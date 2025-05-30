import { router} from 'expo-router';
import { View, Text,StyleSheet,Image, ScrollView, TouchableOpacity, Touchable} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import axios from 'axios';
import { useEffect, useState } from 'react';
import graphImg from '../../assets/images/graph.png'
// import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
// import Loader from '../../components/loader.jsx';

export default function StationInfoScreen() {

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
        <Text style={styles.titleTxt}>Welcome back <Text style={styles.subTxt}>Kilimambogo Station!</Text></Text>
            <View style={styles.TopContainer1}>
                <TouchableOpacity style={styles.Tcontainer101}
                    onPress={()=>router.push("/Analytics")}
                >
                    <Text style={styles.TopTxt}>Total Sales</Text>
                    <Text style={styles.TopSubTxt}>Ksh 20,000.00</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Tcontainer102}
                    onPress={()=>router.push("/Orders")}
                >
                    <Text style={styles.TopTxt}>Pending Orders</Text>
                    <Text style={styles.TopSubTxt}>7</Text>
                </TouchableOpacity>
            </View>
            {/* container 2 */}
            <View style={styles.TopContainer2}>
                <TouchableOpacity style={styles.Tcontainer201}
                    onPress={()=>router.push("/Orders")}
                >
                    <Text style={styles.TopTxt}>Delivered Fuel</Text>
                    <Text style={styles.TopSubTxt}>320 L</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Tcontainer202}
                    onPress={()=>router.push("/Orders")}
                >
                    <Text style={styles.TopTxt}>Declined Orders</Text>
                    <Text style={styles.TopSubTxt}>0</Text>
                </TouchableOpacity>
            </View>

            {/* analytics section */}
            <View style={styles.analyticsContainer}>
                <Text style={styles.titleTxt}>Revenue Overview</Text>
                {/* graph */}
                <Image source={graphImg} style={{width:310,alignSelf:'center',resizeMode:'cover'}}/>
            </View>

            {/* history section */}
            <View style={styles.historyContainer}>
                <View style={styles.historyTopC}>
                    <Text>Recent Orders</Text>
                    <TouchableOpacity
                    onPress={()=>router.push("/Orders")}
                    >
                        <Text style={styles.subTxt}>View All</Text>
                    </TouchableOpacity>
                </View>
                <View style={{gap:10,}}>
                    {
                        ordersData.map((order,index)=>(
                            <View key={index} style={styles.orderContainer}>
                                <Text style={styles.subTxt}>Order: {order.id}</Text>
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
    titleTxt:{
        textAlign:'center',
        paddingTop:15,
        paddingBottom:15,
        fontSize:16,
        fontWeight:'semibold',
    },
    subTxt:{
        color:'#077E8C'
    },
    TopContainer1:{
        flexDirection:'row',
        width:'90%',
        alignSelf:'center',
        gap:20
    },
        TopContainer2:{
        flexDirection:'row',
        width:'90%',
        alignSelf:'center',
        gap:20,
        marginTop:15
    },
    Tcontainer101:{
        backgroundColor:'#222222',
        padding:15,
        borderRadius:10,
        width:150,
        justifyContent:'center'
    },
        Tcontainer201:{
        backgroundColor:'#077E8C',
        padding:15,
        borderRadius:10,
        width:150,
        justifyContent:'center'
    },
        Tcontainer102:{
        backgroundColor:'#F29339',
        padding:15,
        borderRadius:10,
        width:150,
        justifyContent:'center'
    },
        Tcontainer202:{
        backgroundColor:'#D9512C',
        padding:15,
        borderRadius:10,
        width:150,
        justifyContent:'center'
    },
    TopTxt:{
        color:'#ffff',
        fontSize:16,
        textAlign:'center'
    },
    TopSubTxt:{
        color:'#ffff',
        paddingTop:2,
        textAlign:'center',
        fontSize:20
    },
    // analytics
    analyticsContainer:{
        width:'90%',
        alignSelf:'center',
        borderColor:'#2F2C2C',
        borderWidth:1,
        borderRadius:10,
        marginTop:20
    },
    // history section
    historyContainer:{
        marginTop:20,
        width:'90%',
        alignSelf:'center',
        borderRadius:10,
        padding:10
    },
    historyTopC:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingBottom:20,
    },
    orderContainer:{
        flexDirection:'column',
        backgroundColor:'#ffff',
        padding:10,
        borderRadius:10
    }
})