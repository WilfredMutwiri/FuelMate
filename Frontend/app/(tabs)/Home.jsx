import {View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import map from '../../assets/images/map.jpg';
import station1 from '../../assets/images/station1.jpg'
import Loader from '../../components/loader.jsx';
import axios from 'axios';
import {SERVER_URI} from '../../constants/SERVER_URI.jsx';
import FuelMap from '../../components/fuelMap.jsx';
import * as Location from 'expo-location';


export default function Home(){
const router=useRouter();

const [location,setLocation]=useState(null);
const [locationName,setLocationName]=useState(null)
const [stations,setStations]=useState([]);
const [loading,setLoading]=useState(false);
const [error,setError]=useState(null);
const [success,setSuccess]=useState(null);
const [message,setMessage]=useState(null);

useEffect(() => {
    const getAStations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URI}/api/v1/station/all`);
            const result = response.data;
            console.log(result);
            if (result.stations) {
                setStations(result.stations);
                setSuccess(true);
                setLoading(false);
                setMessage(result.message);
            } else {
                setError(true);
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
    console.log("stations", stations);

}, []);

// get user's current location
useEffect(()=>{
    setLoading(true);
    (
        async () =>{
        let {status}=await Location.requestForegroundPermissionsAsync();
        if(status!='granted'){
            Alert.alert("permission denied","Location is required to show your current location");
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


    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView 
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
            <View>
                {/* map section */}
                <View style={styles.mapContainer}>
                    <View style={styles.IntroContainer}>
                        <Text>@ Wilfred</Text>
                        <View style={styles.locationContainer}>
                            <View>
                            <FontAwesome6 name="location-dot" size={18} color="#ff6d1f"/>
                            </View>
                            <Text>
                                {
                                    loading?(
                                        <Loader/>
                                    ):(
                                        locationName
                                    )
                                }
                            </Text>
                        </View>
                    </View>
                    {/* map section */}
                    <View style={{flex:1}}>
                        <FuelMap/>
                    </View>
                    {/* <Image source={map} style={{height:"100%",width:"100%",resizeMode:"cover"}}/> */}
                    <View style={styles.SearchContainer}>
                        <TextInput
                        placeholder='Search'
                        style={styles.TextInput}
                        />
                    </View>
                </View>
                {/* nearby stations */}
                <View style={styles.nearbyStationsContainer}>
                    <View style={styles.headerContainer}>
                    <Text style={styles.TitleTxt}>Nearby Filling Stations</Text>
                    <TouchableOpacity>
                    <Text style={styles.moreTxt}>See All</Text>
                    </TouchableOpacity>
                    </View>
                    {/* stations list */}
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.stationContainer}>
                            {
                                loading?(
                                    <Loader/>
                                ):error?(
                                    <Text>{message}</Text>
                                ):(
                                stations.map((station)=>(
                                    <TouchableOpacity key={station._id} onPress={()=>router.push(`/(stationInfo)/${station._id}`)}>
                                        <Image source={station1} style={{width:200,height:150,resizeMode:"cover"}}/>
                                        <View style={styles.stationInfoContainer}>
                                            <View >
                                                <Text>{station.username}</Text>
                                                <Text>Rating:{station.rating}</Text>
                                            </View>

                                            <View>
                                                {
                                                    station.fuel.map((fuelType, index) => (
                                                        <Text key={index}>{fuelType.name} : {fuelType.price}/Ltr</Text>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )
                            }
                        </View>
                    </ScrollView>

                    {/* most popular*/}
                    <View style={styles.headerContainer}>
                    <Text style={styles.TitleTxt}>Most Popular</Text>
                    <TouchableOpacity>
                    <Text style={styles.moreTxt}>See All</Text>
                    </TouchableOpacity>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.stationContainer}>
                            {
                                loading?(
                                    <Loader/>
                                ):error?(
                                    <Text>{message}</Text>
                                ):(
                                    stations.map((station)=>(
                                        <TouchableOpacity key={station._id} onPress={()=>router.push(`/(stationInfo)/${station._id}`)}>
                                            <Image source={station1} style={{width:200,height:150,resizeMode:"cover"}}/>
                                            <View style={styles.stationInfoContainer}>
                                                <View >
                                                    <Text>{station.username}</Text>
                                                    <Text>Rating:{station.rating}</Text>
                                                </View>
                                                <View>
                                                    {
                                                        station.fuel.map((fuelType, index) => (
                                                            <Text key={index}>{fuelType.name} : {fuelType.price}/Ltr</Text>
                                                        ))
                                                    }
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                )
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    IntroContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        backgroundColor:"#ffff",
        width:"100%",
        alignSelf:"center",
        position:"absolute",
        paddingTop:6,
        paddingBottom:6,
        paddingLeft:10,
        paddingRight:10,
        zIndex:100,
        alignItems:"center",
    },
    locationContainer:{
        flexDirection:"row",
        gap:10,
        alignItems:"center",
        padding:5,
        marginRight:10,
    },
    mapContainer:{
        height:260,
        width:"100%",
        position:"relative",
        backgroundColor:"#ffff",
    },
    SearchContainer:{
        position:"absolute",
        zIndex:50,
        width:"90%",
        marginTop:60,
        backgroundColor:"#ffff",
        alignSelf:"center",
        borderRadius:50,
        opacity:0.9,
    },
    TextInput:{
        padding:5,
        borderRadius:50,
        borderWidth:1,
        paddingLeft:20,
        width:"100%",
        alignSelf:"center",
        borderColor:"#00478F",
        height:45,

    },
    headerContainer:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
    },
    nearbyStationsContainer:{
        padding:10,
        width:"100%"
    },
    TitleTxt:{
        paddingTop:10,
        fontSize:19,
        fontWeight:"semibold",
        color:"#00478F"
    },
    moreTxt:{
        color:'#E19540',
        paddingTop:2
    },
    stationContainer:{
        paddingTop:10,
        paddingBottom:15,
        flexDirection:"row",
        gap:15,
    },
    stationInfoContainer:{
        flexDirection:"row",
        backgroundColor:"#EBF5FF",
        gap:10,
        width:"100%",
        marginTop:-45,
        padding:4
    }
})