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

import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {primaryColor, grayLight, backgroundColor} from '../src/styles';
import moment from 'moment';
import { START_TIME } from '../src/constants';

const diaryNavOptions = ({ navigation }) => {
    return {
        headerStyle: {
            backgroundColor: backgroundColor,
            elevation: 0,
        },
        title: navigation.getParam('location', ''),
        headerTitleStyle: {
            fontFamily: 'futuramedium',
            fontWeight: '200',
        }
    };
};

const postNavOptions = ({ navigation }) => {
    return {
        headerStyle: {
            backgroundColor: 'transparent',
        },
        title: `${navigation.getParam('creator', '')}      ${navigation.getParam('date', '')}`,
        headerTitleStyle: {
            fontFamily: 'futuramedium',
            fontWeight: '200',
        }
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
        navigationOptions: diaryNavOptions,
    },
    CreatePost: {
        screen: CreatePostScreen,
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'transparent',
            },
            title: 'Uusi postaus',
            headerTitleStyle: {
                fontFamily: 'futuramedium',
                fontWeight: '200',
            }
        },
    },
    Post: {
        screen: PostScreen,
        navigationOptions: postNavOptions,
    },
});

const HomeTabIcon = (props) => (
    <FontAwesome
        name='home'
        size={28}
        color={props.focused ? primaryColor : grayLight}
    />
);

const InfoTabIcon = (props) => (
    <Ionicons
      name='ios-airplane'
      size={32}
      color={props.focused ? primaryColor : grayLight}
    />
);

const tripStarted = moment().diff(moment(START_TIME)) > 0;

const TodoTabIcon = (props) => {
    if (tripStarted) {
      return <Ionicons
        name='ios-list'
        size={30}
        color={props.focused ? primaryColor : grayLight}
      />;
    }
    return <FontAwesome
      name='suitcase'
      size={24}
      color={props.focused ? primaryColor : grayLight}
    />;
};

const UsersIcon = (props) => (
    <MaterialIcons
      name='person'
      size={30}
      color={props.focused ? primaryColor : grayLight}
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
            height: 60,
            justifyContent: 'center',
        },
        iconStyle: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
        },
        indicatorStyle: {
            opacity: 0
        },
        showLabel: false,
        showIcon: true,
    }
}));
