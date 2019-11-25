import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableNativeFeedback, FlatList } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import firebase from 'firebase';
import { Post, User } from '../interfaces';
import { destinations } from  '../constants';
import { FontAwesome } from '@expo/vector-icons';

export const DiaryScreen: React.FC = () => {

    const { navigate } = useNavigation();
    const destinationIndex = useNavigationParam('destinationIndex');

    const destination = destinations[destinationIndex];

    const [ posts, setPosts ] = useState<Post[]>([]);
    const [ users, setUsers ] = useState<User[]>([]);

    const onCreatePress = () => {
        navigate('CreatePost', { destinationIndex });
    };

    const onPostPress = (postUid: string) => {
        navigate('Post', { postUid });
    };

    useEffect(() => {
        firebase.database().ref('posts').on('value', (snapshot) => {
            const result = snapshot.val();
            if (result) {
                const postList: Post[] = Object.keys(result).map(key => {
                    return result[key];
                });
                const filteredPosts = postList.filter(post => post.destination ===  destination.name);
                setPosts(filteredPosts);
            }
        });
    }, []);

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

    return (
        <View style={styles.view}>
            <View style={styles.location}><FontAwesome name='map-marker' size={20} /><Text>{destination.name}</Text></View>
            <View style={styles.button}>
            <TouchableNativeFeedback
                style={styles.button}
                background={TouchableNativeFeedback.SelectableBackground()}
                onPress={onCreatePress}
            >
                <FontAwesome name='plus' size={25} color='white' />
            </TouchableNativeFeedback>
            </View>
            <FlatList
                data={posts}
                renderItem={({ item }) => {
                    const user = users.find(user => user.uid === item.userUid);
                    const userAvatarUrl =  user ? user.avatarUrl : null;
                    return <View style={styles.postContainer}>
                        {userAvatarUrl
                            ? <Image source={{ uri: userAvatarUrl }} style={styles.avatar} />
                            : <Image source={require('../../assets/no_avatar.png')} style={styles.avatar} />
                        }
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.SelectableBackground()}
                            onPress={() => onPostPress(item.uid)}
                        >
                            <View style={styles.post}>
                                <FlatList
                                    data={item.imageUrls}
                                    renderItem={({ item }) => (
                                        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                                            <Image source={{ uri: item }} style={styles.postImage} />
                                        </View>
                                    )}
                                    numColumns={3}
                                    keyExtractor={(_, index) => index.toString()}
                                />
                                <Text>{item.text}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>;
                }}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
    },
    location: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    button: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 46,
        height: 46,
        borderRadius: 23,
        zIndex: 1,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    post: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        flex: 1,
    },
    postImage: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    images: {
        display: 'flex',
        flexDirection: 'row',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'grey',
        overflow: 'hidden',
        marginRight: 10,
    },
});
