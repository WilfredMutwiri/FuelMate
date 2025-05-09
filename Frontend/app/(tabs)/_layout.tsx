import { Tabs } from 'expo-router';
import Toast from 'react-native-toast-message';
import {View} from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function TabsLayout() {

  return (
    <SafeAreaProvider style={{flex:1}}>
    <View style={{flex:1,backgroundColor:'#fff'}}>
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#02223B',
          
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
        tabBarInactiveTintColor:'#02223B'
      }}
      >
        <Tabs.Screen name="Home" options={
          {
            headerShown:true,
            title: 'Home',
            tabBarIcon: ({ color,focused}) => (
              <FontAwesome6 name="house" size={ focused?24:16} color={color} />
            ),
          }
        }/>

        <Tabs.Screen name="Orders" options={
          {
            headerShown:true,
            title: 'Orders',
            tabBarIcon: ({ color, size=10,focused }) => (
              <FontAwesome6 
              name="cart-shopping" 
              size={focused ? 24:16} 
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
              size={focused ? 24:16} 
              color={color} />
            ),
          }
        }/>

<Tabs.Screen name="settings" options={
          {
            headerShown:true,
            title: 'Settings',
            tabBarIcon: ({ color, size=10,focused }) => (
              <FontAwesome6 
              name="gear" 
              size={focused ? 24:16} 
              color={color} />
            ),
          }
        }/>

      </Tabs>
      <Toast/>
    </View>
    </SafeAreaProvider>
  );
}
