import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { HomeScreen } from '../src/screens/HomeScreen';
import { DayScreen } from '../src/screens/DayScreen';
import { TodoScreen } from '../src/screens/TodoScreen';
import { CreatePostScreen } from '../src/screens/CreatePostScreen';
import { PostScreen } from '../src/screens/PostScreen';

const HomeStack = createStackNavigator({
    Home: HomeScreen,
    Day: DayScreen,
    CreatePost: CreatePostScreen,
    Post: PostScreen,
}, {
    headerMode: 'none',
});

export default createAppContainer(createMaterialTopTabNavigator({
    Home: HomeStack,
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
