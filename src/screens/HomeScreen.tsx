import React, { useState,  useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableNativeFeedback, ImageBackground } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

import moment from 'moment';
import { destinations, START_TIME } from  '../constants';


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

    const onUsersPress = () => {
        navigate('Users');
    };

    const onDestinationPress = (destinationIndex: number) => {
        navigate('Diary', { destinationIndex });
    };

    return (
        <View>
            {isLoading
                ? <View><Image source={require('../../assets/kitten.jpeg')} /></View>
                : <ImageBackground source={require('../../assets/vietnam_placeholder.jpg')} style={styles.backgroundImage}>
                    {(timeUntil && timeUntil.days < 0  || timeUntil.hours < 0 || timeUntil.minutes < 0 || timeUntil.seconds < 0)
                        ? <View style={styles.timeUntilBackground}>
                            <View style={styles.timeUntilContainer}>
                                <Text style={styles.text}>Aikaa matkan alkuun</Text>
                                <View style={styles.timeUntilItems}>
                                    <View style={styles.timeUntilItemContainer}>
                                        <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.days}</Text></View>
                                        <Text>Päivää</Text>
                                    </View>
                                     <View style={styles.timeUntilItemContainer}>
                                        <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.hours}</Text></View>
                                        <Text>Tuntia</Text>
                                    </View>
                                     <View style={styles.timeUntilItemContainer}>
                                        <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.minutes}</Text></View>
                                        <Text>Minuuttia</Text>
                                    </View>
                                     <View style={styles.timeUntilItemContainer}>
                                        <View style={styles.timeUntilItem}><Text style={styles.timeUntilText}>{-timeUntil.seconds}</Text></View>
                                        <Text>Sekuntia</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : <View style={styles.view}>
                            {destinations.map((destination, index) =>
                                <TouchableNativeFeedback
                                    background={TouchableNativeFeedback.SelectableBackground()}
                                    onPress={() => onDestinationPress(index)}
                                    key={index}
                                    >
                                    <View style={styles.date}>
                                        <Text>{`${destination.name}`}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            )}
                            <View style={styles.button}>
                                <Button title="Käyttäjät" onPress={() => onUsersPress()}/>
                            </View>
                        </View>
                    }
                </ImageBackground>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
    },
    date: {
        borderWidth: 1,
        padding: 10,
        margin: 5,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    timeUntilBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
    },
    timeUntilContainer: {
        width: '80%',
        borderRadius: 5,
        backgroundColor: 'lightgray',
        paddingVertical: 30,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
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
        borderRadius: 5,
        width: 60,
        height: 60,
    },
    timeUntilText: {
        fontSize: 40,
        fontWeight: 'bold',
    }
});