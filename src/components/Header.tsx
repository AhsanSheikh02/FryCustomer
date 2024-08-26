import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {CustomText} from './Text';

interface HeaderProps {
  title?: string;
  style?: StyleProp<ViewStyle>;
}

export const Header: React.FC<HeaderProps> = ({title = '', style}) => (
  <View style={[styles.header, style]}>
    <CustomText style={styles.headerText}>{title}</CustomText>
  </View>
);

const styles = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 25,
    color: '#362068',
    fontWeight: '400',
    fontFamily: 'Helvetica Neue',
  },
});
