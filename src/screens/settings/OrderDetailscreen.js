import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, Text, View, Button, ActivityIndicator, Alert, ScrollView, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import OrderDetailsCell from './OrderDetailsCell';
import { config, colors } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-tiny-toast';
import moment from "moment";

export default function OrderDetailscreen(props) {
    const { navigate } = props;
    const { orderData } = props.route.params;
    //1 - DECLARE VARIABLES
    const [paymentMethod, setPaymentMethod] = useState("Credit Card")
    const [orderId, setOrderId] = useState(orderData.order_no ? orderData.order_no : orderData)
    const [placedOrder, setPlacedOrder] = useState("")
    const [deliveryOrder, setDeliveryOrder] = useState("Mar 17, 2021")
    const [orderStatus, setOrderStatus] = useState(true)
    const [orderList, setOrderList] = useState([])
    const [orders_status, setOrdersStatus] = useState([])
    const [orderDetailsData, setOrderDetailsData] = useState('')
    const { state, handleLogout, handleGetOrderDetails } = useAuth();
    const user = state.user;



    useEffect(() => {
        callApiforGetOrderDetails()
    }, [])


    function callApiforGetOrderDetails() {
        let order_date;
        Toast.showLoading("Please wait..")
        handleGetOrderDetails(orderId)
            .then((response) => {
                Toast.hide()
                console.log("GetOrderDetails-res: ", response)
                if (response.status == 1) {
                    order_date = moment(response.data.created_at).format("MMM DD, YYYY")
                    setOrderDetailsData(response.data)
                    setOrderList(response.data.product)
                    setOrdersStatus(response.data.order_json)
                    setPlacedOrder(order_date)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }


    function render({ item, index }) {

        return <OrderDetailsCell
            source={item.images[0]}
            deliveryDate={item.deliveryDate}
            quantity={item.quantity}
            productTitle={item.product_name}
            productPrice={item.price}
            productQuantity={item.quantity}
        />
    }

    function showOrderStatus() {
        if (orderStatus) {
            setOrderStatus(false)
        } else {
            setOrderStatus(true)
        }
    }

    function itemSeparatorComponent() {
        return <View style={{ marginTop: moderateScale(10) }} />
    }


    return (
        <View style={styles.MainContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* ------------------CenterView ----------------- */}
                <View style={styles.CenterView} >
                    {/* ------------------ SubContainer ----------------- */}
                    <View style={styles.SubContainer}>
                        <View style={{ width: Dimensions.get('window').width }} >
                            <View style={{ backgroundColor: colors.secondary_color, padding: moderateScale(10) }} >
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                                    <View>
                                        <CustomText bold style={styles.TextContainer4}>ORDER ID</CustomText>
                                        <CustomText style={styles.TextContainer5}>{orderId}</CustomText>
                                    </View>
                                    <View>
                                        <CustomText bold style={styles.TextContainer4}>TOTAL</CustomText>
                                        <CustomText style={styles.TextContainer5}>{config.currency} {orderDetailsData ? orderDetailsData.total_amount : ""}</CustomText>
                                    </View>
                                </View>

                                <View height={verticalScale(10)} />
                                <CustomText bold style={[styles.TextContainer4]}>PLACED</CustomText>
                                <CustomText style={[styles.TextContainer5]}>{placedOrder}</CustomText>

                                <View height={verticalScale(15)} />
                                <View style={{ flexDirection: 'row' }}>
                                    <CustomText style={[styles.TextContainer2, { color: colors.main_color }]}>{orderDetailsData ? orderDetailsData.address.user_name : ""}</CustomText>

                                </View>

                                <View height={verticalScale(5)} />
                                <CustomText ellipsizeMode={'tail'} numberOfLines={3} style={[styles.TextContainer1, { color: 'white', }]} >{orderDetailsData ? orderDetailsData.address.address + "," + orderDetailsData.address.locality + " " + orderDetailsData.address.city + "," + orderDetailsData.address.state + " " + orderDetailsData.address.country + "," + orderDetailsData.address.pincode : ""}</CustomText>
                                <View style={{ flexDirection: 'row', marginTop: moderateScale(8) }}>
                                    <Image style={{ resizeMode: 'contain', height: moderateScale(20), width: moderateScale(20), alignSelf: 'center' }}
                                        source={require('../../../assets/images/phone.png')} />
                                    <CustomText bold style={[styles.TextContainer2, { marginLeft: moderateScale(8), color: colors.main_color }]} >{orderDetailsData ? orderDetailsData.address.user_phone : ""}</CustomText>
                                </View>
                            </View>
                            <View height={verticalScale(15)} />

                            <CustomText style={[styles.TextContainer, { color: colors.secondary_color, marginLeft: moderateScale(10) }]}>{orderList.length} {orderList.length == 1 ? "item" : 'items'} Confirmed.</CustomText>
                            <View height={verticalScale(5)} />
                            <CustomText style={[styles.TextContainer1, { marginLeft: moderateScale(10) }]}>Expected Delivery On</CustomText>

                            <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row' }} onPress={() => showOrderStatus()}>
                                <View style={{
                                    flexDirection: 'row', marginRight: moderateScale(10), marginLeft: moderateScale(10),
                                    width: Dimensions.get('window').width - scale(10), justifyContent: 'space-between'
                                }}>
                                    <CustomText bold style={[styles.TextContainer1, { marginTop: moderateScale(1), color: 'grey' }]}>{orderData.delivery_date ? orderData.delivery_date : "N/A"}</CustomText>
                                    {orders_status.length > 0 ? <Image style={styles.ImageContainer} source={orderStatus ? require("../../../assets/images/down.png") : require("../../../assets/images/Up.png")} />
                                        : <View />}
                                </View>
                            </TouchableOpacity>

                            {orderStatus
                                ? orders_status.length > 0 ? <FlatList
                                    style={{ marginTop: moderateScale(15) }}
                                    data={orders_status}
                                    renderItem={({ item, index }) => {
                                        let status_date;
                                        status_date = item.date ? moment(item.date).format("MMM DD, YYYY hh:mm A") : ""
                                        return (
                                            <View style={{
                                                flexDirection: 'row'
                                                , width: Dimensions.get("window").width - scale(20), marginLeft: moderateScale(10), marginRight: moderateScale(10), alignItems: 'center', justifyContent: 'space-between'
                                            }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    {item.status ? <Image style={[styles.ImageContainer1]} source={require("../../../assets/images/dot.png")} /> : null}
                                                    <CustomText style={[styles.TextContainer6, { marginLeft: moderateScale(10), marginRight: moderateScale(10) }]}>{item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : ""}</CustomText>
                                                </View>
                                                <View style={{ alignItems: 'flex-end' }}>
                                                    <CustomText style={[styles.TextContainer6, { marginLeft: moderateScale(10), marginRight: moderateScale(10) }]}>{status_date}</CustomText>
                                                </View>
                                            </View>
                                        )
                                    }}
                                    ItemSeparatorComponent={itemSeparatorComponent}
                                    keyExtractor={(item, index) => index.toString()}
                                /> : <View />
                                : <View />}

                            <FlatList
                                style={{ paddingTop: moderateScale(10), paddingBottom: moderateScale(10), marginTop: moderateScale(15), backgroundColor: '#f7f7f7' }}
                                //ref={(ref) => this.flatList = ref}
                                data={orderList}
                                renderItem={render}
                                ItemSeparatorComponent={itemSeparatorComponent}
                                keyExtractor={(item, index) => index.toString()}
                            />

                        </View>

                    </View>
                </View>
            </ScrollView>
            {/* <CustomText style={styles.TextContainer}>Payment Details</CustomText> */}
            <View style={{ backgroundColor: '#f7f7f7', width: Dimensions.get('window').width, marginTop: moderateScale(5), padding: moderateScale(10), }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                    <CustomText style={styles.TextContainer3}>Payment Method</CustomText>
                    <CustomText style={styles.TextContainer3}>{paymentMethod}</CustomText>
                </View>


                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: moderateScale(12), }}>
                    <CustomText style={styles.TextContainer3}>Sub Total</CustomText>
                    <CustomText style={styles.TextContainer3}>{config.currency}{orderDetailsData ? orderDetailsData.sub_total : ""}</CustomText>
                </View>

                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: moderateScale(12) }}>
                    <CustomText style={{ color: 'grey', fontSize: moderateScale(17) }}>Shipping Charges</CustomText>
                    <CustomText style={{ color: 'grey', fontSize: moderateScale(17) }}>{config.currency}{orderDetailsData ? orderDetailsData.shipping_charge : ""}</CustomText>
                </View>
            </View>
            <View style={{
                marginLeft: moderateScale(10), marginRight: moderateScale(10), justifyContent: 'space-between',
                flexDirection: 'row', marginTop: moderateScale(5), width: Dimensions.get('window').width - scale(20)
            }}>
                <CustomText bold style={{ fontSize: moderateScale(17), color: colors.secondary_color }}>Total</CustomText>
                <CustomText bold style={{ fontSize: moderateScale(17), color: colors.secondary_color }}>{config.currency}{orderDetailsData ? orderDetailsData.total_amount : ""}</CustomText>
            </View>

            <View height={verticalScale(20)} />
        </View>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        width: Dimensions.get('window').width,
        flex: 1,
        marginTop: 0,
        marginLeft: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    CenterView: {
        width: Dimensions.get('window').width,
        flex: 1,
        backgroundColor: 'transparent',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    SubContainer: {
        width: Dimensions.get('window').width,
        marginTop: 0,
        backgroundColor: 'transparent',
    },
    ImageContainer: {
        height: verticalScale(18),
        width: scale(18),
        marginRight: moderateScale(10),
        resizeMode: 'cover',
        tintColor: 'grey'
    },
    ImageContainer1: {
        height: moderateScale(8),
        width: moderateScale(8),
        resizeMode: 'contain',
        tintColor: 'grey',
    },

    TextContainer: {
        fontSize: moderateScale(15),
        fontWeight: 'bold',
        color: '#212121',
        textAlign: 'justify',
        alignSelf: 'flex-start',
        //  marginLeft: moderateScale(10),
        opacity: 0.8
    },
    TextContainer1: {
        fontSize: moderateScale(14),
        color: '#212121',
        alignSelf: 'flex-start',
        // marginLeft: moderateScale(10),
        // marginRight: moderateScale(10)
    },
    LineStyle: {
        height: verticalScale(1),
        // width: Dimensions.get('window').width,
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
        backgroundColor: 'lightgrey',
    },
    TextContainer2: {
        fontSize: moderateScale(15),
        // marginLeft: moderateScale(10),
        marginRight: moderateScale(10),
        fontWeight: 'bold',
        color: '#212121',
    },
    TextContainer3: {
        color: 'black',
        fontSize: moderateScale(17)
    },
    TextContainer4: {
        fontSize: moderateScale(14),
        color: colors.main_color,
        textAlign: 'justify'
    },
    TextContainer5: {
        fontSize: moderateScale(14),
        color: 'white',
        textAlign: 'justify'
    },
    TextContainer6: {
        fontSize: moderateScale(14),
        color: 'grey',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
});

