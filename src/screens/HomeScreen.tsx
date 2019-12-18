import React, { useState,  useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    ImageBackground,
    ActivityIndicator,
    LayoutChangeEvent,
    NativeSyntheticEvent,
    NativeScrollEvent
} from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

import moment from 'moment';
import { destinations, START_TIME } from  '../constants';
import { primaryColor } from '../styles';

const SCROLLABLE_CONTENT_HEIGHT = 2423;

export const HomeScreen: React.FC = () => {

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ timeUntil, setTimeUntil ] =  useState<{days: number, hours: number, minutes: number, seconds: number}>(undefined);

    const { navigate } = useNavigation();

    useEffect(() => {
        const start_time: moment.Moment = moment(START_TIME);
        const diff = moment().diff(start_time);
        const duration = moment.duration(diff);
        setTimeUntil({ days: duration.days(), hours: duration.hours(), minutes: duration.minutes(), seconds: duration.seconds() });
        setIsLoading(false);
    });

    const onDestinationPress = (destinationIndex: number) => {
        navigate('Diary', { destinationIndex, location: destinations[destinationIndex].name });
    };

    const insets = useSafeArea();

    // States for background position
    const [ scrollViewWidth, setScrollViewWidth ] = useState<number>(undefined);
    const [ scrollViewHeight, setScrollViewHeight ] = useState<number>(undefined);
    const [ progress, setProgress ] = useState<number>(undefined);
    const [ parallaxPos, setParallaxPos ] = useState(undefined);
    const [ parallaxLeftPos, setParallaxLeftPos ] = useState(undefined);
    const [ parallaxRightPos, setParallaxRightPos ] = useState(undefined);

    useEffect(() => {
        if (scrollViewWidth && scrollViewHeight) {
            updatePositions();
        }
    }, [progress]);

    const updatePositions = () => {
        const bgWidth = scrollViewWidth;
        const bgHeight = bgWidth * 5.94;
        const parallaxHeight = bgHeight * 1.3;
        const parallaxBottom = (progress * (parallaxHeight - scrollViewHeight)) + scrollViewHeight - parallaxHeight;
        const parallaxPos = {width: bgWidth, height: parallaxHeight, left: 0, bottom: parallaxBottom};
        const parallaxWidth = bgWidth * 1.7;
        const parallaxLeft = (progress * (parallaxWidth - scrollViewWidth)) + scrollViewWidth - parallaxWidth;
        const parallaxLeftPos = {width: parallaxWidth, height: bgHeight, left: parallaxLeft, top: 0};
        const parallaxRight = (progress * (parallaxWidth - scrollViewWidth)) + scrollViewWidth - parallaxWidth;
        const parallaxRightPos = {width: parallaxWidth, height: bgHeight, right: parallaxRight, top: 0};
        setParallaxPos(parallaxPos);
        setParallaxLeftPos(parallaxLeftPos);
        setParallaxRightPos(parallaxRightPos);
    };

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setScrollViewWidth(width);
        setScrollViewHeight(height);
        setProgress(0);
    };

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) =>  {
        const scrollY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;
        const maxY = contentHeight - viewHeight;
        const progress = Math.max(Math.min(scrollY / maxY, 1), 0);
        setProgress(progress);
    };

    const parallaxImages = <>
        <Image source={require('../../assets/monkey.png')} style={styles.monkey} />
        <Image source={require('../../assets/lamps.png')} style={styles.lamps} />
        <Image source={require('../../assets/rice_guy_in_boat.png')} style={styles.boat} />
    </>;
    const parallaxLeftImages =  <>
        <Image source={require('../../assets/scooter.png')} style={styles.scooter} />
    </>;
    const parallaxRightImages =  <>
        <Image source={require('../../assets/transparent_clouds.png')} style={styles.clouds} />
    </>;

    return (
        <View style={{
            ...styles.view,
            marginTop: insets.top,
            marginBottom: insets.bottom
        }} onLayout={(event) => onLayout(event)}>
            {isLoading
                ? <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <ActivityIndicator size={60} color={primaryColor} />
                  </View>
                : <>
                    {(timeUntil && timeUntil.days < 0  || timeUntil.hours < 0 || timeUntil.minutes < 0 || timeUntil.seconds < 0)
                        ? <ImageBackground source={require('../../assets/app_background_start.png')} style={{width: '100%', height: '100%'}}>
                            <View style={styles.timeUntilBackground}>
                                <View style={styles.timeUntilContainer}>
                                    <Text style={styles.timeUntilTitle}>Aikaa matkan alkuun</Text>
                                    <View style={styles.timeUntilItems}>
                                        <View style={styles.timeUntilItemContainer}>
                                            <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.days}</Text></View>
                                            <Text style={styles.timeUntilUnitText}>Päivää</Text>
                                        </View>
                                        <View style={styles.timeUntilItemContainer}>
                                            <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.hours}</Text></View>
                                            <Text style={styles.timeUntilUnitText}>Tuntia</Text>
                                        </View>
                                        <View style={styles.timeUntilItemContainer}>
                                            <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.minutes}</Text></View>
                                            <Text style={styles.timeUntilUnitText}>Minuuttia</Text>
                                        </View>
                                        <View style={styles.timeUntilItemContainer}>
                                            <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.seconds}</Text></View>
                                            <Text style={styles.timeUntilUnitText}>Sekuntia</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                        : <ScrollView style={styles.scrollView} onScroll={(event) => onScroll(event)}>
                            <ImageBackground source={require('../../assets/home_bg.png')} style={{width: '100%', height: '100%'}}>
                                <View style={[styles.parallax, parallaxPos]}>{parallaxImages}</View>
                                <View style={[styles.parallax, parallaxLeftPos]}>{parallaxLeftImages}</View>
                                <View style={[styles.parallax, parallaxRightPos]}>{parallaxRightImages}</View>
                                <View style={{flex: 1, height: SCROLLABLE_CONTENT_HEIGHT}}>
                                    {destinations.map((destination, index) =>
                                        <TouchableOpacity
                                            onPress={() => onDestinationPress(index)}
                                            key={index}
                                            style={{
                                                ...styles.date,
                                                position: 'absolute',
                                                top: destination.position.y,
                                                left: destination.position.x,
                                            }}
                                        >
                                            <View>
                                                <Text style={styles.dateText}>{`${index + 1}`}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                           </ImageBackground>
                        </ScrollView>
                    }
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#F1F3FD',
    },
    scrollView: {
        flex: 1,
    },
    parallax: {
        position: 'absolute',
    },
    monkey: {
        position: 'absolute',
        left: 0,
        bottom: '96%',
    },
    boat: {
        position: 'absolute',
        right: 50,
        bottom: '2.5%',
    },
    lamps: {
        position: 'absolute',
        left: 0,
        bottom: '60%',
    },
    scooter: {
        position: 'absolute',
        top: 610,
        left: '50%',
    },
    clouds: {
        top: 300,
        right: '10%',
    },
    date: {
        backgroundColor: '#fff',
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        fontFamily: 'futuramedium',
        fontSize: 22,
    },
    timeUntilBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
    },
    timeUntilContainer: {
        width: '85%',
        borderRadius: 20,
        backgroundColor: '#F1F3FD',
        paddingVertical: 40,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    timeUntilTitle: {
        fontSize: 20,
        marginBottom: 30,
        fontWeight: 'bold',
    },
    timeUntilItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    timeUntilItemContainer: {
        alignItems: 'center',
    },
    timeUntilItem: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10,
        justifyContent: 'center',
        width: 70,
        height: 70,
        marginBottom: 10,
    },
    timeUntilText: {
        fontSize: 38,
        fontWeight: 'bold',
    },
    timeUntilUnitText: {
        fontWeight: 'bold',
    },
});