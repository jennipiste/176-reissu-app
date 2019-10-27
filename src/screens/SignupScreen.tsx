import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert, Image, TouchableNativeFeedback } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';


export const SignupScreen: React.FC = () => {

    const [ avatarUrl, setAvatarUrl ] = useState<string>('');
    const [ username, setUsername ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ email, setEmail ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');

    const { navigate } = useNavigation();

    const database = firebase.database();

    const onPickImagePress = async () => {
        const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1],
            allowsEditing: true,
        });
        if (result.cancelled === false) {
            setAvatarUrl(result.uri);
        }
    };

    const onSignupPress = () => {
        if (!username  || !description || !email || !password) {
            Alert.alert('Kaikki kentät on pakollisia!');
        } else if (!avatarUrl) {
            Alert.alert('Kuva on pakollinen!');
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential: firebase.auth.UserCredential) => {
                    const uid = userCredential.user.uid;
                    database.ref(`users/${userCredential.user.uid}`).set({
                        username,
                        email,
                        uid,
                        description,
                        avatarUrl,
                    });
                    navigate('Home');
                }, (error) => {
                    Alert.alert(error.message);
                });
        }
    };

    return (
        <View style={styles.view}>
            <Text style={styles.text}>Rekisteröidy reissuun!</Text>
            <TouchableNativeFeedback onPress={onPickImagePress}>
                {avatarUrl.length > 0
                    ? <Image source={{ uri: avatarUrl }} style={styles.image} />
                    : <Image source={require('../../assets/no_avatar.png')} style={styles.image} />
                }
            </TouchableNativeFeedback>
            <TextInput style={styles.textInput} placeholder="Username" value={username} onChangeText={(text) => setUsername(text)}/>
            <TextInput style={styles.textInput} placeholder="Description" value={description} onChangeText={(text) => setDescription(text)}/>
            <TextInput style={styles.textInput} placeholder="Email" keyboardType='email-address' autoCapitalize='none' value={email} onChangeText={(text) => setEmail(text)}/>
            <TextInput style={styles.textInput} secureTextEntry={true} placeholder="Password" value={password} onChangeText={(text) => setPassword(text)}/>
            <View style={styles.button}>
                <Button title="OK" onPress={() => onSignupPress()}/>
            </View>
            <Text style={styles.text}>TAI</Text>
            <View>
                <Button title="Kirjaudu sisään" onPress={() => navigate('Login')}></Button>
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
    text: {
        margin: 20,
    },
    textInput: {
        borderColor: 'gray',
        borderRadius: 5,
        borderWidth: 1,
        width: '80%',
        padding: 10,
        margin: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'gray',
        overflow: 'hidden',
        margin: 10,
    }
});
