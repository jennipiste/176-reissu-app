import React, { useState,  useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback, ScrollView, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

import moment from 'moment';
import { destinations, START_TIME } from  '../constants';

const SCROLLABLE_CONTENT_HEIGHT = 3000;

export const HomeScreen: React.FC = () => {

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ timeUntil, setTimeUntil ] =  useState<{days: number, hours: number, minutes: number, seconds: number}>(undefined);

    // States for background position
    const [ scrollViewWidth, setScrollViewWidth ] = useState<number>(undefined);
    const [ scrollViewHeight, setScrollViewHeight ] = useState<number>(undefined);
    const [ progress, setProgress ] = useState<number>(undefined);
    const [ bgPos, setBgPos ] = useState(undefined);

    const { navigate } = useNavigation();

    useEffect(() => {
        const start_time: moment.Moment = moment(START_TIME);
        const diff = moment().diff(start_time);
        const duration = moment.duration(diff);
        setTimeUntil({ days: duration.days(), hours: duration.hours(), minutes: duration.minutes(), seconds: duration.seconds() });
        setIsLoading(false);
    });

    useEffect(() => {
        if (scrollViewWidth && scrollViewHeight) {
            updatePositions();
        }
    }, [progress]);

    const updatePositions = () => {
        const bgWidth = scrollViewWidth;
        const bgHeight = bgWidth * 5.8;
        const bgTop = (progress * (bgHeight - scrollViewHeight)) + scrollViewHeight - bgHeight;
        const bgPos = {width: bgWidth, height: bgHeight, bottom: bgTop, left: 0};
        setBgPos(bgPos);
        console.log("scrollViewHeight", scrollViewHeight);
        console.log("bgHeight", bgHeight);
        console.log("updatedBgPos", bgPos);
    };

    const onLayout = (event: LayoutChangeEvent) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        console.log("onLayout", x, y, width, height);

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
        console.log("progress", progress);
        setProgress(progress);
    };

    const onDestinationPress = (destinationIndex: number) => {
        navigate('Diary', { destinationIndex });
    };

    const insets = useSafeArea();

    return (
        <View onLayout={(event) => onLayout(event)} style={{
            ...styles.view,
            marginTop: insets.top,
            marginBottom: insets.bottom
        }}>
            {isLoading
                ? <View><Image source={require('../../assets/kitten.jpeg')} /></View>
                : <>
                    <Image
                        source={require('../../assets/vietnam.jpeg')}
                        style={[styles.background, bgPos]}
                    />
                    {(timeUntil && timeUntil.days < 0  || timeUntil.hours < 0 || timeUntil.minutes < 0 || timeUntil.seconds < 0)
                        ? <View style={styles.timeUntilBackground}>
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
                        : <ScrollView
                            style={styles.scrollView}
                            onScroll={(event) => onScroll(event)}
                        >
                            <View style={{height: SCROLLABLE_CONTENT_HEIGHT}}>
                                {destinations.map((destination, index) =>
                                    <TouchableNativeFeedback
                                        background={TouchableNativeFeedback.SelectableBackground()}
                                        onPress={() => onDestinationPress(index)}
                                        key={index}
                                    >
                                        <View style={[styles.date, { position: 'absolute', top: (index + 1) * 550}]}>
                                            <Text>{`${destination.name}`}</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                )}
                            </View>
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
    background: {
        position: 'absolute',
        zIndex: -1,
    },
    date: {
        borderWidth: 1,
        padding: 10,
        margin: 5,
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
    }
});