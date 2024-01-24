import React, {useEffect, useState} from 'react'
import { Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, Alert } from 'react-native'
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
    const auth = getAuth();
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permissions are needed if you want to use your picture.');
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri);
        }
    };

    const handleSave = async () => {
        try {
            const currentUser = auth.currentUser;
            if (newEmail.trim()) {
                await updateEmail(currentUser, newEmail)
            }
            if (newPassword.trim()) {
                await updatePassword(currentUser, newPassword);
            }
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
            >
                <>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            style={[styles.userImg, image && { opacity: 0.5 }]}
                            source={image ? { uri: image } : require('../../assets/users/user-1.jpg')}
                        />
                    </TouchableOpacity>
                </>
                <TextInput
                    placeholder={auth.currentUser?.email}
                    style={styles.userName}
                    onChangeText={(text) => setNewEmail(text)}
                    value={newEmail}
                />
                <TextInput
                    textContentType="newPassword"
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={(text) => setNewPassword(text)}
                    value={newPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

export default EditProfile

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
    input: {
        marginVertical:4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
        width: '60%',
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    userName: {
        paddingTop: 10,
        marginVertical:4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
        width: '60%',
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