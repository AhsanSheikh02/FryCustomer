import React from 'react';
import { TextInput, View, StyleSheet, Image, Text } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { config, fonts } from '../utils/constants';

//TextInput COMPONENT
export const CustomText = (props) => {
    return (
        <Text 
          ellipsizeMode={props.ellipsizeMode ? props.ellipsizeMode : null}
          numberOfLines={props.numberOfLines ? props.numberOfLines : null}
          style={[
              styles.regular,
              props.light && styles.light, 
              props.bold && styles.bold, 
              props.style
          ]} 
          onPress={props.onPress}>
            {props.children}
          </Text>
    );
};

CustomText.defaultProps = {
    textInputStyle: {}
};

const styles = StyleSheet.create({
    light: {
		fontFamily: fonts.opensans_light,
    },
    regular: {
		fontFamily: fonts.opensans_regular,
    },
    bold: {
		fontFamily: fonts.opensans_bold,
    },
});


