// import { createStackNavigator, createBottomTabNavigator, StackNavigatorConfig } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation';

import { HomeScreen } from '../screens/HomeScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { UserListScreen } from '../screens/UserListScreen';

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

const tabNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  Users: UserListScreen,
  Schedule: ScheduleScreen,
});

export default tabNavigator;
