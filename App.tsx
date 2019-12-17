import {SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';
import AppNavigator from './navigation/AppNavigator';
import MainTabNavigator from './navigation/MainTabNavigator';
import firebase from 'firebase';
import {firebaseConfig} from './src/config';
import {ImageBackground, Text, View} from 'react-native';

import * as Font from 'expo-font';


const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onAuthStateChanged = async (user: firebase.User) => {
    await fetchFont();
    const timeout = setTimeout(function() { setIsLoading(false); }, 2000);
    setIsAuthenticated(!!user);
    return () => clearTimeout(timeout);
  };

  const fetchFont = async () => {
    return Font.loadAsync({
        'futuramedium': require('./assets/fonts/futuramedium.ttf'),
      });
    };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <View>
        <ImageBackground source={require('./assets/splash_screen_bg.png')} style={{width: '100%', height: '100%'}}>
          <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 20}}>
            <Text style={{color: '#fff', fontSize: 18}}>176 luxus matkat</Text>
            <Text style={{color: '#fff', fontSize: 14}}>Kaikki oikeudet pidätetään</Text>
          </View>
        </ImageBackground>
      </View>;
  }
  return <SafeAreaProvider>
    {isAuthenticated ? <MainTabNavigator/> : <AppNavigator/>}
  </SafeAreaProvider>;
};

export default App;
