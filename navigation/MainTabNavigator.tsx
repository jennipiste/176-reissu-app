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
import { primaryColor, grayDark } from '../src/styles';

const navigationOptions = ({ navigation }) => {
    return {
        headerStyle: {
            backgroundColor: 'transparent',
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
});

const HomeTabIcon = (props) => (
    <FontAwesome
        name='home'
        size={28}
        color={props.focused ? primaryColor : grayDark}
    />
);

const InfoTabIcon = (props) => (
    <FontAwesome
      name='plane'
      size={28}
      color={props.focused ? primaryColor : grayDark}
    />
);

const TodoTabIcon = (props) => (
    <FontAwesome
      name='suitcase'
      size={28}
      color={props.focused ? primaryColor : grayDark}
    />
);

const UsersIcon = (props) => (
    <FontAwesome
      name='user'
      size={28}
      color={props.focused ? primaryColor : grayDark}
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
    },
    Users: {
        screen: UserListScreen,
        navigationOptions: {
            tabBarIcon: UsersIcon,
        },
    }
}, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        style: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 60,
            justifyContent: 'center',
            elevation: 10,
            boxShadow: '0px -1px 8px 3px rgba(0,0,0,0.75)',
        },
        iconStyle: {
            width: 28,
            height: 28,
        },
        indicatorStyle: {
            opacity: 0
        },
        showLabel: false,
        showIcon: true,
    }
}));
