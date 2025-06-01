import {View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import userImg from '../../assets/images/station1.jpg';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {documentPicker} from '../../components/filePicker.jsx'

export default function Profile(){
    const [fileUrl,setFileUrl]=useState(null);
    const [uploadedFile,setUploadedFile]=useState(null);

        const handleFileUpload=async()=>{
            const result=await documentPicker();
            if(result){
                setUploadedFile(result);
                const formData=new FormData();
                formData.append('file', {
                    uri: result.uri,
                    type: result.type || result.mimeType || 'application/octet-stream',
                    name: result.name || `file-${Date.now()}`,
                });
    
                try {
                    const response=await axios.post(`${SERVER_URI}/api/v1/upload`,formData,{
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                    console.log("File uploaded successfully",response.data);
                    setFileUrl(response.data.fileUrl);
                } catch (error) {
                    console.error("Error uploading file",error);
                }
            }
        }
    
        useEffect(()=>{
            if(uploadedFile){
                console.log("The uploaded file is", uploadedFile)
                console.log("File URL is", fileUrl);
            }
        },[uploadedFile,fileUrl])

        useEffect(()=>{
            if(fileUrl){
                console.log("File URL is", fileUrl);
            }
        },[fileUrl])


    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.profileCont}>
                    {/* header section */}
                        <View style={styles.header}>
                            <Image source={fileUrl?{uri:fileUrl}:userImg} style={styles.profileImg}/>
                            <TouchableOpacity onPress={handleFileUpload}
                            style={{marginLeft:-35,marginTop:20,backgroundColor:'gray',padding:5,borderRadius:15}}
                            >
                                <FontAwesome6 name="pen" size={16} color="#05367C"/>
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.label}>Kilimambogo Station</Text>
                                <Text style={styles.subTitle}>Eldoret Town Center</Text>
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
                                <Text style={styles.subTitle}>0721234356</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Email Address</Text>
                                <Text style={styles.subTitle}>kilimambogostation@gmail.com</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Physical Address</Text>
                                <Text style={styles.subTitle}>321-Eldoret</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>B/S Registration Number</Text>
                                <Text style={styles.subTitle}>100ABGJJJBUAMBKM103</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Services Offered</Text>
                                <Text style={styles.subTitle}>Carwash, Balancing</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Fuel Types Available</Text>
                                <Text style={styles.subTitle}>Diesel, Petrol</Text>
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

                        <TouchableOpacity style={styles.updateBtn}>
                            <Text style={styles.btnTxt}>Update Profile</Text>
                            <FontAwesome6 name="pen" size={18} color="#ffff"/>
                        </TouchableOpacity>

                        </View>
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
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
        justifyContent:'space-between',
        marginTop:"50%"
    },
    signoutBtn:{
        backgroundColor:'#E42629',
        width:'45%',
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