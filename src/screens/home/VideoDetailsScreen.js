import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, TextInput, Text, Linking, View, Image, Button, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions, FlatList, KeyboardAvoidingView, LogBox, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import HomeCell from './HomeCell'
import { CustomText } from '../../components/Text';
import ViewPager from '@react-native-community/viewpager';
import { colors, config, fonts } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CategoryCell from './CategoryCell'
import Player from '../../components/Player'
import Orientation from 'react-native-orientation-locker';
import Toast from 'react-native-tiny-toast';
import { useRef } from 'react';

let heightScaled = Dimensions.get("window").height / 2

export default function VideoDetailsScreen(props) {
    const { navigation, route } = props;
    const { state, handleVideoDetail } = useAuth();

    //1 - DECLARE VARIABLES
    const video_id = route.params.item.id
    const [videoData, setVideoData] = useState("");
    const [playInFull, setPlayInFull] = useState(false);
    const [loading, setLoading] = useState(true);
    const [is_data_found, setDatafound] = useState(false);
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
        callApiforVideoDetails(video_id)
    }, [video_id]);

    useEffect(() => {
        console.log("kkk1")
        setTimeout(() => {
            console.log("kkk2", heightScaled)
            setVideoHeight(playInFull ? Dimensions.get("window").height - StatusBar.currentHeight : heightScaled)
        }, 50);
    }, [playInFull])

    function callApiforVideoDetails(video_id) {
        Toast.showLoading("Please wait..")
        handleVideoDetail(video_id)
            .then((response) => {
                Toast.hide()
                console.log("VideoDetails-res: ", response)
                if (response.status == 1) {
                    setDatafound(true)
                    setVideoData(response.data)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    return (
        <View style={styles.MainContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* ------------------ SubContainer ----------------- */}
                <View style={styles.SubContainer}>

                    <View>
                        {videoData == "" ? <View /> : <Player
                            style={{ backgroundColor: colors.accent_color }}
                            video={{ uri: videoData.video_url == "" || videoData.video_url.endsWith("/") ? null : videoData.video_url }}
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
                            thumbnail={videoData.video_thumbnail == "" ? require("../../../assets/images/placeholder.png") : { uri: videoData.video_thumbnail }}
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
                        />}
                    </View>
                    
                    {loading && is_data_found ?
                        <View style={{ width: "100%", height: Dimensions.get("window").height / verticalScale(2), position: "absolute", justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size={'large'} color={"white"} style={{ alignSelf: "center" }} />
                        </View> : console.log("")}


                    {/* ------------------CenterView ----------------- */}
                    {!playInFull ? <View style={styles.CenterView} >
                        <View height={10} />
                        {/* ------------------ Video Title ----------------- */}
                        <CustomText bold style={styles.TextContainer}>{videoData.title}</CustomText>

                        {/* ------------------ Video Description ----------------- */}
                        <CustomText style={styles.TextContainer1}>{videoData.description}</CustomText>

                        <View height={20} />
                        <View style={styles.LineStyle} />
                        <View style={{ marginTop: 10, marginRight: 15, marginLeft: 15, justifyContent: 'center' }}>

                            <CustomText style={{ fontWeight: 'bold', fontSize: moderateScale(16), color: colors.secondary_color }}>Benefits</CustomText>
                            <View style={{ flexDirection: 'row', marginTop: moderateScale(5) }}>
                                <Image style={styles.ImageContainer2} source={require('../../../assets/images/dot.png')} />
                                <CustomText style={styles.TextContainer2}>{videoData.benefits}</CustomText>
                            </View>
                        </View>
                        <View height={20} />
                        <View style={styles.LineStyle} />
                        <View style={{ marginVertical: 10, marginRight: 15, marginLeft: 15, justifyContent: 'center' }}>

                            <CustomText style={{ fontWeight: 'bold', fontSize: moderateScale(16), color: colors.secondary_color }}>Category</CustomText>
                            <View style={{ flexDirection: 'row', marginTop: moderateScale(5) }}>
                                <Image style={styles.ImageContainer3} source={require('../../../assets/images/categorylist.png')} />
                                <CustomText style={styles.TextContainer2}>{videoData.category_name}</CustomText>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: moderateScale(5) }}>
                                <Image style={styles.ImageContainer3} source={require('../../../assets/images/categorylist.png')} />
                                <CustomText style={styles.TextContainer2}>{videoData.subcategory_name}</CustomText>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: moderateScale(5) }}>
                                <Image style={styles.ImageContainer3} source={require('../../../assets/images/categorylist.png')} />
                                <CustomText style={styles.TextContainer2}>{videoData.group_name}</CustomText>
                            </View>
                        </View>
                    </View> : <View />}
                </View>
            </ScrollView>
            {!playInFull && Platform.OS == "android" ? <TouchableOpacity activeOpacity={0.8} style={{ margin: moderateScale(12), position: "absolute", left: 0 }} onPress={() => navigation.pop()}>
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
    TextContainer: {
        fontSize: moderateScale(18),
        color: colors.secondary_color,
        //textAlign: 'justify',
        alignSelf: 'flex-start',
        marginLeft: moderateScale(15)
    },
    TextContainer1: {
        fontSize: moderateScale(14),
        marginTop: moderateScale(1),
        color: colors.border_color,
        //textAlign: 'justify',
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
    }
});