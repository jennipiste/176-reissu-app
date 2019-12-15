import {SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useState} from 'react';
import AppNavigator from './navigation/AppNavigator';
import MainTabNavigator from './navigation/MainTabNavigator';
import firebase from 'firebase';
import {firebaseConfig} from './src/config';
import {ImageBackground, Text, View} from 'react-native';


const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onAuthStateChanged = (user: firebase.User) => {
    setTimeout(function() { setIsLoading(false); }, 2000);
    setIsAuthenticated(!!user);
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  if (isLoading) {
    return <View>
      <ImageBackground source={require('./assets/splash_screen_bg.png')} style={{width: '100%', height: '100%'}}>
        <Text>176 luxus matkat</Text>
        <Text>Kaikki oikeuden pidätetään</Text>
      </ImageBackground>
    </View>;
  }
  return <SafeAreaProvider>
    {isAuthenticated ? <MainTabNavigator/> : <AppNavigator/>}
  </SafeAreaProvider>;
};

export default App;
