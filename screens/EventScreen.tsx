import React from 'react';
import { Text, View } from 'react-native';

interface EventProps {
    startTime: string;
    endTime: string;
    title: string;
    location: string;
    description?: string;
}

export const EventScreen: React.FC<EventProps> = props => {
    return (
        <View>
            <Text>{props.startTime}-{props.endTime}: {props.title}</Text>
            <Text>{props.location}</Text>
            <Text>{props.description}</Text>
        </View>
    );
}
