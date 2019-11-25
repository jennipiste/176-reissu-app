import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, Button, Modal, TextInput, TouchableNativeFeedback, Alert, FlatList } from 'react-native';
import firebase from 'firebase';
import { User } from '../interfaces';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid/v4';
import { FontAwesome } from '@expo/vector-icons';


export const UserListScreen: React.FC = () => {

    const [ currentUser, setCurrentUser ] = useState<User>(undefined);
    const [ username, setUsername ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ newAvatarUrl, setNewAvatarUrl ] = useState<string>('');
    const [ users, setUsers ] = useState<User[]>([]);
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isSaving, setIsSaving ] = useState<boolean>(false);

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

    return (
        <ScrollView style={styles.view}>
            {isLoading
                ? <Text>Loading...</Text>
                : <>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalVisible}
                    >
                        <View style={styles.modal}>
                            {isSaving
                                ? <Text>Saving...</Text>
                                : <View style={styles.modalContent}>
                                    <FontAwesome name='close' size={20} style={styles.closeButton} onPress={() => setIsModalVisible(false)} />
                                    <TouchableNativeFeedback onPress={onPickImagePress}>
                                        {newAvatarUrl
                                            ? <Image source={{ uri: newAvatarUrl }} style={styles.currentUserImage} />
                                            : <Image source={{ uri: currentUser.avatarUrl }} style={styles.currentUserImage} />
                                        }
                                    </TouchableNativeFeedback>
                                    <TextInput style={styles.textInput} placeholder="Username" value={username} onChangeText={(text) => setUsername(text)}/>
                                    <TextInput style={styles.textInput} placeholder="Description" value={description} onChangeText={(text) => setDescription(text)} multiline={true} numberOfLines={2}/>
                                    <Button title='Tallenna' onPress={() => onSaveUserPress()} />
                                </View>
                            }
                        </View>
                    </Modal>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1}} color='#FF0000'>
                        <Button title='Edit' onPress={() => setIsModalVisible(true)}/>
                        <Button title='Log Out' onPress={onLogoutPress} />
                    </View>
                    {currentUser &&
                        <View style={styles.user}>
                            {currentUser.avatarUrl
                                ? <Image source={{ uri: currentUser.avatarUrl }} style={styles.currentUserImage} />
                                : <Image source={require('../../assets/no_avatar.png')} style={styles.currentUserImage} />
                            }
                            <View>
                                <Text style={styles.userNameHeader}>{currentUser.username}</Text>
                                <Text style={styles.text}>{currentUser.description}</Text>
                            </View>
                        </View>
                    }
                    <FlatList
                        data={users.filter(user => user.uid !== currentUser.uid)}
                        renderItem={({ item }) => {
                            return <View key={item.uid} style={styles.user}>
                                {item.avatarUrl
                                    ? <Image source={{ uri: item.avatarUrl }} style={styles.image} />
                                    : <Image source={require('../../assets/no_avatar.png')} style={styles.image} />
                                }
                                <View style={styles.usersText}>
                                    <Text style={styles.userNameHeader}>{item.username}</Text>
                                    <Text>{item.description}</Text>
                                </View>
                            </View>;
                        }}
                        keyExtractor={(_, index) => index.toString()}
                    />
                </>
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    view: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    user: {
        flexDirection: 'row',
        marginTop: 20,
    },
    currentUser: {
        // alignItems: 'center',
        // marginBottom: 20,
    },
    userNameHeader: {
        fontWeight: 'bold'
    },
    currentUserImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        overflow: 'hidden',
        marginRight: 10,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        overflow: 'hidden',
        marginRight: 30,
    },
    editButton: {
        // position: 'absolute',
        // left: 0,
        // top: 10,
    },
    logoutButton: {
        // position: 'absolute',
        // right: 0,
        // top: 10,
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
    text: {
        maxWidth: '70%',
    },
    usersText: {
        flex: 1,
    },
});
