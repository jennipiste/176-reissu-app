import {SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useState} from 'react';
import AppNavigator from './navigation/AppNavigator';
import MainTabNavigator from './navigation/MainTabNavigator';
import firebase from 'firebase';
import {firebaseConfig} from './src/config';
import {View, Image} from 'react-native';


const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onAuthStateChanged = (user: firebase.User) => {
    setIsLoading(false);
    setIsAuthenticated(!!user);
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  if (isLoading) {
    return <View><Image source={require('./assets/kitten.jpeg')}/></View>
  }
  return <SafeAreaProvider>
    {isAuthenticated ? <MainTabNavigator/> : <AppNavigator/>}
  </SafeAreaProvider>
};

export default App;
