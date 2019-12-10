import {useSafeArea} from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity
} from 'react-native';
import firebase from 'firebase';
import {User} from '../interfaces';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid/v4';
import {FontAwesome} from '@expo/vector-icons';
import { backgroundColor, commonStyles } from '../styles';
import { Button } from 'react-native-elements';


export const UserListScreen: React.FC = () => {

  const [currentUser, setCurrentUser] = useState<User>(undefined);
  const [username, setUsername] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<string>(undefined);
  const [modalUser, setModalUser] = useState<User>(undefined);

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
        backgroundColor: backgroundColor,
    }}>
      <View style={styles.header}>
        {currentUser && <>
            <Text style={styles.title}>Profiili</Text>
            <View style={styles.topIcons}>
              <TouchableOpacity style={styles.topIcon} onPress={() => setIsModalVisible(true)}>
                <FontAwesome name='pencil' size={20}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.topIcon} onPress={onLogoutPress}>
                <FontAwesome name='sign-out' size={20}/>
              </TouchableOpacity>
            </View>
          <View style={styles.currentUser}>
            {currentUser.avatarUrl
              ? <Image source={{uri: currentUser.avatarUrl}} style={commonStyles.profileImage}/>
              : <Image source={require('../../assets/no_avatar.png')} style={commonStyles.noAvatarImage}/>
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
              animationType='fade'
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => {
                setIsModalVisible(false);
              }}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modal}>
                  {isSaving
                    ? <Text>Saving...</Text>
                    : <View style={styles.modalContent}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                          setIsModalVisible(false);
                          setInputFocus(undefined);
                        }}
                      >
                        <FontAwesome name='close' size={20} />
                      </TouchableOpacity>
                      <Text style={styles.modalTitle}>Muokkaa profiilia</Text>
                      <TouchableOpacity onPress={onPickImagePress}>
                        <View>
                          {newAvatarUrl
                            ? <Image source={{uri: newAvatarUrl}} style={commonStyles.profileImage}/>
                            : <Image source={{uri: currentUser.avatarUrl}} style={commonStyles.profileImage}/>
                          }
                          <FontAwesome name='pencil' style={styles.editImageIcon} />
                        </View>
                      </TouchableOpacity>
                      <TextInput
                        style={inputFocus === 'username' ? [commonStyles.textInput, commonStyles.textInputActive] : commonStyles.textInput}
                        placeholder="Käyttäjänimi"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        onFocus={() => setInputFocus('username')}
                      />
                      <TextInput
                        style={inputFocus === 'description' ? [commonStyles.textInput, commonStyles.textInputActive] : commonStyles.textInput}
                        placeholder="Kuvaus"
                        value={description}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical='top'
                        onChangeText={(text) => setDescription(text)}
                        onFocus={() => setInputFocus('description')}
                      />
                      <View style={styles.buttonView}>
                        <Button buttonStyle={commonStyles.button} title='Tallenna' onPress={() => onSaveUserPress()}/>
                      </View>
                    </View>
                  }
                </View>
              </View>
            </Modal>
            {modalUser &&
              <Modal
                animationType='fade'
                transparent={true}
                visible={!!modalUser}
                onRequestClose={() => {
                  setModalUser(undefined);
                }}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modal}>
                    <View style={styles.modalContent}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                          setModalUser(undefined);
                        }}
                      >
                        <FontAwesome name='close' size={20} />
                      </TouchableOpacity>
                      <Image source={{uri: modalUser.avatarUrl}} style={commonStyles.profileImage}/>
                      <Text>{modalUser.username}</Text>
                      <Text>{modalUser.description}</Text>
                    </View>
                  </View>
                </View>
              </Modal>
            }
            <ScrollView contentContainerStyle={styles.scrollView}>
              {users.filter(user => user.uid !== currentUser.uid).map((user, index) => {
                return <TouchableOpacity key={index} style={styles.user} onPress={() => setModalUser(user)}>
                  {user.avatarUrl
                    ? <Image source={{uri: user.avatarUrl}} style={styles.image}/>
                    : <Image source={require('../../assets/no_avatar.png')} style={styles.image}/>
                  }
                  <View style={styles.usersText}>
                    <Text style={styles.userNameHeader}>{user.username}</Text>
                    <Text>{user.description}</Text>
                  </View>
                </TouchableOpacity>;
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
  topIcons: {
    position: 'absolute',
    right: 0,
    top: 30,
    flexDirection: 'row',
  },
  topIcon: {
    width: 40,
    height: 40,
  },
  view: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    backgroundColor: '#FFF',
  },
  scrollView: {
    paddingHorizontal: 30,
    paddingTop: 20,
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
  modalBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flex: 1,
  },
  modal: {
    width: '80%',
    height: 500,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 10,
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    ...commonStyles.title,
    marginBottom: 30,
  },
  editImageIcon: {
    position: 'absolute',
    right: 0,
    bottom: 20,
  },
  buttonView: {
    ...commonStyles.buttonView,
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 24,
    width: 30,
    height: 30,
  },
  usersText: {
    flex: 1,
  },
});
