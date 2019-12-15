import React, {useState, useEffect} from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import {Text, View, Button, TextInput, StyleSheet, Image, ScrollView} from 'react-native';
import {useNavigationParam, useNavigation} from 'react-navigation-hooks';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import uuid from 'uuid/v4';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import {destinations} from '../constants';
import {Destination, User} from '../interfaces';
import {FontAwesome} from '@expo/vector-icons';

export const CreatePostScreen: React.FC = () => {

  const destinationIndex = useNavigationParam('destinationIndex');
  const {goBack} = useNavigation();

  const [date, setDate] = useState<moment.Moment>(undefined);
  const [destination, setDestination] = useState<Destination>(undefined);
  const [text, setText] = useState<string>('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(undefined);

  const database = firebase.database();

  useEffect(() => {
    // Set default date
    const now = moment();
    const dest = destinations[destinationIndex];
    setDestination(dest);
    if (now.diff(moment(dest.endTime)) > 0) {
      setDate(moment(dest.endTime));
    } else {
      setDate(now);
    }
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref(`users/${userId}`).once('value')
      .then(async (snapshot) => {
        setCurrentUser(snapshot.val());
      });
  }, []);

  const onCreatePress = async () => {
    setIsUploading(true);
    const postUid = uuid();
    if (imageUris) {
      const downloadUrls: string[] = [];
      await Promise.all(imageUris.map(async imageUri => {
        const uri = imageUri;
        const response: Response = await fetch(uri);
        const blob: Blob = await response.blob();
        const ext = uri.split('.').pop();
        const filename = `${uuid()}.${ext}`;

        const uploadTask = await firebase.storage().ref().child(`images/${filename}`).put(blob);
        const downloadUrl = await uploadTask.ref.getDownloadURL();
        Promise.resolve(downloadUrls.push(downloadUrl));
      }));
      await database.ref(`posts/${postUid}`).set({
        text,
        destination: destination.name,
        date: date.toISOString(true),
        imageUrls: downloadUrls,
        userUid: currentUser.uid,
        createdAt: moment().toISOString(true),
        uid: postUid,
      });
      goBack();
    } else {
      await database.ref(`posts/${postUid}`).set({
        text,
        destination: destination.name,
        date: date.toISOString(true),
        userUid: currentUser.uid,
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
      const resized = await ImageManipulator.manipulateAsync(
        result.uri,
        [
          {resize: {width: 600}}
        ],
        {}
      )
      setImageUris([...imageUris, resized.uri])
    }
  };

  return (
    <ScrollView style={styles.view}>
      {isUploading
        ? <Text>Creating post...</Text>
        : destination && <View>
          <View style={styles.location}><FontAwesome name='map-marker' size={20}/><Text>{destination.name}</Text></View>
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
              <Button title='Lisää kuva' onPress={onPickImagePress}/>
          </View>
        {imageUris.map((imageUri, index) =>
          <View key={index}>
            <Image source={{uri: imageUri}} style={styles.image}/>
          </View>
        )}
          <View style={styles.button}>
              <Button title='Luo' onPress={onCreatePress}/>
          </View>
      </View>
      }
    </ScrollView>
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
    marginBottom: 10,
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