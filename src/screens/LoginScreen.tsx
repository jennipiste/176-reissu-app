import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import firebase from 'firebase';


export const LoginScreen: React.FC = () => {

    const [ email, setEmail ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');

    const { navigate } = useNavigation();

    const onLoginPress = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            navigate('Home');
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.view}>
            <Text style={styles.text}>Loggaa sisää!</Text>
            <TextInput style={styles.textInput} placeholder="Email" keyboardType='email-address' autoCapitalize='none' value={email} onChangeText={(text) => setEmail(text)}/>
            <TextInput style={styles.textInput} secureTextEntry={true} placeholder="Password" value={password} onChangeText={(text) => setPassword(text)}/>
            <View style={styles.button}>
                <Button title="OK" onPress={() => onLoginPress()}/>
            </View>
            <Text style={styles.text}>TAI</Text>
            <View style={styles.button}>
                <Button title="En oo ines bro" onPress={() => navigate('Signup')}></Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    textInput: {
        borderColor: 'gray',
        borderRadius: 5,
        borderWidth: 1,
        width: '80%',
        padding: 10,
        margin: 10,
    },
    text: {
        margin: 20,
    },
});
