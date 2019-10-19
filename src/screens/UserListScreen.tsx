import React from 'react';
// import { UserScreen } from './UserScreen';
import { Text, View } from 'react-native';

interface User {
    userName: string;
    fact: string;
}

interface UserListProps {
    users: User[];
}

export const UserListScreen: React.FC<UserListProps> = props => {
    return (
        <View>
            <Text>Nää tyypit on sun mukana matkassa!</Text>
            {/* {props.users.map(user =>
                <UserScreen {...user} />
            )} */}
        </View>
    );
};
