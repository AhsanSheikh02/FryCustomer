import React, { useState, useContext } from 'react';
import { TextInput, Text, View, Button, ActivityIndicator, Alert, KeyboardAvoidingView, StyleSheet, Dimensions, Image, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { CustomButton } from '../../components/Button';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-tiny-toast';
import { CommonActions } from '@react-navigation/native';
import { CustomText } from '../../components/Text';

export default function OTPVerification(props) {
    const { navigation, route } = props;
    const { email, password, isForgot } = route.params
    console.log("props: ", route)
    //1 - DECLARE VARIABLES
    const [code, setCode] = useState("");
    const [forgotKey, setForgotKey] = useState(isForgot);
    const { state, handleSendOTP, handleVerifyOTP, handleLogin, handleVerifyOTP2, handleResendOTP2 } = useAuth();
    const user = state.user;

    function callApiforSendOTP() {
        Toast.showLoading("Please wait..")
        setCode("")

        handleSendOTP(email)
            .then((response) => {
                Toast.hide()
                console.log("SendOTP-res: ", response)
                Toast.show(response.message)
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }


    function callApiforForgotPasswordResendOTP() {
        Toast.showLoading("Please wait..")
        setCode("")

        handleResendOTP2(email)
            .then((response) => {
                Toast.hide()
                // console.log("ForgotPasswordResendOTP-res: ", response)
                Toast.show(response.message)
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }

    function onPressResendOTP() {
        if (forgotKey) {
            callApiforForgotPasswordResendOTP()
        } else {
            callApiforSendOTP()
        }
    }

    function onPressSubmit() {
        if (forgotKey) {
            callApiforPasswordVerifacation()
        } else {
            callApiforVerifyOTP()
        }
    }

    function callApiforPasswordVerifacation() {
        if (code == "" || code.length < 4) {
            Toast.show("Please enter the OTP!")
        } else {
            Toast.showLoading("Please wait..")
            handleVerifyOTP2(email, code)
                .then((response) => {
                    console.log("PasswordVerifacation-res: ", response)
                    if (response.status == 1) {
                        Toast.hide()
                        Toast.showSuccess(response.message)
                        navigation.navigate("ResetPassword", { email })
                    } else {
                        Toast.hide()
                        Toast.show(response.message)
                    }
                })
                .catch((error) => {
                    Toast.hide()
                    console.log(error.message);
                    Toast.show(error.message)
                })
        }
    }

    function callApiforVerifyOTP() {

        if (code == "" || code.length < 4) {
            Toast.show("Please enter the OTP!")
        } else {
            Toast.showLoading("Please wait..")
            handleVerifyOTP(email, code)
                .then((response) => {
                    // console.log("VerifyOTP-res: ", response)
                    if (response.status == 1) {
                        Toast.hide()
                        Toast.showSuccess(response.message)

                        handleLogin(email, password)
                            .then((response) => {
                                Toast.hide()
                                // console.log("res: ", response)
                                if (response.status == 1) {
                                    // Toast.showSuccess(response.message)
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 1,
                                            routes: [
                                                { name: 'SubscriptionPage' },
                                            ],
                                        })
                                    );
                                } else {
                                    Toast.show(response.message)
                                }
                            })
                            .catch((error) => {
                                Toast.hide()
                                console.log(error.message);
                                Toast.show(error.message)
                            })

                    } else {
                        Toast.hide()
                        Toast.show(response.message)
                    }
                })
                .catch((error) => {
                    Toast.hide()
                    console.log(error.message);
                    Toast.show(error.message)
                })
        }
    }

    return (
        <KeyboardAvoidingView style={styles.MainContainer} behavior="padding" enabled={Platform.OS == "ios"}>
            {/* ------------------CenterView ----------------- */}
            <ImageBackground style={{ left: 0, top: 0, width: Dimensions.get("window").width, height: Dimensions.get("window").height, position: "absolute" }} resizeMode={"cover"} source={require("../../../assets/images/login_bg.png")} />
            <View style={styles.CenterView} >

                <TouchableOpacity activeOpacity={0.8} style={{ position: "absolute", margin: moderateScale(18) }} onPress={() => navigation.pop()}>
                    <Image style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color }} source={require("../../../assets/images/left.png")} />
                </TouchableOpacity>

                <View height={verticalScale(10)} />

                <Image style={{ height: verticalScale(140), width: scale(140), margin: moderateScale(10), resizeMode: 'contain', alignSelf: 'center' }} source={require('../../../assets/images/FRY.jpg')} />

                <View height={verticalScale(10)} />

                <View style={styles.cardView}>

                    <View height={verticalScale(20)} />

                    <CustomText style={styles.HeaderText}>ENTER CODE</CustomText>
                    <View height={verticalScale(5)} />

                    <CustomText style={styles.TextContainer}>You will get an OTP via E-Mail.</CustomText>

                    <View height={verticalScale(20)} />

                    <OTPInputView
                        style={{ height: verticalScale(80), width: "90%", justifyContent: "center", alignSelf: "center" }}
                        pinCount={4}
                        code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        onCodeChanged={code => { setCode(code) }}
                        autoFocusOnLoad={true}
                        placeholderTextColor={"black"}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={(code => {
                            console.log(`Code is ${code}`)
                        })}

                    />
                    <View height={verticalScale(30)} />
                    <CustomButton buttonStyle={{ width: scale(200), alignSelf: "center" }} title="Submit" onPress={() => {
                        onPressSubmit()
                    }} />

                    <View marginTop={0} height={verticalScale(20)} />

                </View>

                <View height={verticalScale(30)} />

                <View style={styles.ViewContainer1}>
                    <CustomText style={[styles.TextBlack1, { margin: 0, fontSize: moderateScale(14) }]}>Didn't receive the OTP?</CustomText>
                    <CustomButton
                        title="Resend"
                        buttonStyle={{ paddingStart: moderateScale(10), paddingEnd: moderateScale(10), paddingTop: moderateScale(5), paddingBottom: moderateScale(5) }}
                        textStyle={{ fontSize: moderateScale(12) }}
                        onPress={() => {
                            onPressResendOTP()
                        }} />
                </View>
            </View>
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
        padding: moderateScale(20),
        marginTop: moderateScale(20)
    },
    cardView: {
        margin: moderateScale(6),
        borderRadius: moderateScale(16),
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
    HeaderText: {
        color: colors.accent_color,
        fontSize: moderateScale(26),
        textAlign: 'center',
    },
    ViewContainer1: {
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: "row",
        marginTop: moderateScale(8),
        marginBottom: moderateScale(8)
    },
    TextBlack1: {
        margin: moderateScale(8),
        color: 'black',
        fontSize: moderateScale(14),
        textAlign: 'center'
    },
    SubContainer: {
        width: Dimensions.get('window').width,
        marginTop: 0,
        marginLeft: 0,
        marginLeft: 0,
        backgroundColor: 'transparent',
    },
    TextContainer: {
        fontSize: 15,
        color: 'grey',
        textAlign: 'center'
    },
    TextContainer1: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center'
    },
    underlineStyleBase: {
        width: scale(50),
        height: verticalScale(50),
        borderRadius: 8,
        backgroundColor: "white",
        margin: moderateScale(0),
        fontSize: moderateScale(18),
        fontWeight: "bold",
        color: colors.accent_color,
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
    underlineStyleHighLighted: {
        borderColor: colors.accent_color,
        borderWidth: 2
    },

});
