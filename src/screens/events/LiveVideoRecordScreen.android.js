import React, { useState, useContext, useEffect, useRef } from 'react';
import { LogBox, Dimensions, ScrollView, StyleSheet, Text, View, Button, ActivityIndicator, Alert, Image, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import Player from '../../components/Player'
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import WebView from 'react-native-webview';

export default function LiveVideoRecordScreen(props) {
    const { navigation, route } = props;
    console.log("route", route.params.eventData.event_url)
    //1 - DECLARE VARIABLES
    const [video_url, setVideoUrl] = useState(route.params.eventData.event_url);

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
        <View style={styles.MainContainer}>
            <WebView
                mediaPlaybackRequiresUserAction={true}
                // androidLayerType='hardware'
                mixedContentMode='always'
                style={{ height: "100%", width: Dimensions.get("window").width, alignSelf: "center", alignContent: "center" }}
                javaScriptEnabled={true}
                source={{ uri: video_url }}
            />
            <TouchableOpacity activeOpacity={0.8} style={{ margin: moderateScale(12), position: "absolute", left: 0, marginTop: moderateScale(20) }} onPress={() => navigation.pop()}>
                <Image style={{ height: verticalScale(45), width: scale(45), resizeMode: 'contain', tintColor: colors.main_color, marginTop: 10, marginLeft: 10 }} source={require("../../../assets/images/left.png")} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        //justifyContent: 'center'
    },
    container: {
        flex: 1,
    },
    player: {
        flex: 1,
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