import React, {useState} from 'react';
import {Text, View, TextInput, StyleSheet, Alert, Image, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import uuid from 'uuid/v4';
import {packings, todos} from '../constants';
import {commonStyles, grayDark} from '../styles';
import {Button} from 'react-native-elements';
import * as ImageManipulator from "expo-image-manipulator";
import {firebaseConfig} from "../config";


export const SignupScreen: React.FC = () => {

  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [inputFocus, setInputFocus] = useState<string>('');

  const {navigate} = useNavigation();

  const onPickImagePress = async () => {
    const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      allowsEditing: true,
    });
    if (result.cancelled === false) {
      const resized = await ImageManipulator.manipulateAsync(result.uri, [{resize: {width: 200}}], {});
      setAvatarUrl(resized.uri);
    }
  };

  const initializePackings = async (userUid: string) => {
    for (let index = 0; index < packings.length; index++) {
      await firebase.database().ref(`packings/${userUid}/${packings[index].id}`).set(packings[index]);
    }
  };

  const initializeTodos = async (userUid: string) => {
    for (let index = 0; index < todos.length; index++) {
      await firebase.database().ref(`todos/${userUid}/${todos[index].id}`).set(todos[index]);
    }
  };

  const onSignupPress = async () => {
    if (!username || !description || !email || !password) {
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
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                break;
              case firebase.storage.TaskState.RUNNING:
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
            await initializeTodos(uid);
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
      <TouchableOpacity onPress={onPickImagePress}>
        {avatarUrl.length > 0
          ? <View style={styles.profileImageContainer}><Image source={{uri: avatarUrl}}
                                                              style={commonStyles.profileImage}/></View>
          : <Image source={require('../../assets/user-profile-empty.png')} style={styles.noAvatarImage}/>
        }
      </TouchableOpacity>
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
        spellCheck={false}
        autoCorrect={false}
        onChangeText={(text) => setDescription(text)}
        onFocus={() => setInputFocus('description')}
      />
      <View style={commonStyles.buttonView}>
        <Button
          title="Rekisteröidy"
          onPress={() => onSignupPress()}
          buttonStyle={commonStyles.button}
          titleStyle={commonStyles.buttonTitleStyle}
        />
      </View>
      <Text style={commonStyles.bottomText}>Onko sinulla jo profiili?<Text style={commonStyles.linkText}
                                                                           onPress={() => navigate('Login')}> Kirjaudu
        sisään</Text></Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpTitle: {
    ...commonStyles.title,
    flex: 0,
    marginBottom: 50,
  },
  profileImageContainer: {
    ...commonStyles.profileImageContainer,
    marginBottom: 40,
  },
  noAvatarImage: {
    ...commonStyles.noAvatarImage,
    marginBottom: 40,
  }
});
