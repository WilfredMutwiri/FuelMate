import { Tabs } from 'expo-router';
import Toast from 'react-native-toast-message';
import {TouchableOpacity, View} from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {useRouter} from 'expo-router';
import useAuthStore from '../../zustand/store.jsx';
import React, { useEffect } from "react";
import axios from 'axios'
import {SERVER_URI} from '../../constants/SERVER_URI.jsx';

export default function TabsLayout() {
const router=useRouter();

const { hasUnreadNotifications, setHasUnreadNotifications, user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const getUserNotifications = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/api/v1/user/notifications/${user.id}`);
        if (response.status === 200) {
          const unread = response.data.some((n) => n.read === false);
          setHasUnreadNotifications(unread);
        }
      } catch (error) {
        console.log("Error fetching notifications", error);
      }
    };

    getUserNotifications(); // fetch once immediately
    const interval = setInterval(getUserNotifications, 30000); // poll every 30 sec
    return () => clearInterval(interval);
  }, [user]);

return (
<View style={{flex:1}}>
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#02223B',
          shadowColor: 'transparent',
        },
        headerTintColor: '#EBF6FE',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerShadowVisible:false,
        tabBarStyle:{
          backgroundColor:'#EBF5FF'
        },
        tabBarActiveTintColor:'#00478F',
        tabBarInactiveTintColor:'#02223B',
        tabBarShowLabel:false
      }}
      >
        <Tabs.Screen name="Home" options={
          {
            headerShown:true,
            title: 'Home',
            tabBarIcon: ({ color,focused}) => (
              <FontAwesome6 name="house" size={ focused?25:18} color={color} />
            ),
            headerLeft: () => (
              <TouchableOpacity
              onPress={()=>{
                router.push('/UserNotifications')
                setHasUnreadNotifications(false);
              
              }}
              style={{marginLeft:20}}
              >
            <View>
              <FontAwesome6 name="bell" size={20} color="#EBF6FE" />
              {hasUnreadNotifications && (
              <View
              style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: 'red',
            }}
        />
      )}
    </View>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
              onPress={()=>router.push('/Profile')}
              style={{marginRight:20}}
              >
                <FontAwesome6 
                  name="user-circle" 
                  size={20} 
                  color="#EBF6FE" 
                />
              </TouchableOpacity>
            )
          }
        }/>

        <Tabs.Screen name="Orders" options={
          {
            headerShown:true,
            title: 'Orders',
            tabBarIcon: ({ color, size=10,focused }) => (
              <FontAwesome6 
              name="cart-shopping" 
              size={focused ? 25:18} 
              color={color} />
            ),
          }
        }/>

<Tabs.Screen name="Alert" options={
          {
            headerShown:true,
            title: 'Emergency Alert',
            tabBarIcon: ({ color, size=10,focused }) => (
              <FontAwesome6 
              name="triangle-exclamation" 
              size={focused ? 25:18} 
              color={color} />
            ),
          }
        }/>


<Tabs.Screen name="Profile" options={
          {
            headerShown:true,
            title: 'Profile',
            tabBarIcon: ({ color, size=10,focused }) => (
              <FontAwesome6 
              name="user" 
              size={focused ? 24:18} 
              color={color} />
            ),
          }
        }/>

      </Tabs>
      <Toast/>
      </View>
  );
}
