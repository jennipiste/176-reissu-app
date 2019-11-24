import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import firebase from 'firebase';
import { Post } from '../interfaces';

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
        <ScrollView style={styles.view}>
            {post
                ? <View>
                    <Text>{`Day ${post.date}`}</Text>
                    <Text>{`Created by ${post.userName}`}</Text>
                    <Text>{post.text}</Text>
                    <FlatList
                        data={post.imageUrls}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                                <Image source={{ uri: item }} style={styles.postImage} />
                            </View>
                        )}
                        numColumns={2}
                        keyExtractor={(_, index) => index.toString()}
                    />
                </View>
                : <Text>Loading...</Text>
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    view: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    postImage: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
});
