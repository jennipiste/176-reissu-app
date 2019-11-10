import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import firebase from 'firebase';
import { Post } from '../interfaces';

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
        <View style={styles.view}>
            {post
                ? <View>
                    <Text>{`Day ${post.date}`}</Text>
                    <Text>{`Created by ${post.userName}`}</Text>
                    <Text>{post.text}</Text>
                    {post.imageUrl &&
                        <View>
                            {isLoadingImage && <Text>Loading image...</Text>}
                            <Image
                                source={{ uri: post.imageUrl}}
                                style={styles.image}
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

const styles = StyleSheet.create({
    view: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    image: {
        height: 300,
    },
});
