import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import firebase from 'firebase';
import { Post, User } from '../interfaces';
import { destinations } from  '../constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

export const DiaryScreen: React.FC = () => {

    const { navigate } = useNavigation();
    const destinationIndex = useNavigationParam('destinationIndex');

    const destination = destinations[destinationIndex];

    const [ posts, setPosts ] = useState<Post[]>([]);
    const [ users, setUsers ] = useState<User[]>([]);

    const onCreatePress = () => {
        navigate('CreatePost', { destinationIndex });
    };

    const onPostPress = (postUid: string, creator: string, date: string) => {
        navigate('Post', { postUid, creator, date });
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
            {/* <View style={styles.location}><FontAwesome name='map-marker' size={20} /><Text>{destination.name}</Text></View> */}
            <TouchableOpacity
                style={styles.button}
                onPress={onCreatePress}
            >
                <MaterialCommunityIcons name='plus' size={28} color='white' />
            </TouchableOpacity>
            <FlatList
                data={posts}
                renderItem={({ item }) => {
                    const user = users.find(user => user.uid === item.userUid);
                    const userAvatarUrl =  user ? user.avatarUrl : null;
                    const date = moment(item.date).format('DD.MM.');
                    return <View style={styles.postContainer}>
                        {userAvatarUrl
                            ? <Image source={{ uri: userAvatarUrl }} style={styles.avatar} />
                            : <Image source={require('../../assets/user-profile-empty.png')} style={styles.avatar} />
                        }
                        <TouchableOpacity
                            onPress={() => onPostPress(item.uid, user.username, date)}
                            style={styles.post}
                        >
                            <View>
                                <FlatList
                                    data={item.imageUrls}
                                    renderItem={({ item }) => (
                                        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                                            <Image source={{ uri: item, cache: 'force-cache' }} style={styles.postImage} />
                                        </View>
                                    )}
                                    numColumns={3}
                                    keyExtractor={(_, index) => index.toString()}
                                    removeClippedSubviews={false}
                                />
                                <Text>{item.text}</Text>
                            </View>
                        </TouchableOpacity>
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
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 5,
        zIndex: 1,
        backgroundColor: '#7800F9',
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
