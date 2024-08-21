import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Image, Platform, TouchableOpacity } from 'react-native';

import Splash from './screens/auth/Splash'
import TabView from './screens/home/Tabview';
import VideoDetailsScreen from './screens/home/VideoDetailsScreen';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import AuthProvider from './redux/providers/auth';
import ResetPassword from './screens/auth/ResetPassword'
import ChangePassword from './screens/auth/ChangePassword';
import ForgotPassword from './screens/auth/ForgotPassword'
import OTPVerification from './screens/auth/OTPVerification'
import SubscriptionPage from './screens/auth/SubscriptionPage'
import PaymentScreen from './screens/auth/PaymentScreen';
import EventDetailsScreen from './screens/events/EventDetailsScreen';
import VideoScreen from './screens/home/VideoScreen'
import ProductDetails from './screens/products/ProductDetails'
import AddToCartScreen from './screens/products/AddToCartScreen';
import AddressScreen from './screens/products/AddressScreen';
import OrderSummaryScreen from './screens/products/OrderSummaryScreen';
import MyOrderScreen from './screens/settings/MyOrderScreen';
import OrderDetailscreen from './screens/settings/OrderDetailscreen';
import AboutUsScreen from './screens/settings/AboutUsScreen';
import ContactUsScreen from './screens/settings/ContactUsScreen';
import SocialRegister from './screens/auth/SocialRegister';
import LiveVideoRecordScreen from './screens/events/LiveVideoRecordScreen'
import { scale, verticalScale } from 'react-native-size-matters';
import { colors } from './utils/constants';
import WebContent from './components/WebContent';
import CouponScreen from './screens/auth/CouponScreen';
import Event2DetailsScreen from './screens/events/Event2DetailsScreen';

const Stack = createStackNavigator();

export default function Router() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                    <Stack.Screen name="WebContent" component={WebContent} options={({ route }) => (
                        {
                            headerTitle: route.params.name ? route.params.name : "F.R.Y",
                            headerTitleAlign: 'center',
                            headerBackTitleVisible: false,
                            headerTintColor: colors.main_color,
                            headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                            headerBackImage: () => <Image style={[{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == "ios" ? { marginLeft: 20 } : {}]} source={require("../assets/images/left.png")} />
                        }
                    )} />
                    <Stack.Screen name="SocialRegister" component={SocialRegister} options={{ headerShown: false }} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                    <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
                    <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
                    <Stack.Screen name="OTPVerification" component={OTPVerification} options={{ headerShown: false }} />
                    <Stack.Screen name="SubscriptionPage" component={SubscriptionPage} options={{ headerShown: false }} />
                    <Stack.Screen name="TabHome" component={TabView}
                        options={({ navigation, route }) => (
                            {
                                headerShown: false,
                                headerRight: () =>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Addtocart")}>
                                        <Image
                                            source={require('../assets/images/cart.png')}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                // borderRadius: 40 / 2,
                                                marginRight: 15,
                                            }}
                                        />
                                    </TouchableOpacity>
                            })}
                    />
                    <Stack.Screen name="CouponScreen" component={CouponScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="PastEventDetails" component={Event2DetailsScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="VideoScreen" component={VideoScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="VideoDetailsScreen" component={VideoDetailsScreen} options={({ route }) => (
                        Platform.OS == "android" ? { headerShown: false }
                            :
                            {
                                headerTitle: "Video Details",
                                headerTitleAlign: 'center',
                                headerBackTitleVisible: false,
                                headerTintColor: colors.main_color,
                                headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                                headerBackImage: () => <Image style={[{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == "ios" ? { marginLeft: 20 } : {}]} source={require("../assets/images/left.png")} />
                            }
                    )} />

                    <Stack.Screen name="LiveVideoRecordScreen" component={LiveVideoRecordScreen} options={({ route }) => (
                        //  Platform.OS == "android" ?
                        { headerShown: false }
                        // :
                        // {
                        //     headerTitle: "Live Video Record",
                        //     headerTitleAlign: 'center',
                        //     headerBackTitleVisible: false,
                        //     headerTintColor: colors.main_color,
                        //     headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                        //     headerBackImage: () => <Image style={{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == "ios" ? { marginLeft: 20 } : {}]} source={require("../assets/images/left.png")} />
                        // }
                    )} />
                    <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="Addtocart" component={AddToCartScreen}
                        options={{
                            headerTitle: "Cart",
                            headerTitleAlign: 'center',
                            headerBackTitleVisible: false,
                            headerTintColor: colors.main_color,
                            headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                            headerBackImage: () => <Image style={[{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == "ios" ? { marginLeft: 20 } : {}]} source={require("../assets/images/left.png")} />

                        }} />
                    <Stack.Screen name="AddressScreen" component={AddressScreen}
                        options={{
                            headerTitle: "Billing/Shipping Address",
                            headerTitleAlign: 'center',
                            headerBackTitleVisible: false,
                            headerTintColor: colors.main_color,
                            headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                            headerBackImage: () => <Image style={[{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == "ios" ? { marginLeft: 20 } : {}]} source={require("../assets/images/left.png")} />
                        }} />
                    <Stack.Screen name="OrderSummary" component={OrderSummaryScreen}
                        options={{
                            headerTitle: "Order Summary",
                            headerTitleAlign: 'center',
                            headerBackTitleVisible: false,
                            headerTintColor: colors.main_color,
                            headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                            headerBackImage: () => <Image style={[{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == "ios" ? { marginLeft: 20 } : {}]} source={require("../assets/images/left.png")} />
                        }} />
                    <Stack.Screen name="MyOrder" component={MyOrderScreen}
                        options={{
                            headerTitle: "My Orders",
                            headerTitleAlign: 'center',
                            headerBackTitleVisible: false,
                            headerTintColor: colors.main_color,
                            headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                            headerBackImage: () => <Image style={[{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == "ios" ? { marginLeft: 20 } : {}]} source={require("../assets/images/left.png")} />
                        }} />
                    <Stack.Screen name="OrderDetails" component={OrderDetailscreen}
                        options={{
                            headerTitle: "Order Details",
                            headerTitleAlign: 'center',
                            headerBackTitleVisible: false,
                            headerTintColor: colors.main_color,
                            headerStyle: { backgroundColor: colors.secondary_color, elevation: 0, shadowOpacity: 0 },
                            headerBackImage: () => <Image style={[{ height: verticalScale(30), width: scale(30), resizeMode: 'contain', tintColor: colors.main_color }, Platform.OS == "ios" ? { marginLeft: 20 } : {}]} source={require("../assets/images/left.png")} />
                        }} />
                    <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerTitle: "About Us", headerTitleAlign: 'center' }} />
                    <Stack.Screen name="ContactUs" component={ContactUsScreen} options={{ headerTitle: "Contact Us", headerTitleAlign: 'center' }} />

                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}