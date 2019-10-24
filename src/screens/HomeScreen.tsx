import React, { useState,  useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableNativeFeedback, AsyncStorage } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import firebase from 'firebase';
import moment from 'moment';


export const HomeScreen: React.FC = () => {

    const [ username, setUsername ] = useState<string>('');
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ timeUntil, setTimeUntil ] =  useState<{days: number, hours: number, minutes: number}>(undefined);
    const [ days, setDays ] = useState<{destination: string}[]>(undefined);

    const database = firebase.database();

    const { navigate } = useNavigation();

    const onLogoutPress = () => {
        firebase.auth().signOut();
    };

    const onDatePress = (dateIndex: number) => {
        navigate('Day', { dateIndex });
    };

    const onProfilePress = () => {
        navigate('Profile');
    };

    const onUsersPress = () => {
        navigate('Users');
    };

    useEffect(() => {
        const userId = firebase.auth().currentUser.uid;
        database.ref(`users/${userId}`).once('value')
        .then(async (snapshot) => {
            setUsername(snapshot.val().username);
            try {
                await AsyncStorage.setItem('userName', snapshot.val().username);
            } catch (error) {
                console.log("error", error);
            }
        });
    }, []);

    useEffect(() => {
        database.ref('trips/vietnam').once('value')
            .then((snapshot) => {
                const trip = snapshot.val();
                const start_time: moment.Moment = moment(trip.start_time);
                const diff = moment().diff(start_time);
                const duration = moment.duration(diff);
                setTimeUntil({ days: duration.days(), hours: duration.hours(), minutes: duration.minutes() });
                setDays(trip.days);
                setIsLoading(false);
            });
    }, []);

    return (
        <View>
            {isLoading
                ? <View><Image source={require('../../assets/kitten.jpeg')} /></View>
                : <View>
                    <Text>Tervetuloa {username}</Text>
                    {(timeUntil && timeUntil.days < 0  && timeUntil.hours < 0 && timeUntil.minutes < 0)
                        ? <Text>{`Matkan alkuun ${-timeUntil.days}d ${-timeUntil.hours}h ${-timeUntil.minutes}min`}</Text>
                        : <View>
                            {days.map((_, index) =>
                                // <Text key={`day-${index}`}>{`Day ${index}}`}</Text>
                                <TouchableNativeFeedback
                                    background={TouchableNativeFeedback.SelectableBackground()}
                                    onPress={() => onDatePress(index)}
                                    key={index}
                                    >
                                    <View style={styles.date}>
                                        <Text>{`Day ${index}`}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            )}
                        </View>
                    }
                    <View style={styles.button}>
                        <Button title="Profile" onPress={() => onProfilePress()}/>
                    </View>
                    <View style={styles.button}>
                        <Button title="All users" onPress={() => onUsersPress()}/>
                    </View>
                    <View style={styles.button}>
                        <Button title="Logout" onPress={() => onLogoutPress()}/>
                    </View>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        marginBottom: 10,
    },
    date: {
        borderWidth: 1,
        padding: 10,
        margin: 5,
    }
});