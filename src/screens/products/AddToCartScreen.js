import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Text, View, Button, ActivityIndicator, Alert, FlatList, Modal } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import { CustomButton } from '../../components/Button';
import CartCell from './CartCell';
import { config } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import { colors } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-tiny-toast';


const TYPE_INCREASE = 1
const TYPE_DECREASE = 2

export default function AddToCartScreen(props) {
    const { navigation } = props;

    //1 - DECLARE VARIABLES
    const [price, setPrice] = useState(0);
    const [shippingCharge, setShippingCharge] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [page, setPage] = useState(1)
    const [per_page, setPerPage] = useState(10)
    const [showDelete, setShowDelete] = useState(false);
    const [image, setImage] = useState(require("../../../assets/images/yogamats.jpg"));
    const [name, setName] = useState("");
    const [deleteItem, setDeleteItem] = useState('')
    const [product_id, setProductId] = useState('')
    const { state, handleLogout, handleCartList, handleRemoveCart, handleEditCart } = useAuth();
    const user = state.user;

    const [productList, setProductList] = useState([])

    useEffect(() => {
        callApiforCartList()
    }, [])

    function onPressQuantity(item, index, value) {
        if (value == TYPE_INCREASE) {
            let productquantity = item.cart_quantity + 1
            let markers = [...productList];
            markers[index] = { ...markers[index], quantity: productquantity };
            callApiforEditCartList(item.id, productquantity)
            setProductList(markers)


        } else if (item.cart_quantity > 0) {
            let productquantity = item.cart_quantity - 1
            let markers = [...productList];
            markers[index] = { ...markers[index], quantity: productquantity };
            callApiforEditCartList(item.id, productquantity)
            setProductList(markers)

        } else {
            console.log("nothing to do")
        }


    }

    function callApiforEditCartList(product_id, quantity) {
        Toast.showLoading("Please wait..")
        handleEditCart(product_id, quantity)
            .then((response) => {
                Toast.hide()

                console.log("res123 ", response)
                if (response.status == 1) {
                    Toast.showSuccess(response.message)
                    setTimeout(() => {
                        callApiforCartList()
                    }, 2000)

                }
                // else{
                //     Toast.showSuccess(response.message)
                // }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    function callApiforCartList() {
        Toast.showLoading("Please wait..")
        handleCartList(page, per_page)
            .then((response) => {
                Toast.hide()
                console.log("CartList-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setProductList(response.data)
                    setTotalPrice(response.total_cart_value)
                    setShippingCharge(response.total_shipping_charge)
                    setPrice(response.total_cart_subtotal)

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })
    }

    function showDeleteDialog(item, index) {
        setDeleteItem(index)
        setImage(item.images[0])
        setName(item.name)
        setShowDelete(true)
        setProductId(item.id)
    }

    function deleteItems() {
        Toast.showLoading("Please wait..")
        handleRemoveCart(product_id)
            .then((response) => {
                Toast.hide()
                console.log("deleteItems-res: ", response)
                if (response.status == 1) {
                    Toast.showSuccess(response.message)
                    setTimeout(() => {
                        callApiforCartList()
                    }, 2000)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
        setShowDelete(false)

    }

    function render({ item, index }) {
        return <CartCell
            source={item.images[0]}
            quantity={item.cart_quantity}
            productTitle={item.name}
            productPrice={item.product_price}
            productQuantity={item.cart_quantity}
            onPressDown={() => onPressQuantity(item, index, TYPE_DECREASE)}
            onPressUp={() => onPressQuantity(item, index, TYPE_INCREASE)}
            onPressDelete={() => showDeleteDialog(item, index)} />
    }


    function itemSeparatorComponent() {
        return <View height={verticalScale(5)} />
    }


    return (
        <View style={styles.MainContainer}>
            {/* ------------------CenterView ----------------- */}
            <View style={styles.CenterView} >
                <View height={verticalScale(10)} />
                <FlatList
                    //ref={(ref) => this.flatList = ref}
                    data={productList}
                    renderItem={render}
                    ItemSeparatorComponent={itemSeparatorComponent}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View height={5} />
            </View>
            {productList.length > 0 ? <View style={styles.SubContainer}>

                {/* <View style={[styles.LineStyle, { height: verticalScale(2) }]} /> */}

                {/* <CustomText style={{ color: colors.secondary_color, alignSelf: 'center', fontWeight: 'bold', marginTop: moderateScale(10), fontSize: moderateScale(15) }}>Payment Details</CustomText> */}
                <View style={{ width: Dimensions.get('window').width, backgroundColor: '#f7f7f7', padding: moderateScale(10) }}>
                    <View style={{
                        marginLeft: moderateScale(10), marginRight: moderateScale(10), justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}>
                        <CustomText style={styles.TextContainer1}>Sub Total</CustomText>
                        <CustomText style={styles.TextContainer1}>{config.currency}{price}</CustomText>
                    </View>

                    <View style={{
                        marginLeft: moderateScale(10), marginRight: moderateScale(10), justifyContent: 'space-between',
                        flexDirection: 'row', marginTop: moderateScale(12)
                    }}>
                        <CustomText style={[styles.TextContainer1, { color: 'grey' }]}>Shipping Charges</CustomText>
                        <CustomText style={[styles.TextContainer1, { color: 'grey' }]}>{config.currency}{shippingCharge}</CustomText>
                    </View>
                </View>
                {/* <View style={{ marginLeft: moderateScale(10), marginRight: moderateScale(10), height: verticalScale(1), backgroundColor: 'lightgrey', marginTop: moderateScale(10) }} /> */}

                <View style={{
                    marginLeft: moderateScale(20), marginRight: moderateScale(20), justifyContent: 'space-between',
                    flexDirection: 'row', marginTop: moderateScale(10)
                }}>
                    <CustomText style={styles.TextContainer4}>Total</CustomText>
                    <CustomText style={styles.TextContainer4}>{config.currency}{totalPrice}</CustomText>
                </View>

                <View height={verticalScale(20)} />

                <CustomButton buttonStyle={{ elevation: 0, backgroundColor: colors.secondary_color, padding: moderateScale(8), width: Dimensions.get("window").width / scale(1.3), alignSelf: 'center' }}
                    textStyle={{ color: colors.main_color }}
                    title="PLACE ORDER" onPress={() => {
                        console.log("PLACE ORDER")
                        navigation.navigate('AddressScreen')
                    }} />
            </View>
                : <View style={styles.ViewContainer2}>
                    <Image style={{ height: verticalScale(30), width: scale(30), tintColor: colors.secondary_color }} source={require('../../../assets/images/cart.png')} />
                    <CustomText style={styles.TextContainer2}>Cart is Empty.</CustomText>
                </View>}
            {/* ------------------ Delete Dialog ----------------- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showDelete}
                onRequestClose={() => {
                    setShowDelete(false)
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: moderateScale(10), backgroundColor: 'rgba(10, 10, 10, 0.7)' }}>
                    <View style={{
                        width: Dimensions.get('window').width - scale(50), backgroundColor: '#f7f7f7', justifyContent: 'flex-start',
                        alignItems: 'center', paddingLeft: moderateScale(10), paddingRight: moderateScale(10),
                        paddingTop: moderateScale(10), borderRadius: moderateScale(5)
                    }}>
                        <CustomText style={{
                            fontSize: moderateScale(15), padding: moderateScale(5), fontWeight: 'bold', textAlign: 'center', alignSelf: 'center', color: colors.secondary_color
                        }}>REMOVE PRODUCT FROM CART?</CustomText>
                        <View style={[styles.LineStyle, { width: Dimensions.get('window').width - scale(50), height: 2 }]} />

                        <View style={{ marginTop: moderateScale(10), marginBottom: moderateScale(5), flexDirection: 'row', justifyContent: 'center', width: "100%" }}>
                            <View alignItems="center" justifyContent="center" width={"40%"}>
                                <Image style={{
                                    height: verticalScale(50), width: scale(80),
                                    resizeMode: 'cover', borderRadius: moderateScale(10), alignSelf: 'center'
                                }}
                                    source={{ uri: image }} />
                            </View>

                            <View style={{ justifyContent: 'center', height: verticalScale(65), width: "60%" }}>
                                <CustomText ellipsizeMode={'tail'} numberOfLines={2} style={{
                                    fontSize: moderateScale(14), fontWeight: 'bold', color: colors.secondary_color,
                                }}>{name}</CustomText>
                            </View>
                        </View>
                        <View style={[styles.LineStyle, { width: Dimensions.get('window').width - scale(50), height: verticalScale(2) }]} />
                        <View style={{
                            flexDirection: 'row', justifyContent: 'flex-start', height: verticalScale(35),
                            width: Dimensions.get('window').width - scale(50), alignItems: 'center', backgroundColor: colors.secondary_color
                        }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowDelete(false)}>
                                <View style={styles.ViewContainer1}>
                                    <CustomText style={{ alignSelf: 'center', color: colors.main_color }}>Cancel</CustomText>
                                </View>
                            </TouchableOpacity>
                            <View style={{ height: verticalScale(35), width: scale(1), backgroundColor: colors.main_color, }} />
                            <TouchableOpacity activeOpacity={0.8} onPress={() => deleteItems()} >
                                <View style={styles.ViewContainer1}>
                                    <CustomText style={{ alignSelf: 'center', color: colors.main_color }}>Remove</CustomText>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View height={verticalScale(20)} />
        </View>
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
    LineStyle: {
        height: verticalScale(1),
        marginTop: moderateScale(5),
        // marginBottom:5,
        // width:Dimensions.get("window").width,
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
        backgroundColor: colors.main_color,
    },
    TextContainer1: {
        color: 'black',
        fontSize: moderateScale(17),
    },
    ViewContainer1: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: (Dimensions.get('window').width - scale(50)) / 2
    },
    TextContainer2: {
        fontSize: moderateScale(20),
        color: colors.secondary_color,
        textAlign: 'center',
        marginTop: moderateScale(5),
        //   fontWeight:'bold'
    },
    ViewContainer2: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 60,
        bottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    }, ImageContainer: {
        height: verticalScale(22),
        width: scale(22),
        alignSelf: 'center'
    }, TextContainer3: {
        color: 'grey',
        fontSize: moderateScale(17),
        marginLeft: moderateScale(15),
    }, TextContainer4: {
        fontWeight: 'bold',
        fontSize: moderateScale(17),
        color: colors.secondary_color
    }

});

