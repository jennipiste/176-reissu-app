import React from 'react';
import { Text, View } from 'react-native';

interface Event {
    startTime: string;
    endTime: string;
    title: string;
    location: string;
    description?: string;
}

interface ScheduleProps {
    events: Event[];
}

export const ScheduleScreen: React.FC<ScheduleProps> = props => {
    return (
        <View>
            <Text>Aikataulu:</Text>
            {/* {props.events.map(event =>
                <Text>{event.startTime}-{event.endTime}: {event.title}</Text>
            )} */}
        </View>
    );
};
