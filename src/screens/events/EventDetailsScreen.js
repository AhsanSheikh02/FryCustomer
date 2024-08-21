import React, { useState, useContext, useEffect } from 'react';
import { LogBox, TouchableOpacity, StyleSheet, Text, View, Button, ActivityIndicator, Alert, KeyboardAvoidingView, Dimensions, ScrollView, Image, Platform } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { CustomButton } from '../../components/Button';
import ViewPager from '@react-native-community/viewpager';
import ImageDialog from '../../components/ImageDialog';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import Toast from 'react-native-tiny-toast';
import moment from "moment";
import Orientation from 'react-native-orientation-locker';
import Player from '../../components/Player'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default function EventDetailsScreen(props) {

    const { navigation, route } = props;
    //1 - DECLARE VARIABLES
    const event_id = route.params.item.id;
    const [eventData, setEventData] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [playInFull, setPlayInFull] = useState(false);
    const [showImageDialog, SetImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState(require("../../../assets/images/placeholder.png"));
    const [joined, setJoined] = useState(route.params.item.joined ? route.params.item.joined : route.params.selectedTab);
    const [loading, setLoading] = useState(true);
    const [is_data_found, setDatafound] = useState(false);
    const { state, handleLogout, handleEventDetails, handleJoindEvent } = useAuth();
    const user = state.user;

    useEffect(() => {
        callApiforEventDetails(event_id)
    }, [event_id]);

    useEffect(() => {
        LogBox.ignoreLogs([
            'Slider has been extracted',
            'Animated: `useNativeDriver` was not specified'
        ]);
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            // The screen is focused
            // Call any action
            console.log("blured")
            Orientation.lockToPortrait()
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation])


    function callApiforEventDetails(event_id) {
        Toast.showLoading("Please wait..")
        handleEventDetails(event_id)
            .then((response) => {
                // console.log("EventDetails-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    Toast.hide()
                    setDatafound(true)
                    setEventData(response.data)
                    let event_date = moment(response.data.start_date).format("MMM-DD-YYYY")
                    let event_time = moment(response.data.start_date).format("hh:mm A")
                    setEventDate(event_date)
                    setEventTime(event_time)
                    setImageUrl({ uri: response.data.event_image })
                } else {
                    Toast.hide()
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    function callApiforJoinEvent() {

        Toast.showLoading("Please wait..")
        handleJoindEvent(event_id)
            .then((response) => {
                Toast.hide()
                // console.log("JoinEvent-res: ", response)
                if (response.status == 1) {
                    Toast.showSuccess(response.message)
                    setJoined(true)
                    route.params.shouldRefresh()
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    function enlargeImage() {
        // const images = [{
        //     url: image,
        //     props: {
        //         // Or you can set source directory.
        //         source: image
        //     }
        // }]

        SetImageDialog(true)
        // SetImageUrl(images)
    }


    return (
        <View style={styles.MainContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* ------------------CenterView ----------------- */}
                <View style={styles.CenterView} >

                    {route.params.selectedTab == 3 ?
                        <View>
                            <Player
                                style={{ backgroundColor: colors.accent_color }}
                                video={{ uri: eventData.video_url ? eventData.video_url : "http://api.firstrespondersyogacanada.com/img/video/1618255358.mp4" }}
                                videoHeight={Dimensions.get("window").height / verticalScale(2)}
                                resizeMode="cover"
                                autoplay
                                onFullScreenChange={(result) => {
                                    console.log("hiii" + result)
                                    if (result === 0) {
                                        setPlayInFull(true)
                                    } else {
                                        setPlayInFull(false)
                                    }
                                }}
                                thumbnail={eventData.video_thumbnail == "" ? require("../../../assets/images/placeholder.png") : { uri: eventData.video_thumbnail }}
                                onLoad={(event) => {
                                    console.log("load_event", event)
                                    setLoading(false)
                                }}
                                onProgress={(event) => {
                                    // console.log("progress_event", event)
                                    setLoading(false)
                                }}
                                onBuffer={(event) => {
                                    console.log("buffer_event", event)
                                    setLoading(event.isBuffering)
                                }}
                                onEnd={(event) => {
                                    console.log("end_event", event)
                                }}
                            />
                        </View>
                        : <TouchableOpacity activeOpacity={0.8} onPress={() => enlargeImage()} >
                            <Image style={{ resizeMode: 'stretch', height: verticalScale(200), width: Dimensions.get('window').width }}
                                source={imageUrl} defaultSource={require("../../../assets/images/placeholder.png")} />
                        </TouchableOpacity>

                    }
                    {loading && is_data_found && route.params.selectedTab == 3 ?
                        <View style={{ width: "100%", height: Dimensions.get("window").height / verticalScale(2), position: "absolute", justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size={'large'} color={"white"} style={{ alignSelf: "center" }} />
                        </View> : console.log("")}

                    {!playInFull
                        ? <View style={styles.viewContainer}>
                            <View width="65%">
                                {/* ------------------ Event Name ----------------- */}
                                <CustomText bold style={styles.TextContainer}>{eventData.title}</CustomText>
                                {/* ------------------ Event Category ----------------- */}
                                <CustomText style={[styles.TextContainer, { marginTop: moderateScale(5), fontSize: moderateScale(12), color: colors.border_color }]}>{eventData.category_name}</CustomText>
                                <CustomText style={[styles.TextContainer, { marginTop: moderateScale(2), fontSize: moderateScale(12), color: colors.border_color }]}>{eventData.subcategory_name}</CustomText>
                            </View>

                            <View style={{ backgroundColor: colors.secondary_color, padding: moderateScale(8) }}>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: "space-between", width: scale(90), lignItems: "center" }}>
                                    <Image style={styles.ImageContainer1} source={require('../../../assets/images/calendar.png')} />
                                    <CustomText style={styles.TextContainer2}>{eventDate}</CustomText>
                                </View>
                                <View style={{ marginTop: moderateScale(8), marginBottom: moderateScale(8), height: verticalScale(1), backgroundColor: colors.border_color, width: scale(100) }} />
                                <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: "space-between", width: scale(90), alignItems: "center" }}>
                                    <Image style={styles.ImageContainer1} source={require('../../../assets/images/clock.png')} />
                                    <CustomText style={styles.TextContainer2}>{eventTime}</CustomText>
                                </View>

                            </View>
                        </View> : console.log("")}

                    {!playInFull ? <View>
                        <View style={styles.LineStyle} />
                        <View height={verticalScale(10)} />

                        <CustomText bold style={[styles.TextContainer, { fontSize: moderateScale(16), marginLeft: moderateScale(12) }]}>Event Description</CustomText>

                        <View height={verticalScale(5)} />

                        {/* ------------------ Event Details ----------------- */}
                        <CustomText style={styles.TextContainer1}>{eventData.description}</CustomText>

                        <View height={verticalScale(30)} />
                    </View> : console.log("")}
                </View>
            </ScrollView>

            {!playInFull ? route.params.selectedTab == 3 ? console.log("") : joined == 0 ?
                <CustomButton buttonStyle={{ elevation: 0, backgroundColor: colors.main_color, padding: moderateScale(8), alignSelf: 'center' }}
                    textStyle={{ color: colors.secondary_color, fontSize: moderateScale(16) }}
                    title="JOIN EVENT" onPress={() => {
                        callApiforJoinEvent()
                    }} />
                : eventData.event_status == 1 ? <CustomButton buttonStyle={{ elevation: 0, backgroundColor: colors.main_color, padding: moderateScale(8), alignSelf: 'center' }}
                    textStyle={{ color: colors.secondary_color, fontSize: moderateScale(16) }}
                    title="VIEW LIVE STREAMING" onPress={() => {
                        navigation.navigate("VideoScreen", { eventData: eventData })
                    }} /> : eventData.event_status == 2 ? <CustomButton buttonStyle={{ elevation: 0, backgroundColor: colors.main_color, padding: moderateScale(8), alignSelf: 'center' }}
                        textStyle={{ color: colors.secondary_color, fontSize: moderateScale(16) }}
                        title="VIEW STORED VIDEO" onPress={() => {
                            navigation.navigate("LiveVideoRecordScreen", { eventData: eventData })
                        }} /> : console.log("") : console.log("")}

            <View height={verticalScale(20)} />

            {!playInFull ? <TouchableOpacity activeOpacity={0.8} style={{ margin: moderateScale(12), position: "absolute", left: 0, top: 10 }} onPress={() => navigation.pop()}>
                <Image style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color, marginTop: 10, marginLeft: 10 }} source={require("../../../assets/images/left.png")} />
            </TouchableOpacity> : <View />}

            <ImageDialog
                showDialog={showImageDialog}
                image={imageUrl.uri}
                closeDialog={() => {
                    SetImageDialog(false)
                }}
            />

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
        backgroundColor: 'transparent',
    },
    SubContainer: {
        marginTop: moderateScale(0),
        marginLeft: moderateScale(0),
        marginLeft: moderateScale(0),
        backgroundColor: 'transparent',
    },
    ImageContainer: {
        height: Dimensions.get('window').height / verticalScale(2),
        width: Dimensions.get('window').width,
        resizeMode: 'cover',

    },
    TextContainer: {
        fontSize: moderateScale(17),
        color: colors.secondary_color,
        textAlign: 'justify',
        alignSelf: 'flex-start',
        marginLeft: moderateScale(10)
    },
    TextContainer1: {
        fontSize: moderateScale(12),
        marginTop: moderateScale(1),
        color: colors.border_color,
        textAlign: 'justify',
        alignSelf: 'flex-start',
        marginLeft: moderateScale(12),
        marginRight: moderateScale(15)
    },
    LineStyle: {
        height: verticalScale(1),
        marginTop: moderateScale(0),
        // marginLeft: 5,
        // marginRight: 5,
        backgroundColor: '#a9a9a9',
    },
    ImageContainer1: {
        height: verticalScale(18),
        width: scale(18),
        resizeMode: 'contain',
        tintColor: colors.main_color,

    },
    TextContainer2: {
        fontSize: moderateScale(12),
        textAlign: 'center',
        color: 'white',
        marginLeft: moderateScale(8)
    },
    viewContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
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
        // paddingLeft: moderateScale(5),
        // paddingBottom: moderateScale(5),
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        //   elevation:5,
        borderRadius: moderateScale(1)
    }


});

