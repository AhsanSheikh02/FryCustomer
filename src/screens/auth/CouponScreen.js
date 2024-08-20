import React, { useState, useRef, useEffect } from 'react';
import { Image, Text, View, Button, ActivityIndicator, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, Platform, ImageBackground, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../redux/providers/auth';
import { CustomButton } from '../../components/Button';
import { colors, config } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CustomTextInput } from '../../components/TextInput';
import Toast from 'react-native-tiny-toast';

// let coupons = [
//     {
//         id: 0,
//         title: "10% discount on subscription",
//         amount_perc: 10.00,
//         validity: "03-08-21",
//         isSelected: true
//     },
//     {
//         id: 1,
//         title: "20% discount on subscription",
//         amount_perc: 20.00,
//         validity: "08-08-21",
//         isSelected: false
//     },
//     {
//         id: 2,
//         title: "40% discount on subscription",
//         amount_perc: 40.00,
//         validity: "03-09-21",
//         isSelected: false
//     },
//     {
//         id: 3,
//         title: "50% discount on subscription",
//         amount_perc: 50.00,
//         validity: "28-07-21",
//         isSelected: false
//     },
// ]

export default function CouponScreen(props) {
    const { navigation, route } = props;
    const { plan, isOrder } = route.params
    console.log("plan: ", plan)

    const { state, handleCouponList, handleVerifyCoupon, handleFreeSubscription, handleUserProfile } = useAuth();
    const user = state.user;

    const [page, setPage] = useState(1)
    const [per_page, setPerPage] = useState(10)
    const [couponList, setCouponList] = useState([])
    const [coupon, setCoupon] = useState("")
    const [couponCode, setCouponCode] = useState("")
    const [couponReedemView, showCouponReedemView] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        // do render work here
        callApiforCouponList()
    }, [navigation])

    useEffect(() => {
        showCouponReedemView(false)
    }, [couponCode])

    function selectCoupon(item) {
        showCouponReedemView(false)
        couponList.map(element => {
            element.isSelected = false
            if (item.id == element.id) {
                element.isSelected = true
            }
        });

        setCoupon(item)
    }

    function fetchCoupon() {
        Keyboard.dismiss()
        if (couponCode == "") {
            Toast.show("Please enter coupon code!")
        } else {
            Toast.showLoading("Please wait..")
            let isValid = false
            couponList.map(element => {
                element.isSelected = false
                if (couponCode.toUpperCase() == element.stripe_coupon_id.toUpperCase()) {
                    isValid = true
                    setCoupon(element)
                }
            });

            if (isValid) {
                Toast.hide()
                Toast.show("Coupon applied successfully!")
                showCouponReedemView(true)
            } else {
                callApiforVerifyCoupon()
            }
        }
    }

    function onSubmit(coupon) {
        if (coupon.percent_off == 100 || coupon.percent_off == 0) {
            callFreeSubscriptionApi(coupon)
            // navigation.dispatch(
            //     CommonActions.reset({
            //         index: 1,
            //         routes: [
            //             { name: 'TabHome' },
            //         ],
            //     })
            // );
        }
        else {
            navigation.navigate("PaymentScreen", { plan, isOrder, coupon })
        }
    }

    function callFreeSubscriptionApi(couponvalue) {
        Toast.showLoading("Please wait..")
        handleFreeSubscription(plan.id, couponvalue.id)
            .then((response) => {
                Toast.hide()
                console.log("FreeSubscriptionApi-res: ", response)
                if (response.status == 1) {
                    Toast.showSuccess(response.message)
                    handleUserProfile()
                        .then((response) => {
                            Toast.hide()
                            // console.log("res: ", JSON.stringify(response))
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 1,
                                    routes: [
                                        { name: 'TabHome' },
                                    ],
                                })
                            );
                        })
                        .catch((error) => {
                            Toast.hide()
                            console.log(error.message);
                            // Toast.show(error.message)
                        })

                } else {
                    Toast.show(response.message)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
        return
        try {
            if (token.error) {
                Toast.show(token.error.message)
            } else {
                handleSubscribe("", plan.id, plan.price, couponvalue.id)
                    .then((response) => {
                        Toast.hide()
                        console.log("res: ", response)
                        if (response.status == 1) {
                            // Toast.showSuccess(response.message)
                            setPaymentDone(true)
                            handleUserProfile()
                                .then((response) => {
                                    Toast.hide()
                                    console.log("res: ", response)
                                })
                                .catch((error) => {
                                    Toast.hide()
                                    console.log(error.message);
                                })
                        } else {
                            Toast.show(response.message)
                        }
                    })
                    .catch((error) => {
                        Toast.hide()
                        console.log(error.message);
                        Toast.show(error.message)
                    })
            }
            console.log("token: ", token)
        } catch (e) {
            Toast.hide()
            console.log("card token error: ", e)
        }
    }

    function callApiforCouponList() {
        Toast.showLoading("Please wait..")
        handleCouponList()
            .then((response) => {
                Toast.hide()
                console.log("CouponList-res: ", response)
                if (response.status == 1) {
                    for (var i = 0; i < response.data.length; i++) {
                        var datum = response.data[i];
                        if (i == 0) {
                            var newNum = "isSelected";
                            var newVal = true;
                            datum[newNum] = newVal;
                        } else {
                            var newNum = "isSelected";
                            var newVal = false;
                            datum[newNum] = newVal;
                        }

                    }
                    setCouponList(response.data)
                    // Toast.showSuccess(response.message)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    function callApiforVerifyCoupon() {
        handleVerifyCoupon(couponCode)
            .then((response) => {
                Toast.hide()
                console.log("VerifyCoupon-res: ", response)
                if (response.status == 1) {
                    Toast.show("Coupon applied successfully!")
                    showCouponReedemView(true)
                    setCoupon(response.data)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show("Coupon is not valid!")
            })
    }

    return (
        <View style={styles.MainContainer}>
            <ImageBackground style={{ left: 0, top: 0, width: Dimensions.get("window").width, height: Dimensions.get("window").height, position: "absolute" }} resizeMode={"cover"} source={require("../../../assets/images/subscription_bg.png")} />
            <View style={styles.CenterView} >

                <View height={verticalScale(30)} />

                <View style={{ height: verticalScale(36), width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", margin: moderateScale(5) }}>
                    <TouchableOpacity style={{ margin: moderateScale(12), position: "absolute", left: 0 }} onPress={() => navigation.pop()}>
                        <Image style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color }} source={require("../../../assets/images/left.png")} />
                    </TouchableOpacity>
                    <CustomText style={styles.HeaderText}>REDEEM COUPON</CustomText>
                </View>

                <View height={verticalScale(20)} />

                <View style={styles.CenterView} >

                    <Image style={{ height: verticalScale(140), width: scale(140), margin: moderateScale(10), resizeMode: 'contain', alignSelf: 'center' }} source={require('../../../assets/images/FRY.jpg')} />

                    <View height={verticalScale(30)} />

                    <View style={{
                        borderTopEndRadius: moderateScale(15),
                        borderBottomEndRadius: moderateScale(15),
                        alignSelf: 'flex-start',
                        paddingStart: moderateScale(8),
                        paddingEnd: moderateScale(15),
                        backgroundColor: colors.secondary_color
                    }}>
                        <CustomText bold style={styles.TextContainer}>Enter Coupon Code</CustomText>
                    </View>
                    <View height={verticalScale(15)} />
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <CustomTextInput
                            placeholder='COUPON CODE'
                            onChangeText={(text) => {
                                setCouponCode(text)
                            }}
                            autoCapitalize={"characters"}
                            returnKeyType={"done"}
                            // keyboardType={"numeric"}
                            value={couponCode}
                            maxLength={30}
                        >
                        </CustomTextInput>
                        <CustomText onPress={() => fetchCoupon()}
                            bold
                            style={{
                                end: moderateScale(20),
                                color: colors.secondary_color,
                                padding: moderateScale(10),
                                position: "absolute",
                                fontSize: moderateScale(13)
                            }}>CHECK</CustomText>
                    </View>
                    {couponReedemView ?
                        <View style={{ height: verticalScale(25), marginHorizontal: scale(12), flexDirection: "row", backgroundColor: "black", borderWidth: 0.5, borderColor: "grey" }}>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                <CustomText style={styles.TextContainer1}>Effective Total: </CustomText>
                                <CustomText bold style={[styles.TextContainer1, { fontSize: moderateScale(14), color: colors.main_color }]}>{config.currency}{(plan.price - (plan.price * coupon.percent_off / 100)).toFixed(2)}</CustomText>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} style={styles.redeemButton} onPress={() => onSubmit(coupon)}>
                                <CustomText style={{ fontSize: moderateScale(13), color: "white" }}>REDEEM</CustomText>
                            </TouchableOpacity>
                        </View>
                        : <View />}

                    <View height={verticalScale(15)} />
                    <FlatList
                        data={couponList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => selectCoupon(item)}>
                                    <View style={styles.cardView}>
                                        <View style={{ flexDirection: "column", paddingLeft: moderateScale(10), justifyContent: "center", backgroundColor: "red", alignItems: "center", width: scale(90) }}>
                                            <CustomText bold style={{ color: "white", fontSize: moderateScale(22), margin: moderateScale(10) }}>{item.percent_off + "%"}</CustomText>
                                        </View>
                                        <View style={{ height: "100%", backgroundColor: "red", right: 1 }}>
                                            <View style={styles.dots} />
                                            <View style={styles.dots} />
                                            <View style={styles.dots} />
                                            <View style={styles.dots} />
                                            <View style={styles.dots} />
                                            <View style={styles.dots} />
                                            <View style={styles.dots} />
                                            <View style={styles.dots} />
                                        </View>
                                        <View style={{ flexDirection: "column", justifyContent: "space-evenly", padding: moderateScale(10), flex: 1 }}>
                                            <CustomText numberOfLines={2} style={{ color: "black", fontSize: moderateScale(14) }}>{item.coupon_name}</CustomText>
                                            <CustomText numberOfLines={1} style={{ color: "grey", fontSize: moderateScale(12), }}>{"Code: " + item.stripe_coupon_id.toUpperCase()}</CustomText>
                                            <CustomText numberOfLines={1} style={{ color: "grey", fontSize: moderateScale(12) }}>{"Valid Until: " + item.redeem_by}</CustomText>
                                        </View>
                                    </View>
                                    <View style={{
                                        height: 20,
                                        width: 20,
                                        borderRadius: 10,
                                        backgroundColor: colors.main_color,
                                        left: 0, top: verticalScale(38), bottom: 0,
                                        position: "absolute"
                                    }}>
                                    </View>
                                    <View style={{
                                        height: 20,
                                        width: 20,
                                        borderRadius: 10,
                                        backgroundColor: colors.main_color,
                                        right: 0, top: verticalScale(38), bottom: 0,
                                        position: "absolute"
                                    }}>
                                    </View>
                                    {item.isSelected ?
                                        <View style={{ height: verticalScale(25), marginHorizontal: scale(12), flex: 1, flexDirection: "row", backgroundColor: "black", borderWidth: 0.5, borderColor: "grey" }}>
                                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                                <CustomText style={styles.TextContainer1}>Effective Total: </CustomText>
                                                <CustomText bold style={[styles.TextContainer1, { fontSize: moderateScale(14), color: colors.main_color }]}>{config.currency}{(plan.price - (plan.price * item.percent_off / 100)).toFixed(2)}</CustomText>
                                            </View>
                                            <TouchableOpacity activeOpacity={0.8} style={styles.redeemButton} onPress={() => onSubmit(item)}>
                                                <CustomText style={{ fontSize: moderateScale(13), color: "white" }}>REDEEM</CustomText>
                                            </TouchableOpacity>
                                        </View>
                                        : <View />}
                                </TouchableOpacity>
                            )
                        }}
                    />

                    <View height={verticalScale(20)} />

                    <View style={{ flexDirection: 'row', backgroundColor: colors.secondary_color }}>
                        <View style={{ flex: 0.9, alignItems: "flex-start", padding: moderateScale(8) }}>
                            <CustomText style={styles.TextContainer1}>TOTAL</CustomText>
                            <CustomText bold style={[styles.TextContainer1, { fontSize: moderateScale(16), color: colors.main_color }]}>{config.currency}{!isOrder ? plan.price.toFixed(2) : totalPrice.toFixed(2)}</CustomText>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={styles.payNowButton} onPress={() => {
                            setCoupon("")
                            onSubmit("")
                        }}>
                            <CustomText style={{ fontSize: moderateScale(18), color: "white" }}>SKIP</CustomText>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: colors.secondary_color_old,
        justifyContent: 'center',
        alignItems: 'center',
    },
    CenterView: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    HeaderText: {
        fontSize: moderateScale(24),
        color: "white",
        textAlign: 'center'
    },
    SubContainer: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    creditCardContainer: {
        flex: 1,
        padding: moderateScale(10),
    },
    TextContainer: {
        fontSize: moderateScale(14),
        padding: moderateScale(5),
        color: 'white',
        textAlign: 'center',
    },
    TextContainer1: {
        fontSize: moderateScale(11),
        paddingStart: moderateScale(8),
        color: 'white',
        textAlign: 'center'
    },
    TextContainer2: {
        fontSize: moderateScale(17),
        color: 'white',
        textAlign: 'center',
    },
    payNowButton: {
        flex: 1.1,
        backgroundColor: colors.accent_color,
        borderTopStartRadius: moderateScale(30),
        borderBottomStartRadius: moderateScale(30),
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    redeemButton: {
        backgroundColor: colors.accent_color,
        borderTopStartRadius: moderateScale(30),
        borderBottomStartRadius: moderateScale(30),
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        paddingHorizontal: scale(20),
        shadowOpacity: 0.8,
        shadowRadius: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    cardView: {
        // borderRadius: moderateScale(6),
        borderColor: "grey",
        borderWidth: 0,
        flexDirection: "row",
        height: verticalScale(80),
        marginTop: moderateScale(8),
        marginHorizontal: moderateScale(12),
        backgroundColor: "white",
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
    dots: {
        height: verticalScale(8),
        width: scale(8),
        marginVertical: verticalScale(1),
        backgroundColor: "white",
        borderRadius: moderateScale(4),
        left: 5
    },
    infoText: {
        fontSize: 16,
        color: 'black',
    },
    infoText1: {
        fontSize: 15,
        color: 'gray',
    },

});

