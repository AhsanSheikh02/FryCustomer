import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { headerStyle, headerTitleStyle } from '../theme'
import Home from '../screens/home/Home';

//Create Routes
const AuthStack = createStackNavigator(
    {
        Home: Home,
    },
    {
        initialRouteName: 'Home',
        defaultNavigationOptions: () => ({ headerStyle, headerTitleStyle })
    }
);

export default AuthStack;