import React from 'react';
import { Text, View, StyleSheet } from 'react-native';


export const InfoScreen: React.FC = () => {

    return (
        <View style={styles.view}>
            <Text>Info:</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
});
