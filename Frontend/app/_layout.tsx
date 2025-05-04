import { Stack } from 'expo-router';


export default function RootLayout() {

  return (
      <Stack>
        <Stack.Screen name="index" options={{
          headerShown: false,
          title: 'Landing',
        }}/>
        <Stack.Screen name="Signin" options={{
          headerShown:false,
          title: 'Sign In',
        }}/>
      </Stack>
  );
}
