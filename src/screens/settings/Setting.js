import React, { useState, useContext, useEffect } from 'react';
import {
    Text, View, Button, ActivityIndicator, Alert, StyleSheet, TouchableOpacity,
    Dimensions, ScrollView, KeyboardAvoidingView, Image, Linking, Platform
} from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, config } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import Toast from 'react-native-tiny-toast';
import moment from "moment";
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
export default function Setting(props) {
    const { navigation } = props;

    const [userData, setUserData] = useState("");
    const [userRole, setUserRole] = useState("");
    const [plan_name, setPlanName] = useState("");
    const [expiry_date, setExpiryDate] = useState("");
    const [subscriptionValue, setSubscriptionValue] = useState(false);
    const [notification_status, setNotificationStatus] = useState();
    const { state, handleLogout, handleUserProfile, handleDeleteUser, handleAutorenewalSubscription, handleNotificationOnOff } = useAuth();
    const isFocused = useIsFocused()
    const user = state.user;
    const roles = [
        { label: 'Dispatcher', value: 3 },
        { label: 'EMS/EMT', value: 2 },
        { label: 'Firefighter', value: 5 },
        { label: 'Police', value: 4 },
        { label: 'User', value: 6 },
    ]

    useEffect(() => {
        callApiforGetProfile()
    }, [isFocused])

    function onChangeValue() {
        Alert.alert("Under Development")
        // if (notificationValue == false) {
        //     setNotificationValue(true)
        // } else {
        //     setNotificationValue(false)
        // }
    }

    function callApiforAutorenewal() {
        setSubscriptionValue(true)
        Toast.showLoading("Please wait..")
        handleAutorenewalSubscription()
            .then((response) => {
                Toast.hide()
                console.log("res: ", response)
                if (response.status == 1) {
                    Toast.showSuccess(response.message)
                    callApiforGetProfile()
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }

    function callApiforNotificationOnOff(value) {
        Toast.showLoading("Please wait..")
        handleNotificationOnOff(value)
            .then((response) => {
                Toast.hide()
                // console.log("NotificationOnOff-res: ", response)
                if (response.status == 1) {
                    Toast.showSuccess(response.message)
                    callApiforGetProfile()
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }

    function onPressNotification() {
        setSubscriptionValue(true)
        if (notification_status == 1) {
            setNotificationStatus(0)
            callApiforNotificationOnOff(0)
        } else {
            setNotificationStatus(1)
            callApiforNotificationOnOff(1)
        }

    }

    function goToURL(url) {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('Don\'t know how to open URI: ' + url);
            }
        });
    }

    function callApiforGetProfile() {
        var date;
        if (!subscriptionValue) {
            Toast.showLoading("Please wait..")
        }
        handleUserProfile()
            .then((response) => {
                Toast.hide()
                // console.log("handleUserProfile-res: ", response)
                if (response.status == 1) {
                    setUserData(response.data)
                    if (response.data.subscriptions) {
                        const planName = response.data.subscriptions.title
                        const ExpiryDate = response.data.subscriptions.expiry_date ? response.data.subscriptions.expiry_date.split(' ') :
                            response.data.subscriptions.period_end.split(' ');
                        let momentObj = moment(ExpiryDate[0], 'DD-MM-YYYY')
                        let showDate = moment(momentObj).format('MMM-DD-YYYY')
                        console.log("date", showDate)
                        setPlanName(planName)
                        setExpiryDate("Expiry Date: " + showDate)
                    } else {
                        setPlanName("")
                        setExpiryDate("")
                    }
                    setNotificationStatus(response.data.notification_status)

                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].value == response.data.role_id) {
                            setUserRole(roles[i].label)
                        }
                    }
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }

    function logout() {
        Alert.alert(
            "Log Out",
            'Are you sure you want to log out?',
            [
                {
                    text: 'NO',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'YES',
                    onPress: () => {
                        btn_LogoutClick()
                    },
                },
            ],
            { cancelable: false },
        )
    }

    async function btn_LogoutClick() {
        await handleLogout()
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Login' },
                ],
            })
        );
    }

    function closeAccount() {
        Alert.alert(
            "Close Account",
            'Are you sure you want to delete your account?',
            [
                {
                    text: 'NO',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'YES',
                    onPress: () => {
                        btn_DeleteClick()
                    }
                },
            ],
            { cancelable: false },
        )
    }

    async function btn_DeleteClick() {
        await handleDeleteUser().then((response) => {
            if (response?.status == 1) {
                Toast.show("Account deleted successfully")
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Login' },
                        ],
                    })
                );
            }

        }).catch(error => {
            console.log("btn_DeleteClick-error", error);
        })

    }

    return (
        <View style={styles.MainContainer}>
            {/* ------------------CenterView ----------------- */}
            <View style={styles.CenterView} >
                <View style={styles.viewContainer1}>
                    <View >
                        <CustomText style={styles.TextContainer}>{userData ? "Hello, " + (userData.first_name != null ? userData.first_name : "") + " " + (userData.last_name != null ? userData.last_name : "") : ""}</CustomText>
                        <CustomText style={styles.TextContainer1}>{userData.email ? userData.email : "N/A"}</CustomText>
                        <CustomText style={styles.TextContainer1}>{userRole}</CustomText>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => logout()}>
                        <Image style={styles.ImageContainer2} source={require('../../../assets/images/logout.png')} />
                    </TouchableOpacity>

                </View>
                <View style={{ marginTop: moderateScale(10), }}>
                    {/* ------------------ My Order ----------------- */}
                    {/* <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("MyOrder")} >
                        <View style={styles.viewContainer2}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={styles.ImageContainer} source={require('../../../assets/images/myorder.png')} />
                                <CustomText style={styles.TextContainer2}>My Orders</CustomText>
                            </View>
                            <Image style={styles.ImageContainer1} source={require('../../../assets/images/next.png')}></Image>
                        </View>
                    </TouchableOpacity> */}

                    {/* ------------------ Subscription Status ----------------- */}
                    {plan_name != "" ? <View style={styles.viewContainer2}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.ImageContainer} source={require('../../../assets/images/subscription.png')} />
                            <View>
                                <CustomText style={styles.TextContainer2}>{plan_name}</CustomText>
                                {!expiry_date == "" ? <CustomText style={{ color: 'grey', top: 0, fontSize: moderateScale(12), marginLeft: moderateScale(15) }}>{expiry_date}</CustomText> : console.log("")}
                            </View>
                        </View>
                        {/* <TouchableOpacity activeOpacity={0.8} onPress={() => callApiforAutorenewal()}>
                            {userData.auto_renew == 1
                                ? <Image style={{ height: moderateScale(35), width: moderateScale(35), resizeMode: 'contain', tintColor: colors.secondary_color }} source={require('../../../assets/images/On1.png')}></Image>
                                : <Image style={{ height: moderateScale(35), width: moderateScale(35), resizeMode: 'contain', tintColor: 'black' }} source={require('../../../assets/images/off.png')}></Image>
                            }
                        </TouchableOpacity> */}
                    </View> : <View />}

                    {/* ------------------ Notification----------------- */}
                    <View style={styles.viewContainer2}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.ImageContainer} source={require('../../../assets/images/notifications.png')} />
                            <CustomText style={styles.TextContainer2}>Notification</CustomText>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => onPressNotification()}  >
                            {notification_status == 1
                                ? <Image style={{ height: moderateScale(35), width: moderateScale(35), resizeMode: 'contain', tintColor: colors.secondary_color }} source={require('../../../assets/images/On1.png')}></Image>
                                : <Image style={{ height: moderateScale(35), width: moderateScale(35), resizeMode: 'contain', tintColor: "black" }} source={require('../../../assets/images/off.png')}></Image>
                            }
                        </TouchableOpacity>
                    </View>

                    {/* ------------------ About Us ----------------- */}
                    <TouchableOpacity style={styles.viewContainer2} activeOpacity={0.8} onPress={() => navigation.navigate("WebContent", { url: config.aboutus_url, name: "About Us" })} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.ImageContainer} source={require('../../../assets/images/aboutus.png')} />
                            <CustomText style={styles.TextContainer2}>About Us</CustomText>
                        </View>
                        <Image style={styles.ImageContainer1} source={require('../../../assets/images/next.png')}></Image>
                    </TouchableOpacity>

                    {/* ------------------ Contact Us ----------------- */}
                    <TouchableOpacity style={styles.viewContainer2} activeOpacity={0.8} onPress={() => navigation.navigate("WebContent", { url: config.contactus_url, name: "Contact Us" })} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.ImageContainer} source={require('../../../assets/images/contactus.png')} />
                            <CustomText style={styles.TextContainer2}>Contact Us</CustomText>
                        </View>
                        <Image style={styles.ImageContainer1} source={require('../../../assets/images/next.png')}></Image>
                    </TouchableOpacity>

                    {/* ------------------ Edit Profile ----------------- */}
                    <TouchableOpacity style={[styles.viewContainer2,]} activeOpacity={0.8} onPress={() => navigation.navigate('EditProfile')} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.ImageContainer} source={require('../../../assets/images/edit.png')} />
                            <CustomText style={styles.TextContainer2}>Edit Profile</CustomText>
                        </View>
                        <Image style={styles.ImageContainer1} source={require('../../../assets/images/next.png')}></Image>
                    </TouchableOpacity>

                    {/* ------------------ Change Password ----------------- */}
                    <TouchableOpacity style={[styles.viewContainer2,]} activeOpacity={0.8} onPress={() => navigation.navigate('ChangePassword')} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.ImageContainer} source={require('../../../assets/images/changePassword.png')} />
                            <CustomText style={styles.TextContainer2}>Change Password</CustomText>
                        </View>
                        <Image style={styles.ImageContainer1} source={require('../../../assets/images/next.png')}></Image>
                    </TouchableOpacity>

                    {/* ------------------ Delete Account ----------------- */}
                    <TouchableOpacity style={[styles.viewContainer2,]} activeOpacity={0.8} onPress={() => closeAccount()} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={styles.deleteImageContainer} source={require('../../../assets/images/bin.png')} />
                            <CustomText style={styles.TextContainer2}>Close Account</CustomText>
                        </View>
                        <Image style={styles.ImageContainer1} source={require('../../../assets/images/next.png')}></Image>
                    </TouchableOpacity>

                </View>
            </View>
        </View >

    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    CenterView: {
        flex: 1,
    },
    viewContainer1: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: colors.secondary_color,
        borderBottomRightRadius: moderateScale(25),
        borderBottomLeftRadius: moderateScale(25),
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(20),
        paddingLeft: moderateScale(20),
        paddingRight: moderateScale(20),

    },
    viewContainer2: {
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: moderateScale(15),
        // marginLeft: moderateScale(20),
        // marginRight: moderateScale(20),
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
        backgroundColor: '#f7f7f7',

    },
    TextContainer: {
        textAlign: 'left',
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.main_color
    }, TextContainer1: {
        textAlign: 'left',
        fontSize: moderateScale(14),
        color: 'white',
        marginTop: moderateScale(3)
    },
    TextContainer2: {
        textAlign: 'left',
        fontSize: moderateScale(15),
        color: colors.secondary_color,
        marginTop: moderateScale(3),
        marginLeft: moderateScale(15),
        marginBottom: moderateScale(3)
    },
    ImageContainer: {
        height: moderateScale(30),
        width: moderateScale(30),
        resizeMode: 'contain',
        tintColor: colors.secondary_color
    },
    ImageContainer1: {
        height: moderateScale(24),
        width: moderateScale(24),
        resizeMode: 'contain',
        tintColor: colors.secondary_color
    },
    ImageContainer2: {
        height: moderateScale(40),
        width: moderateScale(40),
        resizeMode: 'contain',
        tintColor: colors.main_color
    },
    deleteImageContainer: {
        height: moderateScale(26),
        width: moderateScale(26),
        resizeMode: 'contain',
        tintColor: 'red'
    },

});

