import { GoogleSignin } from '@react-native-community/google-signin';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, Image, Platform, TouchableOpacity } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import * as RNIap from 'react-native-iap';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-tiny-toast';
import { useAuth } from '../../redux/providers/AuthProvider';
import fetch from '../../services/fetch';
import { colors, GET_SUBSCRIPTION_LIST, IAP_PAYMENT } from '../../utils/constants';
import EditProfile from '../auth/EditProfile';
import Event from '../events/Event';
import Notification from '../notifications/Notification';
import Product from '../products/Product';
import Setting from '../settings/Setting';
import CategoryList from './CategoryList';
import Home from './Home';
import VideoList from './VideoList';

const HomeStack = createStackNavigator();
const EventStack = createStackNavigator();
const StoreStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const SettingStack = createStackNavigator();

{/* ------------------ home ----------------- */ }
function HomeStackScreen(props) {
    const { handleLogout } = useAuth();
    const { navigation } = props;

    function showLogoutDialog() {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                {
                    text: 'NO',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'YES',
                    onPress: () => {
                        logout();
                    },
                },
            ],
            { cancelable: false },
        );
    }

    async function logout() {
        await handleLogout();
        configurationGoogleSignin();
        await signOutFromGoogle();
        signOutFromFacebook();
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Login' },
                ],
            })
        );
    }

    function configurationGoogleSignin() {
        GoogleSignin.configure({
            //  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: '', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            // hostedDomain: '', // specifies a hosted domain restriction
            // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
            // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            // accountName: '', // [Android] specifies an account name on the device that should be used
            // iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        });
    }

    async function signOutFromGoogle() {
        try {
            if (GoogleSignin.isSignedIn()) {
                // await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                //   this.setState({ user: null }); // Remember to remove the user from your app's state as well
            }
        } catch (error) {
            console.error(error);
        }
    }

    function signOutFromFacebook() {
        LoginManager.logOut();
        return;
    }

    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" component={Home}
                options={({ navigation, route }) => ({
                    headerTitle: 'Home',
                    headerTitleAlign: 'center',
                    headerTintColor: colors.main_color,
                    headerBackTitleVisible: false,
                    headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                    // headerRight: () =>
                    //     <TouchableOpacity
                    // activeOpacity={0.8}
                    //         onPress={() =>
                    //             showLogoutDialog()
                    //         }>
                    //         <Image
                    //             source={require('../../../assets/images/logout.png')}
                    //             style={{
                    //                 width: 24,
                    //                 height: 24,
                    //                 tintColor: colors.main_color,
                    //                 // borderRadius: 40 / 2,
                    //                 marginRight: 15,
                    //             }}

                    //         />
                    //     </TouchableOpacity>
                })} />
            <HomeStack.Screen name="CategoryList" component={CategoryList}
                options={({ route }) => ({
                    headerTitle: route.params.item.category_name,
                    headerTitleAlign: 'center',
                    headerBackTitleVisible: false,
                    headerTintColor: colors.main_color,
                    headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                    headerBackImage: () => <Image style={[{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == 'ios' ? { marginLeft: moderateScale(20) } : {}]} source={require('../../../assets/images/left.png')} />,
                })} />
            <HomeStack.Screen name="VideoList" component={VideoList}
                options={({ route }) => ({
                    headerTitle: route.params.name,
                    headerTitleAlign: 'center', headerTitleStyle: {
                        alignSelf: 'center',
                        justifyContent: 'center',
                        marginLeft: moderateScale(25),
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: colors.main_color,
                    headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                    headerBackImage: () => <Image style={[{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == 'ios' ? { marginLeft: moderateScale(20) } : {}]} source={require('../../../assets/images/left.png')} />,
                })} />
        </HomeStack.Navigator>
    );
}

{/* ------------------ Event ----------------- */ }
function EventStackScreen() {
    return (
        <EventStack.Navigator>
            <EventStack.Screen name="Events" component={Event}
                options={{
                    headerTitle: 'Event',
                    headerTitleAlign: 'center',
                    headerTintColor: colors.main_color,
                    headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                }} />
        </EventStack.Navigator>
    );
}

{/* ------------------ Store ----------------- */ }
function StoreStackScreen() {
    return (
        <StoreStack.Navigator>
            <StoreStack.Screen name="Store" component={Product}
                options={({ navigation, route }) => ({
                    headerTitle: 'Shop',
                    headerTitleAlign: 'center',
                    headerTintColor: colors.main_color,
                    headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                    headerRight: () =>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Addtocart')}>
                            <Image
                                source={require('../../../assets/images/cart.png')}
                                style={{
                                    width: 24,
                                    height: 24,
                                    // borderRadius: 40 / 2,
                                    marginRight: 15,
                                    tintColor: colors.main_color,
                                }}

                            />
                        </TouchableOpacity>,
                })}
            />
        </StoreStack.Navigator>
    );
}

{/* ------------------ Notification ----------------- */ }
function NotificationStackScreen() {
    return (
        <NotificationStack.Navigator>
            <EventStack.Screen name="Notifications" component={Notification}
                options={{
                    headerTitle: 'Notification',
                    headerTitleAlign: 'center',
                    headerTintColor: colors.main_color,
                    headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                }} />
        </NotificationStack.Navigator>
    );
}

{/* ------------------ Setting ----------------- */ }
function SettingStackScreen() {
    return (
        <SettingStack.Navigator>
            <SettingStack.Screen name="Settings" component={Setting}
                options={{
                    headerTitle: 'Settings',
                    headerTitleAlign: 'center',
                    headerTintColor: colors.main_color,
                    headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                }} />
            <SettingStack.Screen name="EditProfile" component={EditProfile}
                options={{
                    headerShown: false,
                }} />
        </SettingStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
export default function TabView() {

    const { state, handleUserProfile } = useAuth();
    const [planList, setPlanList] = useState([]);
    const itemSubs = ['com.yogacustomer.1month', 'com.yogacustomer.3month', 'com.yogacustomer.1year'];

    useEffect(() => {
        const user = state.user;
        if (user && user.subscriptions != '' && user.subscribe == 0 && planList.length > 0) {
            getAvailablePurchases();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [planList, state]);

    useEffect(() => {
        RNIap.initConnection()
            .then(result => {
                console.log('IAP result: ', result);
                getItems();

                Toast.hide();
                fetch.get(GET_SUBSCRIPTION_LIST)
                    .then((result) => {
                        console.log('result', result);
                        Toast.hide();
                        if (result.status == 1) {
                            setPlanList(result.data);
                        } else {
                            setPlanList([]);
                        }
                    })
                    .catch((error) => {
                        console.log('error', error);
                        Toast.hide();
                    });

                if (Platform.OS === 'android') {
                    RNIap.flushFailedPurchasesCachedAsPendingAndroid()
                        .then((result) => {
                            console.log('consumed all items?', result);
                        })
                        .catch(error => {
                            console.log('error', error);
                        });
                } else {
                    RNIap.clearTransactionIOS();
                }
            })
            .catch((reason) => {
                console.log('error', reason);
            });

        return (() => {
            RNIap.endConnection();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [RNIap]);

    const getAvailablePurchases = async () => {
        try {
            const purchases = await RNIap.getAvailablePurchases();
            console.log('available purchases', purchases);
            if (purchases.length > 0) {
                let receipt;
                if (Platform.OS === 'android') {
                    receipt = JSON.parse(purchases[0].transactionReceipt);
                }
                else {
                    receipt = { 'productId': purchases[0].productId, 'purchaseTime': purchases[0].transactionDate };
                }
                console.info('receipt', receipt);

                const data = planList.find((value) => {
                    return value.sku === receipt.productId;
                });
                if (data) {
                    const plan = data;
                    // call api free-subscription, params: plan.id, receipt.purchaseTime
                    buyIAPsubscription(plan, receipt.purchaseTime);
                }
            }
        } catch (err) {
            console.warn(err); // standardized err.code and err.message available
            // Alert.alert(err.message);
        }
    };

    function buyIAPsubscription(plan, purchaseTime) {
        fetch.post(IAP_PAYMENT, {
            expiry_at: purchaseTime,
            subscription_id: plan.id,
        })
            .then((result) => {

                Toast.show(result.msg);
                Toast.hide();
                if (result.status == 1) {
                    // Toast.showSuccess(response.message)
                    handleUserProfile()
                        .then((response) => {
                            Toast.hide();

                            let title = 'Restore Successful';
                            let message = 'You have successfully restored ' + plan.title;
                            Alert.alert(
                                title,
                                message
                            );

                        })
                        .catch((error) => {
                            Toast.hide();
                            console.log(error.message);
                        });
                } else {
                    Toast.show(result?.response.message);
                }
            })
            .catch((error) => {

                Toast.show('something went wrong!');
            })
            .finally(() => {
                Toast.hide();
            });
    }

    const getItems = async () => {
        try {

            const Products = await RNIap.getSubscriptions(itemSubs);

        } catch (err) {
            console.warn('IAP error', err.code, err.message, err);
        }
    };


    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.main_color,
                tabBarInactiveTintColor: 'white',
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: Platform.OS === 'android' ? { textTransform: 'uppercase', marginBottom: moderateScale(8) } : { textTransform: 'uppercase' },
                tabBarStyle: { backgroundColor: colors.secondary_color, height: verticalScale(60), justifyContent: 'space-evenly' },
                tabBarIconStyle: {
                    height: moderateScale(25),
                    width: moderateScale(25),
                },
            }}
        >
            <Tab.Screen name="Home" component={HomeStackScreen} options={{
                tabBarIcon: ({ color, focused, size }) => {
                    return <Image resizeMode="contain" style={{ height: size, width: size, tintColor: color }}
                        source={require('../../../assets/images/home1.png')} />;
                },
            }} />
            <Tab.Screen name="Events" component={EventStackScreen} options={{
                tabBarIcon: ({ color, focused, size }) => {
                    return <Image resizeMode="contain" style={{ height: size, width: size, tintColor: color }}
                        source={require('../../../assets/images/event1.png')} />;
                },
            }} />
            {/* <Tab.Screen name="Shop" component={StoreStackScreen} options={{
                tabBarIcon: ({ color, focused, size }) => {
                    return <Image resizeMode="contain" style={{ height: size, width: size, tintColor: color }}
                        source={require('../../../assets/images/shop1.png')} />;
                },
            }} /> */}
            <Tab.Screen name="Notifications" component={NotificationStackScreen} options={{
                tabBarIcon: ({ color, focused, size }) => {
                    return <Image resizeMode="contain" style={{ height: size, width: size, tintColor: color }}
                        source={require('../../../assets/images/notification1.png')} />;
                },
            }} />
            <Tab.Screen name="Settings" component={SettingStackScreen} options={{
                tabBarIcon: ({ color, focused, size }) => {
                    return <Image resizeMode="contain" style={{ height: size, width: size, tintColor: color }}
                        source={require('../../../assets/images/settings1.png')} />;
                },
            }} />
        </Tab.Navigator>
    );
}
