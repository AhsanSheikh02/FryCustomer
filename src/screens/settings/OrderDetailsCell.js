import React from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { CustomText } from '../../components/Text';
import { config, colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default OrderDetailsCell = ({ source, productTitle, onPress, productPrice,
    productQuantity, isDeliver, deliveryDate }) => {
    return (

        // <View style={Styles.viewContainer} >
        <View style={Styles.viewContainer1}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                    {/* <View style={{
                        height: verticalScale(60), width: scale(60), borderWidth: moderateScale(1), borderRadius: moderateScale(2), borderColor: 'lightgrey',
                        marginLeft: moderateScale(10), alignItems: 'center', justifyContent: 'center'
                    }}> */}
                    <Image
                        source={{ uri: source }}
                        style={Styles.ImageContainer} />
                    {/* </View> */}
                </TouchableOpacity>
                <View style={{ marginLeft: moderateScale(5), marginRight: moderateScale(5), height: verticalScale(60), justifyContent: 'center' }}>
                    <CustomText ellipsizeMode={'tail'} numberOfLines={1} style={[Styles.TextContainer1, { width: Dimensions.get('window').width / scale(1.4) - scale(10) }]}>{productTitle}</CustomText>
                    <View style={{ flexDirection: 'row' }}>
                        <CustomText style={[Styles.TextContainer1, { color: colors.border_color }]}>{config.currency}{productPrice}</CustomText>
                        <Image source={(require('../../../assets/images/multiply.png'))}
                            style={{ marginLeft: moderateScale(5), tintColor: colors.border_color, height: verticalScale(8), alignSelf: 'center', width: scale(8) }} />
                        <CustomText style={[Styles.TextContainer1, { marginLeft: moderateScale(5), color: colors.border_color }]}>{productQuantity + " Qty."}</CustomText>
                    </View>
                </View>
            </View>

        </View>

        //  </View> 


    );
};
const Styles = StyleSheet.create({
    viewContainer1: {
        backgroundColor: '#f7f7f7',
        width: Dimensions.get('window').width - scale(20),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: moderateScale(10),
        marginRight: moderateScale(10),
        //  flexDirection: 'row',
        marginTop: moderateScale(5),
        //  marginBottom: moderateScale(5),
        // padding: moderateScale(10),
        // ...Platform.select({
        //     ios: {
        //         shadowColor: '#000',
        //         shadowOffset: { width: 0, height: 2 },
        //         shadowOpacity: 0.8,
        //         shadowRadius: 2,
        //     },
        //     android: {
        //         elevation: 5,
        //     },
        // }),
    },

    ImageContainer: {
        height: verticalScale(60),
        width: scale(80),
        borderRadius: moderateScale(10),
        resizeMode: 'cover',
        alignSelf: 'center',
        //margin: 10,

    },
    TextContainer1: {
        fontSize: moderateScale(14),
        color: colors.secondary_color,
        textAlign: 'justify',
        marginLeft: moderateScale(8),
        alignSelf: 'flex-start'
    },

});


