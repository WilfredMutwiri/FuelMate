import { useLocalSearchParams } from 'expo-router';
import { View, Text,StyleSheet,Image, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
import Loader from '../../components/loader.jsx';
import useAuthStore from '../../zustand/store.jsx';

export default function OrdersScreen() {

    const station=useAuthStore((state)=>state.station)
    const [stationData,setStationData]=useState(null);
    const [Loading,setLoading]=useState(false);

    useEffect(() => {
    const getStation = async () => {
        if (!station?.id) {
        console.log("station.id not yet available");
        return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URI}/api/v1/order/station/${station.id}`);
            const result = response.data;
            if (result.stationOrders) {
                setStationData(result.stationOrders);
                setLoading(false);
            } else {
                setError(true);
                setLoading(false);
            }
        }
        catch (error) {
            setError(true);
            setMessage("An error occurred");
            console.log("API fetch error:", error.response?.data || error.message);
            setError(true);
            setMessage("An error occurred");
        }
        setLoading(false);
    };
    getStation();
}, []);
    
// useEffect(()=>{
// console.log("Station data",stationData)
// },[stationData])

  return (
    <SafeAreaView style={styles.container} edges={['left','right']}>
        <ScrollView
        contentContainerStyle={{paddingBottom:50}}
        >
            <View style={styles.historyContainer}>
                {
                    Loading?(
                        <View>
                            <Loader/>
                        </View>
                    ):(
                        <View style={{gap:10,}}>
                    {
                        stationData?.map((order,index)=>(
                            <View key={index._id || index} style={styles.orderContainer}>
                                    <Text style={styles.subTxt}>Order ID: {order._id}</Text>
                                    <Text>Customer Location: {order?.location}</Text>
                                    <Text>Customer Contact: {order?.clientPhoneNo}</Text>
                                    <Text>Fuel Type: {order?.fuelType}</Text>
                                    <Text>Fuel Volume: {order?.fuelVolume} L</Text>
                                    <Text>Amount Charged : {order?.amount}</Text>

                                    <View style={styles.StatusContainer}>
                                            <Text>Status : <Text style={styles.subTxt}>{order?.status}</Text></Text>
                                            <TouchableOpacity style={styles.BTNContainer}>
                                                <Text style={styles.BtnTxt}>Update</Text>
                                            </TouchableOpacity>
                                    </View>
                            </View>
                        ))
                    }
                </View>
                )
            }
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    subTxt:{
        color:'#077E8C'
    },
    // history section
    historyContainer:{
        marginTop:20,
        width:'95%',
        alignSelf:'center',
        borderRadius:10,
        padding:10
    },
    orderContainer:{
        flexDirection:'column',
        backgroundColor:'#D9D9D9',
        padding:10,
        borderRadius:10,
        gap:2
    },
    StatusContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingTop:10
    },
    BTNContainer:{
        backgroundColor:'#077E8C',
        padding:5,
        borderRadius:10,
        width:70
    },
    BtnTxt:{
        color:"#ffff",
        fontSize:12,
        textAlign:"center"
    }
})