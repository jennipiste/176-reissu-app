import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import firebase from 'firebase';


export const HomeScreen: React.FC = () => {

    const [ username, setUsername ] = useState(undefined);
    const [ isLoading, setIsLoading ] = useState(true);

    const database = firebase.database();

    const logout = () => {
        firebase.auth().signOut();
    };

    const userId = firebase.auth().currentUser.uid;
    database.ref(`users/${userId}`).once('value')
        .then((snapshot) => {
            setUsername(snapshot.val().username);
            setIsLoading(false);
        });

    return (
        <View>
            {isLoading
                ? <View><Image source={require('../../assets/kitten.jpeg')} /></View>
                : <View>
                    <Text>Tervetuloa {username}</Text>
                    <View style={styles.button}>
                        <Button title="Logout" onPress={() => logout()}/>
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
    }
});