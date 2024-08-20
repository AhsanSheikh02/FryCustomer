import React from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { CustomText } from '../../components/Text';
import { config } from '../../utils/constants';
import { colors } from '../../utils/constants';
import { moderateScale, s, scale, verticalScale } from 'react-native-size-matters';

export default ProductCell = ({ source, quantity, productTitle, onPress, productPrice, onPressDelete,
    productQuantity, onPressDown, onPressUp }) => {

    return (
        <View style={Styles.viewContainer} >
            <View style={Styles.viewContainer1}>
                <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                    {/* <View style={{
                        height: verticalScale(80), width: scale(80), borderWidth: moderateScale(2), borderRadius: moderateScale(5), borderColor: 'lightgrey',
                        marginLeft: moderateScale(10), alignItems: 'center', justifyContent: 'center'
                    }}> */}

                    <Image
                        source={{ uri: source }}
                        style={Styles.ImageContainer} />
                    {/* </View> */}
                </TouchableOpacity>

                {/* <View style={{ width: 2, backgroundColor: 'lightgrey', height: 100, justifyContent: 'center', marginBottom: 5 }} /> */}

                <View style={{
                    flex: 1, flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', marginLeft: moderateScale(10), marginRight: moderateScale(10)
                }}>
                    <View width={"80%"}>
                        <CustomText num ellipsizeMode={'tail'} numberOfLines={2} style={Styles.TextContainer1}>{productTitle}</CustomText>
                        <View height={verticalScale(2)} />
                        <CustomText style={[Styles.TextContainer1, { color: colors.border_color }]}>{config.currency} {productPrice}</CustomText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: moderateScale(5) }}>
                            <TouchableOpacity activeOpacity={0.8} disabled={quantity == 1} onPress={onPressDown}>
                                <Image style={{ height: moderateScale(30), width: moderateScale(30) }}
                                    source={require('../../../assets/images/minus.png')} />
                            </TouchableOpacity>

                            <View style={{
                                height: verticalScale(22), width: scale(40), borderColor: 'lightgrey', borderWidth: moderateScale(1), justifyContent: 'center',
                                marginLeft: moderateScale(10), marginRight: moderateScale(10), borderRadius: moderateScale(10)
                            }}>
                                <CustomText style={Styles.TextContainer2}>{productQuantity}</CustomText>
                            </View>
                            <View>
                                <TouchableOpacity activeOpacity={0.8} onPress={onPressUp}>
                                    <Image style={{ height: moderateScale(30), width: moderateScale(30) }}
                                        source={require('../../../assets/images/plus.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={{ alignSelf: 'flex-start', }} onPress={onPressDelete}>
                        <View style={{ height: verticalScale(25), marginLeft: moderateScale(5), width: "20%" }}>
                            <Image style={{ height: moderateScale(35), width: moderateScale(35) }}
                                source={require('../../../assets/images/delete.png')} />
                        </View>
                    </TouchableOpacity>
                </View>

            </View>

        </View>

    );
};

const Styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#f7f7f7',
        width: Dimensions.get('window').width - scale(20),
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: moderateScale(10),
        marginRight: moderateScale(10),
        marginBottom: moderateScale(5),
        padding: moderateScale(5),
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

    viewContainer1: {
        backgroundColor: '#f7f7f7',
        width: Dimensions.get('window').width - scale(20),
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: moderateScale(10),
        marginRight: moderateScale(10),
        flexDirection: 'row',
        marginTop: moderateScale(5),
        marginBottom: moderateScale(5),
    },

    ImageContainer: {
        height: verticalScale(80),
        width: scale(100),
        resizeMode: 'cover',
        alignSelf: 'center',
        borderRadius: moderateScale(10),
        marginLeft: moderateScale(10)
    },
    TextContainer1: {
        fontSize: moderateScale(14),
        color: colors.secondary_color,
        // fontWeight: 'bold',
        //  textAlign: 'center',
        // marginLeft: moderateScale(15),
        alignSelf: 'flex-start'
    },
    TextContainer2: {
        // marginLeft: 20,
        // marginRight: 20,
        fontSize: moderateScale(12),
        alignSelf: 'center',
        fontWeight: 'bold',
        color: colors.secondary_color
    },
    LineStyle: {
        height: verticalScale(2),
        marginTop: moderateScale(5),
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
        backgroundColor: 'lightgray',
        width: Dimensions.get('window').width - scale(30),

    },

});


