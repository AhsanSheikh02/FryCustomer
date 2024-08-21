import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Platform, } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { colors, fonts } from '../utils/constants';

//Button COMPONENT
export const CustomButton = (props) => {
    let { title, buttonStyle, textStyle, onPress } = props;

    return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress}>
			<View style={[styles.buttonStyle, buttonStyle]}>
				<Text style={[styles.textStyle, textStyle]}>
					{title}
				</Text>
			</View>
		</TouchableOpacity>
    )
};

CustomButton.defaultProps = {
    title: "",
	buttonStyle: {},
	textStyle: {}
};

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
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
            },
            android: {
                elevation: 5,
            },
        }),
	},
});