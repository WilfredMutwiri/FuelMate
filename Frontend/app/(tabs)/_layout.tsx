import { Tabs } from 'expo-router';
import Toast from 'react-native-toast-message';
import {TouchableOpacity, View} from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { SafeAreaProvider,SafeAreaView,useSafeAreaInsets } from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';


export default function TabsLayout() {
const router=useRouter();

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
              onPress={()=>router.push('/UserNotifications')}
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
            title: 'Order Progress',
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
