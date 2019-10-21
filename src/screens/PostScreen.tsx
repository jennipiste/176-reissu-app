import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { Post } from './DayScreen';
import { useNavigationParam } from 'react-navigation-hooks';
import firebase from 'firebase';


export const PostScreen: React.FC = () => {

    const postUid = useNavigationParam('postUid');

    const [ post, setPost ] = useState<Post>(undefined);

    const database = firebase.database();

    useEffect(() => {
        database.ref(`posts/${postUid}`).once('value')
            .then((snapshot) => {
                setPost(snapshot.val());
            });
    }, []);

    return (
        <View>
            {post
                ? <View>
                    <Text>{`Day ${post.date}`}</Text>
                    <Text>{`Created by ${post.userUid}`}</Text>
                    <Text>{post.title}</Text>
                    <Text>{post.text}</Text>
                    {post.downloadURL &&
                        <Image source={{ uri: post.downloadURL}} style={{width: 200, height: 100 }}/>
                    }
                </View>
                : <Text>Loading...</Text>
            }
        </View>
    );
};
