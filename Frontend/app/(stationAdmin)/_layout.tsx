import { Tabs, useLocalSearchParams,router} from 'expo-router';
import Toast from 'react-native-toast-message';
import {TouchableOpacity, View} from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { SafeAreaProvider,SafeAreaView,useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabsLayout() {
const {id}=useLocalSearchParams();
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
          backgroundColor:'#EBF5FF',
        },
        tabBarActiveTintColor:'#00478F',
        tabBarInactiveTintColor:'#02223B',
        tabBarShowLabel:false
      }}
      >
        <Tabs.Screen name="Dashboard" options={
          {
            headerShown:true,
            title: `Dashboard`,
            tabBarIcon: ({ color,focused}) => (
              <FontAwesome6 name="grip" size={ focused?25:18} color={color} />
            ),
            headerLeft: () => (
              <TouchableOpacity
              onPress={()=>router.push('/StationNotifications')}
              style={{marginLeft:20}}
              >
                <FontAwesome6 
                  name="bell" 
                  size={20} 
                  color="#EBF6FE" 
                />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
              style={{marginRight:20}}
              onPress={()=>router.push("/Profile")}
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
        <Tabs.Screen name="Analytics" options={
          {
            headerShown:true,
            title: 'Analytics',
            tabBarIcon: ({ color, size=10,focused }) => (
              <FontAwesome6 
              name="chart-line" 
              size={focused ? 25:18} 
              color={color} />
            ),
          }
        }/>
        <Tabs.Screen name="Profile" options={
          {
            headerShown:true,
            title: 'Station Profile',
            tabBarIcon: ({ color, size=10,focused }) => (
              <FontAwesome6 
              name="user" 
              size={focused ? 25:18} 
              color={color} />
            ),
          }
        }/>
      </Tabs>
      <Toast/>
      </View>
  );
}
