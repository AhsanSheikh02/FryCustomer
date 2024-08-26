import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { CustomText } from './Text';

interface ErrorTextProps {
    error?: string;
    style?: StyleProp<TextStyle>;
}

export const ErrorText: React.FC<ErrorTextProps> = ({ error = '', style }) => {
    return <CustomText style={[styles.errorText, style]}>{error}</CustomText>;
};

const styles = StyleSheet.create({
    errorText: {
        marginBottom: 8,
        color: 'red',
    },
});
