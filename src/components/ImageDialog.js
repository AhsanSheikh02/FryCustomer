import React from 'react';
import { Dimensions, TouchableOpacity, View, Modal, Image, StyleSheet, Animated } from 'react-native';
import { ImageViewer } from "react-native-image-zoom-viewer";
import { colors } from '../utils/constants';

export default ImageDialog = ({ showDialog, closeDialog, image }) => {
    return (
        showDialog ?
            <View style={{ padding: 10, position: "absolute", width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(10, 10, 10, 1)" }}>
                <ImageViewer
                    style={styles.ImageContainer1}
                    // imageUrls={image}
                    imageUrls={[{ url: image }]}
                    failImageSource={require('../../assets/images/placeholder.png')}
                    renderIndicator={(currentIndex, size) => <View />} />
                <TouchableOpacity activeOpacity={0.8} style={{ position: "absolute", top: 40, right: 10, justifyContent: "center", alignSelf: "flex-end" }} onPress={closeDialog}>
                    <Image style={styles.ImageContainer2} source={require('../../assets/images/deleteicon2.png')}></Image>
                </TouchableOpacity>

            </View>
            :
            <View />
    );
};
const styles = StyleSheet.create({
    ImageContainer1: {
        height:"100%",
        width:"100%",
        resizeMode: 'contain',
    },
    ImageContainer2: {
        width: 35,
        height: 35,
        marginRight: 10,
        tintColor: colors.main_color
    },
});


