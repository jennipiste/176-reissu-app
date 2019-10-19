import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import firebase from 'firebase';


export const SignupScreen: React.FC = () => {

    const [username, setUsername] = useState(undefined);
    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);

    const { navigate } = useNavigation();

    const database = firebase.database();

    const onSignupPress = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential: firebase.auth.UserCredential) => {
                database.ref(`users/${userCredential.user.uid}`).set({
                    username,
                    email,
                });
                navigate('Home');
            }, (error) => {
                Alert.alert(error.message);
            });
    };

    return (
        <View>
            <Text>Lisää ittes reissuun!</Text>
            <TextInput placeholder="Username" value={username} onChangeText={(text) => setUsername(text)}/>
            <TextInput placeholder="Email" keyboardType='email-address' value={email} onChangeText={(text) => setEmail(text)}/>
            <TextInput secureTextEntry={true} placeholder="Password" value={password} onChangeText={(text) => setPassword(text)}/>
            <View style={styles.button}>
                <Button title="OK" onPress={() => onSignupPress()}/>
            </View>
            <View>
                <Button title="Takas loginii" onPress={() => navigate('Login')}></Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        marginBottom: 10,
    }
});
