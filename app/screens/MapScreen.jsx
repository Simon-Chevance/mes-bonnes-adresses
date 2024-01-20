import React, { useState, useEffect } from 'react';
import {View, Text, ActivityIndicator, Modal, TextInput, Switch, Button} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getFirestore, collection, getDocs, addDoc, GeoPoint } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth()

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
        //console.log("in getLocation")
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            //console.log("Permission status:", status);
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            } else {
                let location = await Location.getCurrentPositionAsync({});
                //console.log("Location coordinates:", location.coords);
                setLocation(location);
            }
            //console.log("getLocation successful");
            setLoading(false);
        } catch (error) {
            console.error("Error in getLocation:", error.message);
            setErrorMsg('Error getting location');
        }
        //console.log("out getLocation")
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
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
            ) : errorMsg ? (
                <Text>{errorMsg}</Text>
            ) : (
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 1 }}
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
                        <View style={{ padding: 20 }}>
                            <Text>Create New Address</Text>
                            <TextInput
                                placeholder="Name"
                                value={newAddressName}
                                onChangeText={(text) => setNewAddressName(text)}
                            />
                            <TextInput
                                placeholder="Description"
                                value={newAddressDescription}
                                onChangeText={(text) => setNewAddressDescription(text)}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>Is Public:</Text>
                                <Switch
                                    value={newAddressPublic}
                                    onValueChange={(value) => setNewAddressPublic(value)}
                                />
                            </View>
                            <Text style={{ color: 'red' }}>{errorText}</Text>
                            <Button title="Create" onPress={handleCreateAddress} />
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
};

export default MapScreen;
