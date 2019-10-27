import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import { LoginScreen } from '../src/screens/LoginScreen';
import { SignupScreen } from '../src/screens/SignupScreen';

export default createAppContainer(
    createSwitchNavigator({
        Signup: SignupScreen,
        Login: LoginScreen,
        Main: MainTabNavigator,
    })
);
