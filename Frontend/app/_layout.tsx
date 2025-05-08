import { Stack } from 'expo-router';


export default function RootLayout() {

  return (
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
        <Stack.Screen name="index" options={{
          headerShown: false,
          title: 'index',
        }}/>
        <Stack.Screen name="Confirm" options={{
          headerShown: false,
          title: 'Confirmation',
        }}/>
        <Stack.Screen name="Landing" options={{
          headerShown:true,
          title: '',
        }}/>
          <Stack.Screen name="Signin" options={{
          headerShown:true,
          title: '',
        }}/>
        <Stack.Screen name="Signup" options={{
          headerShown:true,
          title: ' ',
        }}/>
        <Stack.Screen name="Recovery" options={{
          headerShown:true,
          title: '',
        }}/>
        <Stack.Screen name="Recovery2" options={{
          headerShown:true,
          title: '',
        }}/>
      </Stack>
  );
}
