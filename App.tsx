import {SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useState} from 'react';
import AppNavigator from './navigation/AppNavigator';
import MainTabNavigator from './navigation/MainTabNavigator';
import firebase from 'firebase';
import {firebaseConfig} from './src/config';
import {ActivityIndicator, View} from 'react-native';
import { primaryColor } from './src/styles';


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
    return <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ActivityIndicator size={60} color={primaryColor} />
    </View>;
  }
  return <SafeAreaProvider>
    {isAuthenticated ? <MainTabNavigator/> : <AppNavigator/>}
  </SafeAreaProvider>;
};

export default App;
