import React, { useState, useContext } from 'react';
import { TouchableOpacity, Text, Image, View, Button, ActivityIndicator, Alert, ScrollView, Dimensions, StyleSheet, FlatList, SectionList } from 'react-native';
import { CustomText } from '../../components/Text';
import { useAuth } from '../../redux/providers/auth';

export default function AboutUsScreen(props) {
    const { navigate } = props.navigation;

    //1 - DECLARE VARIABLES
    const { state, handleLogout } = useAuth();
    const user = state.user;

    return (
        <View style={styles.MainContainer}>
            {/* ------------------CenterView ----------------- */}
            <View style={styles.CenterView} >
                {/* ------------------ SubContainer ----------------- */}
                <View style={styles.SubContainer}>
                    <CustomText style={styles.textContainer}>Under Development</CustomText>
                </View>
            </View>
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
        justifyContent: 'center',
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
        backgroundColor: 'lightgray',
        width: Dimensions.get('window').width
    },
    ImageContainer: {
        width: 10,
        height: 10,
        margin: 5,
        tintColor: 'grey'
    },
    textContainer: {
        fontSize: 20,
        textAlign: 'center'
    }
});

