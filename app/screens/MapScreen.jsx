import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            getLocation();
        } catch (error) {
            console.error("Error in useEffect:", error.message);
        }
    }, []);

    const getLocation = async () => {
        console.log("in getLocation")
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log("Permission status:", status);

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            } else {
                let location = await Location.getCurrentPositionAsync({});
                console.log("Location coordinates:", location.coords);

                setLocation(location);
            }
            console.log("getLocation successful");
            setLoading(false);
        } catch (error) {
            console.error("Error in getLocation:", error.message);
            setErrorMsg('Error getting location');
        }
        console.log("out getLocation")
    };

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
            ) : errorMsg ? (
                <Text>{errorMsg}</Text>
            ) : (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Your location"
                        description="This is your current location"
                    />
                </MapView>
            )}
        </View>
    );
};

export default MapScreen;
