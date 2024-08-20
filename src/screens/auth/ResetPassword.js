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
    ImageBackground
} from 'react-native';

import { useAuth } from '../../redux/providers/auth';
import { CustomTextInput } from '../../components/TextInput';
import { CustomButton } from '../../components/Button';
import Toast from 'react-native-tiny-toast';
import { colors, config } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CustomText } from '../../components/Text';
import { CommonActions } from '@react-navigation/native';


export default function ResetPassword(props) {
    console.log("props", props)
    const { navigation, route } = props;
    const { navigate } = navigation;
    const { handleResetPassword } = useAuth();

    //1 - DECLARE VARIABLES
    const [email, setEmail] = useState(route.params.email);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    var passwordRef = useRef(null)

    function callApiforResetPassword() {
        Toast.showLoading("Please wait..")

        handleResetPassword(email, password)
            .then((response) => {
                Toast.hide()
                console.log("ResetPassword-res: ", response)
                Toast.showSuccess(response.message)
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Login' },
                        ],
                    })
                );
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    function changePassword() {
        if (password == '') {
            Toast.show("Please Enter your New Password")
        } else if (password.length < 6) {
            Toast.show("password length must be atleast 6 characters")
        } else if (confirmPassword != password) {
            Toast.show("Password Does Not Match")
        } else {
            callApiforResetPassword()
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

                            {/* ------------------ New Password ----------------- */}
                            <CustomTextInput
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => passwordRef.focus()}
                                placeholder='New Password'
                                secureTextEntry={!showPassword}
                                textContentType={"password"}
                                icon={require('../../../assets/images/passwordicon.png')}
                                onChangeText={(text) => setPassword(text)}
                                setHidePass={(value) => {
                                    console.log(value)
                                    setShowPassword(!value)
                                }}
                                value={password}
                                maxLength={25}
                            />
                            <View marginTop={0} height={verticalScale(15)} />
                            {/* ------------------ Confirm Password ----------------- */}
                            <CustomTextInput
                                textInputRef={(ref) => passwordRef = ref}
                                placeholder='Confirm Password'
                                secureTextEntry={!showConfirmPassword}
                                textContentType={"password"}
                                icon={require('../../../assets/images/passwordicon.png')}
                                onChangeText={(text) => setConfirmPassword(text)}
                                setHidePass={(value) => {
                                    console.log(value)
                                    setShowConfirmPassword(!value)
                                }}
                                value={confirmPassword}
                                maxLength={25}
                                returnKeyType={"done"}
                            />

                            <View marginTop={0} height={verticalScale(30)} />

                            <CustomButton title="Reset Password" onPress={() => changePassword()} />

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