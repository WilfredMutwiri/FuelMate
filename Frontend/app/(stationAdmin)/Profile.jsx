import {View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity,Linking} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import userImg from '../../assets/images/station1.jpg';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../zustand/store.jsx';
import Loader from '../../components/loader.jsx';
import {SERVER_URI} from '../../constants/SERVER_URI.jsx';
import ToastComponent from "../../components/Toast";


export default function Profile(){
    const station=useAuthStore((state)=>state.station);
    const [stationData,setStationData]=useState(null);
    const [Loading,setLoading]=useState(false);
    const [newFuelType, setNewFuelType] = useState('');
    const [newFuelPrice, setNewFuelPrice] = useState('');
    const [newService, setNewService] = useState('');
    const [stationStats,setStationStats]=useState([])


    console.log(station.id)

    useEffect(() => {
    const getStation = async () => {
        if (!station?.id) {
        console.log("station.id not yet available");
        return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URI}/api/v1/station/${station.id}`);
            const result = response.data;
            console.log(result)
            if (result.station) {
                setStationData(result.station);
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

// update station fuel data
const handleFuelUpdate = async () => {
    if (!stationData || !stationData.fuel) return;

    try {
        setLoading(true);
        const response = await axios.patch(`${SERVER_URI}/api/v1/station/${station.id}/update-fuel`, {
            fuel: stationData.fuel
        });

        if (response.data.success) {
            ToastComponent("success",`Fuel data updated successfully!`);  
        } else {
            ToastComponent("error",`Update failed.Please try again!`);  
        }
    } catch (error) {
        console.log("Update fuel error:", error.message);
         ToastComponent("error",`An error occurred while updating fuel data!`);  
    } finally {
        setLoading(false);
    }
};

// delete station fuel data
const handleDeleteFuel = async (indexToDelete) => {
    const updatedFuel = stationData.fuel.filter((_, index) => index !== indexToDelete);
    setStationData({ ...stationData, fuel: updatedFuel });

    try {
        setLoading(true);
        const response = await axios.patch(`${SERVER_URI}/api/v1/station/${station.id}/update-fuel`, {
            fuel: updatedFuel
        });

        if (response.data.success) {
            ToastComponent("success", `Fuel type deleted successfully!`);
        } else {
            ToastComponent("error", `Failed to delete fuel type`);
        }
    } catch (error) {
        console.log("Fuel deletion update error:", error.message);
        ToastComponent("error", "Something went wrong while deleting fuel type.");
    } finally {
        setLoading(false);
    }
};

// add station services
const handleAddService = async () => {
  if (!newService.trim()) return ToastComponent("error", "Enter a service name");

  try {
    setLoading(true);
    const response = await axios.patch(`${SERVER_URI}/api/v1/station/${station.id}/add-service`, {
      services: [newService.trim()]
    });

    if (response.data.success) {
      ToastComponent("success", "Service added successfully!");
      setStationData(prev => ({
        ...prev,
        services: response.data.services
      }));
      setNewService('');
    } else {
      ToastComponent("error", "Could not add service");
    }
  } catch (err) {
    console.log("Add service error:", err.message);
    ToastComponent("error", "Error adding service");
  } finally {
    setLoading(false);
  }
};

// delete station services
const handleDeleteService = async (serviceToDelete) => {
  try {
    setLoading(true);
    const response = await axios.patch(`${SERVER_URI}/api/v1/station/${station.id}/delete-service`, {
      services: [serviceToDelete]
    });

    if (response.data.success) {
      ToastComponent("success", "Service removed successfully!");
      setStationData(prev => ({
        ...prev,
        services: response.data.services
      }));
    } else {
      ToastComponent("error", "Failed to remove service");
    }
  } catch (err) {
    console.log("Delete service error:", err.message);
    ToastComponent("error", "Error deleting service");
  } finally {
    setLoading(false);
  }
};

// close/open station
const toggleOpenStatus = async () => {
  try {
    setLoading(true);
    const response = await axios.patch(`${SERVER_URI}/api/v1/station/${station.id}/toggle-open`);
    ToastComponent("success", response.data.message);

    // Refresh stationData
    const updatedStation = await axios.get(`${SERVER_URI}/api/v1/station/${station.id}`);
    setStationData(updatedStation.data.station);
  } catch (error) {
    ToastComponent("error", error.response?.data?.message || "Could not toggle open status");
  } finally {
    setLoading(false);
  }
};

//fetching the station stats-likes-dislikes
    useEffect(() => {
        const getStationStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${SERVER_URI}/api/v1/station/${station.id}/stats`);
                const result = response.data;
                if (result.success) {
                    setStationStats(result);
                }
            }
            catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getStationStats();
    },[station.id])

    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.profileCont}>
                    {
                        Loading?(
                            <Loader/>
                        ):(
                            <>
                        {/* header section */}
                        <View style={styles.header}>
                            <Image source={{uri:stationData?.profileImg} || userImg} style={styles.profileImg}/>
                            <View>
                                <Text style={styles.label}>{stationData?.stationName}</Text>
                                <Text style={styles.subTitle}>{stationData?.county} - <Text>{stationData?.town}</Text></Text>
                            </View>
                        </View>
                        {/* status container */}
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusTxt}>Status <Text style={styles.subTitle}>{stationData?.status}</Text></Text>
                            {
                            stationData?.status === "Approved" ? null : (
                            
                            <Text style={{ color: "red", marginTop: 10 }}>
                                To have your station approved and visible to users, please ensure you’ve added{' '}
                                <Text style={{ fontWeight: 'bold' }}>at least one fuel type with a valid price</Text> and{' '}
                                <Text style={{ fontWeight: 'bold' }}>a valid business registration certificate</Text>.
                            </Text>
                            )}
                        </View>

                        {/* station open/close status */}
                        <View style={styles.MetaInfo2}>
                        <FontAwesome6
                            name={stationData?.isOpen ? "door-open" : "door-closed"}
                            size={18}
                            color={stationData?.isOpen ? "#28a745" : "#dc3545"}
                            style={{ marginRight: 10 }}
                        />
                        <View>
                        <Text style={{ fontWeight: "600", fontSize: 16 }}>
                            {stationData?.isOpen ? "Open Now" : "Closed"}
                        </Text>
                        <Text style={styles.subTxt}>
                            {stationData?.isOpen ? "We're currently serving customers" : "We'll be back soon"}
                        </Text>
                        </View>
                    </View>

                    {/* close/open station */}
                    <TouchableOpacity
                        style={{
                        backgroundColor: stationData?.isOpen ? '#dc3545' : '#28a745',
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 10,
                        marginBottom:10,
                        alignItems: 'center'
                    }}
                        onPress={toggleOpenStatus}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {stationData?.isOpen ? "Close Station" : "Open Station"}
                        </Text>
                    </TouchableOpacity>
                        {/* data section */}
                        {/* ratings */}
                        <View style={styles.likesContainer}>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingTxt}>{stationStats.starsRating}</Text>
                                <FontAwesome6 name="star" size={18} color="#ff6d1f"/>
                            </View>
                            <View style={styles.ratingContainer}>
                                <FontAwesome6 name="thumbs-up" size={18} color="#ff6d1f"/>
                                <Text>{stationStats.likes || 0}</Text>
                            </View>
                            <View style={styles.ratingContainer}>
                                <FontAwesome6 name="thumbs-down" size={18} color="red"/>
                                <Text>{stationStats.dislikes || 0}</Text>
                                </View>
                            </View>
                        <View>
                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Phone Number</Text>
                                <Text style={styles.subTitle}>{stationData?.phoneNo}</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Email Address</Text>
                                <Text style={styles.subTitle}>{stationData?.email}</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Physical Address</Text>
                                <Text style={styles.subTitle}>{stationData?.physicalAddress}</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>B/S Registration Number</Text>
                                <Text style={styles.subTitle}>{stationData?.RegNo}</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Registration Certificate</Text>
                                <TouchableOpacity onPress={() => {
                                    if (stationData?.BusinessCert) {
                                    Linking.openURL(stationData.BusinessCert);
                                }}}>
                                    <Text style={[styles.subTitle, { color: '#077E8C', textDecorationLine: 'underline'}]}>
                                        View Certificate
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Services Offered</Text>
                                <View style={{ marginBottom: 10 }}>
                                    {stationData?.services?.map((service, idx) => (
                                    <View
                                        key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                                        <Text style={{ flex: 1 }}>{service}</Text>
                                        <TouchableOpacity onPress={() => handleDeleteService(service)}>
                                            <FontAwesome6 name="trash-can" size={16} color="red" />
                                        </TouchableOpacity>
                                    </View>))}
                                </View>

                                {/* Add new service input */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <TextInput
                                    placeholder="Enter new service"
                                    value={newService}
                                    onChangeText={setNewService}
                                    style={[styles.priceInput, { flex: 1 }]}
                                />
                                <TouchableOpacity onPress={handleAddService}>
                                    <Text style={{ color: '#077E8C', marginTop: 5 }}>Add</Text>
                                </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.dataContainer}>
                            
                                <Text style={styles.label}>Fuel Types & Prices</Text>
                                {
                                    stationData?.fuel?.map((item, index) => (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                        <Text style={{ flex: 1 }}>{item.type}</Text>
                                    <TextInput
                                        style={styles.priceInput}
                                        keyboardType="numeric"
                                        value={String(item.price)}
                                        onChangeText={(text) => {
                                        const updatedFuel = [...stationData.fuel];
                                        updatedFuel[index].price = text === '' ? '' : parseFloat(text);
                                        setStationData({ ...stationData, fuel: updatedFuel });
                                        }}
                                        />
                                        {/* delete fuel type and price */}
                                        <TouchableOpacity onPress={() => handleDeleteFuel(index)}>
                                            <FontAwesome6 style={{margin:5}} name="trash-can" size={18} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                    ))}
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{marginBottom:8,fontWeight:500}}>Add New Fuel Type</Text>
                                        <Text style={{ fontSize: 12, color: 'gray',paddingBottom:8 }}>
                                            Allowed: petrol, diesel, kerosene, lpg, electric,cng,electric,biodiesel,ethanol.
                                        </Text>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <TextInput
                                        placeholder="Type (e.g. petrol)"
                                        style={styles.priceInput}
                                        value={newFuelType}
                                        onChangeText={setNewFuelType}
                                    />
                                    <TextInput
                                        placeholder="Price"
                                        style={styles.priceInput}
                                        keyboardType="numeric"
                                        value={newFuelPrice}
                                        onChangeText={setNewFuelPrice}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                        if (newFuelType && newFuelPrice) {
                                        const newFuel = {
                                        type: newFuelType.trim().toLowerCase(),
                                        price: parseFloat(newFuelPrice)
                                        };
                                        setStationData({
                                        ...stationData,
                                        fuel: [...stationData.fuel, newFuel]
                                        });
                                        setNewFuelType('');
                                        setNewFuelPrice('');
                                    }}}
                                    >
                                        <Text style={{ color: '#077E8C', marginTop: 10 }}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* save update changes */}
                                    <TouchableOpacity
                                    style={styles.updateBtn}
                                    onPress={handleFuelUpdate}
                                    >
                                        <Text style={styles.btnTxt}>Save Fuel Changes</Text>
                                    </TouchableOpacity>
                            </View>
                            </View>
                            </View>

                        {/* buttons */}
                        <View style={styles.BTNsContainer}>
                        <TouchableOpacity style={styles.signoutBtn}
                            onPress={()=>router.push("/StationSignin")}
                        >
                            <Text style={styles.btnTxt}>Signout</Text>
                            <FontAwesome6 name="right-from-bracket" size={18} color="#ffff"/>
                        </TouchableOpacity>

                        </View>
                        </>
                        )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1
    },
    profileCont:{
        width:'90%',
        alignSelf:'center',
        paddingTop:25,
        paddingBottom:50
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        marginBottom:20,
        gap:10,
        borderWidth:1,
        borderColor:'#E19540',
        borderRadius:10,
        padding:10  
    },
    profileImg:{
        width:50,
        height:50,
        resizeMode:'cover',
        alignSelf:'center',
        borderRadius:50,
    },
    dataContainer:{
        borderWidth:1,
        borderColor:'#E19540',
        borderRadius:10,
        padding:10,
        marginTop:10
    },
    label:{
        fontSize:16,
        color:'#000',
        fontWeight:'500'
    },
    subTitle:{
        color:"#05367C",
        paddingTop:5
    },
    BTNsContainer:{
        flexDirection:'column',
        justifyContent:'center',
        marginTop:20,
        justifyContent:'space-between',
        marginTop:"10%"
    },
    signoutBtn:{
        backgroundColor:'#E42629',
        width:'45%',
        padding:13,
        borderRadius:10,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    updateBtn:{
        backgroundColor:'#05367C',
        width:'45%',
        alignSelf:'center',
        padding:13,
        marginTop:10,
        borderRadius:10,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    btnTxt:{
        textAlign:'center',
        color:'#ffff'
    },
    statusContainer:{
        alignItems:'center',
        paddingBottom:15
    },
    priceInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 6,
    flex: 1,
    marginRight: 5,
},
updateBtn: {
    marginTop: 20,
    backgroundColor: '#077E8C',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
},
deleteText: {
    color: 'red',
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 4
},
likesContainer:{
    flexDirection:'row',
    gap:20,
    paddingTop:10,
    paddingBottom:10,
    alignSelf:'center'
},
ratingContainer:{
    flexDirection:'row',
    gap:5
}
})