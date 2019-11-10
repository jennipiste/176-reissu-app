import React, { useState } from 'react';
import AppNavigator from './navigation/AppNavigator';
import MainTabNavigator from './navigation/MainTabNavigator';
import firebase from 'firebase';
import { firebaseConfig } from './src/config';
import { View, StyleSheet, Image } from 'react-native';


const App: React.FC = () => {

    const [ isAuthenticated, setIsAuthenticated] = useState(false);
    const [ isLoading, setIsLoading] = useState(true);

    const onAuthStateChanged = (user: firebase.User) => {
        setIsLoading(false);
        setIsAuthenticated(!!user);
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().onAuthStateChanged(onAuthStateChanged);

    return (
        <View style={styles.container}>
            {isLoading
                ? <View><Image source={require('./assets/kitten.jpeg')} /></View>
                : <>{isAuthenticated ? <MainTabNavigator /> : <AppNavigator />}</>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 30,
    }
});

export default App;
