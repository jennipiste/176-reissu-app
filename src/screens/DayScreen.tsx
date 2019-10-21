import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import firebase from 'firebase';
import { Post } from './PostScreen';

export const DayScreen: React.FC = () => {

    const dateIndex = useNavigationParam('dateIndex');
    const { navigate } = useNavigation();

    const [ posts, setPosts ] = useState<Post[]>(undefined);

    const onCreatePress = () => {
        navigate('CreatePost', { dateIndex });
    };

    const onPostPress = (postUid: string) => {
        navigate('Post', { postUid });
    };

    useEffect(() => {
        firebase.database().ref('posts').orderByChild('date').equalTo(dateIndex).on('value', (snapshot) => {
            const result = snapshot.val();
            if (result) {
                const postList = Object.keys(result).map(key => {
                    return result[key];
                });
                setPosts(postList);
            }
        });
    }, []);

    return (
        <View>
            <Text>{`Day ${dateIndex}`}</Text>
            <View style={styles.button}>
                <Button title='Create new post' onPress={onCreatePress} />
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
                                <Text>{post.title}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    )}
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
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
