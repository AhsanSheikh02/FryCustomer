import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomText } from './Text';

//HEADER COMPONENT
export const Header = (props) => {
    let { title, style } = props;

    return (
        <View style={[styles.header, style]}>
            <CustomText style={styles.headerText}>
                {title}
            </CustomText>
        </View>
    )
};

Header.defaultProps = {
    title: "",
    style: {}
};

const styles = StyleSheet.create({
    header: {
        height: 50,
        justifyContent: "center"
    },
    headerText: {
        fontSize: 25,
        color: "#362068",
        fontWeight: "400",
        fontFamily: "Helvetica Neue"
    },
});