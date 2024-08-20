import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    View,
    ActivityIndicator, 
    Dimensions
} from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import WebView from 'react-native-webview';
import { colors, config } from '../utils/constants';

export default function WebContent(props) {
    console.log("props", props)
    const { navigation, route } = props;
    const url = route.params.url
    console.log("url", url)

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg_color }}>
            <WebView
                style={{ flex: 1, width: Dimensions.get("window").width }}
                source={{ uri: url }}
                startInLoadingState={true}
                renderLoading={() => {
                    return (
                        <ActivityIndicator
                            color="black"
                            size="large"
                            style={{ justifyContent: "center", position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
                        />
                    )
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    splash: {
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        height: 100,
        width: 100,
        resizeMode: "cover"
    }
});