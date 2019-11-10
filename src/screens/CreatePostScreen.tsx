import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet, Image, Alert, AsyncStorage } from 'react-native';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import uuid from 'uuid/v4';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import { destinations } from '../constants';
import { Destination } from '../interfaces';
import { FontAwesome } from '@expo/vector-icons';

export const CreatePostScreen: React.FC = () => {

    const destinationIndex = useNavigationParam('destinationIndex');
    const { goBack } = useNavigation();

    const [ date, setDate ] = useState<moment.Moment>(undefined);
    const [ destination, setDestination ] = useState<Destination>(undefined);
    const [ text, setText ] = useState<string>('');
    const [ imageUri, setImageUri ] = useState<string>('');
    const [ isUploading, setIsUploading ] = useState<boolean>(false);

    const database = firebase.database();

    useEffect(() => {
        // Set default date
        const now = moment();
        const dest = destinations[destinationIndex];
        setDestination(dest);
        if (now.diff(moment(dest.endTime)) > 0)  {
            setDate(moment(dest.endTime));
        } else {
            setDate(now);
        }
    }, []);

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
                    text,
                    destination: destination.name,
                    date: date.toISOString(true),
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
                text,
                destination: destination.name,
                date: date.toISOString(true),
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
        <View style={styles.view}>
            {isUploading
                ? <Text>Creating post...</Text>
                : destination && <View>
                    <View style={styles.location}><FontAwesome name='map-marker' size={20} /><Text>{destination.name}</Text></View>
                    <DatePicker
                        style={styles.datePicker}
                        date={date}
                        mode='date'
                        placeholder='Valitse päivä'
                        format='YYYY-MM-DD'
                        minDate={destination.startTime}
                        maxDate={destination.endTime}
                        confirmBtnText='Valitse'
                        cancelBtnText='Peruuta'
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36,
                                borderRadius: 5,
                            }
                        }}
                        onDateChange={(date) => setDate(moment(date))}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder='Kirjoita tähän...'
                        value={text}
                        onChangeText={(text) => setText(text)}
                        multiline={true}
                        numberOfLines={6}
                        textAlignVertical='top'
                    />
                    <View style={styles.button}>
                        <Button title='Lisää kuva' onPress={onPickImagePress} />
                    </View>
                    {imageUri.length > 0 &&
                        <View>
                            <Image source={{ uri: imageUri }} style={styles.image} />
                        </View>
                    }
                    <View style={styles.button}>
                        <Button title='Luo' onPress={onCreatePress} />
                    </View>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    location: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
    },
    text: {
        height: 100,
    },
    image: {
        height: 300,
    },
    textInput: {
        borderColor: 'gray',
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
    },
    datePicker: {
        marginTop: 10,
        marginBottom: 10,
    }
});