import React, { useState, useEffect } from 'react';
import {View, Text, Button, FlatList, TouchableOpacity, Modal, TextInput, Switch, Alert} from 'react-native';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { GeoPoint } from "firebase/firestore"

const db = getFirestore();

const AddressListItem = ({ address, onPress, onDelete }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{address.name}</Text>
            <Text>{address.description}</Text>
        </View>
        <Button title="Supprimer" onPress={() => onDelete(address.id)} />
    </TouchableOpacity>
);

const AddressCreationModal = ({ isVisible, onClose, onCreateAddress }) => {
    const [newAddressName, setNewAddressName] = useState('');
    const [newAddressDescription, setNewAddressDescription] = useState('');
    const [newAddressIsPublic, setNewAddressIsPublic] = useState(false);
    const [newAddressLatitude, setNewAddressLatitude] = useState('');
    const [newAddressLongitude, setNewAddressLongitude] = useState('');
    const [newAddressPhotoURL, setNewAddressPhotoURL] = useState('');

    const handleCreateAddress = async () => {
        const latitude = parseFloat(newAddressLatitude);
        const longitude = parseFloat(newAddressLongitude);

        if (isNaN(latitude) || isNaN(longitude)) {
            console.error('Invalid latitude or longitude values');
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'addresses'), {
                name: newAddressName || 'New Address',
                description: newAddressDescription || 'Address Description',
                isPublic: newAddressIsPublic,
                location: new GeoPoint(latitude, longitude),
                photoURL: newAddressPhotoURL || 'photoURL'
            });
            console.log('Created document: ', docRef.id);

            setNewAddressName('');
            setNewAddressDescription('');
            setNewAddressIsPublic(false);
            setNewAddressLatitude('');
            setNewAddressLongitude('');
            setNewAddressPhotoURL('');
            onCreateAddress();
            Alert.alert('Succès', 'Adresse ajoutée');
            onClose();
        } catch (e) {
            console.error('Error adding document: ', e);
            Alert.alert('Erreur', "Erreur lors de l'ajout de l'adresse");
        }
    };

    return (
        <Modal visible={isVisible} onRequestClose={onClose}>
            <View style={{ padding: 20 }}>
                <Text>Ajouter une adresse</Text>
                <TextInput
                    placeholder="Nom"
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
                        value={newAddressIsPublic}
                        onValueChange={(value) => setNewAddressIsPublic(value)}
                    />
                </View>
                <TextInput
                    placeholder="Latitude"
                    value={newAddressLatitude}
                    onChangeText={(text) => setNewAddressLatitude(text)}
                />
                <TextInput
                    placeholder="Longitude"
                    value={newAddressLongitude}
                    onChangeText={(text) => setNewAddressLongitude(text)}
                />
                <TextInput
                    placeholder="Photo"
                    value={newAddressPhotoURL}
                    onChangeText={(text) => setNewAddressPhotoURL(text)}
                />
                <Button title="Créer" onPress={handleCreateAddress} />
                <Button title="Annuler" onPress={onClose} />
            </View>
        </Modal>
    );
};

const AddRemoveAddress = ({ addresses, onAddAddress, onRemoveAddress }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <Button title="Ajouter" onPress={() => setModalVisible(true)} />
            <AddressCreationModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onCreateAddress={onAddAddress}
            />
            {addresses.length > 0 && (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AddressListItem
                            address={item}
                            onPress={() => console.log('clic sur une adresse')}
                            onDelete={onRemoveAddress}
                        />
                    )}
                />
            )}
        </View>
    );
};

const AddressList = () => {
    const [addressList, setAddressList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAddresses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "addresses"));
            console.log('Query Snapshot:', querySnapshot);
            const addresses = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setAddressList(addresses);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error('Error fetching addresses: ', err);
            setLoading(false);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const addAddress = async () => {
        fetchAddresses();
    };

    const removeAddress = async (id) => {
        try {
            await deleteDoc(doc(db, 'addresses', id));
            setError(null);
            fetchAddresses();
            Alert.alert('Succès', "Suppression de l'adresse");
        } catch (error) {
            console.error('Error removing address:', error);
            setError(error.message);
            Alert.alert('Erreur', "Erreur lors de la suppression de l'adresse");
        }
    };

    return (
        <View>
            {loading && <Text>Loading...</Text>}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <AddRemoveAddress
                addresses={addressList}
                onAddAddress={addAddress}
                onRemoveAddress={removeAddress}
            />
        </View>
    );
};

export default AddressList;
