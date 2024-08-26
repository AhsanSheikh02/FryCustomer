import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { fonts } from '../utils/constants';

interface CustomTextProps extends TextProps {
  light?: boolean;
  bold?: boolean;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  numberOfLines?: number;
  onPress?: () => void;
  children: React.ReactNode;
}

export const CustomText: React.FC<CustomTextProps> = ({
  light,
  bold,
  ellipsizeMode,
  numberOfLines,
  style,
  onPress,
  children,
  ...rest
}) => {
  return (
    <Text
      ellipsizeMode={ellipsizeMode || undefined}
      numberOfLines={numberOfLines || undefined}
      style={[
        styles.regular,
        light && styles.light,
        bold && styles.bold,
        style,
      ]}
      onPress={onPress}
      {...rest}
    >
      {children}
    </Text>
  );
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
