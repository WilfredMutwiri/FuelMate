import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SERVER_URI } from '../constants/SERVER_URI.jsx';
import axios from 'axios';

const FuelMap = () => {
  const [location, setLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch all fuel stations
  useEffect(() => {
    const getStations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${SERVER_URI}/api/v1/station/all`);
        const result = response.data;
        if (result.stations) {
          setStations(result.stations);
          setMessage(result.message);
        }
      } catch (error) {
        setError(true);
        setMessage("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    getStations();
  }, []);

  // Get user's current location
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied", "Location is required to show your current position.");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (err) {
        Alert.alert("Error", "Unable to fetch current location.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {
        location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
          >
            {stations.map((station) => {
              if (
                station.location &&
                Array.isArray(station.location.coordinates) &&
                station.location.coordinates.length === 2
              ) {
                const [longitude, latitude] = station.location.coordinates;
                return (
                  <Marker
                    key={station._id}
                    coordinate={{ latitude, longitude }}
                    title={station.stationName}
                    description={`${station.username} Fuel Station`}
                    pinColor='red'
                  />
                );
              }
              return null;
            })}
          </MapView>
        ) : (
          <View style={styles.loadingMap}>
            <Text style={{ textAlign: 'center',color:'#E19540',
}}>
              Loading map...
            </Text>
          </View>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default FuelMap;
