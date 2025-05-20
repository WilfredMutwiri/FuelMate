import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const FuelMap= () => {
  const stations = [
      {
    id: '1',
    name: 'Kapsabet Central Station',
    latitude: 0.2033,
    longitude: 35.1055,
  },
  {
    id: '2',
    name: 'Nandi Hills Station',
    latitude: 0.1147,
    longitude: 35.1759,
  },
  {
    id: '3',
    name: 'Chepsonoi Fuel Stop',
    latitude: 0.2469,
    longitude: 35.0672,
  },
  {
    id: '4',
    name: 'Kaptumo Station',
    latitude: 0.1045,
    longitude: 35.0253,
  },
  {
    id: '5',
    name: 'Kabiyet Service Station',
    latitude: 0.3402,
    longitude: 35.1168,
  },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
            latitude: 0.2033,
            longitude: 35.1055,
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
        }}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={station.name}
            description={`${station.name} Fuel Station`}
            pinColor='red'
          />
        ))}
      </MapView>
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
});

export default FuelMap;
