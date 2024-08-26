import React, { useEffect } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { useAuth } from '../../redux/providers/AuthProvider';
export default function Splash(props) {
    // console.log("props", props)
    const { navigation } = props;
    const { getAuthState } = useAuth()

    useEffect(() => {
        // fetch.get(SCHOOL_LIST)
        //     .then((result) => {
        //         console.log("result", result)
        //         if (result.status == 1) {
        //             result.data.sort((a, b) => a.school_name.localeCompare(b.school_name))
        //             AsyncStorage.setItem("schools", JSON.stringify(result.data))
        //         }
        //     })
        //     .catch((error) => {
        //         console.log("error", error)
        //         AsyncStorage.setItem("schools", [])
        //     })
        //     .finally(() => {
        //         load()
        //     })
        setTimeout(() => {
            load()
        }, 1000);
    }, [navigation])


    async function load() {

        getAuthState()
            .then(({ isLoggedIn }) => {
                console.log("isLoggedIn: ", isLoggedIn)
                if (isLoggedIn) {
                    navigation.replace('TabHome')
                } else {
                    navigation.replace('Login')
                }
            }).catch((reason) => {
                console.log("error: ", reason)
                navigation.replace('Login')
            })

        SplashScreen.hide()
    }

    return (
        <View />
    );
};

const styles = StyleSheet.create({
    splash: {
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        height: 100,
        width: 100,
        resizeMode: "cover"
    }
});