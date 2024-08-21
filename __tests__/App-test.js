<<<<<<< HEAD
/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});
=======
import "react-native";
import React from "react";
import App from "../App";
// Note: import explicitly to use the types shipped with jest.
import { it } from "@jest/globals";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("renders correctly", () => {
  renderer.create(<App />);
});
>>>>>>> 5d7e46d54251c7d169a76977d2fb87a9f9216716
