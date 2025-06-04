import {router } from 'expo-router';
import { View, Text,StyleSheet,Image, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import axios from 'axios';
import { useEffect, useState } from 'react';
import graphImg from '../../assets/images/graph.png'
import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
import Loader from '../../components/loader.jsx';
import useAuthStore from '../../zustand/store.jsx';

export default function StationAnalytics() {
        const station=useAuthStore((state)=>state.station);
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
    
  return (
    <SafeAreaView style={styles.container} edges={['left','right']}>
        <ScrollView
        contentContainerStyle={{paddingBottom:50}}
        >
            <View style={styles.AnalyticsContainer}>
                <View>
                    <Text style={styles.WelcomeTxt}>Hello <Text style={styles.SubTxt}>{station?.username}</Text></Text>
                    <Text style={styles.BusTxt}>Business Analysis Summary</Text>
                </View>
                {/* graph container */}
                <View style={styles.analyticsContainer}>
                    <Image source={graphImg} style={{width:300,alignSelf:'center',resizeMode:'cover'}}/>
                </View>
                {/* latest activity container */}
                <View style={{gap:10,borderBottomColor:"#077E8C",height:550,borderBottomWidth:2,overflow:"hidden"}}>
                <View style={styles.historyTopC}>
                    <Text>Recent Activity</Text>
                    <TouchableOpacity
                    onPress={()=>router.push('/Orders')}
                    >
                        <Text style={styles.SubTxt}>View All</Text>
                    </TouchableOpacity>
                </View>
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
                                <Text style={styles.SubTxt}>Order ID: {order._id}</Text>
                                <Text>Customer Location: {order?.location}</Text>
                                <Text>Customer Contact: {order?.clientPhoneNo}</Text>
                                <Text>Fuel Type: {order?.fuelType}</Text>
                                <Text>Fuel Volume: {order?.fuelVolume} L</Text>
                                <Text>Amount Charged : {order?.amount}</Text>
                
                                <View style={styles.StatusContainer}>
                                        <Text>Status : <Text style={styles.SubTxt}>{order?.status}</Text></Text>
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
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    AnalyticsContainer:{
        width:"85%",
        alignSelf:"center",
        paddingTop:30,
        paddingBottom:50
    },
    WelcomeTxt:{
     fontSize:22,
     fontWeight:"semibold",
     paddingBottom:10 ,
     textAlign:'center'
    },
    SubTxt:{
        color:"#077E8C"
    },
    BusTxt:{
        textAlign:'center'
    },
    analyticsContainer:{
        alignSelf:'center',
        borderColor:'#2F2C2C',
        borderWidth:1,
        borderRadius:10,
        marginTop:20,
        padding:10
    },
        historyTopC:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingBottom:10,
        paddingTop:20
    },
    orderContainer:{
        backgroundColor:"#ffff",
        padding:10,
        borderRadius:10,
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
    },
        StatusContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingTop:10
    }
})