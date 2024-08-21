import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, TextInput, Text, Linking, View, Image, Button, TouchableOpacity, StyleSheet, Dimensions, FlatList, KeyboardAvoidingView } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import HomeCell from './HomeCell'
import { CustomText } from '../../components/Text';
import ViewPager from '@react-native-community/viewpager';
import { colors, config, fonts } from '../../utils/constants';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CategoryCell from './CategoryCell'
import Toast from 'react-native-tiny-toast';
export default function CategoryList(props) {
    const { navigation, route } = props;
    // const { navigate } = navigation;

    const { state, handleLogout, handleSubCategoryList, handleGroupList } = useAuth();
    const user = state.user;

    //1 - DECLARE VARIABLES
    const [subCatLoaded, setSubCatLoaded] = useState(false);
    const [subCategory_id, SetSubCategoryId] = useState("");
    const [category_id, SetCategoryId] = useState(route.params.item.id);
    const [subCategoryList, SetSubCategoryList] = useState([])
    const [groupList, setGroupList] = useState([])

    useEffect(() => {
        if (!subCatLoaded) {
            callApiforSubCategory()
        }
    }, []);

    function onPressSubCategory(item, index) {
        console.log("subCategoryList1", subCategoryList)
        let marker = subCategoryList.map(el => (
            el.id === item.id ? { ...el, isSelected: "1" } : { ...el, isSelected: "0" }
        ))
        SetSubCategoryList(marker)
        SetSubCategoryId(item.id)
        setGroupList([])
        callApiforGroupList(item.id)
    }

    function callApiforSubCategory() {
        Toast.showLoading("Please wait..")
        handleSubCategoryList(category_id)
            .then((response) => {
                setSubCatLoaded(true)
                Toast.hide()
                // console.log("res: ", response)
                if (response.status == 1) {
                    response.data
                        .sort((a, b) => a.subcategory_name.localeCompare(b.subcategory_name))
                        .map((item, i) => console.log("data", item));


                    // Toast.showSuccess(response.message)
                    for (var i = 0; i < response.data.length; i++) {
                        var datum = response.data[i];
                        if (i == 0) {
                            var newNum = "isSelected";
                            var newVal = "1";
                            datum[newNum] = newVal;
                            onPressSubCategory(datum, i)
                        } else {
                            var newNum = "isSelected";
                            var newVal = "0";
                            datum[newNum] = newVal;
                        }
                    }
                    SetSubCategoryList(response.data)
                }
            })
            .catch((error) => {
                setSubCatLoaded(true)
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
    }

    function callApiforGroupList(subcategory_id) {
        Toast.showLoading("Please wait..")
        handleGroupList(category_id, subcategory_id)
            .then((response) => {
                Toast.hide()
                // console.log("GroupList-res: ", response)
                if (response.status == 1) {
                    response.data
                        .sort((a, b) => a.group_name.localeCompare(b.group_name))
                        .map((item, i) => console.log("data", item));

                    setGroupList(response.data)
                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
    }


    function render({ item, index }) {
        return <TouchableOpacity activeOpacity={0.8} onPress={() => onPressSubCategory(item, index)} style={{ justifyContent: 'center' }}>
            <View style={[styles.viewContainer1, { backgroundColor: item.isSelected == "0" ? colors.secondary_color : colors.main_color }]}>
                <CustomText style={[styles.TextContainer1, { color: item.isSelected == "0" ? colors.main_color : colors.secondary_color }]}>{item.subcategory_name}</CustomText>
            </View>
        </TouchableOpacity>
    }

    function videoRender({ item, index }) {
        return <CategoryCell
            videoTitle={item.group_name}
            source={{ uri: item.group_image }}
            onPress={() => navigation.navigate("VideoList", { name: item.group_name, category_id: category_id, subCategory_id: subCategory_id })} />
    }

    return (
        <View style={styles.MainContainer}>
            <View style={styles.CenterView}>

                {/* ------------Category List------------- */}
                <View>
                    {subCategoryList.length > 0 ? <FlatList
                        data={subCategoryList}
                        renderItem={render}
                        style={{ backgroundColor: colors.secondary_color }}
                        // numColumns={3}
                        // columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, }}
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                    /> : subCatLoaded ? <View style={styles.NoReordContainer}>
                        <CustomText style={styles.textContainer}>No Data Found</CustomText>
                    </View> : <View />}
                </View>

                <View height={10} />
                {groupList.length > 0 ? <FlatList
                    data={groupList}
                    renderItem={videoRender}
                    style={{ flex: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                /> : subCatLoaded && subCategoryList.length > 0 ? <View style={styles.NoReordContainer}>
                    <CustomText style={styles.textContainer}>No Data Found</CustomText>
                </View> : <View />}
            </View>
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
    HeaderText: {
        fontSize: moderateScale(24),
        color: colors.main_color,
        textAlign: 'center'
    },
    TextContainer1: {
        fontSize: moderateScale(12),
        color: colors.accent_color,
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
        fontFamily: fonts.opensans_light,
    },
    viewContainer: {
        backgroundColor: 'white',
        // width: Dimensions.get('window').width,
        // margin: moderateScale(5),
        //  height: verticalScale(200),
    },

    viewContainer1: {
        backgroundColor: 'white',
        //  width: scale(90),
        borderColor: colors.main_color,
        borderWidth: moderateScale(1),
        margin: moderateScale(5),
        padding: moderateScale(5),
        paddingLeft: moderateScale(10),
        paddingRight: moderateScale(10),
        borderRadius: moderateScale(20),
        justifyContent: 'center',
        height: verticalScale(30),
        marginTop: moderateScale(5),
        marginBottom: moderateScale(10),
    },
    NoReordContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 200,
        bottom: 200,
        alignItems: 'center',
        justifyContent: 'center',
        //  backgroundColor: 'transparent'
    },
    textContainer: {
        fontSize: moderateScale(20)
    },

});