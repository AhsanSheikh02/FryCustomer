import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomText } from './Text';

//ERROR COMPONENT
export const ErrorText = ({ error }) => {
    return <CustomText style={styles.errorText}>{error}</CustomText>
};

ErrorText.defaultProps = {
    error: ""
};

const styles = StyleSheet.create({
    errorText: {
        marginBottom: 8,
        color: "red"
    }
});