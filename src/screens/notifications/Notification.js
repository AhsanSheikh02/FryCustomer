import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, Text, Image, View, Button, ActivityIndicator, Alert, ScrollView, Dimensions, StyleSheet, FlatList, SectionList } from 'react-native';
import { CustomText } from '../../components/Text';
import { useAuth } from '../../redux/providers/auth';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
// import NotifService from './NotifService'
import Toast from 'react-native-tiny-toast';
import { colors } from '../../utils/constants';

export default function Notification(props) {
    const { navigation } = props;

    //1 - DECLARE VARIABLES
    const [is_data_found, setDataFound] = useState(false)

    const [notificationList, setNotificationList] = useState(
        [
            // {
            //     title: 'Order Notification',
            //     data: ['Order received', 'Order processed', 'Order completed', 'Monthly subscription payment slip', 'Notification 5',
            //         'Notification 6', 'Notification 7',]
            // },

            // {
            //     title: 'Event Notification',
            //     data: ['Live Event Started', 'Notification 2', 'Notification 3', 'Notification 4', 'Notification 5',
            //         'Notification 6', 'Notification 7',]
            // },

        ]
    )
    const { state, handleLogout, handleGetNotification } = useAuth();
    const user = state.user;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', e => {
            // Prevent default behavior
            callAPIforGetNotification()
            // Do something manually
            // ...
        });
        return unsubscribe;
    }, []);

    function callAPIforGetNotification() {
        Toast.showLoading("Please wait..")
        handleGetNotification()
            .then((response) => {
                Toast.hide()
                console.log("GetNotification-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setNotificationList(response.data)
                    if (response.data[0].data.length == 0 && response.data[1].data.length == 0) {
                        setDataFound(true)
                    }
                }
            })
            .catch((error) => {
                setDataFound(true)
                Toast.hide()
                console.log(error.message);
                Toast.show(error.message)
            })

    }
    function render({ item, index }) {
        return <TouchableOpacity activeOpacity={0.8} onPress={() => item.order_id ? navigation.navigate("OrderDetails", { orderData: item })
            : navigation.navigate("EventDetails", { item })} >
            <View style={{
                width: Dimensions.get('window').width - scale(10), justifyContent: 'center',
                flexDirection: 'row', alignItems: "center", margin: moderateScale(5)
            }}>
                <View width={"20%"}>
                    <Image style={styles.ImageContainer} source={{ uri: item.order_image ? item.order_image : item.event_image }}></Image>
                </View>
                <View width={"80%"}>
                    <CustomText style={{ color: colors.secondary_color, fontSize: moderateScale(14), }}>{item.message}</CustomText>
                </View>
            </View>
        </TouchableOpacity >

    }

    function renderSectionHeader({ section }) {
        return section.data.length > 0 ? <View style={[styles.LineStyle, { height: verticalScale(35), opacity: 0.8, justifyContent: 'center', }]}>
            <CustomText bold style={{ fontSize: moderateScale(16), marginLeft: moderateScale(10), color: colors.secondary_color }}>{section.title}</CustomText>
        </View> : console.log("")
    }


    return (
        <View style={styles.MainContainer}>
            {/* ------------------CenterView ----------------- */}
            <View style={styles.CenterView} >
                {/* ------------------ SubContainer ----------------- */}
                <View style={styles.SubContainer}>

                    {!is_data_found ? <SectionList
                        sections={notificationList}
                        renderItem={render}
                        renderSectionHeader={renderSectionHeader}
                        keyExtractor={(item, index) => index}
                    />
                        : <View style={styles.NoReordContainer}>
                            <CustomText style={styles.textContainer}>No Data Found</CustomText>
                        </View>}

                </View>
            </View>
            {/* <CustomText style={styles.textContainer}>Under Development</CustomText> */}
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
    LineStyle: {
        height: 1,
        // marginTop: 10,
        backgroundColor: colors.main_color,
        width: Dimensions.get('window').width
    },
    ImageContainer: {
        width: moderateScale(60),
        height: moderateScale(50),
        margin: moderateScale(5),
        // tintColor: colors.secondary_color
    },
    textContainer: {
        fontSize: moderateScale(20)
    },
    NoReordContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        marginTop: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
});

