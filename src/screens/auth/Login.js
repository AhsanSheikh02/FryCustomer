import React, { useEffect, useRef, useState } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Alert,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    ImageBackground,
    Modal,
    FlatList
} from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { useAuth } from '../../redux/providers/auth';
import { CustomTextInput } from '../../components/TextInput';
import { CustomButton } from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-tiny-toast';
import { ADD_SCHOOL, colors, config, fonts, social_type } from '../../utils/constants';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CommonActions } from '@react-navigation/native';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { CustomText } from '../../components/Text';

import PushNotification from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import fetch from '../../services/fetch';
import Global from '../../utils/global';

var socialInitialCheck = true

export default function Login(props) {
    // console.log("props", props)
    const { navigation } = props;
    const { navigate } = navigation;

    if (socialInitialCheck) {
        configurationGoogleSignin()
        signOutFromGoogle()
        signOutFromFacebook()
        socialInitialCheck = false
    }

    //1 - DECLARE VARIABLES
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [deviceToken, setDeviceToken] = useState("");
    const [deviceType, setDeviceType] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [schoolList, setSchoolList] = useState([{ label: "", id: 0, selected: false }]);
    const [school, setSchool] = useState("");
    // const [showSchoolDialog, setShowSchoolDialog] = useState(false);
    const { handleLogin, handleSocialLogin, handleSendOTP } = useAuth();
    var passwordRef = useRef(null)

    useEffect(() => {
        Enablenotification()
        // AsyncStorage.getItem('device_token')
        //     .then(req => JSON.parse(req))
        //     .then((data) => {
        //         setDeviceToken(data.token)
        //         setDeviceType(data.os)
        //     })

        // AsyncStorage.getItem('schools')
        //     .then(req => JSON.parse(req))
        //     .then((data) => {
        //         console.log("schools: ", data)
        //         let array = []
        //         array.push({ label: "Individual First Responder", value: 0, selected: true })
        //         if (data) {
        //             array = []
        //             data.forEach(element => {
        //                 array.push({ label: element.school_name, value: element.id, selected: false })
        //             });
        //         }
        //         console.log("parsed schools: ", array)
        //         setSchoolList(array)
        //     })
    }, [])

    function Enablenotification() {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                // console.log("TOKEN:", token);
                setDeviceToken(token.token)
                setDeviceType(token.os)
                AsyncStorage.setItem("device_token", JSON.stringify(token))
            },

            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
                console.log("onNotifaction:", notification);
                // process the notification

                // (required) Called when a remote is received or opened, or local notification is opened
                // notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.log("ACTION:", notification.action);
                console.log("onAction:", notification);

                // process the action
            },

            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.error("onRegistrationError", err.message, err);
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        });

    }

    function configurationGoogleSignin() {
        GoogleSignin.configure({
            //  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: '', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            // hostedDomain: '', // specifies a hosted domain restriction
            // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
            // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            // accountName: '', // [Android] specifies an account name on the device that should be used
            // iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        });
    }

    async function signOutFromGoogle() {
        try {
            if (GoogleSignin.isSignedIn()) {
                // await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                //   this.setState({ user: null }); // Remember to remove the user from your app's state as well   
            }
        } catch (error) {
            console.error(error);
        }
    };

    function signOutFromFacebook() {
        LoginManager.logOut()
        return
        var current_access_token = '';
        AccessToken.getCurrentAccessToken().then((data) => {
            console.log(data)
            current_access_token = data.accessToken.toString();
        }).then(() => {
            let logout =
                new GraphRequest(
                    "me/permissions/",
                    {
                        accessToken: current_access_token,
                        httpMethod: 'DELETE'
                    },
                    (error, result) => {
                        if (error) {
                            console.log('Error fetching data: ' + error.toString());
                        } else {
                            LoginManager.logOut();
                        }
                    });
            new GraphRequestManager().addRequest(logout).start();
        })
            .catch(error => {
                console.log(error)
            });
    }

    function callApiforLogin() {
        Toast.showLoading("Please wait..")
        // debugger

        handleLogin(email, password, deviceToken, deviceType)
            .then((response) => {
                Toast.hide()
                console.log("handleLogin-res: ", response)
                if (response.status == 1) {
                    Toast.showSuccess(response.message)
                    // navigation.navigate('SubscriptionPage')
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: 'TabHome' },
                            ],
                        })
                    );
                } else if (response.status == 2) {
                    Toast.show(response.message)
                    navigation.navigate('OTPVerification', { email, password })
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    function signIn() {
        // navigation.navigate('SubscriptionPage')
        // return

        if (email == '') {
            Toast.show("Please Enter Email Address")
        } else if (config.EMAIL_REG.test(email) === false) {
            Toast.show('Please Enter Valid Email Address')
        } else if (password == '') {
            Toast.show("Please Enter Password")
        } else {
            callApiforLogin()
        }
    }

    function fbSignIn() {

        LoginManager.logInWithPermissions(["email", "public_profile"]).then(
            function (result) {
                console.log("result", result)
                if (result.isCancelled) {
                    // Toast.show("Login cancelled")
                } else {
                    AccessToken.getCurrentAccessToken()
                        .then((data) => {
                            console.log(data)
                            // Create a graph request asking for user information with a callback to handle the response.
                            const infoRequest = new GraphRequest(
                                '/me',
                                {
                                    httpMethod: 'GET',
                                    version: 'v10.0',
                                    parameters: {
                                        'fields': {
                                            'string': 'id,name,first_name,last_name,email,picture.type(large)'
                                        }
                                    }
                                },
                                (error, result) => {
                                    if (error) {
                                        console.log("error:", error)
                                        Toast.show("Something went wrong!")
                                    }
                                    else {
                                        console.log("result:", result)
                                        callApiforSocialLogin(social_type.FACEBOOK, result.id, result.email, result.first_name, result.last_name, result.picture.data.url);

                                    }
                                },
                            );
                            // Start the graph request.
                            new GraphRequestManager().addRequest(infoRequest).start();
                        })
                        .catch((error) => {
                            console.log("error: ", error)
                            Toast.show("Something went wrong!")
                        })

                }
            },
            function (error) {
                console.log("Login fail with error: " + error);
                Toast.show("Something went wrong!")
            }
        );
    }

    async function googleSignIn() {
        try {
            GoogleSignin.hasPlayServices()
                .then((success) => {
                    console.log("success", success)
                    GoogleSignin.signIn()
                        .then((result) => {
                            const { user } = result
                            console.log("userInfo: ", user)
                            // social_id, social_type, first_name, last_name, email, profile_url, otp
                            // navigate("SocialRegister", {
                            //     social_type: social_type.GOOGLE,
                            //     social_id: user.id,
                            //     email: user.email,
                            //     last_name: user.familyName,
                            //     first_name: user.givenName,
                            //     profile_url: user.photo
                            // })
                            callApiforSocialLogin(social_type.GOOGLE, user.id, user.email, user.givenName, user.familyName, user.photo);
                        })
                        .catch((error) => {
                            handleGoogleLoginError(error)
                        })
                })
                .catch((error) => {
                    handleGoogleLoginError(error)
                })
        } catch (error) {
            handleGoogleLoginError(error)
        }
    };

    function handleGoogleLoginError(error) {
        console.log('google signin error', error)
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('cancelled');
            // Toast.show("Login cancelled")
        } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('in progress');
            // Toast.show(error.message ? error.message : "Something went wrong!")
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('play services not available or outdated');
            // Toast.show(error.message ? error.message : "Something went wrong!")
        } else {
            Toast.show("Something went wrong!")
        }
    }

    function callApiforSocialLogin(type, id, email, firstName, lastName, photo) {
        Toast.showLoading("Please wait..")
        handleSocialLogin(id, type, firstName, lastName, email, photo, false, deviceToken, deviceType)
            .then((result) => {
                Toast.hide()
                console.log("result: ", result)
                if (result.status == 1) {
                    Toast.showSuccess(result.message)
                    // if (schoolList.length > 1) {
                    //     Global.setToken(result.data.token)
                    //     setShowSchoolDialog(true)
                    // } else {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: 'SubscriptionPage' },
                                ],
                            })
                        );
                    // }
                } else if (result.status == 2) {
                    Toast.showSuccess(result.message)
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: 'TabHome' },
                            ],
                        })
                    );
                } else {
                    Toast.show(result.message)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log("error: ", error)
                Toast.show(error.message)
            })
    }

    async function onAppleButtonPress() {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        // use credentialState response to ensure the user is authenticated
        if (credentialState === appleAuth.State.AUTHORIZED) {
            console.log("Email", appleAuthRequestResponse.email)
            console.log("firstname", appleAuthRequestResponse.fullName.givenName)
            console.log("lastname", appleAuthRequestResponse.fullName.familyName)
            console.log("id", appleAuthRequestResponse.user)
            const user = appleAuthRequestResponse
            let firstname = appleAuthRequestResponse.fullName.givenName == null ? " " : appleAuthRequestResponse.fullName.givenName
            callApiforSocialLogin(social_type.APPLE, user.user, user.email, firstname, user.fullName.familyName, "");
        }
        else {
            alert("something went wrong")
        }
    }

    function schoolSelectionDone() {
        setShowSchoolDialog(false)
        let schoolId = school
        if (schoolId == 0) {
            schoolId = ""
        }
        console.log("schoolId", schoolId)
        // Toast.showLoading("Please wait...")
        fetch.post(ADD_SCHOOL, { school: schoolId })
            .then((result) => {
                console.log("result", result)
                Toast.show(result.msg)
            })
            .catch((error) => {
                console.log("error", error)
                Toast.show("something went wrong!")
            })
            .finally(() => {
                Toast.hide()
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'SubscriptionPage' },
                        ],
                    })
                );
            })

    }

    function setSchoolSelection(item, index) {
        let schools = schoolList.map((element, index1) => {
            element.selected = false
            if (index == index1) {
                element.selected = true
                setSchool(element.value)
            }
            return element
        })

        setSchoolList(schools)
    }

    return (
        < View style={styles.MainContainer} >
            {/* <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}> */}
            < ImageBackground style={{ left: 0, top: 0, width: Dimensions.get("window").width, height: Dimensions.get("window").height, position: "absolute" }} resizeMode={"cover"} source={require("../../../assets/images/login_bg.png")} />
            {/* <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={Platform.select({ ios: Dimensions.get('window').height == 812 || Dimensions.get('window').width == 812 ? 85 : 64, android: -500 })}> */}
            {/* ------------------CenterView ----------------- */}
            <View style={styles.CenterView} >
                <View height={verticalScale(10)} />
                <Image style={{ height: verticalScale(140), width: scale(140), resizeMode: 'contain', alignSelf: 'center' }} source={require('../../../assets/images/FRY.jpg')} />

                <View height={verticalScale(10)} />

                <View style={styles.cardView}>

                    <CustomText style={styles.HeaderText}>LOGIN</CustomText>

                    {/* ------------------ Email ----------------- */}
                    <CustomTextInput
                        placeholder='Email'
                        keyboardType={"email-address"}
                        textContentType={"emailAddress"}
                        icon={require('../../../assets/images/emailicon.png')}
                        onChangeText={(text) => setEmail(text)}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onSubmitEditing={() => passwordRef.focus()}
                        value={email}
                        maxLength={50}
                    />
                    <View marginTop={0} height={verticalScale(15)} />

                    {/* ------------------ Password ----------------- */}
                    <CustomTextInput
                        textInputRef={(ref) => passwordRef = ref}
                        placeholder='Password'
                        secureTextEntry={!showPassword}
                        textContentType={"password"}
                        icon={require('../../../assets/images/passwordicon.png')}
                        onChangeText={(text) => setPassword(text)}
                        setHidePass={(value) => {
                            console.log(value)
                            setShowPassword(!value)
                        }}
                        value={password}
                        maxLength={25}
                    />
                    <View marginTop={0} height={verticalScale(10)} />

                    {/* ------------------ Forgot Password ----------------- */}
                    <View style={{ alignSelf: "flex-end" }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('ForgotPassword')}>
                            <CustomText style={[styles.TextBlack1]}>Forgot password?</CustomText>
                        </TouchableOpacity>
                    </View>

                    <View marginTop={0} height={verticalScale(12)} />

                    <CustomButton title="Login" onPress={() => {
                        console.log("login attempted")
                        signIn()
                    }} />

                    <View marginTop={0} height={verticalScale(20)} />

                </View>

                <View marginTop={0} height={verticalScale(15)} />

                <View style={{ alignItems: 'center', flexDirection: "row", marginStart: moderateScale(25), marginEnd: moderateScale(25) }}>
                    <View style={styles.lineView} />
                    <CustomText style={styles.TextBlack1}>OR</CustomText>
                    <View style={styles.lineView} />
                </View>

                <View marginTop={0} height={verticalScale(5)} />

                <View style={styles.HorizontalContainer}>

                    {/* ------------------ FACEBOOK ----------------- */}
                    <TouchableOpacity activeOpacity={0.8} style={styles.ButtonContainer} onPress={() => fbSignIn()} >
                        <Image style={styles.imageContainer} source={require('../../../assets/images/facebook.png')} />
                    </TouchableOpacity>

                    {/* ------------------ Google ----------------- */}
                    <TouchableOpacity activeOpacity={0.8} style={styles.ButtonContainer} onPress={() => googleSignIn()} >
                        <Image style={styles.imageContainer} source={require('../../../assets/images/google.png')} />
                    </TouchableOpacity>


                    {Platform.OS == "ios" ? <TouchableOpacity activeOpacity={0.8} style={styles.ButtonContainer} onPress={() => onAppleButtonPress()} >
                        <Image style={styles.imageContainer} source={require('../../../assets/images/apple.png')} />
                    </TouchableOpacity> : <View />}

                </View>

                <View marginTop={0} height={verticalScale(20)} />
                {/* ------------------ Horizontal Container ----------------- */}

                <View style={styles.ViewContainer1}>
                    <CustomText style={[styles.TextBlack1, { margin: 0, fontSize: moderateScale(14) }]}>Don't have an account?</CustomText>
                    <CustomButton
                        title="Sign up"
                        buttonStyle={{ paddingStart: moderateScale(10), paddingEnd: moderateScale(10), paddingTop: moderateScale(5), paddingBottom: moderateScale(5) }}
                        textStyle={{ fontSize: moderateScale(12) }}
                        onPress={() => {
                            navigate("Register")
                        }} />
                </View>

            </View>
            {/* </KeyboardAvoidingView> */}
            {/* </ScrollView> */}

            {/* <Modal
                animationType="fade"
                style={{ flex: 1 }}
                transparent={true}
                visible={showSchoolDialog}
                onRequestClose={() => {
                    console.log("closed")
                    Toast.show("Please Select School")
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: moderateScale(30), backgroundColor: 'rgba(10, 10, 10, 0.5)' }}>
                    <View style={{ flexDirection: "column", width: "100%", backgroundColor: "white", padding: moderateScale(20) }}>
                        <CustomText style={{ fontSize: moderateScale(16), justifyContent: "center", alignSelf: "center" }}>Select your Organization</CustomText>
                        <View height={verticalScale(20)} />
                        <FlatList
                            data={schoolList}
                            renderItem={({ item, index }) => {
                                console.log("kk", item)
                                return (
                                    <View style={{ flex: 1, flexDirection: "row" }}>
                                        <CustomText style={{ flex: 1 }}>{item.label}</CustomText>
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => setSchoolSelection(item, index)}>
                                            <Image style={{ resizeMode: "contain", height: verticalScale(16), width: scale(16), tintColor: !item.selected ? "black" : colors.secondary_color }} source={!item.selected ? require('../../../assets/images/uncheck.png')
                                                : require('../../../assets/images/check.png')} />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            style={{ marginHorizontal: moderateScale(20) }}
                            ItemSeparatorComponent={() => {
                                return <View style={{ height: 1, backgroundColor: "grey", marginVertical: verticalScale(5) }} />
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View height={verticalScale(20)} />
                        <View style={{}}>
                            <CustomButton
                                buttonStyle={{ alignSelf: "center" }}
                                textStyle={{ fontSize: moderateScale(14) }}
                                title="Submit"
                                onPress={() => {
                                    if (school == "") {
                                        Toast.show("Please Select School")
                                    } else {
                                        schoolSelectionDone()
                                    }
                                }} />
                        </View>
                    </View>
                </View>
            </Modal> */}
        </View >
    );
};

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: colors.secondary_color,
        justifyContent: 'center',
        alignItems: 'center',
    },
    CenterView: {
        width: Dimensions.get('window').width,
        flex: 1,
        padding: moderateScale(20)
    },
    cardView: {
        margin: moderateScale(6),
        borderRadius: moderateScale(16),
        backgroundColor: colors.card_color,
        padding: moderateScale(6),
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
    ViewContainer1: {
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: "row",
        marginTop: moderateScale(8),
        marginBottom: moderateScale(8)
    },
    TextBlack1: {
        margin: moderateScale(8),
        color: colors.accent_color,
        fontSize: moderateScale(14),
        textAlign: 'center'
    },
    lineView: {
        height: 1,
        backgroundColor: colors.accent_color,
        flex: 1
    },
    HorizontalContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
    },
    ButtonContainer: {
        backgroundColor: 'white',
        margin: moderateScale(10),
        padding: moderateScale(15),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center",
        borderRadius: moderateScale(35),
        flexDirection: 'row',
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
        margin: moderateScale(16)
    },
    imageContainer: {
        height: verticalScale(26),
        width: scale(26),
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    appleBtn: { height: verticalScale(60), width: scale(60), margin: moderateScale(10) }
});