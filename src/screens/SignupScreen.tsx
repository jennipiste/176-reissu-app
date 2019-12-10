import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Alert, Image, TouchableNativeFeedback, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import uuid from 'uuid/v4';
import { packings } from '../constants';
import { commonStyles, grayDark, secondaryColor } from '../styles';
import { Button } from 'react-native-elements';


export const SignupScreen: React.FC = () => {

    const [ avatarUrl, setAvatarUrl ] = useState<string>('');
    const [ username, setUsername ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ email, setEmail ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ inputFocus, setInputFocus ] = useState<string>('');

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


                        navigate('Home');
                    });
                }, (error) => {
                    Alert.alert(error.message);
                }).finally(() => {
                });
        }
    };

    return (
        <KeyboardAvoidingView style={styles.view} behavior='padding'>
            <Text style={styles.signUpTitle}>Luo profiili</Text>
            <TouchableNativeFeedback onPress={onPickImagePress}>
                {avatarUrl.length > 0
                    ? <Image source={{ uri: avatarUrl }} style={{...styles.image, borderColor: secondaryColor, borderWidth: 3}} />
                    : <Image source={require('../../assets/no_avatar.png')} style={styles.image} />
                }
            </TouchableNativeFeedback>
            <TextInput
                style={inputFocus === 'username' ? [commonStyles.textInput, commonStyles.textInputActive] : commonStyles.textInput}
                placeholder="Käyttäjänimi"
                placeholderTextColor={grayDark}
                value={username}
                onChangeText={(text) => setUsername(text)}
                onFocus={() => setInputFocus('username')}
            />
            <TextInput
                style={inputFocus === 'email' ? [commonStyles.textInput, commonStyles.textInputActive] : commonStyles.textInput}
                placeholder="Sähköposti"
                placeholderTextColor={grayDark}
                keyboardType='email-address'
                autoCapitalize='none'
                value={email}
                onChangeText={(text) => setEmail(text)}
                onFocus={() => setInputFocus('email')}
            />
            <TextInput
                style={inputFocus === 'password' ? [commonStyles.textInput, commonStyles.textInputActive] : commonStyles.textInput}
                secureTextEntry={true}
                placeholder="Salasana"
                placeholderTextColor={grayDark}
                value={password}
                onChangeText={(text) => setPassword(text)}
                onFocus={() => setInputFocus('password')}
            />
            <TextInput
                style={inputFocus === 'description' ? [commonStyles.textInput, commonStyles.textInputActive] : commonStyles.textInput}
                placeholder="Kuvaus"
                placeholderTextColor={grayDark}
                value={description}
                multiline={true}
                numberOfLines={4}
                textAlignVertical='top'
                onChangeText={(text) => setDescription(text)}
                onFocus={() => setInputFocus('description')}
            />
            <View style={commonStyles.buttonView}>
                <Button title="Rekisteröidy" onPress={() => onSignupPress()} buttonStyle={commonStyles.button} />
            </View>
            <Text style={commonStyles.bottomText}>Onko sinulla jo profiili?<Text style={commonStyles.linkText} onPress={() => navigate('Login')}> Kirjaudu sisään</Text></Text>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 40,
    },
    signUpTitle: {
        ...commonStyles.title,
        marginBottom: 50,
    }
});
