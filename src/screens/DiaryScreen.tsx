import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import firebase from 'firebase';
import { Post } from '../interfaces';
import { destinations } from  '../constants';

export const DiaryScreen: React.FC = () => {

    const { navigate } = useNavigation();
    const destinationIndex = useNavigationParam('destinationIndex');

    const destination = destinations[destinationIndex];

    const [ posts, setPosts ] = useState<Post[]>(undefined);


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

    return (
        <View style={styles.view}>
            <Text>{destination.name}</Text>
            <View style={styles.button}>
                <Button title='Luo uusi postaus' onPress={onCreatePress} />
            </View>
            {(posts && posts.length > 0) &&
                <View>
                    <Text>Posts:</Text>
                    {posts.map((post, index) =>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.SelectableBackground()}
                            onPress={() => onPostPress(post.uid)}
                            key={index}
                        >
                            <View style={styles.post}>
                                <Text>{post.text}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    )}
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
    },
    post: {
        borderWidth: 1,
        padding: 10,
        margin: 5,
    }
});
