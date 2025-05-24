import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import {View} from 'react-native'

export default function RootLayout() {

  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          
        },
        headerTintColor: 'black',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerShadowVisible:false
      }}
      >
        <Stack.Screen name="index" options={{headerShown: false,title: 'index',}}/>
        <Stack.Screen name="Confirm" options={{headerShown: false,title: 'Confirmation',}}/>
        <Stack.Screen name="Landing" options={{headerShown:true,title: '',}}/>
        <Stack.Screen name="Signin" options={{headerShown:true,title: '',}}/>
        <Stack.Screen name="Signup" options={{headerShown:true,title: ' ',}}/>
        <Stack.Screen name="Recovery" options={{headerShown:true,title: '',}}/>
        <Stack.Screen name="Recovery2" options={{headerShown:true,title: '',}}/>
        <Stack.Screen name="(tabs)" options={{headerShown:false,title: '',}}/>
        <Stack.Screen name="(stationInfo)" options={{headerShown:false,title: '',}}/>

        {/* fuel station */}
        <Stack.Screen name="(stationAdmin)" options={{headerShown:false,title: '',}}/>
        <Stack.Screen name="StationRecovery" options={{headerShown:true,title: '',}}/>
        <Stack.Screen name="StationRecovery2" options={{headerShown:true,title: '',}}/>
        <Stack.Screen name="StationSignup" options={{headerShown:true,title: ' ',}}/>
        <Stack.Screen name="StationSignin" options={{headerShown:true,title: ' ',}}/>
      </Stack>
      <Toast/>
    </View>
  );
}
