import { useLocalSearchParams } from 'expo-router';
import { View, Text,StyleSheet,Image, ScrollView, TouchableOpacity,Modal, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
import Loader from '../../components/loader.jsx';
import useAuthStore from '../../zustand/store.jsx';
import { Picker } from '@react-native-picker/picker';
import ToastComponent from "../../components/Toast";

export default function OrdersScreen() {

    const station=useAuthStore((state)=>state.station)
    const [stationData,setStationData]=useState(null);
    const [Loading,setLoading]=useState(false);
    const [modalOpen,setModalOpen]=useState(false);
    const [orderStatus, setOrderStatus] = useState('received');
    const [selectedOrderId, setSelectedOrderId] = useState(null);


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
    
// update order status
    const updateOrder = async () => {
        try {
            if(!selectedOrderId) return;

            setLoading(true);
            const response = await axios.patch(`${SERVER_URI}/api/v1/order/update/${selectedOrderId}`,{
                newStatus:orderStatus
            });
            const result = response.data;
            console.log(result.order)
            if (result.success) {
                setLoading(true)
                const response = await axios.get(`${SERVER_URI}/api/v1/order/station/${station.id}`);
                const result = response.data;
                if (result.stationOrders) {
                    setStationData(result.stationOrders);
                    setLoading(false);
                }
                 
            } else {
                console.log("Update Failed")
            }
        }
        catch (error) {
            ToastComponent("error",error.message)
            console.log(error)
        }finally{
            setLoading(false);
            setModalOpen(false)
            setSelectedOrderId(null)
        }
    };

    console.log(orderStatus)

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
                                            <TouchableOpacity style={styles.BTNContainer} 
                                            onPress={()=>{
                                                setSelectedOrderId(order._id)
                                                setModalOpen(!modalOpen)
                                            }
                                            }>
                                                <Text style={styles.BtnTxt}>Update</Text>
                                            </TouchableOpacity>
                                    </View>
                            </View>
                        ))
                    }

                    {/* modal section */}
                    <View>
                    <Modal
                        visible={modalOpen}
                        animationType='slide'
                        transparent={true}
                        onRequestClose={()=>setModalOpen(!modalOpen)}
                        >
                        <TouchableWithoutFeedback onPress={()=>setModalOpen(!modalOpen)}>
                            <View style={styles.modalOverlay}>
                            {
                                Loading?(
                                    <Loader/>
                                ):(
                                    <>
                            <Text style={styles.modalText}>Update Order</Text>
                            <Text style={styles.introText}>Select Order status</Text>
                        <Picker
                        selectedValue={orderStatus}
                        onValueChange={(itemValue) => setOrderStatus(itemValue)}
                        style={styles.picker}
                        >
                            <Picker.Item label="Received" value="received"/>
                            <Picker.Item label="Approved" value="approved"/>
                            <Picker.Item label="Delivered" value="delivered"/>
                            <Picker.Item label="Canceled" value="canceled"/>
                        </Picker>
                        <TouchableOpacity onPress={updateOrder} style={styles.updateBtn}>
                            <Text style={styles.updateTxt}>Update Order</Text>
                        </TouchableOpacity>
                        </>
                        )
                    }
                    </View>
                    </TouchableWithoutFeedback>    
                    </Modal>
                    </View>
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
    },
    modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width:"90%",
    alignSelf:"center",
    borderRadius:10,
    height:250,
    padding:20,
    marginTop:100
  },
    modalText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color:"#ffff"
  },
  introText:{
    color:"#ffff"
  },
  picker:{
    color:'#077E8C',
    backgroundColor:"#ffff",
    marginTop:15,
    borderRadius:10
  },
  updateBtn:{
    backgroundColor:"#077E8C",
    marginTop:25,
    padding:10,
    borderRadius:10
  },
  updateTxt:{
    textAlign:'center',
    color:"#ffff"
  }
})