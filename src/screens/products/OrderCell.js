import React from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { CustomText } from '../../components/Text';
import { config } from '../../utils/constants';
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
export default OrderCell = ({ source, productTitle, onPress, productPrice,
    productQuantity }) => {
    return (

        // <View style={Styles.viewContainer} >
        <View style={Styles.viewContainer1}>
            <View width={"40%"} justifyContent="center" alignItems="center">
                <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                    {/* <View style={{
                    height: verticalScale(80), width: scale(100), borderRadius: moderateScale(10), borderWidth: moderateScale(1), borderColor: 'grey',
                    marginLeft: moderateScale(10), alignItems: 'center', justifyContent: 'center'
                }}> */}
                    <Image
                        source={{ uri: source }}
                        style={Styles.ImageContainer} />
                    {/* </View> */}
                </TouchableOpacity>
            </View>

            <View style={{ justifyContent: 'center', height: verticalScale(80), width: "60%" }}>
                <CustomText ellipsizeMode={'tail'} numberOfLines={2} style={Styles.TextContainer1}>{productTitle}</CustomText>
                <View height={verticalScale(5)} />
                <View style={{ flexDirection: 'row' }}>
                    <CustomText style={[Styles.TextContainer1, { color: colors.border_color }]}>{config.currency}{productPrice}</CustomText>
                    <Image source={(require('../../../assets/images/multiply.png'))}
                        style={{ marginLeft: moderateScale(5), tintColor: colors.border_color, height: moderateScale(8), alignSelf: 'center', width: moderateScale(8) }} />
                    <CustomText style={[Styles.TextContainer1, { marginLeft: moderateScale(5), color: colors.border_color }]}>{productQuantity + " Qty."}</CustomText>
                </View>
            </View>

        </View>

        //  </View> 


    );
};
const Styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width - scale(20),
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: moderateScale(10),
        marginRight: moderateScale(10),
        marginBottom: moderateScale(5)
    },

    viewContainer1: {
        backgroundColor: '#f7f7f7',
        width: Dimensions.get('window').width - scale(20),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: moderateScale(10),
        marginRight: moderateScale(10),
        marginTop: moderateScale(5),
        marginBottom: moderateScale(5),
        flexDirection: 'row',
        marginTop: moderateScale(10),
        padding: moderateScale(8),
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

    ImageContainer: {
        height: verticalScale(80),
        width: scale(110),
        borderRadius: moderateScale(10),
        resizeMode: 'cover',
        // alignSelf: 'center',
        //margin: 10,

    },
    TextContainer1: {
        fontSize: moderateScale(14),
        color: colors.secondary_color,
        // fontWeight: 'bold',
        //  textAlign: 'center',
        marginLeft: moderateScale(8),
        alignSelf: 'flex-start'
    },
    TextContainer2: {
        // marginLeft: 20,
        // marginRight: 20,
        fontSize: moderateScale(14),
        alignSelf: 'center',
        color: 'black'
    },

});


