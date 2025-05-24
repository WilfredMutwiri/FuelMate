import { useLocalSearchParams } from 'expo-router';
import { View, Text,StyleSheet,Image, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import axios from 'axios';
import { useEffect, useState } from 'react';
// import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
// import Loader from '../../components/loader.jsx';

export default function StationOrders() {

  return (
    <SafeAreaView style={styles.container} edges={['left','right']}>
        <ScrollView
        contentContainerStyle={{paddingBottom:50}}
        >
            <View>
                <Text>Orders</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    ImageContainer:{
        width:"100%",
        height:250,
    },
    stationImg:{
        width:"100%",
        height:"100%",
        resizeMode:"cover"
    },
    Stationinfo:{
        padding:15,
        gap:20
    },
    topInfo:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    ratingContainer:{
        flexDirection:'row',
        gap:10,
        paddingTop:5
    },
    ratingTxt:{
        fontSize:16
    },
    stationName:{
        fontWeight:'semibold',
        fontSize:20,
        color:"#00478F"
    },
    likesContainer:{
        flexDirection:'row',
        gap:30
    },
    locationContainer:{
        flexDirection:'column',
        gap:10
    },
    headingTxt:{
        fontWeight:'semibold',
        fontSize:18,
        color:'#525151'
    },
    MetaConatiner:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    MetaInfo:{
        flexDirection:'row',
        gap:20,
        backgroundColor:'#E3E2E2',
        padding:10,
        width:'43%',
        borderRadius:10
    },
    gasContainer:{
        flexDirection:'row',
        paddingTop:10,
        gap:40
    },
    gas:{
    backgroundColor:'#E3E2E2',
    padding:5,
    width:"25%",
    alignItems:'center',
    borderRadius:10
    },
    lowerInfoContainer:{
        paddingBottom:20
    },
    priceContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop:10,
        paddingBottom:20
    },
    price:{
        fontWeight:'semibold',
        fontSize:24,
        color:"#ff6d1f"
    },
    orderBtn:{
        backgroundColor:"#00478F",
        padding:10,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    },
    orderTxt:{
        color:"#fff"
    }
})