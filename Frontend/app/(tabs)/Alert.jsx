import {View,Text,StyleSheet, ScrollView,TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAuthStore from '../../zustand/store.jsx';
import React,{useState,useEffect} from 'react'
import ToastComponent from "../../components/Toast";
import {SERVER_URI} from '../../constants/SERVER_URI.jsx';
import axios from 'axios'
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

export default function Alert(){
    const router=useRouter();
    const user=useAuthStore((state)=>state.user)
    const [loading,setLoading]=useState(false);
    const [nearbyStations,setNearbyStations]=useState([]);
    const [location,setLocation]=useState(null);
    

    const [formData,setFormData]=useState({
        clientName:'',
        clientPhone:'',
        fuelType:'',
        fuelVolume:'',
        urgency:'',
        message:'',
        clientLocation:''
    });

    // get user's current location
    useEffect(()=>{
        setLoading(true);

        (async () =>{
            try {
            
            let {status}=await Location.requestForegroundPermissionsAsync();

            if(status!='granted'){
                Alert.alert("permission denied","Location is required to show your current location");
                return
            }
    
            let currentLocation=await Location.getCurrentPositionAsync({});
            
            const coords = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            };
            setLocation(coords);

            setFormData(prev => ({
                ...prev,
                clientName: user?.username || '',
                clientPhone: user?.phoneNo || '',
                clientLocation: {
                    type: 'Point',
                    coordinates: [coords.longitude, coords.latitude]
                }
            }));
    
            // Get nearby stations
            setLoading(true)
            const response=await axios.get(`${SERVER_URI}/api/v1/station/nearby`,{
                params:{
                    latitude:currentLocation.coords.latitude,
                    longitude:currentLocation.coords.longitude,
                }
            });
    
            const result=response.data;
            if(result.success){
                setNearbyStations(result.stations);
            }
        } catch (error) {
            console.log("An error occured",error.message);    
        }finally{
            setLoading(false)
        }
        })();
    },[])
    
    

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
        ...prev,
        [name]: value,
        clientName: user?.username || prev.clientName,
        clientPhone: user?.phoneNo || prev.clientPhone,
        clientLocation: {
        type: 'Point',
        coordinates: [location?.longitude, location?.latitude]
        } || prev.clientLocation
    }));
};


    // request fuel
    const handleFuelRequest=async(req,res)=>{
        setLoading(true)

        const {
            clientName,
            clientPhone,
            fuelType,
            fuelVolume,
            urgency,
            message,
            clientLocation
        } = formData;

        if (
            !clientName ||
            !clientPhone ||
            !fuelType ||
            !fuelVolume ||
            !urgency ||
            !message ||
            !clientLocation ||
            !clientLocation.coordinates ||
            clientLocation.coordinates.length !== 2
        ) {
            ToastComponent("error", "Please fill all fields before submitting the order.");
            setLoading(false);
            return;
        }

        try {
            
            if (!formData.clientLocation || !formData.clientLocation.coordinates || formData.clientLocation.coordinates.length !== 2) {
                return ToastComponent("error", "Location not ready. Please wait a moment and try again.");
            }            
                
            const response=await axios.post(`${SERVER_URI}/api/v1/order/emergency/create/`,{
                ...formData
            })

            const result=response.data;
            console.log(result);

            if(response.data.success){
                ToastComponent("success","Order placed successfully!");
                router.push('/Orders')
            }

        } catch (error) {
            ToastComponent("error","Error placing order! Please try again")
            console.log(error.message);
            return
        }
    }

    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.emergencyCont}>
                    <View>

                        <Text style={styles.IntroTxt}>
                            Out of fuel? Help is on the way. Request emergency fuel and our nearest station will deliver it right to you.
                        </Text>

                    </View>
                    {/* form section */}
                    <View style={styles.formContainer}>
                        <View>
                            <Text style={styles.label}>Fuel Type</Text>
                            <TextInput
                                placeholder='e.g diesel'
                                style={styles.textInput}
                                value={formData.fuelType}
                                onChangeText={(text)=>handleInputChange('fuelType',text)}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Enter Fuel Volume</Text>
                            <TextInput
                                placeholder='20 L'
                                keyboardType='numeric'
                                style={styles.textInput}
                                value={formData.fuelVolume}
                                onChangeText={(text)=>handleInputChange('fuelVolume',text)}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Preferred Delivery Time</Text>
                            <TextInput
                                placeholder='Immediately'
                                style={styles.textInput}
                                value={formData.urgency}
                                onChangeText={(text)=>handleInputChange('urgency',text)}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Message</Text>
                            <TextInput
                                placeholder="E.g., Hello, I'm stranded near ABC Highway. Please send fuel ASAP."
                                style={styles.textInput}
                                value={formData.message}
                                onChangeText={(text)=>handleInputChange('message',text)}
                                multiline
                                numberOfLines={4}
                                maxLength={300}
                            />
                        </View>

                        {/* submit btn */}
                        <TouchableOpacity style={styles.submitBtn} 
                        onPress={handleFuelRequest}
                        >
                            <Text style={styles.btnTxt}>Order Now!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1
    },
    emergencyCont:{
        width:'90%',
        alignSelf:'center',
        paddingTop:10,
        paddingBottom:50
    }
    ,
    IntroTxt:{
        paddingTop:15,
        textAlign:'center',
        fontSize:14,
        color:'#00478F'
    },
    IntroSubTxt:{
        paddingTop:15,
        textAlign:'center',
        color:'#10AB10'
    },
    formContainer:{
        paddingTop:20,
        gap:15
    },
    textInput:{
        borderRadius:10,
        borderWidth:1,
        borderColor:'#D9D9D9',
        marginTop:10
    },
    label:{
        paddingLeft:4
    },
    submitBtn:{
        backgroundColor:'#00478F',
        width:'85%',
        alignSelf:'center',
        padding:10,
        marginTop:10,
        borderRadius:10
    },
    btnTxt:{
        textAlign:'center',
        color:'#ffff'
    }
})