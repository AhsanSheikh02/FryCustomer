import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, TextInput, Text, Linking, View, Image, Button, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions, FlatList, KeyboardAvoidingView, LogBox, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { CustomText } from '../../components/Text';
import { colors, config, fonts } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Player from '../../components/Player'
import Orientation from 'react-native-orientation-locker';
import Toast from 'react-native-tiny-toast';
import { useRef } from 'react';
import moment from 'moment';

let heightScaled = Dimensions.get("window").height / 2

export default function Event2DetailsScreen(props) {
    const { navigation, route } = props;
    const { state } = useAuth();

    //1 - DECLARE VARIABLES
    const videoData = route.params.eventData

    let event_date = moment(videoData.created_at).format("MMM-DD-YYYY")
    let event_time = moment(videoData.created_at).format("hh:mm A")

    const [playInFull, setPlayInFull] = useState(false);
    const [loading, setLoading] = useState(false);
    const [videoHeight, setVideoHeight] = useState(Dimensions.get("window").height / 2);
    
    let player = useRef(null)

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

    useEffect(() => {
        console.log("kkk1")
        setTimeout(() => {
            console.log("kkk2", heightScaled)
            setVideoHeight(playInFull ? Dimensions.get("window").height - StatusBar.currentHeight : heightScaled)
        }, 50);
    }, [playInFull])

    return (
        <View style={styles.MainContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* ------------------ SubContainer ----------------- */}
                <View style={styles.SubContainer}>

                    <View>
                        <Player
                            style={{ backgroundColor: colors.accent_color }}
                            video={{ uri: videoData.video == "" || videoData.video.endsWith("/") ? null : videoData.video }}
                            videoHeight={videoHeight}
                            resizeMode="contain"
                            autoplay
                            onFullScreenChange={(result) => {
                                console.log("hiii" + result)
                                if (result === 0) {
                                    setPlayInFull(true)
                                } else {
                                    setPlayInFull(false)
                                }
                            }}
                            thumbnail={videoData.image == "" ? require("../../../assets/images/placeholder.png") : { uri: videoData.image }}
                            onLoad={(event) => {
                                console.log("load_event", event)
                                setLoading(false)
                                const { width, height } = event.naturalSize;
                                heightScaled = (height * (Dimensions.get("window").width / width)) + verticalScale(20);
                                console.log("height: ", heightScaled)
                    
                                event.naturalSize.orientation = "horizontal";
                                setVideoHeight(heightScaled)
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
                    
                    {loading ?
                        <View style={{ width: "100%", height: Dimensions.get("window").height / verticalScale(2), position: "absolute", justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size={'large'} color={"white"} style={{ alignSelf: "center" }} />
                        </View> : <View />}


                    {/* ------------------CenterView ----------------- */}
                    {!playInFull ? <View style={styles.CenterView} >
                        <View style={styles.viewContainer}>
                            <View width="65%">
                                {/* ------------------ Event Name ----------------- */}
                                <CustomText bold style={styles.TextContainer}>{videoData.title}</CustomText>
                            </View>

                            <View style={{ backgroundColor: colors.secondary_color, padding: moderateScale(8) }}>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: "space-between", width: scale(90), lignItems: "center" }}>
                                    <Image style={styles.ImageContainer1} source={require('../../../assets/images/calendar.png')} />
                                    <CustomText style={styles.TextContainer2}>{event_date}</CustomText>
                                </View>
                                <View style={{ marginTop: moderateScale(8), marginBottom: moderateScale(8), height: verticalScale(1), backgroundColor: colors.border_color, width: scale(100) }} />
                                <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: "space-between", width: scale(90), alignItems: "center" }}>
                                    <Image style={styles.ImageContainer1} source={require('../../../assets/images/clock.png')} />
                                    <CustomText style={styles.TextContainer2}>{event_time}</CustomText>
                                </View>

                            </View>
                        </View>

                        <View style={styles.LineStyle} />
                        {/* ------------------ Video Description ----------------- */}
                        <CustomText style={styles.TextContainer1}>{videoData.description}</CustomText>

                    </View> : <View />}
                </View>
            </ScrollView>
            {!playInFull ? <TouchableOpacity activeOpacity={0.8} style={{ margin: moderateScale(12), position: "absolute", left: 0 }} onPress={() => navigation.pop()}>
                <Image style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color, marginTop: 10, marginLeft: 10 }} source={require("../../../assets/images/left.png")} />
            </TouchableOpacity> : <View />}
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
        backgroundColor: 'transparent',
    },
    ImageContainer: {
        height: Dimensions.get('window').height / verticalScale(2),
        width: Dimensions.get('window').width,
        resizeMode: 'cover',
    },
    ViewContainer: {
        height: Dimensions.get('window').height / verticalScale(2),
        width: Dimensions.get('window').width,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
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
    },

    TextContainer: {
        fontSize: moderateScale(18),
        color: colors.secondary_color,
        //textAlign: 'justify',
        alignSelf: 'flex-start',
        marginLeft: moderateScale(15)
    },
    TextContainer1: {
        fontSize: moderateScale(14),
        color: colors.border_color,
        //textAlign: 'justify',
        marginTop: verticalScale(10),
        alignSelf: 'flex-start',
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15)
    },
    TextContainer3: {
        fontSize: moderateScale(14),
        marginTop: moderateScale(1),
        color: colors.border_color,
        //textAlign: 'justify',
        alignSelf: 'flex-start',
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15)
    },
    LineStyle: {
        height: verticalScale(1),
        marginTop: moderateScale(0),
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: '#a9a9a9',
    },
    ImageContainer1: {
        height: verticalScale(50),
        width: scale(50),
        alignSelf: 'center',
        resizeMode: 'contain',
        tintColor: colors.border_color,
    },
    ImageContainer2: {
        height: verticalScale(8),
        width: scale(8),
        resizeMode: 'cover',
        tintColor: colors.border_color,
        alignSelf: 'flex-start',
        marginTop: moderateScale(5),
    },
    ImageContainer3: {
        height: verticalScale(15),
        width: scale(15),
        resizeMode: 'cover',
        alignSelf: 'center',
        tintColor: colors.border_color,
        marginTop: moderateScale(5)
    },
    TextContainer2: {
        fontSize: moderateScale(14),
        // textAlign: 'center',
        color: '#212121',
        marginLeft: moderateScale(10),
        alignSelf: 'center',
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
});