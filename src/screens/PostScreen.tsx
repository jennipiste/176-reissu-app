import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import firebase from 'firebase';

export interface Post {
    title: string;
    text: string;
    date: number;
    downloadURL: string;
    userUid: string;
    userName: string;
    createdAt: string;
    uid: string;
}

export const PostScreen: React.FC = () => {

    const postUid = useNavigationParam('postUid');

    const [ post, setPost ] = useState<Post>(undefined);
    const [ isLoadingImage, setIsLoadingImage ] = useState<boolean>(true);

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
                    <Text>{`Created by ${post.userName}`}</Text>
                    <Text>{post.title}</Text>
                    <Text>{post.text}</Text>
                    {post.downloadURL &&
                        <View>
                            {isLoadingImage && <Text>Loading image...</Text>}
                            <Image
                                source={{ uri: post.downloadURL}}
                                style={{width: 200, height: 100 }}
                                onLoadEnd={() => setIsLoadingImage(false)}
                            />
                        </View>
                    }
                </View>
                : <Text>Loading...</Text>
            }
        </View>
    );
};
