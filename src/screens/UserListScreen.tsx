import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { User } from '../interfaces';


export const UserListScreen: React.FC = () => {

    const [ users, setUsers ] = useState<User[]>([]);

    useEffect(() => {
        firebase.database().ref('users').on('value', (snapshot) => {
            const result = snapshot.val();
            if (result) {
                const usersList = Object.keys(result).map(key => {
                    return result[key];
                });
                console.log("users", usersList);
                setUsers(usersList);
            }
        });
    }, []);

    return (
        <View>
            <Text>Nää tyypit on sun mukana matkassa!</Text>
            {users.map(user =>
                <View key={user.uid} style={styles.view}>
                    {user.avatarUrl
                        ? <Image source={{ uri: user.avatarUrl }} style={styles.image} />
                        : <Image source={require('../../assets/no_avatar.png')} style={styles.image} />
                    }
                    <Text>{user.username}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
    },
    image: {
        height: 75,
        width: 75,
        marginRight: 20,
    }
});
