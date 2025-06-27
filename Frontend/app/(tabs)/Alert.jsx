import {View,Text,StyleSheet, ScrollView,TextInput, TouchableOpacity,Modal,TouchableWithoutFeedback} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAuthStore from '../../zustand/store.jsx';
import React,{useState,useEffect} from 'react'
import ToastComponent from "../../components/Toast";
import {SERVER_URI} from '../../constants/SERVER_URI.jsx';
import axios from 'axios'
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Loader from '../../components/loader.jsx';

export default function Alert(){
    const router=useRouter();
    const user=useAuthStore((state)=>state.user)
    const [loading,setLoading]=useState(false);
    const [nearbyStations,setNearbyStations]=useState([]);
    const [location,setLocation]=useState(null);
    const [locationName,setLocationName]=useState(null);
    const [modalOpen,setModalOpen]=useState(false);
    const [sendingSmS,setSendingSmS]=useState(false);
    const [adminNo,setAdminNo]=useState(null)

    

    const [formData,setFormData]=useState({
        clientName:'',
        clientPhone:'',
        fuelType:'',
        fuelVolume:'',
        urgency:'',
        message:'',
        clientLocation:'',
        readableLocation:''
    });

    // get user's current location
    useEffect(()=>{
        setLoading(true);

        (async () =>{
            try {
            
            let {status}=await Location.requestForegroundPermissionsAsync();

            if(status!='granted'){
                Alert.alert("permission denied","Location is required to show your current location");
                return
            }
    
            let currentLocation=await Location.getCurrentPositionAsync({});
            
            const coords = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            };
            setLocation(coords);

            let addressArray=await Location.reverseGeocodeAsync(currentLocation.coords);
            if(addressArray.length>0){
                const address=addressArray[0];
                setLocationName(`${address.name} | ${address.city} | ${address.region}`)
            }

            console.log("current location nam",locationName)

            setFormData(prev => ({
                ...prev,
                clientName: user?.username || '',
                clientPhone: user?.phoneNo || '',
                readableLocation:locationName || '',
                clientLocation: {
                    type: 'Point',
                    coordinates: [coords.longitude, coords.latitude]
                }
            }));
    
            // Get nearby stations
            setLoading(true)
            const response=await axios.get(`${SERVER_URI}/api/v1/station/nearby`,{
                params:{
                    latitude:currentLocation.coords.latitude,
                    longitude:currentLocation.coords.longitude,
                }
            });
    
            const result=response.data;
            if(result.success){
                setNearbyStations(result.stations);
            }
        } catch (error) {
            console.log("An error occured",error.message);    
        }finally{
            setLoading(false)
        }
        })();
    },[])
    
    

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
        ...prev,
        [name]: value,
        clientName: user?.username || prev.clientName,
        clientPhone: user?.phoneNo || prev.clientPhone,
        readableLocation:locationName || '',
        clientLocation: {
        type: 'Point',
        coordinates: [location?.longitude, location?.latitude]
        } || prev.clientLocation
    }));
};


    // request fuel
    const handleFuelRequest=async(req,res)=>{
        setLoading(true)

        const {
            clientName,
            clientPhone,
            fuelType,
            fuelVolume,
            urgency,
            message,
            clientLocation,
            readableLocation
        } = formData;

        if (
            !clientName ||
            !clientPhone ||
            !fuelType ||
            !fuelVolume ||
            !urgency ||
            !message ||
            !clientLocation ||
            !clientLocation.coordinates ||
            clientLocation.coordinates.length !== 2
        ) {
            ToastComponent("error", "Please fill all fields before submitting the order.");
            setLoading(false);
            return;
        }

        try {
            
            if (!formData.clientLocation || !formData.clientLocation.coordinates || formData.clientLocation.coordinates.length !== 2) {
                return ToastComponent("error", "Location not ready. Please wait a moment and try again.");
            }  
            
            console.log("data being sent is: ",formData)
                
            const response=await axios.post(`${SERVER_URI}/api/v1/order/emergency/create/${user.id}`,{
                ...formData
            })

            const result=response.data;
            console.log(result);

            if(response.data.success){
                ToastComponent("success","Order placed successfully!");
                router.push('/Orders')
            }

        } catch (error) {
            ToastComponent("error","Error placing order! Please try again")
            console.log(error.message);
            return
        }
    }

    // get admin info
useEffect(() => {
  const getAdminInfo = async () => {
    try {
      const response = await axios.get(`${SERVER_URI}/api/v1/users/admins`);
      const data = response.data;

      if (data.success && data.adminsInfo.length > 0) {
        let rawPhone = data.adminsInfo[0].phoneNo.toString();

        // format to +254
        if (!rawPhone.startsWith('+')) {
          rawPhone = `+254${rawPhone.replace(/^0+/, '')}`;
        }

        console.log("Formatted admin number:", rawPhone);

        setAdminNo(rawPhone);

        setFormData2(prev => ({
          ...prev,
          phoneNo: rawPhone
        }));
      }
    } catch (error) {
      console.log("Failed to fetch admin info:", error.message);
    }
  };

  getAdminInfo();
}, []);



    // sms formdata
    const fullPhoneNumber = "+254770250898";

    console.log("admin number is ",adminNo)

    const [formData2,setFormData2]=useState({
        message:'',
        phoneNo:'0775720540'
    })

    const handleInputChange2 = (name, value) => {
        setFormData2(prev => ({
        ...prev,
        [name]: value,
    }));
};

// handle sms sending
const handleSmsSending=async(req,res)=>{
      setSendingSmS(true);
      console.log("sending sms initiated")
      try {
        console.log("sending sms now!")
        const response=await axios.post(`${SERVER_URI}/api/v1/user/send-sms/`,{
            ...formData2
        })
        
        const result=response.data;
        if(result.status==="Success"){
            console.log("sms sent")
            setModalOpen(false);
            ToastComponent("success","Message sent successfully!")
        }else{
            console.log("An error occured")

        }

      } catch (error) {
        console.log(error)
        ToastComponent("error",error.message)
      }finally{
        setSendingSmS(false)
      }

}


    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 20}
        >
        <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.emergencyCont}>
                    <View>

                        <Text style={styles.IntroTxt}>
                            Out of fuel? Help is on the way. Request emergency fuel and our nearest station will deliver it right to you.
                        </Text>

                    </View>
                    {/* form section */}
                    <View style={styles.formContainer}>
                        <View>
                            <Text style={styles.label}>Fuel Type</Text>
                            <TextInput
                                placeholder='e.g diesel'
                                style={styles.textInput}
                                value={formData.fuelType}
                                onChangeText={(text)=>handleInputChange('fuelType',text)}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Enter Fuel Volume</Text>
                            <TextInput
                                placeholder='20 L'
                                keyboardType='numeric'
                                style={styles.textInput}
                                value={formData.fuelVolume}
                                onChangeText={(text)=>handleInputChange('fuelVolume',text)}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Preferred Delivery Time</Text>
                            <TextInput
                                placeholder='Immediately'
                                style={styles.textInput}
                                value={formData.urgency}
                                onChangeText={(text)=>handleInputChange('urgency',text)}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Message</Text>
                            <TextInput
                                placeholder="E.g., Hello, I'm stranded near ABC Highway. Please send fuel ASAP."
                                style={styles.textInput}
                                value={formData.message}
                                onChangeText={(text)=>handleInputChange('message',text)}
                                multiline
                                numberOfLines={4}
                                maxLength={300}
                            />
                        </View>

                        {/* submit btn */}
                        <TouchableOpacity style={styles.submitBtn} 
                        onPress={handleFuelRequest}
                        >
                            <Text style={styles.btnTxt}>Order Now!</Text>
                        </TouchableOpacity>

                        {/* initiate sending admin offline sms */}
                        <TouchableOpacity style={styles.submitBtn} 
                        onPress={()=>setModalOpen(!modalOpen)}
                        >
                            <Text style={styles.btnTxt}>Send offline message to support</Text>
                        </TouchableOpacity>
                    </View>

                    {/* modal section */}

                    <Modal
                        visible={modalOpen}
                        animationType='slide'
                        transparent={true}
                        onRequestClose={()=>setModalOpen(!modalOpen)}
                        >
                        <TouchableWithoutFeedback onPress={()=>setModalOpen(!modalOpen)}>
                            <View style={styles.modalOverlay}>
                                <View>
                                    {
                                        sendingSmS?(
                                        <View style={{flexDirection:'column'}}>
                                                <Loader/>
                                                <Text style={{color:"#ff6d1f",textAlign:"center",paddingTop:20}}>Sending Message...Please wait!</Text>
                                        </View>
                                        ):(
                                            <Text>Message sent</Text>
                                        )
                                    }
                                    <Text style={styles.modalText}>Send Offline Message</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData2.message}
                                        onChangeText={(text)=>handleInputChange2('message',text)}
                                        placeholder='Hello support, I need fuel Immediately...'
                                        multiline
                                        numberOfLines={40}
                                        maxLength={500}
                                    />
                                <TouchableOpacity style={styles.submitBtn} 
                                onPress={handleSmsSending}
                                >
                                    <Text style={styles.btnTxt}>Send Message</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        </Modal>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1
    },
    emergencyCont:{
        width:'90%',
        alignSelf:'center',
        paddingTop:10,
        paddingBottom:50
    }
    ,
    IntroTxt:{
        paddingTop:15,
        textAlign:'center',
        fontSize:14,
        color:'#00478F'
    },
    IntroSubTxt:{
        paddingTop:15,
        textAlign:'center',
        color:'#10AB10'
    },
    formContainer:{
        paddingTop:20,
        gap:15
    },
    textInput:{
        borderRadius:10,
        borderWidth:1,
        borderColor:'#D9D9D9',
        marginTop:10
    },
    label:{
        paddingLeft:4
    },
    submitBtn:{
        backgroundColor:'#00478F',
        width:'85%',
        alignSelf:'center',
        padding:10,
        marginTop:10,
        borderRadius:10
    },
    btnTxt:{
        textAlign:'center',
        color:'#ffff'
    },
    modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    width:"90%",
    alignSelf:"center",
    borderRadius:10,
    height:450,
    padding:20,
    marginTop:100,
    paddingTop:40
  },
    modalText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color:"#ffff",
    textAlign:'center',
    paddingTop:10
  },
  input:{
    backgroundColor:"#ffff",
    marginTop:10,
    borderRadius:10,
    height:180,
    marginBottom:15,
    textAlignVertical: 'top',
},
})