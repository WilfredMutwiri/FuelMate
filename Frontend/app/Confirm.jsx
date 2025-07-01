import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
export default function Signin() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/Landing");
  };

  const handleStationAdmin = () => {
    router.push("/StationSignin");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* top section */}
        <View style={styles.TopContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>
            Fuel<Text style={styles.subText}>Mate</Text>
          </Text>
          <Text>Your Fuel, Delivered Anywhere, Anytime</Text>
        </View>

        {/* bottom section */}
        <View style={styles.BottomContainer}>
          <Text style={styles.welcomeTxt}>Welcome to FuelMate</Text>
          <Text style={styles.welcomeSubTxt}>How can we help you today?</Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>I am looking for Fuel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleStationAdmin}
          >
            <Text style={styles.buttonText}>
              I want to manage my Fuel station
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  TopContainer: {
    width: "100%",
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    padding: 20,
    marginTop: 100,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "semibold",
    textAlign: "center",
    marginTop: 10,
  },
  // bottom section
  BottomContainer: {
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFA500",
    // backgroundColor: '#FFB300',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  linkText: {
    color: "#05367C",
    fontWeight: "semibold",
    textDecorationLine: "none",
    marginBottom: 5,
    fontSize: 14,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#E19540",
    textAlign: "center",
    marginTop: 10,
  },
  subText: {
    color: "#05367C",
    fontSize: 30,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "90%",
    height: 50,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: "10%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "semibold",
    textAlign: "center",
  },
  welcomeTxt: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#05367C",
    textAlign: "center",
    marginTop: 10,
    paddingBottom: 10,
  },
  welcomeSubTxt: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});
