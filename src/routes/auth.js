import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { headerStyle, headerTitleStyle } from '../theme'
import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';

//Create Routes
const AuthStack = createStackNavigator(
    {
        Register: Register,
        Login: Login,
    },
    {
        initialRouteName: 'Login',
        defaultNavigationOptions: () => ({ headerStyle, headerTitleStyle })
    }
);

export default AuthStack;