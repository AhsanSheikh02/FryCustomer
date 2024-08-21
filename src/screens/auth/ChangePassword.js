import React, { useState, useRef } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Alert,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    ImageBackground,
    Keyboard
} from 'react-native';

import { useAuth } from '../../redux/providers/auth';
import { CustomTextInput } from '../../components/TextInput';
import { CustomButton } from '../../components/Button';
import Toast from 'react-native-tiny-toast';
import { colors, config } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CustomText } from '../../components/Text';
import { CommonActions } from '@react-navigation/native';


export default function ChangePassword(props) {
    // console.log("props", props)
    const { navigation, route } = props;
    const { navigate } = navigation;
    const { handleChangePassword } = useAuth();

    //1 - DECLARE VARIABLES
    const [email, setEmail] = useState('');

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    var oldPasswordRef = useRef(null)
    var newPasswordRef = useRef(null)
    var confirmPasswordRef = useRef(null)

    function callApiforChangePassword() {
        Toast.showLoading("Please wait..")

        handleChangePassword(oldPassword, newPassword, confirmPassword)
            .then((response) => {
                Toast.hide()
                console.log("ChangePassword-res: ", response)
                if (response?.status === 1) {
                    Toast.showSuccess('Password changed successfully')
                    setTimeout(() => {
                        navigation.pop()
                    }, 300);
                } else {
                    Toast.show(response?.message)
                }

            })
            .catch((error) => {
                Toast.hide()
                console.log(error);
                Toast.show(error)
            })
    }

    function changePassword() {
        if (oldPassword == '') {
            Toast.show("Please enter your old password")
        } else if (newPassword.length < 6) {
            Toast.show("password length must be atleast 6 characters")
        } else if (newPassword != confirmPassword) {
            Toast.show("Password does not match")
        } else {
            callApiforChangePassword()
        }
    }

    return (
        <KeyboardAvoidingView style={styles.MainContainer} behavior="padding" enabled={Platform.OS == "ios"}>
            <ImageBackground style={{ left: 0, top: 0, width: Dimensions.get("window").width, height: Dimensions.get("window").height, position: "absolute" }} resizeMode={"cover"} source={require("../../../assets/images/login_bg.png")} />
            {/* <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={Platform.select({ ios: Dimensions.get('window').height == 812 || Dimensions.get('window').width == 812 ? 85 : 64, android: -500 })}> */}
            {/* ------------------CenterView ----------------- */}
            <View style={styles.CenterView} >

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <View height={verticalScale(30)} />

                        <Image style={{ height: verticalScale(140), width: scale(140), margin: moderateScale(10), resizeMode: 'contain', alignSelf: 'center' }} source={require('../../../assets/images/FRY.jpg')} />

                        <View height={verticalScale(20)} />

                        <View style={styles.cardView}>

                            <CustomText style={styles.HeaderText}>Change Password</CustomText>

                            {/* ------------------ Old Password ----------------- */}
                            <CustomTextInput
                                textInputRef={oldPasswordRef}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => newPasswordRef.current.focus()}
                                placeholder='Old Password'
                                secureTextEntry={!showOldPassword}
                                textContentType={"password"}
                                icon={require('../../../assets/images/passwordicon.png')}
                                onChangeText={(text) => setOldPassword(text)}
                                setHidePass={(value) => {
                                    setShowOldPassword(!value)
                                }}
                                value={oldPassword}
                                maxLength={25}
                            />
                            <View marginTop={0} height={verticalScale(15)} />

                            {/* ------------------ New Password ----------------- */}
                            <CustomTextInput
                                textInputRef={newPasswordRef}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => confirmPasswordRef?.current?.focus()}
                                placeholder='New Password'
                                secureTextEntry={!showNewPassword}
                                textContentType={"password"}
                                icon={require('../../../assets/images/passwordicon.png')}
                                onChangeText={(text) => setNewPassword(text)}
                                setHidePass={(value) => {
                                    setShowNewPassword(!value)
                                }}
                                value={newPassword}
                                maxLength={25}
                            />
                            <View marginTop={0} height={verticalScale(15)} />

                            {/* ------------------ Confirm Password ----------------- */}

                            <CustomTextInput
                                textInputRef={confirmPasswordRef}
                                returnKeyType={"done"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                placeholder='Confirm Password'
                                secureTextEntry={!showConfirmPassword}
                                textContentType={"password"}
                                icon={require('../../../assets/images/passwordicon.png')}
                                onChangeText={(text) => setConfirmPassword(text)}
                                setHidePass={(value) => {
                                    setShowConfirmPassword(!value)
                                }}
                                value={confirmPassword}
                                maxLength={25}
                            />
                            <View marginTop={0} height={verticalScale(30)} />

                            <CustomButton title="Save" onPress={() => changePassword()} />

                            <View marginTop={0} height={verticalScale(20)} />

                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity activeOpacity={0.8} style={[{ position: "absolute", marginTop: moderateScale(35) }, { marginLeft: Platform.OS == "ios" ? moderateScale(20) : moderateScale(20) }]} onPress={() => navigation.pop()}>
                    <Image style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color }} source={require("../../../assets/images/left.png")} />
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
        // </View>
    );
};


const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: colors.secondary_color_old,
        justifyContent: 'center',
        alignItems: 'center',
    },
    CenterView: {
        flex: 1,
        width: Dimensions.get('window').width,
        padding: moderateScale(20),
        marginTop: moderateScale(20)
    },
    HeaderText: {
        color: colors.accent_color,
        fontSize: moderateScale(26),
        textAlign: 'center',
        margin: moderateScale(16)
    },
    cardView: {
        margin: moderateScale(6),
        borderRadius: moderateScale(16),
        backgroundColor: colors.card_color,
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
});