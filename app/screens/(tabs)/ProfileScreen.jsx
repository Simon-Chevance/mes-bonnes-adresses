import React, {useEffect} from "react";
import { useNavigation } from "@react-navigation/core";
import {View, Text, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity} from "react-native";
import { auth } from "../../../firebase";
const ProfileScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                showsVerticalScrollIndicator={false}
            >
                <Image
                    style={styles.userImg}
                    source={require('../../../assets/users/user-1.jpg')}
                />
                <Text style={styles.userName}>{auth.currentUser?.email}</Text>
                <TouchableOpacity
                    style={styles.userBtn}
                    onPress={() => {
                        navigation.navigate('EditProfile')
                        }
                    }
                >
                    <Text style={styles.userBtnTxt}>Edit</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}
export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#fff",
        padding: 20,
    },
    text: {
        fontSize: 20,
        color: "#333333",
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10,
    },
    aboutUser: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
        textAlign: "center",
        marginBottom: 10,
    },
    userBtnWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginBottom: 10,
    },
    userBtn: {
        borderColor: "#2e64e5",
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
    },
    userBtnTxt: {
        color: "#2e64e5",
    },
    userInfoWrapper: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginVertical: 20,
    },
    userInfoItem: {
        justifyContent: "center",
    },
    userInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    userInfoSubTitle: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
})