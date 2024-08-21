import React from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { CustomText } from '../../components/Text';
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default CategoryCell = ({ source, videoTitle, onPress }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <View style={Styles.viewContainer} >
                <View style={Styles.viewContainer1}>
                    <Image
                        source={source}
                        style={Styles.ImageContainer} />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: verticalScale(80), marginLeft: moderateScale(5) }}>
                    <CustomText ellipsizeMode={'tail'} numberOfLines={2} style={Styles.TextContainer1}>{videoTitle}</CustomText>
                </View>
            </View>
        </TouchableOpacity>

    );
};
const Styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        width: Dimensions.get('window').width - scale(30),
        alignItems: 'center',
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15),
        borderRadius: moderateScale(10),
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
        // padding: moderateScale(5),
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
        height: verticalScale(80)
    },
    ImageContainer: {
        height: verticalScale(80),
        width: scale(90),
        resizeMode: 'cover',
        borderBottomLeftRadius: moderateScale(10),
        borderTopLeftRadius: moderateScale(10),
    },
    viewContainer1: {
        height: verticalScale(80),
        width: scale(90),
        borderBottomLeftRadius: moderateScale(10),
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: colors.secondary_color,
        borderTopLeftRadius: moderateScale(10),
    },
    TextContainer1: {
        // textAlign: 'center',
        fontSize: moderateScale(17),
        color: colors.secondary_color,
        fontWeight: 'bold',
        marginLeft: moderateScale(15),
        marginRight: moderateScale(5),
        width: scale(200),
        // backgroundColor:"red"
    },
});


