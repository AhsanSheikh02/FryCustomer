import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, TextInput, Text, Linking, View, Image, Button, TouchableOpacity, StyleSheet, Dimensions, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import HomeCell from './HomeCell'
import { CustomText } from '../../components/Text';
import ViewPager from '@react-native-community/viewpager';
import { colors, config, fonts } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CategoryCell from './CategoryCell'
import Toast from 'react-native-tiny-toast';

export default function VideoList(props) {
    let { videoLists, route } = props
    const { navigation } = props;
    console.log("route", route)
    // const { navigate } = navigation;
    const { state, handleLogout, handleVideoList } = useAuth();
    const user = state.user;
    console.log("user", user)
    //1 - DECLARE VARIABLES
    const [subCategory_id, SetSubCategoryId] = useState(route.name == "VideoList" ? route.params.subCategory_id : null);
    const [category_id, SetCategoryId] = useState(route.name == "VideoList" ? route.params.category_id : null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(100);
    const [group_name, setGroupName] = useState(route.name == "VideoList" ? route.params.name : null);
    const [category, SetCategory] = useState("");
    const [videoList, SetVideoList] = useState([])

    useEffect(() => {
        if (route.name == "VideoList") {
            callApiforVideos()
        }
    }, [route]);

    function render({ item, index }) {
        return <HomeCell
            onPressDetails={() => checkSubscription(item, false)}
            onPress={() => checkSubscription(item, true)}
            source={item.video_thumbnail}
            videoTitle={item.title}
            description={item.description}
            benefits={item.benefits} />
    }

    function checkSubscription(item, playVideo) {
        console.log("sub: ", user.name)
        if (user && user.subscribe == 1) {
            // if (playVideo) {
            //     navigation.navigate('VideoScreen', { item })
            // } else {
            navigation.navigate('VideoDetailsScreen', { item })
            // } 
        } else {
            Alert.alert(
                "Subscribe now",
                "You haven't subscribed to any plan yet. please subscribe to use this feature",
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    },
                    {
                        text: 'OK', onPress: () => {
                            navigation.navigate('SubscriptionPage', { insideApp: true })
                        }
                    }
                ],
                { cancelable: false }
            )
        }
    }

    function itemSeparatorComponent() {
        return <View style={styles.LineStyle} />
    }

    function callApiforVideos() {
        Toast.showLoading("Please wait..")
        handleVideoList(category_id, subCategory_id, group_name, page, perPage)
            .then((response) => {
                Toast.hide()
                console.log("res: ", response)
                if (response.status == 1) {
                    response.data
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((item, i) => console.log("data", item));
                    SetVideoList(response.data)
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
            <View style={styles.CenterView}>

                {/* ------------Video List------------- */}
                <FlatList
                    data={route.name == "VideoList" ? videoList : videoLists}
                    renderItem={render}
                    style={{ flex: 1 }}
                    //  ItemSeparatorComponent={itemSeparatorComponent}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>

            {/* {route.name == "VideoList" && videoList.length == 0
                || videoLists.length == 0
                ? <View style={styles.NoReordContainer}>
                    <CustomText style={styles.textContainer}>No Video Found</CustomText>
                </View>
                : <View />} */}

        </View >
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
    TextContainer1: {
        fontSize: moderateScale(14),
        color: colors.accent_color,
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
        fontFamily: fonts.opensans_light,
    },
    LineStyle: {
        height: verticalScale(1),
        marginTop: moderateScale(10),
        marginBottom: moderateScale(5),
        backgroundColor: colors.accent_color,
    },
    textContainer: {
        fontSize: moderateScale(20)
    },
    HeaderText: {
        fontSize: moderateScale(24),
        color: colors.main_color,
        textAlign: 'center'
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