import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import {Image, Platform} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';

// Import screens
import WebContent from './screens/WebContent';
import ChangePassword from './screens/auth/ChangePassword';
import CouponScreen from './screens/auth/CouponScreen';
import ForgotPassword from './screens/auth/ForgotPassword';
import Login from './screens/auth/Login';
import OTPVerification from './screens/auth/OTPVerification';
import PaymentScreen from './screens/auth/PaymentScreen';
import Register from './screens/auth/Register';
import ResetPassword from './screens/auth/ResetPassword';
import Splash from './screens/auth/Splash';
import SubscriptionPage from './screens/auth/SubscriptionPage';
import Event2DetailsScreen from './screens/events/Event2DetailsScreen';
import EventDetailsScreen from './screens/events/EventDetailsScreen';
import LiveVideoRecordScreen from './screens/events/LiveVideoRecordScreen';
import TabView from './screens/home/Tabview';
import VideoDetailsScreen from './screens/home/VideoDetailsScreen';
import VideoScreen from './screens/home/VideoScreen';
import AddToCartScreen from './screens/products/AddToCartScreen';
import AddressScreen from './screens/products/AddressScreen';
import OrderSummaryScreen from './screens/products/OrderSummaryScreen';
import ProductDetails from './screens/products/ProductDetails';
import AboutUsScreen from './screens/settings/AboutUsScreen';
import ContactUsScreen from './screens/settings/ContactUsScreen';
import MyOrderScreen from './screens/settings/MyOrderScreen';
import OrderDetailscreen from './screens/settings/OrderDetailscreen';
import {colors} from './utils/constants';

const Stack = createStackNavigator();

const commonHeaderOptions: StackNavigationOptions = {
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
  headerTintColor: colors.main_color,
  headerStyle: {
    backgroundColor: colors.secondary_color,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerBackImage: () => (
    <Image
      style={[
        {
          height: verticalScale(30),
          width: scale(30),
          resizeMode: 'contain',
          tintColor: colors.main_color,
        },
        Platform.OS === 'ios' ? {marginLeft: 20} : {},
      ]}
      source={require('../assets/images/left.png')}
    />
  ),
};

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="WebContent"
        options={({route}: any) => ({
          ...commonHeaderOptions,
          headerTitle: route.params?.name || 'F.R.Y',
        })}
        component={WebContent}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} />
      <Stack.Screen name="SubscriptionPage" component={SubscriptionPage} />
      <Stack.Screen name="TabHome" component={TabView} />
      <Stack.Screen name="CouponScreen" component={CouponScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="PastEventDetails" component={Event2DetailsScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen
        name="VideoDetailsScreen"
        component={VideoDetailsScreen}
        options={() => ({
          ...commonHeaderOptions,
          headerTitle: 'Video Details',
          headerShown: Platform.OS !== 'android',
        })}
      />
      <Stack.Screen
        name="LiveVideoRecordScreen"
        component={LiveVideoRecordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen
        name="Addtocart"
        component={AddToCartScreen}
        options={{headerTitle: 'Cart', ...commonHeaderOptions}}
      />
      <Stack.Screen
        name="AddressScreen"
        component={AddressScreen}
        options={{
          headerTitle: 'Billing/Shipping Address',
          ...commonHeaderOptions,
        }}
      />
      <Stack.Screen
        name="OrderSummary"
        component={OrderSummaryScreen}
        options={{headerTitle: 'Order Summary', ...commonHeaderOptions}}
      />
      <Stack.Screen
        name="MyOrder"
        component={MyOrderScreen}
        options={{headerTitle: 'My Orders', ...commonHeaderOptions}}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailscreen}
        options={{headerTitle: 'Order Details', ...commonHeaderOptions}}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{headerTitle: 'About Us', headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={{headerTitle: 'Contact Us', headerTitleAlign: 'center'}}
      />
    </Stack.Navigator>
  );
}
