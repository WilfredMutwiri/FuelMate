import {View,Text,StyleSheet, ScrollView,TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {SERVER_URI} from '../../constants/SERVER_URI.jsx';
import useAuthStore from '../../zustand/store.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../../components/loader.jsx';

export default function Orders(){
    const user=useAuthStore((state)=>state.user)
    console.log(user.id)
    const [customerData,setCustomerData]=useState(null);
    const [Loading,setLoading]=useState(false);
    const [apiResponse,setAPIResponse]=useState(null)

    useEffect(() => {
    const getOrders = async () => {

        try {
            console.log("initiating orders fetch")
            setLoading(true);
            const response = await axios.get(`${SERVER_URI}/api/v1/order/customer/${user.id}`);
            const result = response.data;
            console.log(result)
            if (result.customerOrders) {
                setAPIResponse(result)
                setCustomerData(result.customerOrders);
                setLoading(false);
            }
        }
        catch (error) {
            console.log("API fetch error:", error.response?.data || error.message);
        }finally{
            setLoading(false);
        }
    };

    getOrders();

}, []);

useEffect(()=>{
console.log(customerData)
},[customerData])


    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.orderCont}>
                    <View>
                        <Text style={styles.orderID}>Hello <Text style={styles.subTxt}>{user?.username}</Text></Text>
                        <Text>Total orders placed : <Text style={styles.subTxt}>{apiResponse?.totalOrders || 0}</Text></Text>
                    </View>
                    {/* orders*/}
                    <View>
                        {
                            Loading?(
                            <View>
                                <Loader/>
                            </View>
                        ):(
                            <View style={{gap:10,marginTop:20}}>
                            {
                                customerData?.map((order,index)=>(
                                <View key={index._id || index} style={styles.orderContainer}>
                                    <Text style={styles.subTxt}>Order ID: {order._id}</Text>
                                    <Text>Delivery Location: {order?.location}</Text>
                                    <Text>Fuel Type: {order?.fuelType}</Text>
                                    <Text>Fuel Volume: {order?.fuelVolume} L</Text>
                                    <Text>Amount Charged : {order?.amount}</Text>
                        
                                    <View style={styles.StatusContainer}>
                                        <Text>Status : <Text style={styles.subTxt}>{order?.status}</Text></Text>
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
)
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    orderCont:{
        width:'85%',
        alignSelf:'center',
    },
    orderID:{
        fontSize:19,
        fontWeight:'bold',
        color:'#000',
        marginTop:20,
        marginBottom:10
    },
    subTxt:{
        color:'#05367C',
    },
    orderContainer:{
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius:10,
        padding:10
    }
})