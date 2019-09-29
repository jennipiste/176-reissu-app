import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
        <View style={styles.container}>
            <Text>Aikataulu:</Text>
            {/* {props.events.map(event =>
                <Text>{event.startTime}-{event.endTime}: {event.title}</Text>
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
