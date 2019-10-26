import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { HomeScreen } from '../src/screens/HomeScreen';
import { DayScreen } from '../src/screens/DayScreen';
import { TodoScreen } from '../src/screens/TodoScreen';
import { CreatePostScreen } from '../src/screens/CreatePostScreen';
import { PostScreen } from '../src/screens/PostScreen';
import { UserScreen } from '../src/screens/UserScreen';
import { UserListScreen } from '../src/screens/UserListScreen';
import { InfoScreen } from  '../src/screens/InfoScreen';

const HomeStack = createStackNavigator({
    Home: HomeScreen,
    Day: DayScreen,
    CreatePost: CreatePostScreen,
    Post: PostScreen,
    Profile: UserScreen,
    Users: UserListScreen,
}, {
    headerMode: 'none',
});

export default createAppContainer(createMaterialTopTabNavigator({
    Home: HomeStack,
    Info: InfoScreen,
    Todo: TodoScreen,
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
