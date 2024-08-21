import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, ScrollView, Text, View, Button, StyleSheet, Dimensions, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import { useAuth } from '../../redux/providers/auth';
import EventCell from './EventCell'
import { colors } from '../../utils/constants';
import { CustomText } from '../../components/Text';
import Toast from 'react-native-tiny-toast';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import moment from "moment";
import Event2Cell from './Event2Cell';

const ALL_EVENTS_TAB = 0
const SIGNED_EVENTS_TAB = 1
const PAST_EVENTS_TAB = 3

const AllEventRoute = ({ allEventList, render, itemSeparatorComponent }) => {
    return (
        <FlatList
            data={allEventList}
            renderItem={render}
            style={{ flex: 1 }}
            ItemSeparatorComponent={itemSeparatorComponent}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}

const SignedEventRoute = ({ signedEventList, render, itemSeparatorComponent }) => {
    return (
        <FlatList
            data={signedEventList}
            renderItem={render}
            style={{ flex: 1 }}
            ItemSeparatorComponent={itemSeparatorComponent}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}

const PastEventRoute = ({ pastEventList, render, itemSeparatorComponent }) => {
    return (
        <FlatList
            data={pastEventList}
            renderItem={render}
            style={{ flex: 1 }}
            ItemSeparatorComponent={itemSeparatorComponent}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}

export default function Event(props) {
    const { navigation, route } = props;
    console.log('route', route)
    const { state, handleLogout, handleEventList, handleJoindEventList, handlePastEventList } = useAuth();
    const user = state.user;

    //1 - DECLARE VARIABLES
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(100);
    const [selectedTab, setSelectedTab] = useState(ALL_EVENTS_TAB);
    const [is_data, setIsData] = useState(route.params ? route.params.data.is_data : "");
    const [allEventList, setAllEventList] = useState([])
    const [signedEventList, setSignedEventList] = useState([])
    const [pastEventList, setPastEventList] = useState([])

    useEffect(() => {
        callApiforEventList(2)
        callApiforJoinedEventList()
        callApiforPastEventList()
        // navigation.addListener('focus', () => {
        //     callApiforEventList()
        // });

        // if (selectedTab == ALL_EVENTS_TAB) {
        //     callApiforEventList()
        // } else {
        //     callApiforJoinedEventList()
        // }
    }, [is_data]);

    function render({ item, index }) {
        // console.log("event: ", item)
        let event_date, date, time;
        date = moment(item.start_date).format("MMM-DD-YYYY")
        time = moment(item.start_date).format("hh:mm A")
        event_date = date + "\n" + time

        return <EventCell
            item={item}
            selectedTab={selectedTab}
            eventCategory={item.category_name}
            source={item.event_image}
            eventTitle={item.title}
            eventDate={event_date}
            joined={selectedTab == 1 ? 1 : item.joined}
            onPress={() => checkSubscription(item)}
            onPressVideo={() => item.event_status == 1 ? navigation.navigate("VideoScreen", { eventData: item })
                : item.event_status == 2 ? navigation.navigate("LiveVideoRecordScreen", { eventData: item })
                    : console.log("")
            }
        />
    }

    function renderPastEvent({ item, index }) {
        // console.log("event: ", item)
        let event_date, date, time;
        date = moment(item.start_date).format("MMM-DD-YYYY")
        time = moment(item.start_date).format("hh:mm A")
        event_date = date + "\n" + time

        return <Event2Cell
            item={item}
            eventDate={event_date}
            onPress={() => navigation.navigate("PastEventDetails", { eventData: item })}
            onPressVideo={() => navigation.navigate("PastEventDetails", { eventData: item })}
        />
    }

    function checkSubscription(item) {
        console.log("sub: ", user.subscribe)
        if (user && user.subscribe == 1) {
            navigation.navigate("EventDetails", {
                item, selectedTab, shouldRefresh: () => {
                    refreshList()
                }
            })
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

    function changeEventList(value) {
        setSelectedTab(value)
        refreshList(value)
    }

    function refreshList(selectedTab) {
        switch (selectedTab) {
            case ALL_EVENTS_TAB:
                callApiforEventList(1)
                break
            case SIGNED_EVENTS_TAB:
                callApiforJoinedEventList()
                break
            case PAST_EVENTS_TAB:
                callApiforPastEventList()
                break
            default:
                break
        }
    }

    function callApiforJoinedEventList() {
        // Toast.showLoading("Please wait..")
        handleJoindEventList(page, perPage)
            .then((response) => {
                Toast.hide()
                // console.log("JoinedEventList-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setSignedEventList(response.data)

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
    }

    function callApiforPastEventList() {
        // Toast.showLoading("Please wait..")
        handlePastEventList(page, perPage)
            .then((response) => {
                Toast.hide()
                // console.log("PastEventList-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setPastEventList(response.data)

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
    }

    function callApiforEventList(value) {
        if (value == 2)
            Toast.showLoading("Please wait..")
        handleEventList(page, perPage)
            .then((response) => {
                Toast.hide()
                // console.log("EventList-res: ", response)
                if (response.status == 1) {
                    // Toast.showSuccess(response.message)
                    setAllEventList(response.data)

                }
            })
            .catch((error) => {
                Toast.hide()
                console.log(error.message);
                // Toast.show(error.message)
            })
    }

    function renderTabPage() {
        switch (selectedTab) {
            case ALL_EVENTS_TAB:
                return <AllEventRoute
                    allEventList={allEventList}
                    render={render}
                />
            case SIGNED_EVENTS_TAB:
                return <SignedEventRoute
                    signedEventList={signedEventList}
                    render={render}
                />
            case PAST_EVENTS_TAB:
                return <PastEventRoute
                    pastEventList={pastEventList}
                    render={renderPastEvent}
                />
            default:
                return <View />
        }
    }

    return (
        <View style={styles.MainContainer}>
            {/* ------------------CenterView ----------------- */}
            <View style={styles.CenterView} >
                <View style={{ backgroundColor: colors.secondary_color, paddingBottom: moderateScale(10), flexDirection: "row" }}>
                    <View style={styles.ViewContainer}>
                        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => changeEventList(ALL_EVENTS_TAB)}>
                            <View style={[styles.ViewContainer1, selectedTab == ALL_EVENTS_TAB ? { backgroundColor: colors.main_color, borderBottomLeftRadius: 30, borderTopLeftRadius: 30 } : {}]}>
                                <CustomText style={[styles.TextContainer], { color: selectedTab == ALL_EVENTS_TAB ? colors.secondary_color : colors.main_color }}>Events</CustomText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => changeEventList(SIGNED_EVENTS_TAB)}>
                            <View style={[styles.ViewContainer1, selectedTab == SIGNED_EVENTS_TAB ? { backgroundColor: colors.main_color } : {}]}>
                                <CustomText style={[styles.TextContainer], { color: selectedTab == SIGNED_EVENTS_TAB ? colors.secondary_color : colors.main_color }}>My Events</CustomText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => changeEventList(PAST_EVENTS_TAB)}>
                            <View style={[styles.ViewContainer1, selectedTab == PAST_EVENTS_TAB ? { backgroundColor: colors.main_color, borderTopRightRadius: 30, borderBottomRightRadius: 30 } : {}]}>
                                <CustomText style={[styles.TextContainer], { color: selectedTab == PAST_EVENTS_TAB ? colors.secondary_color : colors.main_color }}>Past Events</CustomText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View height={10} />
                {renderTabPage()}
                <View height={10} />
            </View>
            {allEventList.length == 0 && selectedTab == ALL_EVENTS_TAB
                || signedEventList.length == 0 && selectedTab == SIGNED_EVENTS_TAB
                || pastEventList.length == 0 && selectedTab == PAST_EVENTS_TAB
                ? <View style={styles.NoReordContainer}>
                    <CustomText style={styles.textContainer}>No Event Found</CustomText>
                </View>
                : <View />}
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
    LineStyle: {
        height: verticalScale(1),
        marginTop: moderateScale(5),
        marginBottom: moderateScale(5),
        backgroundColor: colors.border_color,
    },
    ViewContainer: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: moderateScale(30),
        height: verticalScale(35),
        borderWidth: moderateScale(1),
        borderColor: colors.main_color,
        // width: Dimensions.get('window').width - moderateScale(60),
        marginLeft: moderateScale(25),
        marginRight: moderateScale(25),
        justifyContent: 'center',
        alignItems: 'center',
    },
    ViewContainer1: {
        flex: 1,
        height: verticalScale(35),
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextContainer: {
        textAlign: 'center',
        fontSize: moderateScale(15),
    },
    textContainer: {
        fontSize: moderateScale(20)
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
