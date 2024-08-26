import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-tiny-toast';
import WebView from 'react-native-webview';
import { CustomButton } from '../../components/Button';
import { CustomText } from '../../components/Text';
import { CustomTextInput } from '../../components/TextInput';
import { useAuth } from '../../redux/providers/AuthProvider';
import { colors, fonts } from '../../utils/constants';

export default function EditProfile(props) {
    const { navigation } = props;

    //1 - DECLARE VARIABLES
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [deviceToken, setDeviceToken] = useState('');
    const [deviceType, setDeviceType] = useState('');
    const [showWebPage, setShowWebPage] = useState(false);
    const [webpage, setWebpage] = useState('');
    const [roles, setRoles] = useState([
        { label: 'Dispatcher', value: 3 },
        { label: 'EMS/EMT', value: 2 },
        { label: 'Firefighter', value: 5 },
        { label: 'Police', value: 4 },
        { label: 'User', value: 6 },
    ]);
    const [role, setRole] = useState('');
    const [roleOpen, setRoleOpen] = useState(false);

    var lastNameRef = useRef(null);
    const { handleUpdateProfile } = useAuth();

    useEffect(() => {
        AsyncStorage.getItem('device_token')
            .then(req => JSON.parse(req))
            .then((data) => {
                if (data) {
                    setDeviceToken(data.token);
                    setDeviceType(data.os);
                }
            });
        AsyncStorage.getItem('user')
            .then(req => JSON.parse(req))
            .then((data) => {
                setFirstName(data?.first_name);
                setLastName(data?.last_name);
                setEmail(data?.email);
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].value == data?.role_id) {
                        console.log(roles[i].value);
                        setRole(roles[i].value);
                    }
                }
            });
    }, [roles]);


    async function callApiforUpdateProfile() {
        if (firstName === '') {
            Toast.show('First Name can\'t be empty');
        } else if (lastName === '') {
            Toast.show('Last Name can\'t be empty');
        } else {
            Toast.showLoading('Please wait..');
            handleUpdateProfile(firstName, lastName, role)
                .then(async (response) => {
                    console.log('handleUpdateProfile-res: ', response);
                    if (response.status == 1) {
                        Toast.hide();
                        Toast.showSuccess('Profile updated successfully');
                        // setTimeout(() => {
                        //     navigation.pop()
                        // }, 300);
                    } else {
                        Toast.show(response?.message);
                    }
                }).catch((error) => {
                    console.log(error.message);
                    Toast.show(error.message);
                });
        }
    }

    function showWebpageContent(url) {
        setWebpage(url);
        setShowWebPage(true);
    }

    function goToURL(url) {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('Don\'t know how to open URI: ' + url);
            }
        });
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

                    <CustomText style={styles.HeaderText}>EDIT PROFILE</CustomText>

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
                        returnKeyType={'done'}
                        textContentType={'familyName'}
                        blurOnSubmit={false}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        value={lastName}
                        maxLength={25}
                    />
                    <View marginTop={0} height={verticalScale(15)} />

                    {/* ------------------ Email ----------------- */}
                    <CustomTextInput
                        placeholder="Email"
                        keyboardType={'email-address'}
                        textContentType={'emailAddress'}
                        icon={require('../../../assets/images/emailicon.png')}
                        onChangeText={(text) => setEmail(text)}
                        returnKeyType={'done'}
                        value={email}
                        maxLength={50}
                        editable={false}
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
                        }}
                        placeholder="Select a Role"
                        setValue={setRole}
                        listMode="SCROLLVIEW"
                    />
                    <View marginTop={0} height={verticalScale(31)} />

                    <View marginTop={0} height={verticalScale(16)} />

                    <CustomButton title="Save" onPress={() => {
                        callApiforUpdateProfile();
                    }} />

                    <View marginTop={0} height={verticalScale(12)} />

                </View>
                <View marginTop={0} height={verticalScale(12)} />
            </ScrollView>
            <Modal
                animationType="fade"
                style={{ flex: 1 }}
                transparent={true}
                visible={showWebPage}
                onRequestClose={() => {
                    setShowWebPage(false);
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: moderateScale(30), backgroundColor: 'rgba(10, 10, 10, 0.5)' }}>
                    <WebView
                        style={{ flex: 1, width: Dimensions.get('window').width - scale(30) }}
                        source={{ uri: webpage }}
                        containerStyle={{ backgroundColor: 'transparent' }}
                        startInLoadingState={true}
                        renderLoading={() => {
                            return (
                                <ActivityIndicator
                                    color="black"
                                    size="large"
                                    style={{ justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                                />
                            );
                        }}
                    />
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );

}

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
