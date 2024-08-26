import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, fonts} from '../utils/constants';

interface CustomButtonProps {
  title?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title = '',
  buttonStyle = {},
  textStyle = {},
  onPress,
}) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <View style={[styles.buttonStyle, buttonStyle]}>
      <Text style={[styles.textStyle, textStyle]}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  textStyle: {
    color: 'white',
    alignSelf: 'center',
    fontSize: moderateScale(18),
    fontFamily: fonts.opensans_regular,
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
  },
  buttonStyle: {
    borderRadius: 30,
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
    padding: moderateScale(10),
    justifyContent: 'center',
    backgroundColor: colors.accent_color,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
