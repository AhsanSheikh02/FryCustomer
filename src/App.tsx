import React from 'react';
import {LogBox} from 'react-native';
import Router from './router';
LogBox.ignoreAllLogs(true);

const App = () => {
  return <Router />;
};

export default App;
