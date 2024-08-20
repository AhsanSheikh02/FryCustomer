import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, TouchableOpacity, FlatList, Dimensions, StyleSheet, Text, View, Button, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import MyOrderCell from './MyOrderCell';
import { colors } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import moment from "moment";
import Toast from 'react-native-tiny-toast';
export default function MyOrderScreen(props) {
    const { navigation } = props;

    //1 - DECLARE VARIABLES
    const [orderList, setOrderList] = useState([])

    const { state, handleLogout, handleGetOrder } = useAuth();
    const user = state.user;

    useEffect(() => {
        callApiforGetOrder()
    }, [])


    function render({ item, index }) {
        let order_date;
        order_date = moment(item.created_at).format("MMM DD, YYYY")

        return <MyOrderCell
            orderId={item.order_no}
            orderList={item.product}
            totalPrice={item.total_amount}
            deliveryDate={order_date}
            productQuantity={item.quantity}
            onPress={() => navigation.navigate("OrderDetails", { orderData: item })}
        />
    }


    function callApiforGetOrder() {
        Toast.showLoading("Please wait..")
        handleGetOrder()
            .then((response) => {
                Toast.hide()
                console.log("GetOrder-res: ", response)
                if (response.status == 1) {
                    setOrderList(response.data)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }



    return (
        <View style={styles.MainContainer}>
            {/* ------------------CenterView ----------------- */}
            <View style={styles.CenterView} >

                <FlatList
                    //ref={(ref) => this.flatList = ref}
                    data={orderList}
                    renderItem={render}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View height={10} />
            </View>
            {orderList.length == 0
                ? <View style={styles.NoReordContainer}>
                    <CustomText style={styles.textContainer}>No Data Found</CustomText>
                </View>
                : <View />}
        </View>
    );
}
const styles = StyleSheet.create({
    MainContainer: {
        width: Dimensions.get('window').width,
        flex: 1,
        marginTop: 0,
        marginLeft: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    CenterView: {
        width: Dimensions.get('window').width,
        flex: 1,
        backgroundColor: 'transparent',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    SubContainer: {
        width: Dimensions.get('window').width,
        marginTop: 0,
        marginLeft: 0,
        marginLeft: 0,
        backgroundColor: 'transparent',
    },
    NoReordContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 60,
        bottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    textContainer: {
        fontSize: moderateScale(20)
    },


});


