import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, Image, Text, View, Button, ActivityIndicator, ImageBackground, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { CustomButton } from '../../components/Button';
import ViewPager from '@react-native-community/viewpager';
import ImageDialog from '../../components/ImageDialog';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, config } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-tiny-toast';

export default function ProductDetails(props) {
    const { navigation } = props;
    const { item } = props.route.params;
    //1 - DECLARE VARIABLES
    const [showImageDialog, SetImageDialog] = useState(false);
    const [imageUrl, SetImageUrl] = useState("");
    const [product_id, SetProductId] = useState(item.id);
    const [productData, setProductData] = useState('')
    const { state, handleLogout, handleProductDetails, handleAddToCart } = useAuth();
    const [isBannerLoaded, setBannerLoaded] = useState(false)

    const user = state.user;

    // let productImage = [{
    //     image: require("../../../assets/images/yogamat.jpg")
    // }, {
    //     image: require("../../../assets/images/yogamats.jpg")
    // }, {
    //     image: require("../../../assets/images/yoga.jpg")
    // }]

    useEffect(() => {
        callApiforProductDetails()
    }, []);


    function callApiforProductDetails() {
        setBannerLoaded(false)
        Toast.showLoading("Please wait..")
        handleProductDetails(product_id)
            .then((response) => {
                Toast.hide()
                console.log("ProductDetails-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setProductData(response.data)
                    setBannerLoaded(true)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
    }

    function enlargeImage(image) {
        SetImageDialog(true)
        SetImageUrl(image)
    }

    function callApiAddtoCart() {
        Toast.showLoading("Please wait..")
        handleAddToCart(product_id, 1)
            .then((response) => {
                Toast.hide()
                console.log("AddtoCart-res: ", response)
                if (response.status == 1) {
                    Toast.showSuccess(response.message)
                    setTimeout(() => {
                        navigation.navigate("Addtocart")
                    }, 1000)

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })


    }

    return (
        // <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.MainContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>
                {/* ------------------CenterView ----------------- */}
                <View style={styles.CenterView} >
                    {/* ------------------ SubContainer ----------------- */}
                    {isBannerLoaded ? <ViewPager
                        showPageIndicator={true}
                        style={{ height: Dimensions.get('window').height / verticalScale(2) - verticalScale(50), width: Dimensions.get('window').width }}
                    >

                        {productData.images.map((element, index) => {
                            return (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => enlargeImage(element)}>
                                    <View key={index} style={{ borderColor: 'grey', height: Dimensions.get('window').height / verticalScale(2) - verticalScale(50), width: Dimensions.get('window').width }} >
                                        <Image style={{ resizeMode: 'cover', height: Dimensions.get('window').height / verticalScale(2) - verticalScale(50), width: Dimensions.get('window').width }}
                                            source={{ uri: element }} defaultSource={require("../../../assets/images/placeholder.png")} />
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </ViewPager> : <View style={{ borderColor: 'grey', height: Dimensions.get('window').height / verticalScale(2) - verticalScale(50), width: Dimensions.get('window').width }} >
                        <Image style={{ resizeMode: 'cover', height: Dimensions.get('window').height / verticalScale(2) - verticalScale(50), width: Dimensions.get('window').width }}
                            defaultSource={require("../../../assets/images/placeholder.png")} />
                    </View>}

                    <View height={verticalScale(10)} />
                    <View style={{ width: Dimensions.get('window').width - scale(30), marginLeft: moderateScale(15), marginRight: moderateScale(15), alignItems: 'center' }}>
                        <View style={{
                            padding: moderateScale(10), width: Dimensions.get('window').width, height: verticalScale(60), elevation: 5,
                            alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f7f7'
                        }}>
                            <View style={{ alignItems: 'center', marginLeft: moderateScale(5), marginRight: moderateScale(5), flexDirection: 'row', width: "100%", justifyContent: 'center' }}>
                                <View width="85%">
                                    <CustomText bold ellipsizeMode={'tail'} numberOfLines={2} style={styles.TextContainer}>{productData.name}</CustomText>
                                </View>
                                <View width="15%">
                                    <CustomText style={styles.TextContainer}>Price</CustomText>
                                    <CustomText bold style={[styles.TextContainer2, { fontSize: moderateScale(18) }]}>{config.currency}{productData.price}</CustomText>
                                </View>
                            </View>
                        </View>

                        <View height={verticalScale(20)} />

                        <CustomText bold style={styles.TextContainer1}>Product Benefits</CustomText>
                        <View height={verticalScale(5)} />
                        <View style={{ alignSelf: 'flex-start' }}>
                            <CustomText style={styles.TextContainer3}>{productData.benefits}</CustomText>
                        </View>
                        <View height={verticalScale(20)} />

                        <CustomText bold style={styles.TextContainer1}>Size & Fit</CustomText>
                        <View height={verticalScale(5)} />
                        <CustomText style={styles.TextContainer3}>{productData.size} </CustomText>

                        <View height={verticalScale(20)} />

                        <View style={{ alignSelf: 'flex-start' }}>
                            <CustomText bold style={styles.TextContainer1}>Product Description</CustomText>
                            <View height={verticalScale(5)} />
                            <CustomText style={styles.TextContainer3}>{productData.description}</CustomText>
                        </View>
                    </View>

                    <View height={verticalScale(20)} />

                </View>
            </ScrollView>
            <TouchableOpacity activeOpacity={0.8} style={{ margin: moderateScale(14), position: "absolute", left: 0 }} onPress={() => navigation.pop()}>
                <Image style={{ height: verticalScale(36), width: scale(36), resizeMode: 'contain', tintColor: colors.main_color, marginTop: 20, marginLeft: 10 }} source={require("../../../assets/images/left.png")} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => callApiAddtoCart()}>
                <Image style={{ height: verticalScale(50), width: Dimensions.get("window").width, }} source={require('../../../assets/images/addtocartbutton.png')} />

            </TouchableOpacity>
            <ImageDialog
                showDialog={showImageDialog}
                image={imageUrl}
                closeDialog={() => {
                    SetImageDialog(false)
                }}
            />


        </View>
        // </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    CenterView: {
        flex: 1,
    },
    TextContainer: {
        //  alignSelf: 'flex-start',
        // textAlign: 'justify',
        fontSize: moderateScale(17),
        //fontWeight: 'bold',
        width: Dimensions.get('window').width - scale(90),
        color: colors.secondary_color
    },
    LineStyle: {
        width: Dimensions.get('window').width,
        height: verticalScale(2),
        backgroundColor: 'lightgray',
    },
    TextContainer1: {
        fontSize: moderateScale(16),
        //fontWeight: 'bold',
        alignSelf: 'flex-start',
        color: colors.secondary_color
    },
    TextContainer2: {
        color: colors.border_color,
        fontSize: moderateScale(14),
        width: Dimensions.get('window').width - scale(80),
        alignSelf: 'flex-start',
    },
    TextContainer3: {
        fontSize: moderateScale(12),
        // marginTop: moderateScale(1),
        color: colors.border_color,
        textAlign: 'justify',
        alignSelf: 'flex-start',
        // marginLeft: moderateScale(12),
        marginRight: moderateScale(15)
    },

});

