import React, { useState,  useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

import moment from 'moment';
import { destinations, START_TIME } from  '../constants';
import { primaryColor } from '../styles';

const SCROLLABLE_CONTENT_HEIGHT = 2350;

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

    return (
        <View style={{
            ...styles.view,
            marginTop: insets.top,
            marginBottom: insets.bottom
        }}>
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
                        >
                           <ImageBackground source={require('../../assets/app_background.png')} style={{width: '100%', height: '100%'}}>
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
    background: {
        position: 'absolute',
        zIndex: -1,
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
    }
});