import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { CustomText } from '../../components/Text';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../utils/constants';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default Event2Cell = ({ item, eventDate, onPress, onPressVideo }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <View style={Styles.viewContainer} >

                <Image
                    source={item.image == "" ? require("../../../assets/images/placeholder.png") : { uri: item.image }}
                    defaultSource={require("../../../assets/images/placeholder.png")}
                    style={Styles.ImageContainer} />

                <View style={{
                    height: moderateScale(45), width: moderateScale(45), alignSelf: 'center', justifyContent: 'center',
                    backgroundColor: colors.main_color, borderRadius: moderateScale(22), alignItems: 'center', position: "absolute"
                }}>
                    <Icon
                        name={'play'}
                        size={moderateScale(18)}
                        style={{ marginLeft: 3 }}
                        color={colors.secondary_color}
                        onPress={onPressVideo}
                    />
                </View>
                <View style={{
                    width: "100%", position: 'absolute', justifyContent: 'space-between',
                    paddingBottom: moderateScale(10), paddingLeft: moderateScale(10), flexDirection: "row", alignItems: 'center', bottom: moderateScale(5),
                }}>
                    <View width={"65%"}>
                        <CustomText numberOfLines={2} style={Styles.TextContainer1}>{item.title}</CustomText>
                    </View>
                    <View width={"35%"} >
                        <View style={{
                            backgroundColor: colors.secondary_color, alignItems: 'center', paddingTop: moderateScale(5),
                            paddingBottom: moderateScale(5), paddingLeft: moderateScale(15), paddingRight: moderateScale(15),
                            borderTopLeftRadius: moderateScale(20), borderBottomLeftRadius: moderateScale(20), right: 0
                        }}>
                            <CustomText style={Styles.TextContainer2}>{eventDate}</CustomText>
                        </View>
                    </View>
                </View>
                <View height={5} />
            </View>
        </TouchableOpacity>
    );
};

const Styles = StyleSheet.create({
    viewContainer: {
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15),
        width: Dimensions.get('window').width - scale(30),
        alignItems: 'center',
        marginTop: moderateScale(5),
        marginBottom: moderateScale(5),
        borderRadius: moderateScale(5),
        backgroundColor: "lightgrey",
        justifyContent: 'center',
    },
    ImageContainer: {
        height: verticalScale(200),
        width: Dimensions.get('window').width - scale(30),
        resizeMode: 'stretch',
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15),
        borderRadius: moderateScale(5),
        // borderWidth: moderateScale(1),
        // borderColor: colors.border_color,
        // opacity:0.8
    },
    viewContainer1: {
        height: verticalScale(50),
        width: scale(50),
        backgroundColor: colors.secondary_color,
        borderColor: colors.main_color,
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(30),
        // marginLeft: moderateScale(10),
        // marginRight: moderateScale(10),
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: moderateScale(10),
        end: moderateScale(10)
    },
    TextContainer1: {
        flex: 1,
        fontSize: moderateScale(14),
        color: colors.main_color,
        //  marginLeft: moderateScale(5)
    },
    TextContainer2: {
        fontSize: moderateScale(12),
        color: colors.main_color,
        textAlign: "center"
    },
});


