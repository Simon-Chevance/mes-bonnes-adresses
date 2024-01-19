import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from "firebase/firestore";

const AddressListItem = ({ address, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{address.name}</Text>
            <Text>{address.description}</Text>
        </View>
    </TouchableOpacity>
);

const AddressCreationModal = ({ isVisible, onClose, onCreateAddress }) => {
    const [newAddressName, setNewAddressName] = useState('');
    const [newAddressDescription, setNewAddressDescription] = useState('');

    const handleCreateAddress = async () => {
        try {
            const docRef = await addDoc(collection(db, 'addresses'), {
                name: newAddressName || 'New Address',
                description: newAddressDescription || 'Address Description',
            });

            console.log('Document written with ID: ', docRef.id);
            setNewAddressName('');
            setNewAddressDescription('');
            onCreateAddress();
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };

    return (
        <Modal visible={isVisible} onRequestClose={onClose}>
            <View style={{ padding: 20 }}>
                <Text>Create New Address</Text>
                <TextInput
                    placeholder="Address Name"
                    value={newAddressName}
                    onChangeText={(text) => setNewAddressName(text)}
                />
                <TextInput
                    placeholder="Address Description"
                    value={newAddressDescription}
                    onChangeText={(text) => setNewAddressDescription(text)}
                />
                <Button title="Create" onPress={handleCreateAddress} />
                <Button title="Cancel" onPress={onClose} />
            </View>
        </Modal>
    );
};

const AddRemoveAddress = ({ addresses, onAddAddress, onRemoveAddress }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <Button title="Add Address" onPress={() => setModalVisible(true)} />
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
                        <AddressListItem address={item} onPress={() => onRemoveAddress(item.id)} />
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
        console.log("fetchAddresses start")
        console.log("db : ", db)
        let addressCollection;
        try {
            addressCollection = collection(db, "addresses");
            console.log("collection : ", addressCollection)

            try {
                const querySnapshot = await getDocs(addressCollection);
                querySnapshot.forEach((doc) => {
                    console.log(`${doc.id} => ${doc.data()}`);
                });
                /*
                                const querySnapshot = await getDocs(collection(db, 'addresses'));
                                console.log('Query Snapshot:', querySnapshot);
                                const addresses = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                                setAddressList(addresses);
                                setLoading(false);
                                setError(null);

                 */
            } catch (err) {
                console.error('Error fetching addresses: ', err);
                setLoading(false);
                setError(err.message);
            }
        } catch (err) {
            console.error("retrieving collection error : ", err)
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const addAddress = async (newAddress) => {
    };

    const removeAddress = async (id) => {
        try {
            await db.collection('addresses').doc(id).delete();
            setError(null);
        } catch (error) {
            console.error('Error removing address:', error);
            setError(error.message);
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
