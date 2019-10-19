import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import firebase from 'firebase';


export const LoginScreen: React.FC = () => {

    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);

    const { navigate } = useNavigation();

    const onLoginPress = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
        }, (error) => {
            Alert.alert(error.message);
        }).finally(() => navigate('Home'));
    };

    return (
        <View>
            <Text>Loggaa sisää</Text>
            <TextInput placeholder="Email" keyboardType='email-address' value={email} onChangeText={(text) => setEmail(text)}/>
            <TextInput secureTextEntry={true} placeholder="Password" value={password} onChangeText={(text) => setPassword(text)}/>
            <View style={styles.button}>
                <Button title="OK" onPress={() => onLoginPress()}/>
            </View>
            <View>
                <Button title="En oo ines bro" onPress={() => navigate('Signup')}></Button>
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
