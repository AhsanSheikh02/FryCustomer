import React from 'react';
import { TouchableOpacity, Text, TextInput, FlatList, View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { CustomText } from '../../components/Text';
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default HomeCell = ({ source, videoTitle, description, benefits, onPress, onPressDetails }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPressDetails}>
            <View style={Styles.viewContainer} >
                <View>
                    <Image
                        source={source == "" ? require("../../../assets/images/placeholder.png") : { uri: source }}
                        defaultSource={require("../../../assets/images/placeholder.png")}
                        style={Styles.ImageContainer} />

                    <View style={{ position: 'absolute', width: scale(100), height: verticalScale(80), justifyContent: 'center' }}>
                        <View style={{
                            height: verticalScale(25), width: scale(25), alignSelf: 'center', justifyContent: 'center',
                            backgroundColor: colors.main_color, borderRadius: moderateScale(18), alignItems: 'center'
                        }}>
                            <Icon
                                name={'play'}
                                size={moderateScale(12)}
                                style={{ marginLeft: 3 }}
                                color={colors.secondary_color}
                                onPress={onPress}
                            />
                        </View>
                    </View>
                </View>

                <View style={{
                    justifyContent: 'center', flex: 1,
                    alignItems: 'flex-start', height: verticalScale(80),
                    marginLeft: moderateScale(10)
                }}>
                    <CustomText bold ellipsizeMode={'tail'} numberOfLines={2} style={Styles.TextContainer1}>{videoTitle}</CustomText>
                    <View height={5} />
                    <CustomText ellipsizeMode={'tail'} numberOfLines={2} style={Styles.TextContainer2}>{description}</CustomText>
                    <View height={5} />

                    {/* <FlatList
                        data={benefits}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={Styles.viewContainer1}>
                                    <CustomText style={[Styles.TextContainer2, { color: colors.secondary_color }]}>{benefits}</CustomText>
                                </View>
                            )
                        }}
                        style={{ flex: 1 }}
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                    /> */}
                </View>
            </View>
        </TouchableOpacity>
    );
};
const Styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        flex: 1,
        height: verticalScale(100),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: moderateScale(15),
        marginRight: moderateScale(15),
        borderRadius: moderateScale(8),
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
        padding: moderateScale(8),
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
    ImageContainer: {
        height: moderateScale(80),
        width: moderateScale(100),
        resizeMode: 'cover',
        // marginLeft: moderateScale(5),
        borderRadius: moderateScale(5),
    },
    TextContainer1: {
        fontSize: moderateScale(16),
        color: colors.secondary_color,
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
    },
    TextContainer2: {
        fontSize: moderateScale(13),
        color: colors.border_color,
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
    },
    viewContainer1: {
        backgroundColor: 'white',
        flexWrap: "wrap",
        borderColor: colors.secondary_color,
        borderWidth: moderateScale(1),
        padding: moderateScale(3),
        borderRadius: moderateScale(20),
        justifyContent: 'center',
        alignItems: "center"
    },
});

