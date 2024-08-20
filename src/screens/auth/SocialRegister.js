import React, { useState, useRef, useEffect } from 'react';
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
    ScrollView
} from 'react-native';
import { CustomTextInput } from '../../components/TextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from "../../components/Header";
import ErrorText from "../../components/Error";
import { CustomButton } from '../../components/Button';
import Toast from 'react-native-tiny-toast';
import { colors, config } from '../../utils/constants';
import { useAuth } from '../../redux/providers/auth';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CommonActions } from '@react-navigation/native';
import { CustomText } from '../../components/Text';

export default function SocialRegister(props) {
    const { navigation, route } = props;
    const { social_type, social_id, email, last_name, first_name, profile_url } = route.params
    // social_id, social_type, first_name, last_name, email, profile_url, otp

    //1 - DECLARE VARIABLES
    const [emailNotExists, showEmail] = useState(!email || email == "");
    const [emailId, setEmailId] = useState("");
    const [role, setRole] = useState("");
    const [termsconditions, setTermsConditions] = useState(false);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [state, setState] = useState("");

    var emailRef = useRef(null)
    var addressRef = useRef(null)
    var cityRef = useRef(null)
    var stateRef = useRef(null)
    var postalCodeRef = useRef(null)
    const { handleSocialLogin } = useAuth();

    // useEffect = () => {

    // }
    
    function callApiforSocialLogin(type, id, email, firstName, lastName, photo) {
        Toast.showLoading("Please wait..")
        handleSocialLogin(id, type, firstName, lastName, email, photo, "")
            .then((response) => {
                Toast.hide()
                console.log("res: ", response)
                Toast.showSuccess(response.message)
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'SubscriptionPage' },
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

    function socialRegister() {
        if (emailNotExists && emailId == '') {
            Toast.show("Please Enter Email Address")
        } else if (emailNotExists && config.EMAIL_REG.test(emailId) === false) {
            Toast.show('Please Enter Valid Email Address')
        } else if (role == '') {
            Toast.show("Please Select Role")
        } else if (address == '') {
            Toast.show("Please Enter Email Address")
        } else if (city == '') {
            Toast.show("Please Enter City")
        } else if (state == '') {
            Toast.show("Please Enter State")
        } else if (postalCode == '') {
            Toast.show("Please Enter Postal Code")
        } else if (!termsconditions) {
            Toast.show("Please agree to the Terms And Conditions.")
        } else {
            doRegister()
        }
    }

    function doRegister() {
        if (emailNotExists) {
            navigation.navigate("OTPVerification", { social_type, social_id, email, last_name, first_name, profile_url })
        } else {
            callApiforSocialLogin(social_type, social_id, email, last_name, first_name, profile_url);
        }
    }

    return (

        <View style={styles.MainContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>
                <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={Platform.select({ ios: Dimensions.get('window').height == 812 || Dimensions.get('window').width == 812 ? 85 : 64, android: -500 })}>
                    {/* ------------------CenterView ----------------- */}
                    <View style={styles.CenterView} >

                        <View height={verticalScale(10)} />

                        {/* ------------------ Email ----------------- */}
                        {emailNotExists ? <>
                        <CustomTextInput
                            textInputRef={(ref) => emailRef = ref}
                            placeholder='Email'
                            keyboardType={"email-address"}
                            textContentType={"emailAddress"}
                            icon={require('../../../assets/images/emailicon.png')}
                            onChangeText={(text) => setEmailId(text)}
                            value={emailId}
                            maxLength={30}
                        />
                        <View marginTop={0} height={verticalScale(15)} />
                        </> : <View />}

                        {/* ------------------ Select a Role ----------------- */}
                        <DropDownPicker
                            items={[
                                { label: 'Police', value: 1 },
                                { label: 'Doctor', value: 2 },
                                { label: 'Fire Fighter', value: 3 },
                                { label: 'Other', value: 4 },
                            ]}
                            defaultValue={role}
                            showArrow={true}
                            containerStyle={{ height: verticalScale(45), marginRight: moderateScale(10), marginLeft: moderateScale(10), borderRadius: moderateScale(5) }}
                            style={{ backgroundColor: '#ffffff' }}
                            itemStyle={{
                                justifyContent: 'flex-start', marginRight: moderateScale(10), marginLeft: moderateScale(10)
                            }}
                            dropDownStyle={{ backgroundColor: '#fafafa' }}
                            onChangeItem={item => setRole(item.value)}
                            // placeholderStyle={{ color: "grey" }}
                            placeholder="Select a Role"
                        />
                        <View marginTop={0} height={verticalScale(15)} />

                        {/* ------------------ Address ----------------- */}
                        <CustomTextInput
                            textInputRef={(ref) => addressRef = ref}
                            placeholder='Address'
                            icon={require('../../../assets/images/profileIcon.png')}
                            onChangeText={(text) => setAddress(text)}
                            textContentType={"fullStreetAddress"}
                            returnKeyType={"next"}
                            blurOnSubmit={false}
                            onSubmitEditing={() => cityRef.focus()}
                            value={address}
                            maxLength={50}
                        />
                        <View marginTop={0} height={verticalScale(15)} />

                        {/* ------------------ City ----------------- */}
                        <CustomTextInput
                            textInputRef={(ref) => cityRef = ref}
                            placeholder='City'
                            icon={require('../../../assets/images/profileIcon.png')}
                            onChangeText={(text) => setCity(text)}
                            textContentType={"addressCity"}
                            returnKeyType={"next"}
                            blurOnSubmit={false}
                            onSubmitEditing={() => stateRef.focus()}
                            value={city}
                            maxLength={20}
                        />
                        <View marginTop={0} height={verticalScale(15)} />

                        {/* ------------------ State ----------------- */}
                        <CustomTextInput
                            textInputRef={(ref) => stateRef = ref}
                            placeholder='State'
                            icon={require('../../../assets/images/profileIcon.png')}
                            onChangeText={(text) => setState(text)}
                            textContentType={"addressState"}
                            returnKeyType={"next"}
                            blurOnSubmit={false}
                            onSubmitEditing={() => postalCodeRef.focus()}
                            value={state}
                            maxLength={20}
                        />
                        <View marginTop={0} height={verticalScale(15)} />

                        {/* ------------------ Postal code ----------------- */}
                        <CustomTextInput
                            textInputRef={(ref) => postalCodeRef = ref}
                            placeholder='Postal Code'
                            icon={require('../../../assets/images/profileIcon.png')}
                            onChangeText={(text) => setPostalCode(text)}
                            returnKeyType={"done"}
                            keyboardType={"numeric"}
                            textContentType={"postalCode"}
                            value={postalCode}
                            maxLength={5}
                        />
                        <View marginTop={0} height={verticalScale(25)} />

                        {/* ------------------Terms & Conditions ----------------- */}
                        <View style={{ flexDirection: 'row', marginLeft: moderateScale(20) }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setTermsConditions(!termsconditions)}>
                                <Image style={{ height: verticalScale(20), width: scale(20), tintColor: !termsconditions ? "grey" : colors.main_color }} source={!termsconditions ? require('../../../assets/images/uncheck.png')
                                    : require('../../../assets/images/check.png')} />
                            </TouchableOpacity>

                            <CustomText style={{ fontSize: moderateScale(14), color: 'grey', marginLeft: moderateScale(15), fontWeight: 'bold', alignItems: "center" }}>I Accept the Terms and Conditions</CustomText>

                        </View>

                        <View marginTop={0} height={verticalScale(30)} />

                        <CustomButton title="Continue" onPress={() => {
                            socialRegister()
                        }} />

                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );

};

SocialRegister.navigationOptions = ({ }) => {
    return {
        title: ``
    }
};

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    CenterView: {
        width: Dimensions.get('window').width,
        padding: moderateScale(20)
    },
    ViewContainer1: {
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: "row",
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10)
    },
    TextBlack1: {
        margin: moderateScale(10),
        color: 'black',
        fontSize: moderateScale(15),
        textAlign: 'center'
    },
});