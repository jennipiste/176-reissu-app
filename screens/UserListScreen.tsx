import React from 'react';
// import { UserScreen } from './UserScreen';
import { StyleSheet, Text, View } from 'react-native';

interface User {
    userName: string;
    fact: string;
}

interface UserListProps {
    users: User[];
}

export const UserListScreen: React.FC<UserListProps> = props => {
    return (
        <View style={styles.container}>
            <Text>Nää tyypit on sun mukana matkassa!</Text>
            {/* {props.users.map(user =>
                <UserScreen {...user} />
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20,
        paddingVertical: 30,
        paddingHorizontal: 20,
    }
});
