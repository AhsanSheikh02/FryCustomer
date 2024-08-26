import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {LogBox} from 'react-native';
import AppNavigator from './AppNavigator';
import AuthProvider from './redux/providers/AuthProvider';
LogBox.ignoreAllLogs(true);

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
