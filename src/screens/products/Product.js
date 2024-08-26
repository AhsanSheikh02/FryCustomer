import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Toast from 'react-native-tiny-toast';
import { CustomText } from '../../components/Text';
import { useAuth } from '../../redux/providers/AuthProvider';
import ProductCell from './ProductCell';
export default function Product(props) {
    const { navigation } = props;

    const { state, handleLogout, handleEventList, handleProductList } = useAuth();
    const user = state.user;

    //1 - DECLARE VARIABLES
    const [productList, setProductList] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(100);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', e => {
            // Prevent default behavior
            callApiforProductList()
            // Do something manually
            // ...
        });
        return unsubscribe;
    }, []);


    function callApiforProductList() {
        Toast.showLoading("Please wait..")
        handleProductList(page, perPage)
            .then((response) => {
                Toast.hide()
                console.log("ProductList-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setProductList(response.data)

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
    }

    function render({ item, index }) {
        return <ProductCell
            source={item.images[0]}
            productTitle={item.name}
            productPrice={item.price}
            onPress={() => navigation.navigate("ProductDetails", { item: item })} />

    }



    return (
        <View style={styles.MainContainer}>
            {/* ------------------CenterView ----------------- */}
            <View style={styles.CenterView} >


                <View height={10} />

                {productList.length > 0 ? <FlatList
                    data={productList}
                    renderItem={render}
                    style={{ flex: 1 }}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                /> : <View style={styles.NoReordContainer}>
                    <CustomText style={styles.textContainer}>No Product Found</CustomText>
                </View>}

                <View height={10} />

            </View>



            {/* <CustomText style={styles.textContainer}>Under Development</CustomText> */}
        </View>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: 'white',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    CenterView: {
        flex: 1,
    },
    textContainer: {
        fontSize: 20
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

});
