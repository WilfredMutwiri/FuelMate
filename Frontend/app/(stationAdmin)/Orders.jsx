import { useLocalSearchParams } from 'expo-router';
import { View, Text,StyleSheet,Image, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import axios from 'axios';
import { useEffect, useState } from 'react';
import graphImg from '../../assets/images/graph.png'
// import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
// import Loader from '../../components/loader.jsx';

export default function OrdersScreen() {

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
        },
        {
            id:5,
            location:'Kapsabet',
            amount:'15L',
            fuelType:'Diesel',
            status:'Delivered',
            price:'12,000'
        },
        {
            id:6,
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
            <View style={styles.historyContainer}>
                <View style={{gap:10,}}>
                    {
                        ordersData.map((order,index)=>(
                            <View key={index} style={styles.orderContainer}>
                                <Text>Order: {order.id}</Text>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <Text>{order.location}</Text>
                                    <Text style={styles.subTxt}>{order.status}</Text>
                                </View>
                                <View>
                                    <Text>Fuel Type: {order.fuelType}</Text>
                                    <Text>Fuel Amount: {order.amount}</Text>
                                    <Text>Amount Charged : {order.price}</Text>
                                </View>
                            </View>
                        ))
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
        borderRadius:10
    }
})