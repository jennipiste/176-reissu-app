import React, { useState } from 'react';
import { Text, View, Button, TextInput, StyleSheet, Image, Alert, AsyncStorage } from 'react-native';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import uuid from 'uuid/v4';
import moment from 'moment';


export const CreatePostScreen: React.FC = () => {

    const dateIndex = useNavigationParam('dateIndex');
    const { goBack } = useNavigation();

    const [ title, setTitle ] = useState<string>('');
    const [ text, setText ] = useState<string>('');
    const [ imageUri, setImageUri ] = useState<string>('');
    const [ isUploading, setIsUploading ] = useState<boolean>(false);

    const database = firebase.database();

    const onCreatePress = async () => {
        setIsUploading(true);
        const postUid = uuid();
        let userName: string;
        try {
            userName = await AsyncStorage.getItem('userName');
        } catch (error) {
            console.log(error);
        }
        if (imageUri) {
            const response: Response = await fetch(imageUri);
            const blob: Blob = await response.blob();
            const ext = imageUri.split('.').pop();
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
                database.ref(`posts/${postUid}`).set({
                    title,
                    text,
                    date: dateIndex,
                    imageUrl: downloadURL,
                    userName,
                    userUid: firebase.auth().currentUser.uid,
                    createdAt: moment().toISOString(true),
                    uid: postUid,
                });
                goBack();
            });
        } else {
            database.ref(`posts/${postUid}`).set({
                title,
                text,
                date: dateIndex,
                userUid: firebase.auth().currentUser.uid,
                createdAt: moment().toISOString(true),
                uid: postUid,
            });
            goBack();
        }
    };

    const onPickImagePress = async () => {
        const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
        });
        if (result.cancelled === false) {
            setImageUri(result.uri);
        }
    };

    return (
        <View>
            {isUploading
                ? <Text>Creating post...</Text>
                : <View>
                    <Text>{`Create post for Day ${dateIndex}`}</Text>
                    <TextInput placeholder='Title' value={title} onChangeText={(text) => setTitle(text)} />
                    <TextInput placeholder='Text' value={text} onChangeText={(text) => setText(text)} multiline={true} numberOfLines={6}/>
                    <View style={styles.button}>
                        <Button title='Pick image' onPress={onPickImagePress} />
                    </View>
                    {imageUri.length > 0 &&
                        <View>
                            <Image source={{ uri: imageUri }} style={styles.image} />
                        </View>
                    }
                    <View style={styles.button}>
                        <Button title='Create' onPress={onCreatePress} />
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
    text: {
        height: 100,
    },
    image: {
        height: 300,
    }
});