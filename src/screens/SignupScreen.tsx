import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert, Image, TouchableNativeFeedback, AsyncStorage } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import uuid from 'uuid/v4';
import { packings } from '../constants';


export const SignupScreen: React.FC = () => {

    const [ avatarUrl, setAvatarUrl ] = useState<string>('');
    const [ username, setUsername ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ email, setEmail ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');

    const { navigate } = useNavigation();

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

    const initializePackings = async (userUid: string) => {
        for (let index = 0; index < packings.length; index++) {
            await firebase.database().ref(`packings/${userUid}/${packings[index].id}`).set(packings[index]);
        }
    };

    const onSignupPress = async () => {
        if (!username  || !description || !email || !password) {
            Alert.alert('Kaikki kentät on pakollisia!');
        } else if (!avatarUrl) {
            Alert.alert('Kuva on pakollinen!');
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(async (userCredential: firebase.auth.UserCredential) => {
                    const uid = userCredential.user.uid;
                    await firebase.database().ref(`users/${uid}`).set({
                        username,
                        email,
                        uid,
                        description,
                    });

                    try {
                        await AsyncStorage.setItem('userName', username);
                    } catch (error) {
                        console.log("error", error);
                    }

                    const response: Response = await fetch(avatarUrl);
                    const blob: Blob = await response.blob();
                    const ext = avatarUrl.split('.').pop();
                    const filename = `${uuid()}.${ext}`;

                    const uploadTask = firebase.storage().ref().child(`images/${filename}`).put(blob);

                    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED:
                                console.log('Upload is paused');
                                break;
                            case firebase.storage.TaskState.RUNNING:
                                console.log('Upload is running');
                                break;
                        }
                    }, (error) => {
                        Alert.alert(error.message);
                    }, async () => {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        await firebase.database().ref(`users/${uid}`).update({
                            avatarUrl: downloadURL,
                        });
                        await initializePackings(uid);
                    });
                }, (error) => {
                    Alert.alert(error.message);
                }).finally(() => {
                    navigate('Home');
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
            <TextInput style={styles.textInput} placeholder="Description" value={description} onChangeText={(text) => setDescription(text)} multiline={true} numberOfLines={2}/>
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
