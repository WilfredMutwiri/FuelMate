import {View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import userImg from '../../assets/images/station1.jpg';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../zustand/store.jsx';
import Loader from '../../components/loader.jsx';
import {SERVER_URI} from '../../constants/SERVER_URI.jsx';


export default function Profile(){
    const station=useAuthStore((state)=>state.station);
    const [stationData,setStationData]=useState(null);
    const [Loading,setLoading]=useState(false);
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

console.log("station data",stationData)
console.log(stationData?.county)

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
                            <Text style={styles.statusTxt}>Status <Text style={styles.subTitle}>Approved</Text></Text>
                        </View>
                        {/* data section */}
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
                                <Text style={styles.subTitle}>{stationData?.BusinessCert}</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Services Offered</Text>
                                <Text style={styles.subTitle}>{stationData?.services.join(' ')}</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Fuel Types Available</Text>
                                <Text style={styles.subTitle}>{stationData?.fuel.join(' ')}</Text>
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

                        {/* <TouchableOpacity style={styles.updateBtn}>
                            <Text style={styles.btnTxt}>Update Profile</Text>
                            <FontAwesome6 name="pen" size={18} color="#ffff"/>
                        </TouchableOpacity> */}

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
        gap:25,
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
    },
    BTNsContainer:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
        justifyContent:'space-between',
        marginTop:"50%"
    },
    signoutBtn:{
        backgroundColor:'#E42629',
        width:'85%',
        alignSelf:'center',
        padding:13,
        marginTop:10,
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
        paddingBottom:10
    }
})