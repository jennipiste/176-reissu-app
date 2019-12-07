import {useSafeArea} from 'react-native-safe-area-context';
// import { SafeAreaView } from 'react-native'
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Modal,
  TextInput,
  TouchableNativeFeedback,
  Alert,
} from 'react-native';
import firebase from 'firebase';
import {User} from '../interfaces';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid/v4';
import {FontAwesome} from '@expo/vector-icons';


export const UserListTopPanel = (props) => {
  // const [topMargin, setTopMargin] = useState(0)
  // SafeArea.getSafeAreaInsetsForRootView().then(result => {setTopMargin(result.top)})
  const insets = useSafeArea();

  return <View
    style={{
      marginTop: insets.top
    }}
  >
    <Button title={'Log out'} onPress={() => {
    }}/>
    <Button title={'Edit'} onPress={() => {
    }}/>
    {/*<Button title={'WTF'} onPress={() => alert('WTF')}></Button>*/}
  </View>
}


export const UserListScreen: React.FC = () => {

  const [currentUser, setCurrentUser] = useState<User>(undefined);
  const [username, setUsername] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    updateUser();
  }, []);

  const updateUser = () => {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref(`users/${userId}`).once('value')
      .then(async (snapshot) => {
        const user: User = snapshot.val();
        setCurrentUser(user);
        setUsername(user.username);
        setDescription(user.description);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    firebase.database().ref('users').on('value', (snapshot) => {
      const result = snapshot.val();
      if (result) {
        const usersList = Object.keys(result).map(key => {
          return result[key];
        });
        setUsers(usersList);
      }
    });
  }, []);

  const onPickImagePress = async () => {
    const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      allowsEditing: true,
    });
    if (result.cancelled === false) {
      setNewAvatarUrl(result.uri);
    }
  };

  const onSaveUserPress = async () => {
    setIsSaving(true);
    if (newAvatarUrl) {
      const response: Response = await fetch(newAvatarUrl);
      const blob: Blob = await response.blob();
      const ext = newAvatarUrl.split('.').pop();
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
        firebase.database().ref(`users/${currentUser.uid}`).update({
          avatarUrl: downloadURL,
          username,
          description,
        }).finally(() => {
          updateUser();
          setIsSaving(false);
          setIsModalVisible(false);
        });
      });
    } else {
      firebase.database().ref(`users/${currentUser.uid}`).update({
        username,
        description,
      }).finally(() => {
        updateUser();
        setIsSaving(false);
        setIsModalVisible(false);
      });
    }
  };

  const onLogoutPress = () => {
    firebase.auth().signOut();
  };

  const insets = useSafeArea();

  return (
    <View style={{
        flex: 1,
        marginTop: insets.top,
        marginBottom: insets.bottom,
        backgroundColor: '#F1F3FD',
    }}>
      <View style={styles.header}>
        {currentUser && <>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1}}>
            <Text style={styles.title}>Profiili</Text>
            <View style={{flexDirection: 'row'}}>
              <FontAwesome style={{ marginRight: 20 }} name='pencil' onPress={() => setIsModalVisible(true)} size={20}/>
              <FontAwesome name='sign-out' onPress={onLogoutPress} size={20}/>
            </View>
          </View>
          <View style={styles.currentUser}>
            {currentUser.avatarUrl
              ? <Image source={{uri: currentUser.avatarUrl}} style={styles.currentUserImage}/>
              : <Image source={require('../../assets/no_avatar.png')} style={styles.currentUserImage}/>
            }
              <Text style={[styles.userNameHeader, styles.currentUserNameHeader]}>{currentUser.username}</Text>
              <Text style={styles.currentUserText}>{currentUser.description}</Text>
          </View>
        </>}
      </View>
      <View style={styles.view}>
        {isLoading
          ? <Text>Loading...</Text>
          : <>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => {
                setIsModalVisible(false);
              }}
            >
              <View style={styles.modal}>
                {isSaving
                  ? <Text>Saving...</Text>
                  : <View style={styles.modalContent}>
                    <FontAwesome
                      name='close' size={20} style={styles.closeButton}
                      onPress={() => setIsModalVisible(false)}
                    />
                    <TouchableNativeFeedback onPress={onPickImagePress}>
                      {newAvatarUrl
                        ? <Image source={{uri: newAvatarUrl}} style={styles.currentUserImage}/>
                        : <Image source={{uri: currentUser.avatarUrl}} style={styles.currentUserImage}/>
                      }
                    </TouchableNativeFeedback>
                    <TextInput style={styles.textInput} placeholder="Username" value={username}
                                onChangeText={(text) => setUsername(text)}/>
                    <TextInput style={styles.textInput} placeholder="Description" value={description}
                                onChangeText={(text) => setDescription(text)} multiline={true} numberOfLines={2}/>
                    <Button title='Tallenna' onPress={() => onSaveUserPress()}/>
                  </View>
                }
              </View>
            </Modal>
            <ScrollView>
              {users.filter(user => user.uid !== currentUser.uid).map((user, index) => {
                return <View key={index} style={styles.user}>
                  {user.avatarUrl
                    ? <Image source={{uri: user.avatarUrl}} style={styles.image}/>
                    : <Image source={require('../../assets/no_avatar.png')} style={styles.image}/>
                  }
                  <View style={styles.usersText}>
                    <Text style={styles.userNameHeader}>{user.username}</Text>
                    <Text>{user.description}</Text>
                  </View>
                </View>;
              })}
            </ScrollView>
          </>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  view: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: '#FFF',
  },
  user: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  currentUser: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  currentUserText: {
    maxWidth: '70%',
    textAlign: 'center',
  },
  currentUserNameHeader: {
    fontSize: 18,
    marginVertical: 10,
  },
  userNameHeader: {
    fontWeight: 'bold',
  },
  currentUserImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#E100CC',
    overflow: 'hidden',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 30,
  },
  textInput: {
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 1,
    width: '80%',
    padding: 10,
    margin: 10,
  },
  modal: {
    width: '80%',
    height: 400,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: 100,
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  usersText: {
    flex: 1,
  },
});
