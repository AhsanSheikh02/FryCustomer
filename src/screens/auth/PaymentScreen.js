import React, { useState, useRef, useEffect } from 'react';
import { Image, Text, View, Button, ActivityIndicator, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '../../redux/providers/auth';
import { CreditCardInput, CardView, CreditCard, LiteCreditCardInput } from "react-native-credit-card-input";
import { CustomButton } from '../../components/Button';
import { colors, config } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CustomTextInput } from '../../components/TextInput';
import Toast from 'react-native-tiny-toast';
import Stripe from 'react-native-stripe-api';

export default function PaymentScreen(props) {
    const { navigation } = props;
    const { plan, isOrder, coupon } = props.route.params
    console.log("plan: ", plan)
    console.log("coupon: ", coupon)
    const plan_price = coupon != "" ? plan.price - (plan.price * coupon.percent_off / 100) : plan.price
    const couponId = coupon != "" ? coupon.id : ""

    const { state, handleSubscribe, handleUserProfile, handlePayment, handleCartList } = useAuth();
    const user = state.user;

    const client = new Stripe(config.stripe_api_key)

    var CCInput = useRef(null)
    var cardHolderRef = useRef(null)
    var expiryRef = useRef(null)
    var cvvRef = useRef(null)

    var is_order = false

    const [paymentDone, setPaymentDone] = useState(false);
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiryDate, setCardExpiryDate] = useState("");
    const [cardCVC, setCardCVC] = useState("");
    const [form, setForm] = useState(null)
    const [page, setPage] = useState(1)
    const [per_page, setPerPage] = useState(10)
    const [totalPrice, setTotalPrice] = useState(0)
    const [productData, setProductData] = useState([])
    useEffect(() => {

        // if (paymentDone) {
        //     setTimeout(() => {
        //         // TabHome
        //         navigation.dispatch(
        //             CommonActions.reset({
        //                 index: 1,
        //                 routes: [
        //                     { name: 'TabHome' },
        //                 ],
        //             })
        //         );

        //     }, 2000);
        // }

        if (isOrder) {
            callApiforCartList()
        }

    }, [])

    function callApiforCartList() {
        Toast.showLoading("Please wait..")
        handleCartList(page, per_page)
            .then((response) => {
                Toast.hide()
                console.log("CartList-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setTotalPrice(response.total_cart_value)
                    setProductData(response.data)

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    async function callBuySubscriptionApi() {

        if (!isOrder) {
            let formattedCardNumber = cardNumber.replace(/ /g, '')
            let formattedCardExpiry = cardExpiryDate.split('/')
            console.log("card details: ", formattedCardNumber)
            console.log("card details: ", formattedCardExpiry)
            console.log("card details: ", cardCVC)
            console.log("card details: ", cardHolderName)
            console.log("card details: ", plan.id)
            console.log("card details: ", plan_price)

            Toast.showLoading("Please wait..")

            try {
                // Create a Stripe token with new card infos
                const token = await client.createToken({
                    number: formattedCardNumber,
                    exp_month: formattedCardExpiry[0],
                    exp_year: formattedCardExpiry[1],
                    cvc: cardCVC,
                });
                if (token.error) {
                    Toast.show(token.error.message)
                } else {
                    handleSubscribe(token.id, plan.id, plan.price, couponId)
                        .then((response) => {
                            Toast.hide()
                            // console.log("BuySubscriptionApi-res: ", response)
                            if (response.status == 1) {
                                // Toast.showSuccess(response.message)
                                setPaymentDone(true)
                                handleUserProfile()
                                    .then((response) => {
                                        Toast.hide()
                                        // console.log("res: ", response)
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
        } else {
            callApiforOrderPayment()
        }

    }

    async function callApiforOrderPayment() {
        let product = []

        for (let i = 0; i < productData.length; i++) {
            product.push({
                id: productData[i].id,
                quantity: productData[i].cart_quantity,
                subtotal: productData[i].cart_price
            })
        }


        let formattedCardNumber = cardNumber.replace(/ /g, '')
        let formattedCardExpiry = cardExpiryDate.split('/')
        Toast.showLoading("Please wait..")

        try {
            // Create a Stripe token with new card infos
            const token = await client.createToken({
                number: formattedCardNumber,
                exp_month: formattedCardExpiry[0],
                exp_year: formattedCardExpiry[1],
                cvc: cardCVC,
            });
            if (token.error) {
                Toast.show(token.error.message)
            } else {
                handlePayment(totalPrice, token.id, product, "Purchase Product")
                    .then((response) => {
                        Toast.hide()
                        console.log("OrderPayment-res: ", response)
                        if (response.status == 1) {
                            // Toast.showSuccess(response.message)
                            setPaymentDone(true)

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
    function onSubmit() {
        console.log("pay now clicked")
        // callBuySubscriptionApi()
        // return

        if (form && form.status) {
            if (form.status.number == "incomplete") {
                Toast.show("Please enter card number")
            } else if (form.status.number == "invalid") {
                Toast.show("Please enter valid card number")
            } else if (cardHolderName == "") {
                Toast.show("Please enter card holder name")
            } else if (form.status.expiry == "incomplete") {
                Toast.show("Please enter card expiry date")
            } else if (form.status.expiry == "invalid") {
                Toast.show("Please enter valid card expiry")
            } else if (form.status.cvc == "incomplete") {
                Toast.show("Please enter card cvc")
            } else if (form.status.cvc == "invalid") {
                Toast.show("Please enter valid card cvc")
            } else {
                callBuySubscriptionApi()
            }
        } else {
            Toast.show("Please enter credit card details")
        }
    }

    function handleCardNumber(text) {
        let formattedText = text.split(' ').join('');
        if (formattedText.length > 0) {
            formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        setCardNumber(formattedText)
        return formattedText;
    }

    return !paymentDone ? (
        <KeyboardAvoidingView style={styles.MainContainer} behavior="padding" enabled={Platform.OS == "ios"}>
            <ImageBackground style={{ width: "100%", height: "100%", position: "absolute" }} resizeMode={"cover"} source={require("../../../assets/images/subscription_bg.png")} />
            <View style={styles.CenterView} >

                <ScrollView>

                    <View height={verticalScale(30)} />

                    <View style={{ height: verticalScale(36), flexDirection: "row", justifyContent: "center", alignItems: "center", margin: moderateScale(5) }}>
                        <TouchableOpacity activeOpacity={0.8} style={{ margin: moderateScale(12), position: "absolute", left: 0 }} onPress={() => navigation.pop()}>
                            <Image style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color }} source={require("../../../assets/images/left.png")} />
                        </TouchableOpacity>
                        <CustomText style={styles.HeaderText}>PAYMENT</CustomText>
                    </View>

                    <View height={verticalScale(20)} />

                    <Image style={{ height: verticalScale(140), width: scale(140), margin: moderateScale(10), resizeMode: 'contain', alignSelf: 'center' }} source={require('../../../assets/images/FRY.jpg')} />

                    <View height={verticalScale(30)} />

                    <View style={styles.SubContainer}>
                        <View height={verticalScale(20)} />

                        <View style={{
                            borderTopEndRadius: moderateScale(15),
                            borderBottomEndRadius: moderateScale(15),
                            alignSelf: 'flex-start',
                            paddingStart: moderateScale(8),
                            paddingEnd: moderateScale(15),
                            backgroundColor: colors.secondary_color
                        }}>
                            <CustomText bold style={styles.TextContainer}>CREDIT CARD DETAILS</CustomText>
                        </View>

                        <View style={{ height: 0 }}>
                            <LiteCreditCardInput ref={(ref) => CCInput = ref} onChange={(form) => {
                                console.log("form: ", form)
                                setForm(form)
                            }} />
                        </View>

                        <View style={styles.creditCardContainer}>
                            {/* <View style={styles.cardView}>
                                <CustomText bold style={{
                                    fontSize: moderateScale(34),
                                    padding: moderateScale(10),
                                    color: colors.secondary_color,
                                    textAlign: "center"
                                }}>stripe</CustomText>
                            </View> */}

                            <Image style={{ width: Dimensions.get("window").width - moderateScale(20), height: ((Dimensions.get("window").width - moderateScale(20)) * 390) / 1092 }} resizeMode="contain" source={require("../../../assets/images/stripe_card.png")} />

                            {/* <View height={verticalScale(6)} /> */}

                            <CustomText style={{ color: "grey", alignSelf: "flex-end", marginEnd: moderateScale(10) }}>{form && form.values.type}</CustomText>

                            <CustomTextInput
                                placeholder='Card Number'
                                onChangeText={(text) => {
                                    CCInput.setValues({ number: text })
                                    setCardNumber(text)
                                }}
                                returnKeyType={"next"}
                                keyboardType={"numeric"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => cardHolderRef.focus()}
                                value={form && form.values.number}
                                maxLength={30}
                            />

                            <View height={verticalScale(15)} />

                            <CustomTextInput
                                textInputRef={(ref) => cardHolderRef = ref}
                                placeholder='Card Holder Name'
                                onChangeText={(text) => setCardHolderName(text)}
                                returnKeyType={"next"}
                                textContentType={"givenName"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => expiryRef.focus()}
                                value={cardHolderName}
                                maxLength={25}
                            />

                            <View height={verticalScale(10)} />

                            <View style={{ flexDirection: "row", justifyContent: "space-between", margin: moderateScale(5) }}>
                                <CustomTextInput
                                    textInputRef={(ref) => expiryRef = ref}
                                    placeholder='MM/YY'
                                    onChangeText={(text) => {
                                        CCInput.setValues({ expiry: text })
                                        setCardExpiryDate(text)
                                    }}
                                    returnKeyType={"next"}
                                    keyboardType={"numeric"}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => cvvRef.focus()}
                                    containerStyle={{ flex: 1, marginLeft: moderateScale(5), marginRight: moderateScale(5) }}
                                    value={form && form.values.expiry}
                                    maxLength={5}
                                />
                                <CustomTextInput
                                    textInputRef={(ref) => cvvRef = ref}
                                    placeholder='CVC'
                                    onChangeText={(text) => {
                                        CCInput.setValues({ cvc: text })
                                        setCardCVC(text)
                                    }}
                                    keyboardType={"numeric"}
                                    returnKeyType={"done"}
                                    // blurOnSubmit={false}
                                    containerStyle={{ flex: 1, marginLeft: moderateScale(5), marginRight: moderateScale(5) }}
                                    value={form && form.values.cvc}
                                    maxLength={3}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={{ flexDirection: 'row', backgroundColor: colors.secondary_color }}>
                    <View style={{ flex: 0.9, alignItems: "flex-start", padding: moderateScale(8) }}>
                        <CustomText style={styles.TextContainer1}>TOTAL</CustomText>
                        <CustomText bold style={[styles.TextContainer1, { fontSize: moderateScale(16), color: colors.main_color }]}>{config.currency}{!isOrder ? plan_price.toFixed(2) : totalPrice.toFixed(2)}</CustomText>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={styles.payNowButton} onPress={() => onSubmit()}>
                        <CustomText style={{ fontSize: moderateScale(18), color: "white" }}>PAY NOW</CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
        :
        (
            <View style={styles.MainContainer}>
                <ImageBackground style={{ width: "100%", height: "100%", position: "absolute" }} resizeMode={"cover"} source={require("../../../assets/images/register_bg.png")} />
                <View style={styles.CenterView} >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <View height={moderateScale(30)} />
                        <Image style={{
                            height: verticalScale(150), width: scale(150), alignSelf: 'center',
                            tintColor: colors.main_color, borderRadius: 8, resizeMode: "contain"
                        }} source={require('../../../assets/images/checkmark.png')} />
                        <View height={moderateScale(10)} />
                        {isOrder ?
                            <View>
                                <CustomText style={styles.HeaderText}>{"PAYMENT SUCCESSFUL"} </CustomText>
                                <CustomText style={styles.TextContainer2}>{"Your order has been confirmed."} </CustomText>
                            </View>
                            :
                            <View>
                                <CustomText style={styles.HeaderText}>{"PAYMENT SUCCESSFUL"} </CustomText>
                                <CustomText style={styles.TextContainer2}>{"Thank you for your subscription."} </CustomText>
                            </View>
                        }
                    </View>
                    <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: moderateScale(50) }}>
                        <CustomButton buttonStyle={{ width: Dimensions.get("window").width / 1.3, alignSelf: "center" }} title="Continue"
                            onPress={() => {
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 1,
                                        routes: [
                                            { name: 'TabHome' },
                                        ],
                                    })
                                );
                            }}
                        />
                    </View>
                </View>
            </View>
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
    cardView: {
        margin: moderateScale(8),
        borderRadius: moderateScale(6),
        backgroundColor: colors.card_color,
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
    infoText: {
        fontSize: 16,
        color: 'black',
    },
    infoText1: {
        fontSize: 15,
        color: 'gray',
    },

});

