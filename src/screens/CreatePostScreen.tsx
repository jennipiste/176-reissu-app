import React, {useState, useEffect} from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import {Text, View, TextInput, StyleSheet, Image, ScrollView, ActivityIndicator, Platform} from 'react-native';
import {useNavigationParam, useNavigation} from 'react-navigation-hooks';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import uuid from 'uuid/v4';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import {destinations} from '../constants';
import {Destination, User} from '../interfaces';
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import { commonStyles, primaryColor, grayDark } from '../styles';
import { Button } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

export const CreatePostScreen: React.FC = () => {

  const destinationIndex = useNavigationParam('destinationIndex');
  const {goBack} = useNavigation();

  const [date, setDate] = useState<moment.Moment>(undefined);
  const [imageLoadingCounter, setImageLoadingCounter] = useState<number>(0);
  const [destination, setDestination] = useState<Destination>(undefined);
  const [text, setText] = useState<string>('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(undefined);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const database = firebase.database();

  useEffect(() => {
    // Set default date
    const now = moment();
    const dest = destinations[destinationIndex];
    setDestination(dest);
    if (now.diff(moment(dest.startTime)) < 0) {
      setDate(moment(dest.startTime));
    } else if (now.diff(moment(dest.endTime)) > 0) {
      setDate(moment(dest.endTime));
    } else {
      setDate(now);
    }
    const userId = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref(`users/${userId}`);
    const handleSnapshot = (snapshot: firebase.database.DataSnapshot) => {
      setCurrentUser(snapshot.val());
    };
    ref.on('value', handleSnapshot);
    return () => ref.off('value', handleSnapshot);
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
    setImageLoadingCounter(currentImageLoadingCounter => currentImageLoadingCounter + 1)
    const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (result.cancelled === false) {
      const resized = await ImageManipulator.manipulateAsync(
        result.uri,
        [
          {resize: {width: 600}}
        ],
        {}
      );
      setImageUris(currImageUris => [...currImageUris, resized.uri]);
    }
    setImageLoadingCounter(currentImageLoadingCounter => currentImageLoadingCounter - 1)
  };

  return (
    <ScrollView style={styles.view}>
      {isUploading
        ? <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 60} color={primaryColor} />
        </View>
        : destination && <View>
          <View style={styles.header}>
            <View style={styles.location}>
              <MaterialIcons name='location-on' size={20}/>
              <Text style={styles.locationName}>{destination.name}</Text>
            </View>
            <DatePicker
              style={styles.datePicker}
              date={date}
              mode='datetime'
              placeholder='Valitse päivä'
              format='YYYY-MM-DD HH:mm'
              minDate={destination.startTime}
              maxDate={destination.endTime}
              confirmBtnText='Valitse'
              cancelBtnText='Peruuta'
              iconComponent={
                <MaterialCommunityIcons name='clock-outline' size={20} style={{
                  position: 'absolute',
                  left: 0,
                  top: 10,
                  marginLeft: 0,
                }}/>
              }
              customStyles={{
                dateInput: {
                  borderWidth: 0,
                  marginLeft: 10,
                },
                dateText: {
                  color: primaryColor,
                  fontSize: 16,
                  fontFamily: 'futuramedium',
                }
              }}
              onDateChange={(date) => setDate(moment(date))}
            />
          </View>
          <TextInput
            style={isFocused
            ? {
                ...styles.textInput,
                ...commonStyles.textInputActive,
                height: 20 * 6
            }
            : {
              ...styles.textInput,
              height: 20 * 6
            }
          }
            placeholder='Lisää postauksen teksti'
            value={text}
            onChangeText={(text) => setText(text)}
            multiline={true}
            numberOfLines={6}
            textAlignVertical='top'
            placeholderTextColor={grayDark}
            spellCheck={false}
            autoCorrect={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <View style={{marginTop: 20}}>
            <FlatList
              data={imageUris}
              renderItem={({item}) => (
                <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
                  <Image source={{uri: item, cache: 'force-cache'}} style={styles.postImage}/>
                </View>
              )}
              numColumns={2}
              keyExtractor={(_, index) => index.toString()}
              removeClippedSubviews={false}
            />
          </View>
          {/* {imageUris.map((imageUri, index) =>
            <View key={index}>
              <Image source={{uri: imageUri}} style={styles.image}/>
            </View>
          )} */}
          <View style={{...commonStyles.buttonView, width: '100%', marginBottom: 10}}>
            <Button
              title='Lisää kuvia'
              onPress={onPickImagePress}
              buttonStyle={styles.addImagesButton}
              titleStyle={{
                ...commonStyles.buttonTitleStyle,
                color: primaryColor,
              }}
              type='outline'
              icon={<MaterialIcons
                name='camera-alt'
                size={20}
                style={{
                  color: primaryColor,
                  marginRight: 10,
                }}
              />}
            />
          </View>
          <View style={{...commonStyles.buttonView, width: '100%', marginTop: 10, marginBottom: 10}}>
            <Button
              title={imageLoadingCounter === 0 ? 'Julkaise' : 'Odota...'}
              disabled={imageLoadingCounter > 0}
              onPress={onCreatePress}
              buttonStyle={commonStyles.button}
              titleStyle={commonStyles.buttonTitleStyle}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    flexWrap: 'wrap',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'futuramedium',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    height: 100,
  },
  image: {
    width: '40%',
    height: 200,
    marginVertical: 10,
  },
  textInput: {
    ...commonStyles.textInput,
    width: '100%',
    margin: 0,
  },
  datePicker: {
    marginTop: 10,
    marginBottom: 10,
    width: 180,
  },
  addImagesButton: {
    ...commonStyles.button,
    backgroundColor: '#fff',
    borderColor: primaryColor,
    borderWidth: 2,
  },
  postImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
});