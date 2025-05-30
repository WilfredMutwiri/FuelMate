import {router } from 'expo-router';
import { View, Text,StyleSheet,Image, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import axios from 'axios';
import { useEffect, useState } from 'react';
import graphImg from '../../assets/images/graph.png'
// import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
// import Loader from '../../components/loader.jsx';

export default function StationAnalytics() {

        const ordersData=[
        {
            id:1,
            location:'Kilimambogo area',
            amount:'20L',
            fuelType:'Petrol',
            status:'Confirmed',
            price:'20,000'
        },
        {
            id:2,
            location:'Malishoni area',
            amount:'10L',
            fuelType:'Diesel',
            status:'Delivered',
            price:'8,000'

        },
        {
            id:3,
            location:'Tea Mall area',
            amount:'22L',
            fuelType:'Petrol',
            status:'Delivered',
            price:'15,000'

        },
        {
            id:4,
            location:'Kapsabet',
            amount:'15L',
            fuelType:'Diesel',
            status:'Delivered',
            price:'12,000'
        }
    
    ]


  return (
    <SafeAreaView style={styles.container} edges={['left','right']}>
        <ScrollView
        contentContainerStyle={{paddingBottom:50}}
        >
            <View style={styles.AnalyticsContainer}>
                <View>
                    <Text style={styles.WelcomeTxt}>Hello <Text style={styles.SubTxt}>Kilimambogo Station!</Text></Text>
                    <Text style={styles.BusTxt}>Business Analysis Summary</Text>
                </View>
                {/* graph container */}
                <View style={styles.analyticsContainer}>
                    <Image source={graphImg} style={{width:300,alignSelf:'center',resizeMode:'cover'}}/>
                </View>
                {/* latest activity container */}
                <View style={{gap:10,}}>
                <View style={styles.historyTopC}>
                    <Text>Recent Activity</Text>
                    <TouchableOpacity
                    onPress={()=>router.push('/Orders')}
                    >
                        <Text style={styles.SubTxt}>View All</Text>
                    </TouchableOpacity>
                </View>
                    {
                        ordersData.map((order,index)=>(
                        <View key={index} style={styles.orderContainer}>
                            <Text style={styles.SubTxt}>Order: {order.id}</Text>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text>{order.location}</Text>
                                <Text style={styles.SubTxt}>{order.status}</Text>
                            </View>
                            <View>
                                <Text>Fuel Type: {order.fuelType}</Text>
                                <Text>Fuel Amount: {order.amount}</Text>
                                <Text>Amount Charged : {order.price}</Text>
                            </View>
                        </View>
                    ))}
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
     paddingBottom:10 
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
        borderRadius:10
    }
})