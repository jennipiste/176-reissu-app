import React, { useState,  useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableNativeFeedback, AsyncStorage, ImageBackground } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import firebase from 'firebase';
import moment from 'moment';
import { destinations, START_TIME } from  '../constants';


export const HomeScreen: React.FC = () => {

    const [ username, setUsername ] = useState<string>('');
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ timeUntil, setTimeUntil ] =  useState<{days: number, hours: number, minutes: number, seconds: number}>(undefined);

    const database = firebase.database();

    const { navigate } = useNavigation();

    useEffect(() => {
        const start_time: moment.Moment = moment(START_TIME);
        const diff = moment().diff(start_time);
        const duration = moment.duration(diff);
        setTimeUntil({ days: duration.days(), hours: duration.hours(), minutes: duration.minutes(), seconds: duration.seconds() });
    });

    const onUsersPress = () => {
        navigate('Users');
    };

    const onDestinationPress = (destinationIndex: number) => {
        navigate('Diary', { destinationIndex });
    };

    useEffect(() => {
        const userId = firebase.auth().currentUser.uid;
        database.ref(`users/${userId}`).once('value')
        .then(async (snapshot) => {
            setUsername(snapshot.val().username);
            try {
                await AsyncStorage.setItem('userName', snapshot.val().username);
                setIsLoading(false);
            } catch (error) {
                console.log("error", error);
            }
        });
    }, []);

    return (
        <View>
            {isLoading
                ? <View><Image source={require('../../assets/kitten.jpeg')} /></View>
                : <ImageBackground source={require('../../assets/vietnam_placeholder.jpg')} style={styles.backgroundImage}>
                    <View style={styles.view}>
                        <Text>Tervetuloa {username}</Text>
                        {(timeUntil && timeUntil.days < 0  || timeUntil.hours < 0 || timeUntil.minutes < 0 || timeUntil.seconds < 0)
                            ? <Text>{`Matkan alkuun ${-timeUntil.days}d ${-timeUntil.hours}h ${-timeUntil.minutes}min ${-timeUntil.seconds}sec`}</Text>
                            : <View>
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
                            </View>
                        }
                        <View style={styles.button}>
                            <Button title="Käyttäjät" onPress={() => onUsersPress()}/>
                        </View>
                    </View>
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
    }
});