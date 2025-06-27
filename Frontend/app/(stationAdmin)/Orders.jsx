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


import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert,Platform } from 'react-native';

export default function OrdersScreen() {

    const station=useAuthStore((state)=>state.station)

    const [stationData,setStationData]=useState(null);
    const [normalOrders, setNormalOrders] = useState([]);
    const [emergencyData,setEmergencyData]=useState([])

    const [Loading,setLoading]=useState(false);
    const [modalOpen,setModalOpen]=useState(false);
    const [modal2Open,setModal2Open]=useState(false)
    const [orderStatus, setOrderStatus] = useState('received');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [emergencyOrders,setEmergencyOrders]=useState(null);
    const [apiResponse,setAPIResponse]=useState(0);




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
                setNormalOrders(result.stationOrders);
                setAPIResponse(result.totalOrders)
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

    // update emergency order
    const updateEmergencyOrder = async () => {
        try {
            if(!selectedOrderId) return;

            setLoading(true);
            const response = await axios.patch(`${SERVER_URI}/api/v1/order/emergency/${selectedOrderId}/update/`,{
                newStatus:orderStatus
            });
            const result = response.data;
            console.log(result)
            if (result.success) {
                setLoading(true)
                const response = await axios.get(`${SERVER_URI}/api/v1/order/emergency/station/${station.id}`);
                const result = response.data;
                // console.log(result)
                if (result.success) {
                    setEmergencyOrders(result.total);
                    setEmergencyData(result.orders)
                    setLoading(false);
                } else {
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
            setModal2Open(false)
            setSelectedOrderId(null)
        }
    };

    // get emergency orders
        useEffect(() => {
        const getEmergencyOrders= async () => {
        if (!station?.id) {
        console.log("station.id not yet available");
        return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URI}/api/v1/order/emergency/station/${station.id}`);
            const result = response.data;
            if (result.success) {
                setEmergencyOrders(result.total);
                setEmergencyData(result.orders)
                setLoading(false);
            }
        }
        catch (error) {
            console.log("an error occured",error.message);
            ToastComponent("error",error.message)
        }
        setLoading(false);
        };
        getEmergencyOrders();
    }, []);


const handleReceiptDownload = async (orderId) => {
  try {
    const url = `${SERVER_URI}/api/v1/order/${orderId}/receipt`;
    const fileUri = FileSystem.documentDirectory + `fuelmate_receipt_${orderId}.pdf`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/pdf',
      },
    });

    const blob = await response.blob();

    const reader = new FileReader();

    // Set up the onloadend callback
    reader.onloadend = async () => {
      try {
        const base64data = reader.result.split(',')[1];

        // Save the base64 PDF to local file
        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Share or alert
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
        ToastComponent("success","Receipt downloaded successfully!")
        }
      } catch (err) {
        console.error("Error saving PDF:", err.message);
        ToastComponent("error","Failed to save or share receipt")
      }
    };

    reader.onerror = (err) => {
      console.error("FileReader error:", err);
      Alert.alert("Error", "Failed to read PDF blob.");
    };

    // Start reading the blob
    reader.readAsDataURL(blob);

  } catch (error) {
    console.error("Receipt download failed:", error.message);
    Alert.alert("Download Error", "Failed to generate or open the receipt.");
  }
};


  return (
    <SafeAreaView style={styles.container} edges={['left','right']}>
        <ScrollView
        contentContainerStyle={{paddingBottom:50}}
        >
            <View style={styles.historyContainer}>
            <View style={styles.ordersSummary}>
                <Text>Normal orders : <Text>{apiResponse || 0}</Text></Text>
                <Text style={styles.subTxt}>Emergency orders : <Text>{emergencyOrders || 0}</Text></Text>
            </View>
                {
                    Loading?(
                        <View>
                            <Loader/>
                        </View>
                    ):(
                        <>
                        <View style={{gap:10,}}>
                        
                        {/* emergency orders */}
                            {
                                emergencyData?.map((order,index)=>(
                                <View key={index._id || index} style={styles.orderContainer}>
                                    <Text style={styles.subTxt}>Order ID: {order._id}</Text>
                                    <Text>Customer Name: {order?.clientName}</Text>
                                    <Text>Customer Contact: {order?.clientPhone}</Text>
                                    <Text>Customer Location: {order?.readableLocation}</Text>
                                    <Text>Fuel Type: {order?.fuelType}</Text>
                                    <Text>Fuel Volume: {order?.fuelVolume} L</Text>
                                    <Text style={{paddingTop:10,color:'#077E8C'}}>~emergency order~</Text>
                                    
                                    <View style={styles.StatusContainer}>
                                        <Text>Status : <Text style={styles.subTxt}>{order?.status}</Text></Text>
                                        <TouchableOpacity style={styles.BTNContainer} 
                                        onPress={()=>{
                                            setSelectedOrderId(order._id)
                                            setModal2Open(!modal2Open)
                                        }
                                        }>
                                            <Text style={styles.BtnTxt}>Update</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.BTNContainer} 
                                            onPress={() => handleReceiptDownload(order._id)}
                                        >
                                            <Text style={styles.BtnTxt}>Download Receipt</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                ))
                            }                                    
                    <Text> - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                                    
                    {/* normal order */}
                    {
                        normalOrders?.map((order,index)=>(
                            <View key={index._id || index} style={styles.orderContainer}>
                                    <Text style={styles.subTxt}>Order ID: {order._id}</Text>
                                    <Text>Customer Location: {order?.location}</Text>
                                    <Text>Customer Contact: {order?.clientPhoneNo}</Text>
                                    <Text>Fuel Type: {order?.fuelType}</Text>
                                    <Text>Fuel Volume: {order?.fuelVolume} L</Text>
                                    <Text>Amount Charged : {order?.amount}</Text>
                                    
                                    <Text style={{paddingTop:10,color:'#077E8C'}}>~normal order~</Text>


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
                                        <TouchableOpacity style={styles.BTNContainer} 
                                            onPress={() => handleReceiptDownload(order._id)}
                                        >
                                            <Text style={styles.BtnTxt}>Download Receipt</Text>
                                        </TouchableOpacity>
                                    </View>
                            </View>
                        ))
                    }

                    {/* modal section */}
                    {/* modal one */}
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

                    {/* modal two */}
                    <View>
                    <Modal
                        visible={modal2Open}
                        animationType='slide'
                        transparent={true}
                        onRequestClose={()=>setModal2Open(!modal2Open)}
                        >
                        <TouchableWithoutFeedback onPress={()=>setModal2Open(!modal2Open)}>
                            <View style={styles.modalOverlay}>
                            {
                                Loading?(
                                    <Loader/>
                                ):(
                                    <>
                            <Text style={styles.modalText}>Update Emergency Order</Text>
                            <Text style={styles.introText}>Select Order status</Text>
                        <Picker
                        selectedValue={orderStatus}
                        onValueChange={(itemValue) => setOrderStatus(itemValue)}
                        style={styles.picker}
                        >
                            <Picker.Item label="Accepted" value="accepted"/>
                            <Picker.Item label="Rejected" value="rejected"/>
                            <Picker.Item label="Delivered" value="delivered"/>
                        </Picker>
                        <TouchableOpacity onPress={updateEmergencyOrder} style={styles.updateBtn}>
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
                </>
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
  },
    ordersSummary:{
        flexDirection:'row',
        justifyContent:"space-between",
        paddingBottom:20
    }
})