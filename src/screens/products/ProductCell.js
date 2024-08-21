import React from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Image, Dimensions, Platform, ImageBackground } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CustomText } from '../../components/Text';
import { colors, config } from '../../utils/constants';

export default ProductCell = ({ source, productTitle, onPress, productPrice }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <View style={Styles.viewContainer} >

                <Image
                    source={{ uri: source }}
                    style={Styles.ImageContainer} />

                <View style={{
                    marginTop: moderateScale(5),
                    alignSelf: 'flex-start',
                    marginLeft: moderateScale(5),
                    marginRight: moderateScale(5),
                    width: Dimensions.get('window').width / 2 - scale(20),
                    // height: verticalScale(50),
                    // backgroundColor:"red"
                }}>
                    <CustomText ellipsizeMode={'tail'} numberOfLines={1} style={Styles.TextContainer1}>{productTitle}</CustomText>
                    <View height={verticalScale(2)} />
                    <CustomText style={Styles.TextContainer2}>{config.currency} {productPrice}</CustomText>
                </View>
                {/* <View height={verticalScale(5)} /> */}
            </View>
        </TouchableOpacity>

    );
};
const Styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#f7f7f7',
        width: Dimensions.get('window').width / 2 - scale(10),
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: '#a9a9a9',
        // borderWidth: 1,
        borderRadius: moderateScale(5),
        margin: moderateScale(5),
        padding: moderateScale(5),
        // height: Dimensions.get('window').height / 3 - verticalScale(70),
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
    ImageContainer1: {
        flex: 1,
        width: "100%",
        position: 'absolute',
        height: "100%",
        borderRadius: moderateScale(5),
    },
    ImageContainer: {
        height: verticalScale(100),
        width: Dimensions.get('window').width / 2 - scale(30),
        resizeMode: 'cover',
        marginTop: moderateScale(5),
        borderRadius: moderateScale(10)
    },
    TextContainer1: {
        fontSize: moderateScale(14),
        color: colors.secondary_color,
        // fontWeight: 'bold',
        //  textAlign: 'center',
        marginLeft: moderateScale(5),
        marginTop: moderateScale(2)
    },
    TextContainer2: {
        fontSize: moderateScale(14),
        color: colors.border_color,
        marginLeft: moderateScale(5)
    },

});


