import { Stack } from 'expo-router';


export default function RootLayout() {

  return (
      <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
      >
        <Stack.Screen name="index" options={{
          headerShown: false,
          title: 'Landing',
        }}/>
        <Stack.Screen name="Confirm" options={{
          headerShown: false,
          title: 'Confirmation',
        }}/>
        <Stack.Screen name="Signin" options={{
          headerShown:false,
          title: 'Sign In',
        }}/>
      </Stack>
  );
}
