import { Tabs, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { TouchableOpacity, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function TabsLayout() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: "#02223B",
            shadowColor: "transparent",
          },
          headerTintColor: "#EBF6FE",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: "#EBF5FF",
            display: "none",
          },
          tabBarActiveTintColor: "#00478F",
          tabBarInactiveTintColor: "#02223B",

          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="[id]"
          options={{
            headerShown: true,
            title: `Station Info`,
          }}
        />
      </Tabs>
      <Toast />
    </View>
  );
}
