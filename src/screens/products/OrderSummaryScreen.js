import React, { useState, useContext, useEffect } from 'react';
import { Text, Image, View, Button, ActivityIndicator, Alert, ScrollView, Dimensions, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { CustomButton } from '../../components/Button';
import OrderCell from './OrderCell';
import { config } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-tiny-toast';
export default function OrderSummaryScreen(props) {
    const { navigation } = props;

    //1 - DECLARE VARIABLES
    const [price, setPrice] = useState(0);
    const [shippingCharge, setShippingCharge] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [page, setPage] = useState(1)
    const [per_page, setPerPage] = useState(10)
    const [orderData, setOrderData] = useState("");
    const { state, handleLogout, handleGetAddress, handleCartList } = useAuth();
    const user = state.user;

    const [orderList, setOrderList] = useState(
        [

        ]
    )

    useEffect(() => {
        callApiforCartList()
        callApiforGetAddress()
    }, [])


    function callApiforCartList() {
        Toast.showLoading("Please wait..")
        handleCartList(page, per_page)
            .then((response) => {
                Toast.hide()
                console.log("CartList-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setOrderList(response.data)
                    setTotalPrice(response.total_cart_value)
                    setShippingCharge(response.total_shipping_charge)
                    setPrice(response.total_cart_subtotal)

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    function callApiforGetAddress() {
        //  Toast.showLoading("Please wait..")
        handleGetAddress()
            .then((response) => {
                Toast.hide()
                console.log("GetAddress-res: ", response)
                if (response.status == 1) {
                    setOrderData(response.data)

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }
    function render({ item, index }) {
        return <OrderCell
            source={item.images[0]}
            quantity={item.cart_quantity}
            productTitle={item.name}
            productPrice={item.product_price}
            productQuantity={item.cart_quantity}
        />
    }

    function itemSeparatorComponent() {
        return <View style={[styles.LineStyle, { height: verticalScale(2) }]} />
    }

    return (
        <View style={styles.MainContainer}>
            {/* <View height={verticalScale(20)} /> */}
            <View style={{ backgroundColor: colors.secondary_color, padding: moderateScale(10) }}>
                <CustomText style={[styles.TextContainer, { fontWeight: 'bold', color: colors.main_color }]}>{orderData ? orderData.user_name : ""}</CustomText>
                <View height={verticalScale(5)} />
                <CustomText ellipsizeMode={'tail'} numberOfLines={3} style={[styles.TextContainer, { color: 'white', fontSize: moderateScale(14), }]} >{orderData ? orderData.address + "," + orderData.locality + " " + orderData.city + "," + orderData.state + " " + orderData.country.charAt(0).toUpperCase() + orderData.country.slice(1).toLowerCase() + "," + orderData.pincode : ""}</CustomText>
                {/* <CustomText style={[styles.TextContainer, { color: 'grey' }]}></CustomText> */}
                <View height={verticalScale(10)} />
                <View style={{ flexDirection: 'row' }}>
                    <Image style={{ marginLeft: moderateScale(5), height: moderateScale(20), width: moderateScale(20), alignSelf: 'center' }}
                        source={require('../../../assets/images/phone.png')} />
                    <CustomText style={[styles.TextContainer, { marginLeft: moderateScale(8), fontWeight: 'bold', color: colors.main_color }]} >{orderData ? orderData.user_phone : ""}</CustomText>
                </View>
            </View>

            <View height={verticalScale(5)} />


            <View style={styles.CenterView} >
                <View height={verticalScale(5)} />
                <FlatList
                    //ref={(ref) => this.flatList = ref}
                    data={orderList}
                    renderItem={render}
                    //  ItemSeparatorComponent={itemSeparatorComponent}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>

            <View height={verticalScale(15)} />
            <View style={{ width: Dimensions.get('window').width, backgroundColor: '#f7f7f7', padding: moderateScale(10) }}>
                <View style={{
                    marginLeft: moderateScale(10), marginRight: moderateScale(10), justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                    <CustomText style={styles.TextContainer1}>Sub Total</CustomText>
                    <CustomText style={styles.TextContainer1}>{config.currency}{price}</CustomText>
                </View>

                <View style={{
                    marginLeft: moderateScale(10), marginRight: moderateScale(10), justifyContent: 'space-between',
                    flexDirection: 'row', marginTop: moderateScale(12)
                }}>
                    <CustomText style={[styles.TextContainer1, { color: 'grey' }]}>Shipping Charges</CustomText>
                    <CustomText style={[styles.TextContainer1, { color: 'grey' }]}>{config.currency}{shippingCharge}</CustomText>
                </View>
            </View>
            <View style={{
                marginLeft: moderateScale(20), marginRight: moderateScale(20), justifyContent: 'space-between',
                flexDirection: 'row', marginTop: moderateScale(10)
            }}>
                <CustomText style={styles.TextContainer4}>Total</CustomText>
                <CustomText style={styles.TextContainer4}>{config.currency}{totalPrice}</CustomText>
            </View>



            <View height={verticalScale(20)} />
            <CustomButton buttonStyle={{ elevation: 0, backgroundColor: colors.secondary_color, padding: moderateScale(8), width: Dimensions.get("window").width / scale(1.3), alignSelf: 'center' }}
                textStyle={{ color: colors.main_color }}
                title="CONTINUE TO PAYMENT" onPress={() => {
                    console.log("CONTINUE TO PAYMENT")
                    navigation.navigate('PaymentScreen', { isOrder: true })
                }} />
            <View height={verticalScale(20)} />

        </View>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        marginTop: 0,
        marginLeft: 0,
        backgroundColor: 'white',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    CenterView: {
        flex: 1,
        backgroundColor: 'transparent',
        //  justifyContent: 'center',
        alignItems: 'center',
    },
    SubContainer: {
        width: Dimensions.get('window').width,
        marginTop: 0,
        marginLeft: 0,
        marginLeft: 0,
        backgroundColor: 'transparent',

    },
    LineStyle: {
        height: verticalScale(1),
        marginTop: moderateScale(10),
        // marginLeft: 5,
        // marginRight: 5,
        backgroundColor: 'lightgray',
        width: Dimensions.get('window').width
    },
    TextContainer: {
        fontSize: moderateScale(15),
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
        // marginTop:2
    },
    TextContainer1: {
        color: 'black',
        fontSize: moderateScale(17)
    }, TextContainer4: {
        fontWeight: 'bold',
        fontSize: moderateScale(17),
        color: colors.secondary_color
    }


});
