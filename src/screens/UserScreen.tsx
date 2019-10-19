import React from 'react';
import { Text, View } from 'react-native';

interface UserProps {
    userName: string;
    fact: string;
}

export const UserScreen: React.FC<UserProps> = props => {
    return (
        <View>
            <Text>{props.userName}</Text>
            <Text>{props.fact}</Text>
        </View>
    );
}
