import React, {useState} from 'react';
import {Text, TextInput, View, StyleSheet, Alert, Image, KeyboardAvoidingView} from 'react-native';
import {Button} from 'react-native-elements';
import {useNavigation} from 'react-navigation-hooks';
import firebase from 'firebase';
import {commonStyles, grayDark} from '../styles';


export const LoginScreen: React.FC = () => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [inputFocus, setInputFocus] = useState<string>('');

  const {navigate} = useNavigation();

  const onLoginPress = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigate('Home');
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.view}>
      <Image style={styles.logo} source={require('../../assets/logo_purple.png')}/>
      <Text style={styles.loginTitle}>Kirjaudu sisään</Text>
      <TextInput
        style={inputFocus === 'email' ? [commonStyles.textInput, commonStyles.textInputActive] : commonStyles.textInput}
        placeholder="Sähköposti"
        placeholderTextColor={grayDark}
        keyboardType='email-address'
        autoCapitalize='none'
        value={email}
        onChangeText={(text) => setEmail(text)}
        onFocus={() => setInputFocus('email')}
      />
      <TextInput
        style={inputFocus === 'password' ? [commonStyles.textInput, commonStyles.textInputActive] : commonStyles.textInput}
        secureTextEntry={true}
        placeholder="Salasana"
        placeholderTextColor={grayDark}
        value={password}
        onChangeText={(text) => setPassword(text)}
        onFocus={() => setInputFocus('password')}
      />
      <View style={commonStyles.buttonView}>
        <Button title="Kirjaudu" onPress={() => onLoginPress()} buttonStyle={commonStyles.button}/>
      </View>
      <Text style={commonStyles.bottomText}>Eikö sinulla ole profiilia?<Text style={commonStyles.linkText}
                                                                             onPress={() => navigate('Signup')}> Luo
        profiili</Text></Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 70,
    marginBottom: 50,
    overflow: 'hidden',
  },
  loginTitle: {
    flexGrow: 0,
    ...commonStyles.title,
    marginBottom: 50,
  },
});
