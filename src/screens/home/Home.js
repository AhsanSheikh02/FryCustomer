import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, TextInput, Text, Linking, View, Image, Button, TouchableOpacity, StyleSheet, Dimensions, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import HomeCell from './HomeCell'
import { CustomText } from '../../components/Text';
import VideoList from './VideoList'
import ViewPager from '@react-native-community/viewpager';
import { config, fonts, colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CustomTextInput } from '../../components/TextInput';
import Toast from 'react-native-tiny-toast';
import Stripe from 'react-native-stripe-api';
import Icon from 'react-native-vector-icons/AntDesign';
import { useRef } from 'react';
import { CustomButton } from '../../components/Button';
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

var disableOnBlur = false

export default function Home(props) {
    const { navigation, route } = props;
    // const { navigate } = navigation;
    PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
            // console.log("TOKEN:", token);
            // AsyncStorage.setItem("token",token.token)
        },

        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
            debugger
            console.log("onNotifaction:", notification);
            if (Platform.OS == "ios") {
                if(notification.data.extraPayLoad){
                    if (notification.data.extraPayLoad.notification_type == "order") {
                        navigation.navigate("OrderDetails", { orderData: notification.data.extraPayLoad.order_no })
                    } else {
                        let item = {
                            id: notification.data.extraPayLoad.event_id,
                            joined: 1
                        }
                        navigation.push("EventDetails", { item })
    
                    }

                }
                else{
                    if (notification.data.notification_type == "order") {
                        navigation.navigate("OrderDetails", { orderData: notification.data.order_no })
                    } else {
                        let item = {
                            id: notification.data.event_id,
                            joined: 1
                        }
                        navigation.push("EventDetails", { item })
    
                    }
                }
                
            }
            else {
                if (notification.data.notification_type == "order") {
                    navigation.navigate("OrderDetails", { orderData: notification.data.order_no })
                } else {
                    let item = {
                        id: notification.data.event_id,
                        joined: 1
                    }
                    navigation.navigate("EventDetails", { item })

                }
            }


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

    const { state, handleUserProfile, handleCategoryList, handleVideoSearch, handleBannerList } = useAuth();
    const user = state.user;

    //1 - DECLARE VARIABLES
    const [searchText, SetsearchText] = useState("");
    const [typing, setTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(0);
    const [searchBarVisible, setSearchBarVisible] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [bannerList, setBannerList] = useState([]);
    const [videoList, setVideoList] = useState([])
    const [isBannerLoaded, setBannerLoaded] = useState(false)
    const [isCategoriesLoaded, setCategoriesLoaded] = useState(false)

    var searchRef = useRef(null)

    useEffect(() => {
        callApiforCategory()
        callApiforBanners()
        // generateToken()
        // callApiforProfile()
    }, []);

    async function generateToken() {
        const client = new Stripe(config.stripe_api_key)
        // Create a Stripe token with new card infos
        const token = await client.createToken({
            number: "4242424242424242",
            exp_month: "05",
            exp_year: "22",
            cvc: "123",
        });
        console.log("token: ", token)
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

    function callApiforCategory() {
        // Toast.showLoading("Please wait..")
        setCategoriesLoaded(false)
        handleCategoryList()
            .then((response) => {
                Toast.hide()
                setCategoriesLoaded(true)
                console.log("Category-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    let catList = response.data ? response.data : []
                    // catList.push({
                    //     category_name: "Search By Challenges", id: 0
                    // })
                    setCategoryList(catList)
                }
            })
            .catch((error) => {
                Toast.hide()
                setCategoriesLoaded(true)
                console.log(error.message);
                // Toast.show(error.message)
            })
    }

    function callApiforBanners() {
        // Toast.showLoading("Please wait..")
        setBannerLoaded(false)
        handleBannerList()
            .then((response) => {
                setBannerLoaded(true)
                Toast.hide()
                console.log("Banners-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setBannerList(response.data)
                }
            })
            .catch((error) => {
                setBannerLoaded(true)
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
    }

    function callApiforProfile() {
        // Toast.showLoading("Please wait..")
        handleUserProfile()
            .then((response) => {
                Toast.hide()
                console.log("res: ", JSON.stringify(response))
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
    }

    function searchVideoList(text) {
        SetsearchText(text)

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTyping(false),
            setTypingTimeout(setTimeout(function () {
                if (text != "") {
                    callApiforVideoSearch(text)
                }
                else {
                    setVideoList([])
                }
            }, 2000))

        // if (text != "") {
        //     for (let i = 0; i < videoList.length; i++) {
        //         if (videoList[i].videoTitle.replace(/[^a-zA-Z0-9]/g, "").substr(0, text.length).toLowerCase() == text.toLowerCase()) {
        //             videos.push(videoList[i]);
        //             console.log("video", videos)
        //         }
        //     }
        // }
        // else {
        //     //setVideos([])
        // }
    }

    function callApiforVideoSearch(text) {
        Toast.hide()
        Toast.showLoading("Please wait..")
        handleVideoSearch(text)
            .then((response) => {
                Toast.hide()
                console.log("VideoSearch-res: ", response)
                if (response.status == 1) {
                    response.data
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((item, i) => console.log("data", item));

                    setVideoList(response.data)
                } else {
                    setVideoList([])
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    function render({ item, index }) {
        let catImage = require('../../../assets/images/categorylist.png')
        switch (item.id) {
            case 1:
                catImage = require('../../../assets/images/cat1.png')
                break;
            case 2:
                catImage = require('../../../assets/images/categorylist.png')
                break;
            case 3:
                catImage = require('../../../assets/images/categorylist.png')
                break;
            case 6:
                catImage = require('../../../assets/images/search.png')
                break;

            default:
                break;
        }
        return <TouchableOpacity activeOpacity={0.8} onPress={() => {
            if (item.id == 0) {
                searchRef.focus()
            } else {
                navigation.navigate('CategoryList', { item })
            }
        }}>
            <View style={styles.viewContainer}>
                <Image style={styles.ImageContainer1} resizeMode={"contain"} source={catImage} />
                <View height={verticalScale(10)} />
                <View style={styles.viewContainer1}>
                    <CustomText bold ellipsizeMode={'tail'} numberOfLines={2} style={styles.TextContainer1}>{item.category_name}</CustomText>
                </View>
            </View>
        </TouchableOpacity>
    }

    function onBlur() {
        if (!disableOnBlur) {
            // setSearchBarVisible(false)
            SetsearchText("")
        } else {
            disableOnBlur = false
        }
    }

    function onFocus() {
        setSearchBarVisible(true)
        setVideoList([])
    }

    return (
        <View style={styles.MainContainer}>
            <View style={styles.CenterView}>
                {!searchBarVisible ? <View style={{ paddingBottom: moderateScale(20), height: verticalScale(160), justifyContent: 'center', alignItems: "center", backgroundColor: colors.secondary_color, }}>
                    {/* ------------Banner------------- */}
                    {/* {isBannerLoaded ?
                        <ViewPager
                            showPageIndicator={false}
                            style={{
                                height: verticalScale(180),
                                width: Dimensions.get('window').width - scale(50)
                            }}
                        >
                            {bannerList.map((element, index) => {
                                return (
                                    // <TouchableOpacity activeOpacity={0.8} key={index} style={{
                                    //     justifyContent: 'center', alignItems: "center",
                                    //     ...Platform.select({
                                    //         ios: {
                                    //             shadowColor: '#000',
                                    //             shadowOffset: { width: 0, height: 2 },
                                    //             shadowOpacity: 0.8,
                                    //             shadowRadius: 2,
                                    //         },
                                    //         android: {
                                    //             elevation: 5,
                                    //         },
                                    //     })
                                    // }} onPress={() => goToURL(element.banner_url)}
                                    // >
                                    <View key={index} style={{
                                        justifyContent: 'center', alignItems: "center",
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
                                        })

                                    }}>
                                        <Image style={styles.ImageContainer}
                                            defaultSource={require("../../../assets/images/placeholder.png")}
                                            source={{ uri: element.banner_image }} />
                                    </View>

                                    // </TouchableOpacity>
                                )
                            })}
                        </ViewPager>
                        :
                        <ActivityIndicator size={"large"} color={colors.main_color} />
                    } */}

                    <Image style={{ height: verticalScale(140), width: verticalScale(140), resizeMode: 'cover', alignSelf: 'center' }} source={require('../../../assets/images/FRY.jpg')} />

                </View> : <View />}

                <View height={15} />

                {/* ------------SearchBar------------- */}
                <CustomTextInput
                    textInputRef={(ref) => searchRef = ref}
                    placeholder='Search here'
                    onChangeText={(text) => searchVideoList(text)}
                    // textContentType={"Search"}
                    // blurOnSubmit={false}
                    containerStyle={{ borderRadius: moderateScale(30) }}
                    textInputStyle={{ fontSize: moderateScale(16) }}
                    value={searchText}
                    maxLength={25}
                    onSubmitEditing={(event) => disableOnBlur = true}
                    onFocus={() => onFocus()}
                    onBlur={() => onBlur()}
                >
                    <Icon
                        name={!searchBarVisible ? 'search1' : 'close'}
                        size={22}
                        color="grey"
                        style={{ position: "absolute", end: moderateScale(10), justifyContent: "center" }}
                        onPress={() => {
                            if (!searchBarVisible) {
                                searchRef.focus()
                            } else {
                                Keyboard.dismiss()
                                if (!disableOnBlur) {
                                    setSearchBarVisible(false)
                                    SetsearchText("")
                                } else {
                                    disableOnBlur = false
                                }
                            }
                        }}
                    />
                </CustomTextInput>

                <View height={10} />

                {/* ------------Category List------------- */}
                {!searchBarVisible ? <FlatList
                    data={categoryList}
                    renderItem={render}
                    style={{ flex: 1 }}
                    numColumns={2}
                    ListEmptyComponent={() => {
                        return !isCategoriesLoaded && (
                            <View style={{ flex: 1, marginTop: moderateScale(80) }} >
                                <ActivityIndicator size={"large"} color={colors.secondary_color} />
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                /> : <View />}

                {searchBarVisible && videoList.length > 0
                    ? <VideoList
                        videoLists={videoList} route={route} navigation={navigation} />
                    : searchBarVisible ? <View style={styles.NoReordContainer}>
                        <CustomText style={styles.textContainer}>No Video Found</CustomText>
                        <View height={verticalScale(10)} />
                        <CustomButton buttonStyle={{ elevation: 0, backgroundColor: colors.main_color, padding: moderateScale(8), width: Dimensions.get("window").width / scale(1.5), alignSelf: 'center' }}
                            textStyle={{ color: colors.secondary_color }}
                            title="BACK" onPress={() => {
                                Keyboard.dismiss()
                                setSearchBarVisible(false)
                            }} />
                    </View> : <View />}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: colors.bg_color,
    },
    CenterView: {
        flex: 1,
    },
    LineStyle: {
        height: verticalScale(1),
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
        backgroundColor: colors.accent_color,
    },
    textContainer: {
        fontSize: moderateScale(20)
    },
    ImageContainer: {
        height: verticalScale(150),
        width: Dimensions.get('window').width - scale(60),
        borderRadius: moderateScale(8),
        resizeMode: 'cover',
    },
    ViewBgContainer1: {
        marginLeft: moderateScale(10),
        marginRight: moderateScale(10),
        flexDirection: 'row',
        width: Dimensions.get('window').width - scale(20),
        justifyContent: "space-between",
        alignItems: "center",
        height: verticalScale(40),
        padding: moderateScale(5),
        borderRadius: moderateScale(20),
        borderWidth: moderateScale(1),
        borderColor: colors.accent_color
    },
    ViewBgContainer2: {
        height: verticalScale(30),
        flexDirection: 'row',
        alignItems: "center",
        borderRadius: moderateScale(5),
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
        backgroundColor: "white",
        flex: 1
    },
    TextContainer2: {
        height: verticalScale(40),
        fontSize: moderateScale(16),
        width: scale(260),
        backgroundColor: 'transparent',
        color: colors.accent_color,
        fontFamily: fonts.opensans_light,
    },
    ImageContainer1: {
        height: verticalScale(50),
        width: scale(50),
        margin: moderateScale(5),
        alignSelf: 'center',
        tintColor: colors.secondary_color,
    },
    TextContainer1: {
        fontSize: moderateScale(20),
        color: colors.main_color,
        textAlign: 'center',
        marginLeft: moderateScale(10),
        marginRight: moderateScale(10),
    },
    viewContainer: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width / 2 - scale(20),
        justifyContent: 'flex-end',
        // borderColor: colors.accent_color,
        // borderWidth: moderateScale(1),
        margin: moderateScale(10),
        borderRadius: moderateScale(8),
        height: Dimensions.get('window').width / 2.5,
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
        backgroundColor: colors.secondary_color,
        width: Dimensions.get('window').width / 2 - scale(20),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        borderColor: colors.accent_color,
        height: verticalScale(60),
        borderBottomLeftRadius: moderateScale(8),
        borderBottomRightRadius: moderateScale(8),
    },
    NoReordContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 60,
        bottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
});