import React,{useState,useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {SERVER_URI} from '../constants/SERVER_URI.jsx';
import axios from 'axios';

const FuelMap= () => {
const [location,setLocation]=useState(null);
const [locationName,setLocationName]=useState(null)
const [stations,setStations]=useState([]);
const [loading,setLoading]=useState(false);
const [error,setError]=useState(null);
const [message,setMessage]=useState(null);

useEffect(() => {
    const getAStations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URI}/api/v1/station/all`);
            const result = response.data;
            if (result.stations) {
                console.log("Stations fetched successfully");
                setStations(result.stations);
                setLoading(false);
                setMessage(result.message);
            }
        }
        catch (error) {
            setError(true);
            setMessage("An error occurred");
        }
        setLoading(false);
    };
    getAStations();

}, []);

// get user's current location
useEffect(()=>{
    setLoading(true);
    (
        async () =>{
        let {status}=await Location.requestForegroundPermissionsAsync();
        if(status!='granted'){
            Alert.alert("permission denied","Location is required to show your current location");
            setLocationName("Location unavailabe (Permission denied).")
            return
        }

        let currentLocation=await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        let addressArray=await Location.reverseGeocodeAsync(currentLocation.coords);
        if(addressArray.length>0){
            const address=addressArray[0];
            setLocationName(`${address.name} | ${address.city} | ${address.region}`)
        }
    })();
    setLoading(false)
},[])


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
        {
        stations.map((station) => (
          <Marker
            key={station._id}
            coordinate={{
              latitude:Number(station.latitude),
              longitude:Number(station.longitude),
            }}
            title={station.username}
            description={`${station.username} Fuel Station`}
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
