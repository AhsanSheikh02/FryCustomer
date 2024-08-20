import React from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Image, Dimensions, Platform, FlatList } from 'react-native';
import { CustomText } from '../../components/Text';
import { config } from '../../utils/constants';
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default MyOrderCell = ({ onPress, orderList, deliveryDate, orderId, totalPrice }) => {
    return (

        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>

            <View style={Styles.viewContainer1}>
                <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between" }}>
                    <View style={{ width: "80%" }}>
                        <CustomText style={{ fontWeight: 'bold', color: '#3BB54A', fontSize: moderateScale(15) }}>{"Order ID: " + orderId} </CustomText>
                        <CustomText style={{ fontWeight: 'bold', color: 'grey', fontSize: moderateScale(15), marginTop: moderateScale(2) }}>{deliveryDate} </CustomText>
                    </View>
                    <CustomText style={{ fontWeight: 'bold', color: 'grey', fontSize: moderateScale(20), marginTop: moderateScale(2) }}>{config.currency}{totalPrice}</CustomText>

                </View>


                <View height={verticalScale(10)} />

                <FlatList
                    data={orderList}
                    width="100%"
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                <View width={"40%"} justifyContent="center" alignItems="center">
                                    <Image
                                        source={{ uri: item.images[0] }}
                                        style={Styles.ImageContainer} />
                                </View>
                                <View style={{ justifyContent: 'center', width: "60%", height: verticalScale(70) }}>
                                    <CustomText ellipsizeMode={'tail'} numberOfLines={2} style={[Styles.TextContainer1, ]}>{item.product_name}</CustomText>
                                    <View height={verticalScale(5)} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <CustomText style={[Styles.TextContainer1, { color: colors.border_color }]}>{config.currency}{item.price}</CustomText>
                                        <Image source={(require('../../../assets/images/multiply.png'))}
                                            style={{ marginLeft: moderateScale(5), tintColor: colors.border_color, height: verticalScale(8), alignSelf: 'center', width: scale(8) }} />
                                        <CustomText style={[Styles.TextContainer1, { marginLeft: moderateScale(5), color: colors.border_color }]}>{item.quantity + " Qty."}</CustomText>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />


            </View>
        </TouchableOpacity>
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
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
        padding: moderateScale(10),
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
        height: verticalScale(70),
        width: scale(100),
        resizeMode: 'cover',
        alignSelf: 'center',
        borderRadius: moderateScale(10),
        // marginTop: moderateScale(8),
        //  marginLeft: moderateScale(10)

    },
    TextContainer1: {
        fontSize: moderateScale(14),
        color: colors.secondary_color,
        marginLeft: moderateScale(8),
        alignSelf: 'flex-start'
    },
});


