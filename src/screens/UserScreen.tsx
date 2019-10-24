import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, Button, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import uuid from 'uuid/v4';
import { User } from '../interfaces';


export const UserScreen: React.FC = () => {

    const database = firebase.database();

    const [ user, setUser ] = useState<User>(undefined);
    const [ username, setUsername ] =  useState<string>('');
    const [ imageUri, setImageUri ] = useState<string>('');
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        const userId = firebase.auth().currentUser.uid;
        database.ref(`users/${userId}`).once('value')
        .then(async (snapshot) => {
            console.log("user", snapshot.val());
            const user: User = snapshot.val();
            setUser(user);
            setUsername(user.username);
            setIsLoading(false);
        });
    }, []);

    const onPickImagePress = async () => {
        const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1],
            allowsEditing: true,
        });
        if (result.cancelled === false) {
            setImageUri(result.uri);
        }
    };

    const onSavePress = async () => {
        setIsSaving(true);
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
                database.ref(`users/${user.uid}`).update({
                    avatarUrl: downloadURL,
                    username,
                });
                setIsSaving(false);
            });
        } else {

        }
    };

    return (
        <View>
            {isSaving
                ? <Text>Saving changes...</Text>
                : <>
                    {isLoading
                        ? <Text>Loading...</Text>
                        : <View>
                            <TextInput placeholder="Username" value={username} onChangeText={(text) => setUsername(text)}/>
                            <View style={styles.button}>
                                <Button title='Select avatar' onPress={onPickImagePress} />
                            </View>
                            {imageUri.length > 0
                                ? <View>
                                    <Image source={{ uri: imageUri }} style={styles.image} />
                                </View>
                                : (user && user.avatarUrl) && <Image source={{ uri: user.avatarUrl }} style={styles.image}/>
                            }
                            <View style={styles.button}>
                                <Button title='Save' onPress={onSavePress} />
                            </View>
                        </View>
                    }
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        marginBottom: 10,
    },
    image: {
        height: 200,
        width: 200,
    }
});
