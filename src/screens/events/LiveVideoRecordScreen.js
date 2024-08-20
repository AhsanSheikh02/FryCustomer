import React, { useState, useContext, useEffect, useRef } from 'react';
import { LogBox, Dimensions, ScrollView, StyleSheet, Text, View, Button, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import Player from '../../components/Player'
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-tiny-toast';

export default function LiveVideoRecordScreen(props) {
    const { navigation, route } = props;
    console.log("route", route.params.eventData.event_url)
    //1 - DECLARE VARIABLES
    const [fullSCreen, setFullSCreen] = useState(false);
    const [playInFull, setPlayInFull] = useState(false);
    const [loading, setLoading] = useState(true);
    const [video_url, setVideoUrl] = useState(route.params.eventData.event_url);
    const { state, handleLogout } = useAuth();
    const user = state.user;

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

    return (
        // <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.MainContainer}>
            {/* <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "black" }}> */}
            {/* ------------------ SubContainer ----------------- */}

            <View flex={1} justifyContent="center">
                <Player
                    style={{ backgroundColor: colors.accent_color }}
                    video={{ uri: video_url == "" || video_url.endsWith("/") ? null : video_url }}
                    videoHeight={300}
                    resizeMode="contain"
                    autoplay
                    // disableFullscreen
                    onFullScreenChange={(result) => {
                        console.log("hiii" + result)
                        if (result === 0) {
                            setPlayInFull(true)
                        } else {
                            setPlayInFull(false)
                        }
                    }}
                    // thumbnail={eventData.video_thumbnail == "" ? require("../../../assets/images/placeholder.png") : { uri: eventData.video_thumbnail }}
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

            {/* </ScrollView> */}
            {loading ? <View alignItems="center" justifyContent="center" height={Dimensions.get('window').height} width={Dimensions.get('window').width} position='absolute'>
                <ActivityIndicator size={"large"} color={"white"} />
            </View> : <View />}

            {!playInFull ? <TouchableOpacity activeOpacity={0.8} style={{ margin: moderateScale(12), position: "absolute", left: 0, marginTop: moderateScale(20) }} onPress={() => navigation.pop()}>
                <Image style={{ height: verticalScale(45), width: scale(45), resizeMode: 'contain', tintColor: colors.main_color, marginTop: 10, marginLeft: 10 }} source={require("../../../assets/images/left.png")} />
            </TouchableOpacity> : <View />}
        </View>
        // </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: "black"
        //justifyContent: 'center'
    },
    backgroundVideo: {
        position: 'absolute',
        backgroundColor: "red",
        height: 50,
        width: 50,
        alignSelf: 'flex-start',
        margin: 10
    },
    SubContainer: {
        backgroundColor: 'transparent',
    },
    ImageContainer: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        resizeMode: 'cover',
    },
    ImageContainer1: {
        height: verticalScale(50),
        width: scale(50),
        alignSelf: 'center',
        resizeMode: 'contain',
        tintColor: colors.border_color,
    },
    ViewContainer: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },

});