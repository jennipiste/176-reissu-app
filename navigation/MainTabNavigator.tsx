import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { HomeScreen } from '../src/screens/HomeScreen';
import { DiaryScreen } from '../src/screens/DiaryScreen';
import { TodoScreen } from '../src/screens/TodoScreen';
import { CreatePostScreen } from '../src/screens/CreatePostScreen';
import { PostScreen } from '../src/screens/PostScreen';
import { UserListScreen } from '../src/screens/UserListScreen';
import { InfoScreen } from  '../src/screens/InfoScreen';

import { FontAwesome } from '@expo/vector-icons';

const navigationOptions = ({ navigation }) => {
    return {
        headerStyle: {
            backgroundColor: 'transparent',
            marginTop: -24,
            marginBottom: -24,
        },
    };
};

const HomeStack = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            header: null,
        }
    },
    Diary: {
        screen: DiaryScreen,
        navigationOptions,
    },
    CreatePost: {
        screen: CreatePostScreen,
        navigationOptions,
    },
    Post: {
        screen: PostScreen,
        navigationOptions,
    },
    Users: {
        screen: UserListScreen,
        navigationOptions,
    }
});

const HomeTabIcon = (props) => (
    <FontAwesome
        name='home'
        size={24}
        color={props.focused ? 'grey' : 'darkgrey'}
    />
);

const InfoTabIcon = (props) => (
    <FontAwesome
      name='plane'
      size={24}
      color={props.focused ? 'grey' : 'darkgrey'}
    />
);

const TodoTabIcon = (props) => (
    <FontAwesome
      name='suitcase'
      size={24}
      color={props.focused ? 'grey' : 'darkgrey'}
    />
);

export default createAppContainer(createMaterialTopTabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            tabBarIcon: HomeTabIcon,
        }
    },
    Info: {
        screen: InfoScreen,
        navigationOptions: {
            tabBarIcon: InfoTabIcon,
        }
    },
    Todo: {
        screen: TodoScreen,
        navigationOptions: {
            tabBarIcon: TodoTabIcon,
        }
    }
}, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        style: {
            backgroundColor: '#fff',
        },
        indicatorStyle: {
            opacity: 0
        },
        showLabel: false,
        showIcon: true,
    }
}));
