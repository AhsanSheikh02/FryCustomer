import React, { useState, useContext } from 'react';
import { TouchableOpacity, TextInput, Text, View, Button, ActivityIndicator, Alert, KeyboardAvoidingView, StyleSheet, Dimensions, Image, Platform, ImageBackground, FlatList } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { CustomButton } from '../../components/Button';
import { CommonActions } from '@react-navigation/native';
import constants, { colors, config, GET_SUBSCRIPTION_LIST, IAP_PAYMENT } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Fontisto';
import fetch from '../../services/fetch';
import { CustomText } from '../../components/Text';
import Toast from 'react-native-tiny-toast';
import { useEffect } from 'react';
import * as RNIap from 'react-native-iap';

var plans = [
    // {
    //     id: 3,
    //     title: "One Month Subscription",
    //     description: "One Month Subscription",
    //     duration: "01",
    //     dur_type: "month",
    //     price: "99.00",
    // },
    // {
    //     id: 4,
    //     title: "Three Month Subscription",
    //     description: "Three Month Subscription",
    //     duration: "03",
    //     dur_type: "month",
    //     price: "249.00",
    // },
    // {
    //     id: 5,
    //     title: "Six Month Subscription",
    //     description: "Six Month Subscription",
    //     duration: "06",
    //     dur_type: "month",
    //     price: "499.00",
    // },
]
var insideApp = false
let itemsLoaded = false
let iapConnected = false

export default function SubscriptionPage(props) {
    const { navigation, route } = props;
    console.log("props: ", route.params)
    insideApp = route.params && route.params.insideApp ? route.params.insideApp : false

    //1 - DECLARE VARIABLES
    const [planList, setPlanList] = useState(plans)
    const [loading, setLoading] = useState(false)

    const { state, handleUserProfile } = useAuth();
    const user = state.user;
    console.log("user: ", user)

    const itemSubs = ['com.yogacustomer.1month', 'com.yogacustomer.3month', 'com.yogacustomer.1year'];

    let purchaseUpdateSubscription = null;
    let purchaseErrorSubscription = null;

    useEffect(() => {
        setLoading(true)
        fetch.get(GET_SUBSCRIPTION_LIST)
            .then((result) => {
                console.log("result", result)
                setLoading(false)
                if (result.status == 1) {
                    setPlanList(result.data)
                } else {
                    setPlanList([])
                }
            })
            .catch((error) => {
                console.log("error", error)
                setLoading(false)
            })

    }, [navigation])

    // useEffect(() => {
    //     if (planList.length > 0 && itemsLoaded && iapConnected)
    //         getAvailablePurchases()
    // }, [planList, itemsLoaded, iapConnected])

    useEffect(() => {
        RNIap.initConnection()
            .then(result => {
                console.log("IAP result: ", result)
                iapConnected = result
                getItems()

                if (Platform.OS === 'android') {
                    RNIap.flushFailedPurchasesCachedAsPendingAndroid()
                        .then((result) => {
                            console.log('consumed all items?', result);
                        })
                        .catch(error => {
                            console.log("error", error)
                        })
                } else {
                    RNIap.clearTransactionIOS();
                }

                purchaseUpdateSubscription = RNIap.purchaseUpdatedListener((purchase) => {
                    console.log('purchaseUpdatedListener', purchase);
                    // Alert.alert("purchase", JSON.stringify(purchase))

                    debugger
                    let receipt;
                    if (Platform.OS === 'android') {
                        receipt = purchase.transactionReceipt
                            ? purchase.transactionReceipt
                            : purchase.originalJson;
                        receipt = JSON.parse(receipt)
                    }
                    else {
                        receipt = { "productId": purchase.productId, "purchaseTime": purchase.transactionDate }
                    }
                    console.info("receipt", receipt);

                    if (receipt) {
                        // Alert.alert("receipt", JSON.stringify(receipt))
                        // Tell the store that you have delivered what has been paid for.
                        // Failure to do this will result in the purchase being refunded on Android and
                        // the purchase event will reappear on every relaunch of the app until you succeed
                        // in doing the below. It will also be impossible for the user to purchase consumables
                        // again until you do this.
                        // await RNIap.finishTransaction(purchase);

                        // From react-native-iap@4.1.0 you can simplify above `method`. Try to wrap the statement with `try` and `catch` to also grab the `error` message.
                        // If consumable (can be purchased again)
                        // await RNIap.finishTransaction(purchase, true);
                        // If not consumable
                        setLoading(true)
                        RNIap.finishTransaction(purchase)
                            .then((ackResult) => {
                                console.info('ackResult', ackResult);
                                // 'ackResult', { message: '', debugMessage: '', code: 'OK', responseCode: 0 }
                                // call api for purchase subscription here ========================

                                setLoading(false)
                                if (Platform.OS == "ios" || ackResult.code == "OK") {
                                    debugger
                                    const data = planList.find((value) => {
                                        return value.sku === receipt.productId
                                    })
                                    if (data) {
                                        const plan = data
                                        // call api free-subscription, params: receipt.productId, receipt.purchaseTime
                                        buyIAPsubscription(plan, receipt.purchaseTime, false)
                                    }
                                } else {
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 1,
                                            routes: [
                                                { name: 'TabHome' },
                                            ],
                                        })
                                    );
                                }
                            })
                            .catch((error) => {
                                console.log("error", error)
                                setLoading(false)
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 1,
                                        routes: [
                                            { name: 'TabHome' },
                                        ],
                                    })
                                );
                            })
                    }
                });

                purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
                    console.warn('purchaseErrorListener', error);
                    setLoading(false)
                    // Alert.alert('purchase error', error.message);
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: 'TabHome' },
                            ],
                        })
                    );
                });
            })
            .catch((reason) => {
                console.log("error", reason)
                iapConnected = false
            })

        return (() => {
            if (purchaseUpdateSubscription) {
                purchaseUpdateSubscription.remove();
                purchaseUpdateSubscription = null;
            }
            if (purchaseErrorSubscription) {
                purchaseErrorSubscription.remove();
                purchaseErrorSubscription = null;
            }
            RNIap.endConnection();
            iapConnected = false
        })
    }, [RNIap, planList])

    const getAvailablePurchases = async () => {
        try {
            const purchases = await RNIap.getAvailablePurchases();
            console.log("available purchases", purchases)

            if (purchases.length > 0) {
                let receipt;
                if (Platform.OS === 'android') {
                    receipt = JSON.parse(purchases[0].transactionReceipt)
                }
                else {
                    receipt = { "productId": purchases[0].productId, "purchaseTime": purchases[0].transactionDate }
                }
                console.info("receipt", receipt);
                const data = planList.find((value) => {
                    return value.sku === receipt.productId
                })
                if (data) {
                    const plan = data
                    // call api free-subscription, params: plan.id, receipt.purchaseTime
                    buyIAPsubscription(plan, receipt.purchaseTime, true)
                }
            }
        } catch (err) {
            console.warn(err); // standardized err.code and err.message available
            Alert.alert(err.message);
        }
    }
    const getItems = async () => {
        try {
            console.log("itemSubs ", itemSubs);
            const Products = await RNIap.getSubscriptions(itemSubs);
            // const Plans = Products.map((element, index) => {
            //     return JSON.parse(element.originalJson)
            // })
            // debugger
            debugger
            itemsLoaded = true
            console.log('IAP Su', Products);
            if (Plans.length !== 0) {
                if (Platform.OS === 'android') {
                    //Your logic here to save the products in states etc
                    // setPlanList(Plans)
                } else {
                    // your logic here to save the products in states etc
                    // Make sure to check the response differently for android and ios as it is different for both
                }
            }
        } catch (err) {
            console.warn("IAP error", err.code, err.message, err);
        }
    };

    const requestIAPSubscription = async (sku) => {
        setLoading(true)
        try {
            await RNIap.requestSubscription(sku);
        } catch (err) {
            setLoading(false)
            console.warn(err.code, err.message);
        }
    }

    function choosePlan(index) {
        let newPlanList = planList.map((item) => {
            item.isSelected = false;
            return item
        });

        newPlanList[index].isSelected = true;
        setPlanList(newPlanList)
    }

    function buyIAPsubscription(plan, purchaseTime, isRestored) {
        debugger
        setLoading(true)
        fetch.post(IAP_PAYMENT, {
            expiry_at: purchaseTime,
            subscription_id: plan.id
        })
            .then((result) => {
                console.log("result", result)
                Toast.show(result.msg)
                if (result.status == 1) {
                    // Toast.showSuccess(response.message)
                    handleUserProfile()
                        .then((response) => {
                            setLoading(false)
                            // console.log("IAPsubscription-res: ", response)
                            let title = "", message = ""
                            if (!isRestored) {
                                title = "Payment Successful"
                                message = "You have successfully subscribed to the plan!"
                            } else {
                                title = "Restore Successful"
                                message = 'You have successfully restored ' + plan.title
                            }
                            Alert.alert(
                                title,
                                message,
                                [
                                    {
                                        text: "Ok",
                                        onPress: () => {
                                            setLoading(false)
                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 1,
                                                    routes: [
                                                        { name: 'TabHome' },
                                                    ],
                                                })
                                            );
                                        },
                                        style: "ok",
                                    },
                                ],
                                {
                                    cancelable: false,
                                }
                            )

                        })
                        .catch((error) => {
                            setLoading(false)
                            console.log(error.message);
                        })
                } else {
                    setLoading(false)
                    Toast.show(response.message)
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log("error", error)
                Toast.show("something went wrong!")
            })
            .finally(() => {
                setLoading(false)
            })

    }

    function onPressSkip() {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'TabHome' },
                ],
            })
        );

    }

    return (
        <KeyboardAvoidingView style={styles.MainContainer} behavior="padding" enabled keyboardVerticalOffset={Platform.select({ ios: Dimensions.get('window').height == 812 || Dimensions.get('window').width == 812 ? 85 : 64, android: -500 })}>
            {/* ------------------CenterView ----------------- */}
            <ImageBackground style={{ width: "100%", height: "100%", position: "absolute" }} resizeMode={"cover"} source={require("../../../assets/images/subscription_bg.png")} />

            <View height={verticalScale(30)} />

            {insideApp ? <View style={{ height: verticalScale(36), width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", margin: moderateScale(5) }}>
                <TouchableOpacity activeOpacity={0.8} style={{ margin: moderateScale(12), position: "absolute", left: 0 }} onPress={() => navigation.pop()}>
                    <Image style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color }} source={require("../../../assets/images/left.png")} />
                </TouchableOpacity>
                <CustomText style={styles.HeaderText}>CHOOSE YOUR PLAN</CustomText>
            </View> : <CustomText style={styles.HeaderText}>CHOOSE YOUR PLAN</CustomText>}

            {/* <View height={verticalScale(20)} /> */}

            <View style={styles.CenterView} >

                {/* <Image style={{ height: verticalScale(140), width: scale(140), margin: moderateScale(10), resizeMode: 'contain', alignSelf: 'center' }} source={require('../../../assets/images/FRY.jpg')} /> */}

                <View style={[styles.cardView, { minHeight: 0, padding: moderateScale(5), alignItems: "center" }]}>
                    <CustomText style={{ textAlign: "center", color: colors.secondary_color }}>
                        By enabling this in-app purchase, you will be able to watch Yoga videos.
                        as well as you can also see the live streams of yoga events after the subscription.
                        So, just enable this feature by subscribing to any of the below plans and enjoy the Yoga at your comfort!
                    </CustomText>
                </View>

                <View height={verticalScale(20)} />

                <FlatList
                    data={planList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity activeOpacity={0.8} style={styles.cardView} onPress={() => requestIAPSubscription(item.sku)}>
                                <View style={{ flexDirection: "row", margin: moderateScale(4) }}>
                                    <View style={{ padding: moderateScale(6), flexDirection: "column", alignItems: "center", width: scale(80) }}>
                                        <CustomText bold style={{ color: colors.secondary_color, fontSize: moderateScale(22) }}>{item.duration}</CustomText>
                                        <CustomText style={{ color: "grey", fontSize: moderateScale(14), marginTop: verticalScale(-3), textTransform: "uppercase", textAlign: "center" }}>{"Month"}</CustomText>
                                    </View>
                                    <View style={{ backgroundColor: "grey", height: "100%", width: 1, margin: moderateScale(2) }} />
                                    <CustomText style={{ color: "grey", fontSize: moderateScale(15), margin: moderateScale(6), alignSelf: "center", flex: 1 }}>{item.title}</CustomText>
                                </View>
                                <View style={{ padding: moderateScale(6), flexDirection: "column", alignItems: "center", backgroundColor: colors.secondary_color, borderBottomEndRadius: moderateScale(6), borderBottomStartRadius: moderateScale(6), width: "100%" }}>
                                    <CustomText style={{ color: "white", fontSize: moderateScale(16) }}>{constants.config.currency}{item.price.toFixed(2)}</CustomText>
                                    {/* <Icon
                                            name={item.isSelected ? 'radio-btn-active' : 'radio-btn-passive'}
                                            size={moderateScale(24)}
                                            color={colors.accent_color}
                                            style={{ margin: moderateScale(12), paddingRight: moderateScale(6) }}
                                            onPress={() => choosePlan(index)}
                                        /> */}
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />

                <View height={verticalScale(10)} />

                <View style={{ flexDirection: "column", alignItems: "center" }}>
                    <CustomText onPress={() => navigation.navigate("WebContent", { url: config.terms_url, name: "Terms & Conditions" })} style={{ fontSize: moderateScale(12), fontWeight: "bold", color: 'blue', alignItems: "center" }}>Terms {'&'} Conditions</CustomText>
                    <CustomText onPress={() => navigation.navigate("WebContent", { url: config.privacy_url, name: "Privacy Policy" })} style={{ fontSize: moderateScale(12), fontWeight: "bold", color: 'blue', alignItems: "center" }}>Privacy Policy</CustomText>
                </View>

                <View height={verticalScale(10)} />

                {insideApp ? <View /> : <CustomButton buttonStyle={{ padding: 8, width: Dimensions.get("window").width / 1.5, alignSelf: 'center' }}
                    title="Skip" onPress={() => { onPressSkip() }} />}
            </View>

            {loading ?
                <View style={{ width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", position: "absolute", justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={'large'} color={"white"} style={{ alignSelf: "center" }} />
                </View> : <View />}

        </KeyboardAvoidingView>
    );
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
        padding: moderateScale(20)
    },
    HeaderText: {
        fontSize: moderateScale(24),
        color: "white",
        textAlign: 'center',
    },
    TextContainer: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.accent_color,
        textAlign: "left",
        flex: 1
    },
    cardView: {
        margin: moderateScale(6),
        borderRadius: moderateScale(6),
        backgroundColor: "white",
        minHeight: verticalScale(80),
        flexDirection: "column",
        alignItems: "center",
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
