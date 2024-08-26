//API Base URL
export const API_URL = 'https://api.frycanada.com/api';
// export const API_URL = 'http://192.168.1.26:8000/api';

//API End Points
export const SCHOOL_LIST = `${API_URL}/school-list`;
export const ADD_SCHOOL = `${API_URL}/user/add-school`;
export const LOGIN = `${API_URL}/login`;
export const REGISTER = `${API_URL}/register`;
export const SOCIAL_LOGIN = `${API_URL}/social-login`;
export const VERIFY_OTP = `${API_URL}/verify-otp`;
export const VERIFY_OTP2 = `${API_URL}/verify-otp2`;
export const RESEND_OTP = `${API_URL}/resend-otp`;
export const RESEND_OTP2 = `${API_URL}/resend-otp2`;
export const FORGOT_PASSWORD = `${API_URL}/forgot-password2`;
export const CHANGE_PASSWORD = `${API_URL}/change-password2`;
export const USER_PROFILE = `${API_URL}/user-profile`;
export const GET_SUBSCRIPTION_LIST = `${API_URL}/get-subscription-list`;
export const IAP_PAYMENT = `${API_URL}/iap_payment`;
export const COUPON_LIST = `${API_URL}/coupon-list`;
export const VERIFY_COUPON = `${API_URL}/check-coupon`;
export const BUY_SUBSCRIPTION = `${API_URL}/buy-subscription`;
export const FREE_SUBSCRIPTION = `${API_URL}/free-subscription`;
export const CATEGORY_LIST = `${API_URL}/category-list`;
export const SUB_CATEGORY_LIST = `${API_URL}/subcategory-list`;
export const EVENT_LIST = `${API_URL}/event-list`;
export const BANNER_LIST = `${API_URL}/list-banner`;
export const JOIN_EVENT_LIST = `${API_URL}/joined-event-list`;
export const PAST_EVENTS_LIST = `${API_URL}/external_event_list`;
export const VIDEO_LIST = `${API_URL}/video-list`;
export const EVENT_DETAILS = `${API_URL}/event-detail`;
export const JOIN_EVENT = `${API_URL}/join-event`;
export const VIDEO_DETAILS = `${API_URL}/video-detail`;
export const VIDEO_SEARCH = `${API_URL}/video-search`;
export const GROUP_LIST = `${API_URL}/group-list`;
export const PRODUCT_LIST = `${API_URL}/list-product`;
export const PRODUCT_DETAILS = `${API_URL}/product-detail`;
export const ADD_TO_CART = `${API_URL}/add-to-cart`;
export const CART_LIST = `${API_URL}/cart-product-list`;
export const REMOVE_CART_LIST = `${API_URL}/remove-from-cart`;
export const EDIT_CART = `${API_URL}/edit-cart`;
export const SET_ADDRESS = `${API_URL}/set-address`;
export const GET_ADDRESS = `${API_URL}/get-address`;
export const MAKE_ORDER = `${API_URL}/make-order`;
export const ORDER_LIST = `${API_URL}/list-order`;
export const ORDER_DETAILS = `${API_URL}/order-detail`;
export const AUTORENEWAL_SUBSCRIPTION = `${API_URL}/autorenewal-subscription`;
export const NOTIFICATION_ON_OFF = `${API_URL}/notification-status`;
export const NOTIFICATION = `${API_URL}/notification-list`;
export const UPDATE_PROFILE = `${API_URL}/update-profile`;
export const UPDATE_PASSWORD = `${API_URL}/update-profile`;
export const DELETE_ACCOUNT = `${API_URL}/delete-user`;

export const colors = {
    secondary_color_old: "#565bf7",
    main_color: "#FFED00",
    secondary_color: "#005397",
    accent_color: "#2F2F2F",
    drawer_color: "rgba(0, 253, 253, 0.6)",
    bg_color: "#EFF0F1",
    loadingBG_color: "rgba(0, 0, 0, 0.1)",
    card_color: "rgba(255, 255, 255, 0.9)",
    border_color: 'grey'
    // #5075C3 -facebook
    //  #6C72DE-register
    //  #6B72E6 -create profile
}

// social_type (1-facebook, 2-google, 3-Apple)
export const social_type = {
    FACEBOOK: 1,
    GOOGLE: 2,
    APPLE: 3
}

export const fonts = {
    opensans_light: "OpenSans-Light",
    opensans_regular: "OpenSans-Regular",
    opensans_bold: "OpenSans-Bold",
    raleway_light: "Raleway-Light",
    raleway_regular: "Raleway-Regular",
    raleway_bold: "Raleway-Bold",
}

export const config = {
    showTextInputIcons: false,
    EMAIL_REG: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    currency: "$",
    // stripe publishable key
    stripe_api_key: "pk_test_51I6LaXJ2UvUAem85099MPDNGIBh8UdoHIYfWItKznB1VDBee8UZhRyt75YO0IU4BXlzY6G9CCfj2SOQxKSe31xHy00Cp0RQCLk",
    // stripe secret key
    stripe_secret_key: "sk_test_51I6LaXJ2UvUAem8577HEXNcJpuNQ9aG0mhaF94mT1205Xd8dVPRhVs5Ja2fpumGiQCuPE3XeqL5auZrsFgUYJYiJ00GF0OXyzh",
    terms_url: "https://www.firstrespondersyogacanada.com/terms-and-conditions/",
    privacy_url: "https://www.firstrespondersyogacanada.com/privacy-policy/",
    aboutus_url: "https://api.frycanada.com/api/cms-page/1",
    contactus_url: "https://api.frycanada.com/api/cms-page/2"
}

export default {
    colors, config, social_type, fonts
}