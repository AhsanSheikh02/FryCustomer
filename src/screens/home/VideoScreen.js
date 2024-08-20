import React, { useState, useContext, useEffect, useRef } from 'react';
import { BackHandler, Dimensions, StyleSheet, Text, View, Button, ActivityIndicator, Alert, Image, TouchableOpacity, LogBox } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils/constants';
import { NodeCameraView, NodePlayerView } from 'react-native-nodemediaclient';
export default function VideoScreen(props) {
    const { navigation, route } = props;

    //1 - DECLARE VARIABLES
    const [fullSCreen, setFullSCreen] = useState(false);
    const [event_id, setEventId] = useState(route.params.eventData.id);
    const [video_url, setVideoUrl] = useState("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    const { state, handleLogout } = useAuth();
    const user = state.user;
    var vp1 = useRef(null)
    console.log("event_id", event_id)
    useEffect(() => {
        LogBox.ignoreLogs([
            'Slider has been extracted',
            'Animated: `useNativeDriver` was not specified'
        ]);
        //  requestCameraPermission()
        vp1.start()
        const backAction = () => {
            if (vp1 != null) {
                vp1.stop()
            } navigation.pop()
            return true;
        };

        BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );


    }, [])

    function onFullScreen(params) {
        setFullSCreen(params)
    }

    // const requestCameraPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
    //             {
    //                 title: "Cool Photo App Camera And Microphone Permission",
    //                 message:
    //                     "Cool Photo App needs access to your camera " +
    //                     "so you can take awesome pictures.",
    //                 buttonNeutral: "Ask Me Later",
    //                 buttonNegative: "Cancel",
    //                 buttonPositive: "OK"
    //             }
    //         );
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log("You can use the camera");
    //         } else {
    //             console.log("Camera permission denied");
    //         }
    //     } catch (err) {
    //         console.warn(err);
    //     }
    // };

    function onPressBack() {
        if (vp1 != null) {
            vp1.stop()
        }
        navigation.pop()
    }
    return (
        <View style={styles.MainContainer}>
            <NodePlayerView
                style={{ flex: 1, width: Dimensions.get("window").width, }}
                ref={(vp) => vp1 = vp}
                inputUrl={"rtmp://138.197.149.182:1935/live/" + event_id}
                scaleMode={"ScaleAspectFit"}
                bufferTime={800}
                maxBufferTime={1500}
                autoplay={true}
            />
            <View style={styles.backgroundVideo}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => onPressBack()}>
                    <Image source={require("../../../assets/images/left.png")} style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color }} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: "black",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    backgroundVideo: {
        position: 'absolute',
        // backgroundColor: "red",
        height: moderateScale(50),
        width: moderateScale(50),
        alignSelf: 'flex-start',
        margin: moderateScale(10),
        marginTop:moderateScale(20)
    },
});

