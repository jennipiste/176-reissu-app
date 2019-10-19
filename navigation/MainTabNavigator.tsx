// import { createStackNavigator, createBottomTabNavigator, StackNavigatorConfig } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { HomeScreen } from '../src/screens/HomeScreen';
import { ScheduleScreen } from '../src/screens/ScheduleScreen';
import { UserListScreen } from '../src/screens/UserListScreen';

// const config: StackNavigatorConfig = {
//   headerMode: 'screen',
//   headerBackTitleVisible: true,
// };

// const HomeStack = createStackNavigator(
//   {
//     Home: HomeScreen,
//   },
//   config
// );

// HomeStack.navigationOptions = {
//   tabBarLabel: 'Home',
// };

// const ScheduleStack = createStackNavigator(
//   {
//     Schedule: ScheduleScreen,
//   },
//   config
// );

// ScheduleStack.navigationOptions = {
//   tabBarLabel: 'Schedule',
// };

// const UserListStack = createStackNavigator(
//   {
//     UserList: UserListScreen,
//   },
//   config
// );

// UserListStack.navigationOptions = {
//   tabBarLabel: 'Users',
// };

// const tabNavigator = createBottomTabNavigator({
//   HomeStack,
//   ScheduleStack,
//   UserListStack,
// });

export default createAppContainer(createMaterialTopTabNavigator({
  Home: HomeScreen,
  Users: UserListScreen,
  Schedule: ScheduleScreen,
}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: '#000',
    inactiveTintColor: 'grey',
    style: {
      backgroundColor: '#fff',
    }
  }
}));
