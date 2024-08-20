import React, { useMemo, useReducer, useContext } from 'react';
import Global from '../../utils/global';

//IMPORT REDUCER, INITIAL STATE AND ACTION TYPES
import reducer, { initialState, LOGGED_IN, LOGGED_OUT } from "../reducer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetch from '../../services/fetch';
import {
    BUY_SUBSCRIPTION, COUPON_LIST, VERIFY_COUPON, FORGOT_PASSWORD, LOGIN, REGISTER, RESEND_OTP, SOCIAL_LOGIN, VERIFY_OTP, VERIFY_OTP2, RESEND_OTP2, CHANGE_PASSWORD,
    VIDEO_DETAILS, CATEGORY_LIST, SUB_CATEGORY_LIST, EVENT_LIST, PAST_EVENTS_LIST, JOIN_EVENT_LIST, VIDEO_LIST,
    EVENT_DETAILS, JOIN_EVENT, VIDEO_SEARCH, GROUP_LIST, BANNER_LIST, USER_PROFILE, PRODUCT_LIST, PRODUCT_DETAILS,
    ADD_TO_CART, CART_LIST, REMOVE_CART_LIST, EDIT_CART, SET_ADDRESS, GET_ADDRESS, MAKE_ORDER,
    ORDER_LIST, ORDER_DETAILS, AUTORENEWAL_SUBSCRIPTION, NOTIFICATION_ON_OFF, NOTIFICATION, FREE_SUBSCRIPTION,
    UPDATE_PASSWORD, UPDATE_PROFILE, DELETE_ACCOUNT
} from '../../utils/constants';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager } from 'react-native-fbsdk';

// CONFIG KEYS [Storage Keys]===================================
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
export const EMAIL_KEY = 'email';
export const ROLE_KEY = 'role';

export const keys = [TOKEN_KEY, USER_KEY, EMAIL_KEY, ROLE_KEY];

// CONTEXT ===================================
const AuthContext = React.createContext();

function AuthProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState || {});

    // Get Auth state
    const getAuthState = async () => {
        try {
            //GET TOKEN && USER
            let token = await AsyncStorage.getItem(TOKEN_KEY);
            let user = await AsyncStorage.getItem(USER_KEY);
            let email = await AsyncStorage.getItem(EMAIL_KEY)
            let role = await AsyncStorage.getItem(ROLE_KEY)

            // console.log("user: ", user)
            // console.log("token123: ", token)

            if (!token || token == "") {
                await handleLogout();
                return { isLoggedIn: false };
            } else {
                Global.setToken(token)
                let res = await handleUserProfile()
                if (res.message == "Unauthenticated.") {
                    await handleLogout();
                    return { isLoggedIn: false };
                }
                return { isLoggedIn: true };
                //DISPATCH TO REDUCER
                // dispatch({ type: LOGGED_IN, user: JSON.parse(user) });
            }
        } catch (error) {
            throw new Error(error)
        }
    };

    // Handle UpdateProfile
    const handleUpdateProfile = async (first_name, last_name, role_id) => {
        try {
            let data = {
                first_name,
                last_name,
                role_id
            }
            let res = await fetch.post(UPDATE_PROFILE, data)
            if (res.status == 1) {
                let updateData = res.data
                let updateProfileData = JSON.stringify(updateData)
                // console.log("updateData: ", updateProfileData)
            }
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Delete User
    const handleDeleteUser = async () => {
        try {
            let res = await fetch.deleteReq(DELETE_ACCOUNT)
            // if (res.status == 1) {
            //     let deleteAccountRes = JSON.stringify(res.data)
            //     console.log("deleteAccountRes: ", deleteAccountRes)
            // }
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle ChangePassword
    const handleChangePassword = async (old_password, password, password_confirmation) => {
        try {
            let data = {
                old_password,
                password,
                password_confirmation
            }
            let res = await fetch.post(UPDATE_PASSWORD, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };


    // Handle User Profile
    const handleUserProfile = async () => {
        try {
            let data = {}
            let res = await fetch.get(USER_PROFILE, data)
            if (res.status == 1) {
                let user = res.data
                let strUser = JSON.stringify(user)
                console.log("UserProfile: ", strUser)

                let data_ = [[USER_KEY, strUser], [TOKEN_KEY, user.token]];
                Global.setToken(user.token)

                await AsyncStorage.multiSet(data_);

                //DISPATCH TO REDUCER
                dispatch({ type: LOGGED_IN, user });
            }
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Login
    const handleLogin = async (email, password, device_token, device_type) => {
        try {
            let data = {
                email, password, device_token, device_type
            }
            let res = await fetch.post(LOGIN, data)
            if (res.status == 1) {
                let user = res.data
                let strUser = JSON.stringify(user)
                console.log("struser: ", strUser)

                let data_ = [[USER_KEY, strUser], [TOKEN_KEY, user.token]];
                Global.setToken(user.token)

                await AsyncStorage.multiSet(data_);

                //DISPATCH TO REDUCER
                dispatch({ type: LOGGED_IN, user });
            }
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Social Login
    const handleSocialLogin = async (social_id, social_type, first_name, last_name, email, profile_url, otp, device_token, device_type) => {
        try {
            let data = {
                social_id, social_type, first_name, last_name, email, profile_url, otp, device_token, device_type
            }
            let res = await fetch.post(SOCIAL_LOGIN, data)
            if (res.status == 1 || res.status == 2) {
                let user = res.data
                let strUser = JSON.stringify(user).toString()
                console.log("struser: ", strUser)

                let data_ = [[USER_KEY, strUser], [TOKEN_KEY, user.token]];
                Global.setToken(user.token)

                await AsyncStorage.multiSet(data_);

                //DISPATCH TO REDUCER
                dispatch({ type: LOGGED_IN, user });
            }
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Send OTP
    const handleSendOTP = async (email) => {
        try {
            let data = {
                email
            }
            let res = await fetch.post(RESEND_OTP, data)

            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Verify OTP
    const handleVerifyOTP = async (email, otp) => {
        try {
            let data = {
                email, otp
            }
            let res = await fetch.post(VERIFY_OTP, data)

            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        try {
            //REMOVE DATA
            Global.setToken("")
            await AsyncStorage.multiRemove(keys);

            //REMOVE SOCIAL MEDIA DATA
            if (GoogleSignin.isSignedIn()) {
                GoogleSignin.signOut()
            }
            LoginManager.logOut()

            //DISPATCH TO REDUCER
            dispatch({ type: LOGGED_OUT });
        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Register
    const handleRegister = async (firstname, lastname, user_role, school, email, password, address, city, postal_code, state, device_token, device_type) => {
        try {
            let data = {
                firstname, lastname, user_role, school, email, password, address1: address, address2: "", city, postal_code, state, country: "Canada", device_token, device_type
            }
            let res = await fetch.post(REGISTER, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Subscribe
    const handleSubscribe = async (stripe_token, subscription_id, total_amount, coupon) => {
        try {
            let data = {
                stripe_token, subscription_id, total_amount, coupon
            }
            let res = await fetch.post(BUY_SUBSCRIPTION, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Free Subcription
    const handleFreeSubscription = async (subscription_id, coupon) => {
        try {
            let data = {
                subscription_id, coupon
            }
            let res = await fetch.post(FREE_SUBSCRIPTION, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle CouponList
    const handleCouponList = async () => {
        try {
            let data = {

            }
            let res = await fetch.get(COUPON_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle VerifyCoupon
    const handleVerifyCoupon = async (coupon) => {
        try {
            let url = VERIFY_COUPON + "?coupon=" + coupon
            let res = await fetch.get(url)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Get Category List
    const handleCategoryList = async () => {
        try {
            let res = await fetch.get(CATEGORY_LIST)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Sub-category List
    const handleSubCategoryList = async (category_id) => {
        try {
            let data = {
                category_id
            }
            let res = await fetch.post(SUB_CATEGORY_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Group List
    const handleGroupList = async (category_id, subcategory_id) => {
        try {
            let data = {
                category_id,
                subcategory_id
            }
            let res = await fetch.post(GROUP_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Event List
    const handleBannerList = async () => {
        try {
            let data = {

            }
            let res = await fetch.get(BANNER_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Event List
    const handleEventList = async (page, per_page) => {
        try {
            let data = {
                page,
                per_page
            }
            let res = await fetch.post(EVENT_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Joined Event List
    const handleJoindEventList = async (page, per_page) => {
        try {
            let data = {
                page,
                per_page
            }
            let res = await fetch.post(JOIN_EVENT_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Past Event List
    const handlePastEventList = async (page, per_page) => {
        try {
            let url = PAST_EVENTS_LIST + "?page=" + page + "&per_page=" + per_page
            let res = await fetch.get(url)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Joined Event 
    const handleJoindEvent = async (event_id) => {
        try {
            let data = {
                event_id
            }
            let res = await fetch.post(JOIN_EVENT, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };


    // Handle Event Details
    const handleEventDetails = async (event_id) => {
        try {
            let data = {
                event_id
            }
            let res = await fetch.post(EVENT_DETAILS, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Video List
    const handleVideoList = async (category_id, subcategory_id, group_name, page, per_page) => {
        try {
            let data = {
                category_id,
                subcategory_id,
                group_name,
                page,
                per_page
            }
            let res = await fetch.post(VIDEO_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Video Detail
    const handleVideoDetail = async (video_id) => {
        try {
            let data = {
                video_id
            }
            let res = await fetch.post(VIDEO_DETAILS, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Video Search
    const handleVideoSearch = async (keyword) => {
        try {
            let data = {
                keyword
            }
            let res = await fetch.post(VIDEO_SEARCH, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Product list
    const handleProductList = async (page, per_page) => {
        try {
            let data = {
                page, per_page
            }
            let res = await fetch.post(PRODUCT_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };


    // Handle Product details
    const handleProductDetails = async (product_id) => {
        try {
            let data = {
                product_id
            }
            let res = await fetch.post(PRODUCT_DETAILS, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle add to cart
    const handleAddToCart = async (product_id, quantity) => {
        try {
            let data = {
                product_id, quantity
            }
            let res = await fetch.post(ADD_TO_CART, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle  cart list
    const handleCartList = async (page, per_page) => {
        try {
            let data = {
                page, per_page
            }
            let res = await fetch.post(CART_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle  remove cart list
    const handleRemoveCart = async (product_id) => {
        try {
            let data = {
                product_id
            }
            let res = await fetch.post(REMOVE_CART_LIST, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle  Edit cart list
    const handleEditCart = async (product_id, quantity) => {
        try {
            let data = {
                product_id, quantity
            }
            let res = await fetch.post(EDIT_CART, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle  Set Address
    const handleSetAddress = async (user_name, user_phone, address, locality, city,
        state, country, pincode) => {
        try {
            let data = {
                user_name, user_phone, address, locality, city,
                state, country, pincode
            }
            let res = await fetch.post(SET_ADDRESS, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Get Address
    const handleGetAddress = async () => {
        try {
            let res = await fetch.get(GET_ADDRESS)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Payment
    const handlePayment = async (amount, stripe_token, product, description) => {
        try {
            let data = {
                amount, stripe_token, product, description
            }
            let res = await fetch.post(MAKE_ORDER, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Get Order
    const handleGetOrder = async () => {
        try {
            let res = await fetch.get(ORDER_LIST)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Get Order Details
    const handleGetOrderDetails = async (order_no) => {
        try {
            let data = {
                order_no
            }
            let res = await fetch.post(ORDER_DETAILS, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Autorenewal Subscription
    const handleAutorenewalSubscription = async () => {
        try {
            let res = await fetch.get(AUTORENEWAL_SUBSCRIPTION)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle Notification Onoff
    const handleNotificationOnOff = async (notification) => {
        try {
            let data = {
                notification
            }
            let res = await fetch.post(NOTIFICATION_ON_OFF, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle get Notification 
    const handleGetNotification = async () => {
        try {
            let res = await fetch.get(NOTIFICATION)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };


    // Handle ForgotPassword
    const handleForgotPassword = async (email) => {
        try {
            let data = {
                email
            }
            let res = await fetch.post(FORGOT_PASSWORD, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };


    // Handle ResetPassword
    const handleResetPassword = async (email, new_password) => {
        try {
            let data = {
                email, new_password
            }
            let res = await fetch.post(CHANGE_PASSWORD, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };


    // Handle VerifyOTP2
    const handleVerifyOTP2 = async (email, otp) => {
        try {
            let data = {
                email, otp
            }
            let res = await fetch.post(VERIFY_OTP2, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };

    // Handle ResendOTP
    const handleResendOTP2 = async (email) => {
        try {
            let data = {
                email
            }
            let res = await fetch.post(RESEND_OTP2, data)
            return res

        } catch (error) {
            throw new Error(error);
        }
    };


    //UPDATE USER LOCAL STORAGE DATA AND DISPATCH TO REDUCER
    const updateUser = async (user) => {
        try {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
            dispatch({ type: LOGGED_IN, user }); //DISPATCH TO REDUCER
        } catch (error) {
            throw new Error(error);
        }
    };

    const value = useMemo(() => {
        return {
            state, handleVerifyCoupon, getAuthState, handleLogin, handleSocialLogin, handleRegister, handleCategoryList, handleGroupList, handleSubscribe,
            handleResetPassword, handleVerifyOTP2, handleResendOTP2, handleFreeSubscription,
            handleEventList, handleCouponList, handleSubCategoryList, handleVideoDetail, handlePastEventList, handleJoindEventList, handleVideoList, handleForgotPassword, handleUserProfile,
            handleSendOTP, handleJoindEvent, handleVerifyOTP, handleLogout, updateUser, handleEventDetails, handleVideoSearch, handleBannerList,
            handleProductList, handleProductDetails, handleAddToCart, handleCartList, handleRemoveCart, handleEditCart, handleSetAddress,
            handleGetAddress, handlePayment, handleGetOrder, handleGetOrderDetails, handleAutorenewalSubscription, handleNotificationOnOff, handleGetNotification,
            handleUpdateProfile, handleDeleteUser, handleChangePassword
        };
    }, [state]);

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
}

const useAuth = () => useContext(AuthContext);
export { AuthContext, useAuth }
export default AuthProvider;