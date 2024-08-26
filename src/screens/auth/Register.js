import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-tiny-toast';
import { CustomButton } from '../../components/Button';
import { CustomText } from '../../components/Text';
import { CustomTextInput } from '../../components/TextInput';
import { useAuth } from '../../redux/providers/AuthProvider';
import { colors, config, fonts } from '../../utils/constants';

export default function Register(props) {
    const { navigation } = props;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([
        { label: 'Dispatcher', value: 3 },
        { label: 'EMS/EMT', value: 2 },
        { label: 'Firefighter', value: 5 },
        { label: 'Police', value: 4 },
        { label: 'User', value: 6 },
    ]);
    const [role, setRole] = useState('');
    const [roleOpen, setRoleOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPasssword, setConfirmPasssword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsconditions, setTermsConditions] = useState(false);
    const [deviceToken, setDeviceToken] = useState('');
    const [deviceType, setDeviceType] = useState('');

    const { handleRegister } = useAuth();

    var lastNameRef = useRef(null);
    var emailRef = useRef(null);
    var cpasswordRef = useRef(null);

    useEffect(() => {
        AsyncStorage.getItem('device_token')
            .then(req => JSON.parse(req))
            .then((data) => {
                console.log('DeviceToken: ', data);
                if (data) {
                    setDeviceToken(data.token);
                    setDeviceType(data.os);
                }
            });
    }, [navigation]);


    function callApiforRegister() {
        Toast.showLoading('Please wait..');
        handleRegister(firstName, lastName, role, '', email, password, '', '', '', '', deviceToken, deviceType)
            .then((response) => {
                Toast.hide();
                console.log('Register-res: ', response);
                Toast.showSuccess(response.message);
                navigation.navigate('OTPVerification', { email, password, isForgot: false });
            })
            .catch((error) => {
                Toast.hide();
                console.log(error.message);
                Toast.show(error.message);
            });
    }

    function register() {
        if (firstName == '') {
            Toast.show('Please Enter First Name');
        } else if (lastName == '') {
            Toast.show('Please Enter Last Name');
        } else if (email == '') {
            Toast.show('Please Enter Email Address');
        } else if (config.EMAIL_REG.test(email) === false) {
            Toast.show('Please Enter Valid Email Address');
        } else if (role == '') {
            Toast.show('Please Select Role');
        }
        else if (password == '') {
            Toast.show('Please Enter Password');
        } else if (password.length < 6) {
            Toast.show('password length must be atleast 6 characters');
        } else if (confirmPasssword == '') {
            Toast.show('Please Enter Confirm Password');
        } else if (confirmPasssword != password) {
            Toast.show('Password Does Not Match');
        } else if (!termsconditions) {
            Toast.show('Please agree to the Terms And Conditions.');
        } else {
            callApiforRegister();
        }
    }

    return (
        <KeyboardAvoidingView style={styles.MainContainer} behavior="padding" enabled={Platform.OS == 'ios'}>
            {/* ------------------CenterView ----------------- */}
            <ImageBackground style={{ left: 0, top: 0, width: Dimensions.get('window').width, height: Dimensions.get('window').height, position: 'absolute' }} resizeMode={'cover'} source={require('../../../assets/images/register_bg.png')} />
            <View height={verticalScale(10)} />
            <View style={{ flexDirection: 'row', width: '100%', marginTop: moderateScale(20), marginBottom: moderateScale(10) }}>
                {/* <Image style={{ height: verticalScale(140), width: scale(140), flex: 1, alignItems: "center", marginTop: moderateScale(30), resizeMode: 'contain', alignSelf: 'center' }} source={require('../../../assets/images/FRY.jpg')} /> */}
                <View flex={1}>
                    <Image style={{ height: verticalScale(140), width: scale(140), resizeMode: 'contain', alignSelf: 'center' }} source={require('../../../assets/images/FRY.jpg')} />
                </View>
                <TouchableOpacity activeOpacity={0.8} style={{ margin: moderateScale(18), position: 'absolute' }} onPress={() => navigation.pop()}>
                    <Image style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color }} source={require('../../../assets/images/left.png')} />
                </TouchableOpacity>
            </View>

            <View marginTop={0} height={verticalScale(12)} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.cardView, { flex: 1, width: Dimensions.get('window').width - moderateScale(40) }]}>

                    <CustomText style={styles.HeaderText}>REGISTER</CustomText>

                    {/* ------------------ First Name ----------------- */}
                    <CustomTextInput
                        placeholder="First Name"
                        icon={require('../../../assets/images/profileIcon.png')}
                        onChangeText={(text) => setFirstName(text)}
                        returnKeyType={'next'}
                        textContentType={'givenName'}
                        blurOnSubmit={false}
                        onSubmitEditing={() => lastNameRef.focus()}
                        value={firstName}
                        maxLength={25}
                    />
                    <View marginTop={0} height={verticalScale(15)} />

                    {/* ------------------ Last Name ----------------- */}
                    <CustomTextInput
                        textInputRef={(ref) => lastNameRef = ref}
                        placeholder="Last Name"
                        icon={require('../../../assets/images/profileIcon.png')}
                        onChangeText={(text) => setLastName(text)}
                        returnKeyType={'next'}
                        textContentType={'familyName'}
                        blurOnSubmit={false}
                        onSubmitEditing={() => emailRef.focus()}
                        value={lastName}
                        maxLength={25}
                    />
                    <View marginTop={0} height={verticalScale(15)} />

                    {/* ------------------ Email ----------------- */}
                    <CustomTextInput
                        textInputRef={(ref) => emailRef = ref}
                        placeholder="Email"
                        keyboardType={'email-address'}
                        textContentType={'emailAddress'}
                        icon={require('../../../assets/images/emailicon.png')}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        maxLength={50}
                    />
                    <View marginTop={0} height={verticalScale(15)} />

                    {/* ------------------ Select a Role ----------------- */}
                    <DropDownPicker
                        items={roles}
                        setItems={setRoles}
                        value={role}
                        open={roleOpen}
                        setOpen={setRoleOpen}
                        showArrow={true}
                        arrowIconStyle={{ tintColor: 'grey' }}
                        containerStyle={{ height: verticalScale(42), marginRight: moderateScale(10), marginLeft: moderateScale(10), borderRadius: moderateScale(5), width: 'auto', zIndex: 10000000 }}
                        style={{ backgroundColor: '#ffffff' }}
                        itemProps={{
                            style: {
                                justifyContent: 'flex-start', marginRight: moderateScale(10), marginLeft: moderateScale(15),
                            },
                        }}
                        labelStyle={{ fontFamily: fonts.opensans_light }}
                        dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => {
                            setRole(item.value);
                            console.log(item);
                        }}
                        placeholder="Select a Role"
                        setValue={setRole}
                        listMode="SCROLLVIEW"
                    />
                    <View marginTop={0} height={verticalScale(15)} />


                    {/* ------------------ Password ----------------- */}
                    <CustomTextInput
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        icon={require('../../../assets/images/passwordicon.png')}
                        onChangeText={(text) => setPassword(text)}
                        returnKeyType={'next'}
                        textContentType={'password'}
                        blurOnSubmit={false}
                        onSubmitEditing={() => cpasswordRef.focus()}
                        value={password}
                        setHidePass={(value) => {
                            console.log(value);
                            setShowPassword(!value);
                        }}
                        maxLength={25}
                    />
                    <View marginTop={0} height={verticalScale(15)} />

                    {/* ------------------Confirm Password ----------------- */}
                    <CustomTextInput
                        textInputRef={(ref) => cpasswordRef = ref}
                        placeholder="Confirm Password"
                        secureTextEntry={!showConfirmPassword}
                        textContentType={'password'}
                        icon={require('../../../assets/images/passwordicon.png')}
                        onChangeText={(text) => setConfirmPasssword(text)}
                        returnKeyType={'done'}
                        // blurOnSubmit={false}
                        setHidePass={(value) => {
                            console.log(value);
                            setShowConfirmPassword(!value);
                        }}
                        // onSubmitEditing={() => addressRef.focus()}
                        value={confirmPasssword}
                        maxLength={25}
                    />
                    <View marginTop={0} height={verticalScale(15)} />

                    {/* ------------------Terms & Conditions ----------------- */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: moderateScale(20), marginRight: moderateScale(20) }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setTermsConditions(!termsconditions)}>
                            <Image style={{ resizeMode: 'contain', height: verticalScale(16), width: scale(16), tintColor: !termsconditions ? 'black' : colors.secondary_color }} source={!termsconditions ? require('../../../assets/images/uncheck.png')
                                : require('../../../assets/images/check.png')} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', marginLeft: moderateScale(10) }}>
                            <CustomText style={{ fontSize: moderateScale(12), color: 'black', alignItems: 'center' }}>I have read and agreed to the </CustomText>
                            <CustomText onPress={() => navigation.navigate('WebContent', { url: config.terms_url, name: 'Terms & Conditions' })} style={{ fontSize: moderateScale(12), fontWeight: 'bold', color: 'blue', alignItems: 'center' }}>Terms {'&'} Conditions </CustomText>
                            <CustomText style={{ fontSize: moderateScale(12), color: 'black', alignItems: 'center' }}>and </CustomText>
                            <CustomText onPress={() => navigation.navigate('WebContent', { url: config.privacy_url, name: 'Privacy Policy' })} style={{ fontSize: moderateScale(12), fontWeight: 'bold', color: 'blue', alignItems: 'center' }}>Privacy Policy.</CustomText>
                        </View>
                    </View>

                    <View marginTop={0} height={verticalScale(16)} />

                    <CustomButton title="Continue" onPress={() => {
                        register();
                    }} />

                    <View marginTop={0} height={verticalScale(12)} />

                </View>
                <View marginTop={0} height={verticalScale(12)} />
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

Register.navigationOptions = ({ }) => {
    return {
        title: '',
    };
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
    ViewContainer1: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
    },
    TextBlack1: {
        margin: moderateScale(10),
        color: 'black',
        fontSize: moderateScale(15),
        textAlign: 'center',
    },
    HeaderText: {
        color: 'black',
        fontSize: moderateScale(26),
        textAlign: 'center',
        margin: moderateScale(16),
    },
});
