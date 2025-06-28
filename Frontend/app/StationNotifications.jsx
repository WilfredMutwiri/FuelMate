import {View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {SERVER_URI} from '../constants/SERVER_URI.jsx';
import axios from 'axios'
import React,{useEffect, useState} from 'react';
import useAuthStore from '../zustand/store.jsx';

export default function StationNotifications(){
    const { hasUnreadNotifications, setHasUnreadNotifications,station} = useAuthStore();
    const [loading,setLoading]=useState(false);
    const [notifications,setNotifications]=useState([]);
    const [error,setError]=useState(false)

    // get all user notifications
    useEffect(()=>{
        const getUserNotifications=async()=>{
            try {
                setLoading(true);
                const response=await axios.get(`${SERVER_URI}/api/v1/user/notifications/${station.id}`)
                const data=response.data
                console.log(data)
                if(response.status === 200){
                    setNotifications(data)
                    const unread = response.data.some((n) => n.read === false);
                    setHasUnreadNotifications(unread);
                }
            } catch (error) {
                console.log(error)
                setError(true)
            }finally{
                setLoading(false)
            }
        }
        getUserNotifications();

        const interval = setInterval(getUserNotifications, 30000);
        return () => clearInterval(interval);
    },[])

    // update status as read
        const markNotificationRead=async(notificationId)=>{
        try {
            const response=await axios.patch(`${SERVER_URI}/api/v1/user/notification/${notificationId}/read/`)
            if (response.status === 200) {
            setNotifications((prev) =>
                prev.map((n) =>
                n._id === notificationId ? { ...n, read: true } : n
             )
            );}

        } catch (error) {
            console.log("Failed to mark notification as read:", error);
        }
    }
    console.log(notifications)

    const notificationData = [
        {
            id: 1,
            from: 'FuelMate',
            message: 'Your fuel delivery is on the way!',
            timestamp: '2023-10-01 10:00 AM',
            read: false
        },  

    ]
    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.notificationCont}>

                    {/* notification section */}
                    <View>
                        {
                            notifications?.map((notification) => (
                                <TouchableOpacity 
                                onPress={() => markNotificationRead(notification?._id)}
                                key={notification?._id} style={[
                                    styles.notification,
                                    !notification?.read && {
                                        backgroundColor: '#e0f7e9',
                                        borderLeftWidth: 4,
                                        borderLeftColor: '#34a853'
                                        }]}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, justifyContent: 'space-between'}}>
                                        <Text style={{fontWeight: 'bold'}}>FuelMate</Text>
                                        <Text style={{ color: '#888', fontSize: 12 }}>
                                            {new Date(notification?.createdAt).toLocaleString()}
                                        </Text>
                                    </View>
                                    <Text>{notification?.message}</Text>
                                </TouchableOpacity>
                            ))
                        }
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
    notificationCont:{
        width:'90%',
        alignSelf:'center',
        paddingTop:25,
        paddingBottom:50
    },
    label:{
        paddingLeft:4
    },
    notification:{
        backgroundColor:'#f9f9f9',
        padding:15,
        borderRadius:10,
        marginBottom:10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
})