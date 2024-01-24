import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Modal, TextInput, Switch, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, GeoPoint } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const AddressListItem = ({ address, onPress, onDelete, currentUser }) => {
    const shouldDisplay = address.isPublic || (currentUser && address.ownerId === currentUser.uid);

    if (!shouldDisplay) {
        return null;
    }

    return (
        <TouchableOpacity onPress={onPress} style={styles.listItem}>
            <Text style={styles.listItemTitle}>{address.name}</Text>
            <Text style={styles.listItemDescription}>{address.description}</Text>
            {currentUser && address.ownerId === currentUser.uid && (
                <Button title="Supprimer" onPress={() => onDelete(address.id)} color="#FF6961" />
            )}
        </TouchableOpacity>
    );
};

const AddressCreationModal = ({ isVisible, onClose, onCreateAddress }) => {
    const [newAddressName, setNewAddressName] = useState('');
    const [newAddressDescription, setNewAddressDescription] = useState('');
    const [newAddressIsPublic, setNewAddressIsPublic] = useState(false);
    const [newAddressLatitude, setNewAddressLatitude] = useState('');
    const [newAddressLongitude, setNewAddressLongitude] = useState('');
    const [newAddressPhotoURL, setNewAddressPhotoURL] = useState('');
    const [errorText, setErrorText] = useState('');

    const handleCreateAddress = async () => {
        const latitude = parseFloat(newAddressLatitude);
        const longitude = parseFloat(newAddressLongitude);

        if (!newAddressName.trim() || !newAddressDescription.trim() || isNaN(latitude) || isNaN(longitude)) {
            setErrorText('Les champs doivent être renseignés.');
            return;
        }

        setErrorText('');

        try {
            const docRef = await addDoc(collection(db, 'addresses'), {
                name: newAddressName,
                description: newAddressDescription,
                isPublic: newAddressIsPublic,
                location: new GeoPoint(latitude, longitude),
                photoURL: newAddressPhotoURL,
                ownerId: auth.currentUser.uid
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
        <Modal visible={isVisible} onRequestClose={onClose} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Ajouter une adresse</Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Nom"
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text>Is Public:</Text>
                        <Switch
                            value={newAddressIsPublic}
                            onValueChange={(value) => setNewAddressIsPublic(value)}
                        />
                    </View>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Latitude"
                        placeholderTextColor="#CDCDCD"
                        value={newAddressLatitude}
                        onChangeText={(text) => setNewAddressLatitude(text)}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Longitude"
                        placeholderTextColor="#CDCDCD"
                        value={newAddressLongitude}
                        onChangeText={(text) => setNewAddressLongitude(text)}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder="Photo"
                        placeholderTextColor="#CDCDCD"
                        value={newAddressPhotoURL}
                        onChangeText={(text) => setNewAddressPhotoURL(text)}
                    />
                    <Text style={styles.errorText}>{errorText}</Text>
                    <Button title="Créer" onPress={handleCreateAddress} color="#5cb85c" />
                    <Button title="Annuler" onPress={onClose} color="#FF6961" />
                </View>
            </View>
        </Modal>
    );
};

const AddRemoveAddress = ({ addresses, onAddAddress, onRemoveAddress }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
            <Text style={{ color: '#fff', textAlign: 'center', fontSize:18, fontWeight:'bold'}}>Ajouter </Text>
            </TouchableOpacity>
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
                            currentUser={auth.currentUser}
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
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAddresses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "addresses"));
            const addresses = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            if (searchQuery) {
                const filteredAddresses = addresses.filter((address) =>
                    address.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setAddressList(filteredAddresses);
            } else {
                setAddressList(addresses);
            }

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
    }, [searchQuery]);

    const addAddress = async () => {
        fetchAddresses();
    };

    const removeAddress = async (id, ownerId) => {
        try {
            if (auth.currentUser && ownerId === auth.currentUser.uid) {
                await deleteDoc(doc(db, 'addresses', id));
                setError(null);
                fetchAddresses();
                Alert.alert('Succès', "Suppression de l'adresse");
            } else {
                Alert.alert('Erreur', "Vous n'êtes pas autorisé à supprimer cette adresse.");
            }
        } catch (error) {
            console.error('Error removing address:', error);
            setError(error.message);
            Alert.alert('Erreur', "Erreur lors de la suppression de l'adresse");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.inputField}
                placeholder="Rechercher une adresse ..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    listItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    listItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    listItemDescription: {
        fontSize: 16,
        color: '#555',
    },
    addButton: {
        marginVertical: 16,
        backgroundColor: '#5cb85c',
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
    modalContent: {
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    inputField: {
        marginBottom: 15,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        color: '#333',
    },
    errorText: {
        color: '#FF6961',
        marginBottom: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});