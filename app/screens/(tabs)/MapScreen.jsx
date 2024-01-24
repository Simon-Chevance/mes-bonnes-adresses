import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Modal, TextInput, Switch, Button, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getFirestore, collection, getDocs, addDoc, GeoPoint } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const createAddress = async ({ name, description, isPublic, latitude, longitude, ownerId }) => {
    try {
        const docRef = await addDoc(collection(db, 'addresses'), {
            name: name || 'New Address',
            description: description || 'Address Description',
            isPublic: isPublic,
            location: new GeoPoint(latitude, longitude),
            photoURL: 'photoURL',
            ownerId: ownerId || auth.currentUser.uid,
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding document: ', error);
        throw error;
    }
};

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addressList, setAddressList] = useState([]);
    const [newAddressCoordinates, setNewAddressCoordinates] = useState(null);
    const [newAddressName, setNewAddressName] = useState('');
    const [newAddressDescription, setNewAddressDescription] = useState('');
    const [newAddressPublic, setNewAddressPublic] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorText, setErrorText] = useState('');

    useEffect(() => {
        try {
            getLocation();
            fetchAddresses();
        } catch (error) {
            console.error("Error in useEffect:", error.message);
        }
    }, []);

    const getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            } else {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error in getLocation:", error.message);
            setErrorMsg('Error getting location');
        }
    };

    const fetchAddresses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "addresses"));
            const addresses = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            const visibleAddresses = addresses.filter(address => {
                return address.isPublic || (address.ownerId === auth.currentUser.uid);
            });
            setAddressList(visibleAddresses);
        } catch (err) {
            console.error('Error fetching addresses: ', err);
        }
    };

    const handleMapLongPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setNewAddressCoordinates({ latitude, longitude });
        setModalVisible(true);
    };

    const handleCreateAddress = async () => {
        try {
            if (!newAddressName.trim() || !newAddressDescription.trim()) {
                setErrorText('Les champs doivent être remplis');
                return;
            }

            setErrorText('');

            await createAddress({
                name: newAddressName,
                description: newAddressDescription,
                isPublic: newAddressPublic,
                latitude: newAddressCoordinates.latitude,
                longitude: newAddressCoordinates.longitude,
                ownerId: auth.currentUser.uid,
            });

            setNewAddressName('');
            setNewAddressDescription('');
            setNewAddressCoordinates(null);
            setNewAddressPublic(false);
            setModalVisible(false);

            fetchAddresses();
        } catch (error) {
            console.error("Error creating address : ", error)
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" style={styles.loadingIndicator} />
            ) : errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
            ) : (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        onLongPress={handleMapLongPress}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            title="Your location"
                            description="This is your current location"
                        />

                        {addressList.map((address) => (
                            <Marker
                                key={address.id}
                                coordinate={{
                                    latitude: address.location.latitude,
                                    longitude: address.location.longitude,
                                }}
                                title={address.name}
                                description={address.description}
                            />
                        ))}
                    </MapView>

                    <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create New Address</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholder="Name"
                                placeholderTextColor="#CDCDCD"
                                value={newAddressName}
                                onChangeText={(text) => setNewAddressName(text)}
                            />
                            <TextInput
                                style={styles.inputField}
                                placeholder="Description"
                                placeholderTextColor="#CDCDCD"
                                value={newAddressDescription}
                                onChangeText={(text) => setNewAddressDescription(text)}
                            />
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchLabel}>Is Public:</Text>
                                <Switch
                                    value={newAddressPublic}
                                    onValueChange={(value) => setNewAddressPublic(value)}
                                />
                            </View>
                            <Text style={styles.errorText}>{errorText}</Text>
                            <TouchableOpacity style={styles.button} onPress={handleCreateAddress}>
                                <Text style={{ color: '#fff', textAlign: 'center', fontSize:18, fontWeight:'bold'}}>Ajouter </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={{ color: '#fff', textAlign: 'center', fontSize:18, fontWeight:'bold'}}>Annuler</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    button: {
        backgroundColor: '#5cb85c',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    cancelButton:{
        backgroundColor: '#e74c3c',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalContent: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 50,
        marginBottom: 10,
        textAlign: 'center',
    },
    inputField: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        marginRight: 10,
    },
});

export default MapScreen;
