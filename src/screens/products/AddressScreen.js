import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, Button, ActivityIndicator, Alert, StyleSheet, ScrollView, Dimensions, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { CustomTextInput } from '../../components/TextInput';
import { CustomButton } from '../../components/Button';
import Toast from 'react-native-tiny-toast';
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CustomText } from '../../components/Text';
export default function AddressScreen(props) {
    const { navigation } = props;

    //1 - DECLARE VARIABLES
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [states, setStates] = useState("");
    const [address, setAddress] = useState("");
    const [town, setTown] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("Canada");
    var mobileRef = useRef(null)
    var pincodeRef = useRef(null)
    var stateRef = useRef(null)
    var addressRef = useRef(null)
    var localityRef = useRef(null)
    var cityRef = useRef(null)

    const { state, handleLogout, handleSetAddress, handleGetAddress } = useAuth();
    const user = state.user;

    useEffect(() => {
        callApiforGetAddress()
    }, [])

    function onPressSubmit() {
        if (name == '') {
            Toast.show("Please Enter Full Name")
        } else if (phone == "") {
            Toast.show("Please Enter Phone Number")
        }
        else if (phone != "" && phone.length != 10) {
            Toast.show("Please enter valid Phone Number")
        }
        else if (address == '') {
            Toast.show("Please Enter Address(House No, Building, Street, Area)")
        }
        else if (town == '') {
            Toast.show("Please Enter Locality/Town")
        }
        else if (city == '') {
            Toast.show("Please Enter City")
        }
        else if (states == "") {
            Toast.show("Please Enter State")
        }
        else if (pinCode == "") {
            Toast.show("Please Enter Pincode")
        } else {
            callApiforSetAddress()
        }
    }



    function callApiforSetAddress() {
        Toast.showLoading("Please wait..")
        handleSetAddress(name, phone, address, town, city, states, country, pinCode)
            .then((response) => {
                Toast.hide()
                console.log("SetAddress-res: ", response)
                if (response.status == 1) {
                    //  Toast.showSuccess(response.message)
                    navigation.navigate('OrderSummary')

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }

    function callApiforGetAddress() {
        Toast.showLoading("Please wait..")
        handleGetAddress()
            .then((response) => {
                Toast.hide()
                console.log("GetAddress-res: ", response)
                if (response.status == 1) {
                    setName(response.data.user_name)
                    setPhone(response.data.user_phone)
                    setAddress(response.data.address);
                    setTown(response.data.locality);
                    setCity(response.data.city);
                    setStates(response.data.state)
                    setCountry(response.data.country);
                    setPinCode(response.data.pincode ? response.data.pincode.toString() : "")
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }

    return (
        <KeyboardAvoidingView style={styles.MainContainer} behavior="padding" enabled={Platform.OS == "ios"}>
            <View style={styles.MainContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>
                    <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={Platform.select({ ios: Dimensions.get('window').height == 812 || Dimensions.get('window').width == 812 ? 85 : 64, android: -500 })}>
                        {/* ------------------CenterView ----------------- */}
                        <View style={styles.CenterView} >
                            <View style={styles.subContainer}>
                                {/* ------------------ Full Name ----------------- */}

                                <View style={{
                                    backgroundColor: colors.secondary_color, borderBottomRightRadius: moderateScale(20), borderBottomLeftRadius: moderateScale(20),
                                    paddingTop: moderateScale(20), paddingBottom: moderateScale(20), paddingLeft: moderateScale(10), paddingRight: moderateScale(10),
                                }}>
                                    <CustomTextInput
                                        placeholder='Full Name'
                                        onChangeText={(text) => setName(text)}
                                        value={name}
                                        textContentType={"name"}
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => mobileRef.focus()}
                                    />

                                    <View marginTop={0} height={verticalScale(15)} />
                                    {/* ------------------ Mobile Number ----------------- */}
                                    <CustomTextInput
                                        textInputRef={(ref) => mobileRef = ref}
                                        placeholder='Phone no.'
                                        onChangeText={(text) => setPhone(text)}
                                        value={phone}
                                        returnKeyType={"next"}
                                        keyboardType={'phone-pad'}
                                        textContentType={"telephoneNumber"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => addressRef.focus()}
                                    />

                                </View>

                            </View>
                            <View style={styles.subContainer}>
                                <View style={{ marginTop: moderateScale(20), paddingLeft: moderateScale(10), paddingRight: moderateScale(10), }}>
                                    <CustomText style={{ fontSize: moderateScale(17), color: colors.secondary_color, marginLeft: moderateScale(10) }}>Address Details</CustomText>
                                    <View marginTop={0} height={verticalScale(20)} />
                                    {/* ------------------ Address ----------------- */}
                                    <CustomTextInput
                                        textInputRef={(ref) => addressRef = ref}
                                        placeholder='Address (House No, Building, Street, Area)'
                                        onChangeText={(text) => setAddress(text)}
                                        value={address}
                                        returnKeyType={"next"}
                                        textContentType={"fullStreetAddress"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => localityRef.focus()}
                                    />

                                    <View marginTop={0} height={verticalScale(15)} />
                                    {/* ------------------ Locality ----------------- */}
                                    <CustomTextInput
                                        textInputRef={(ref) => localityRef = ref}
                                        placeholder='Locality/Town'
                                        onChangeText={(text) => setTown(text)}
                                        value={town}
                                        returnKeyType={"next"}
                                        textContentType={"sublocality"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => cityRef.focus()}
                                    />

                                    <View marginTop={0} height={verticalScale(15)} />
                                    {/* ------------------ City ----------------- */}
                                    <CustomTextInput
                                        textInputRef={(ref) => cityRef = ref}
                                        placeholder='City/District'
                                        onChangeText={(text) => setCity(text)}
                                        value={city}
                                        textContentType={"addressCity"}
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => stateRef.focus()}
                                    />

                                    <View marginTop={0} height={verticalScale(15)} />
                                    {/* ------------------ State----------------- */}
                                    <CustomTextInput
                                        textInputRef={(ref) => stateRef = ref}
                                        placeholder='State'
                                        onChangeText={(text) => setStates(text)}
                                        value={states}
                                        returnKeyType={"next"}
                                        textContentType={"addressState"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => pincodeRef.focus()}
                                    />

                                    <View marginTop={0} height={verticalScale(15)} />
                                    {/* ------------------ Pincode----------------- */}
                                    <CustomTextInput
                                        textInputRef={(ref) => pincodeRef = ref}
                                        placeholder='Pin Code'
                                        onChangeText={(text) => setPinCode(text)}
                                        value={pinCode}
                                        keyboardType={'numeric'}
                                        textContentType={"postalCode"}
                                    />
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <CustomButton buttonStyle={{ elevation: 0, backgroundColor: colors.secondary_color, padding: moderateScale(8), width: Dimensions.get("window").width / scale(1.3), alignSelf: 'center' }}
                    textStyle={{ color: colors.main_color }}
                    title="REVIEW ORDER" onPress={() => {
                        console.log("REVIEW ORDER")
                        onPressSubmit()
                    }} />
                <View height={verticalScale(20)} />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: colors.main_color,
        justifyContent: 'center',
        alignItems: 'center',
    },
    CenterView: {
        width: Dimensions.get('window').width
    },
    subContainer: {
        //padding: moderateScale(15)
    },
    LineStyle: {
        height: verticalScale(5),
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
        // marginLeft: 5,
        // marginRight: 5,
        backgroundColor: 'lightgray',
        width: Dimensions.get('window').width
    },
    TextContainer: {
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
        height: verticalScale(50),
        width: Dimensions.get('window').width - scale(100),
    }

});


