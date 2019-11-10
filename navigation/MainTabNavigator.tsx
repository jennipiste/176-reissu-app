import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { HomeScreen } from '../src/screens/HomeScreen';
import { DiaryScreen } from '../src/screens/DiaryScreen';
import { TodoScreen } from '../src/screens/TodoScreen';
import { CreatePostScreen } from '../src/screens/CreatePostScreen';
import { PostScreen } from '../src/screens/PostScreen';
import { UserListScreen } from '../src/screens/UserListScreen';
import { InfoScreen } from  '../src/screens/InfoScreen';

const HomeStack = createStackNavigator({
    Home: HomeScreen,
    Diary: DiaryScreen,
    CreatePost: CreatePostScreen,
    Post: PostScreen,
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
