// import React from 'react';
// import { View,StyleSheet,ScrollView,SafeAreaView} from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useLocalSearchParams } from 'expo-router';

import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useCallback } from "react";
import { SERVER_URI } from "../constants/SERVER_URI.jsx";

export default function PaymentScreen({ route }) {
  const { authorizationUrl, reference } = useLocalSearchParams();
  const navigation = useNavigation();
  console.log("reference", reference);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", async (e) => {
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      try {
        console.log("Sending reference to backend...");
        console.log("Reference to send:", reference);
        await axios.post(`${SERVER_URI}/api/v1/paystack/verify/${reference}`);
        console.log("Reference sent successfully");

        // After sending, allow the back navigation
        unsubscribe(); // Remove listener to avoid loop
        navigation.dispatch(e.data.action);
      } catch (error) {
        console.error("Error sending reference:", error);
        Alert.alert("Error", "Failed to verify payment.");
      }
    });

    return unsubscribe;
  }, [navigation, reference]);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.container}>
        <View style={styles.PaymentContainer}>
          <WebView
            source={{ uri: authorizationUrl }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onNavigationStateChange={(navState) => {
              if (navState.url.includes("paystack/success")) {
                console.log("Payment successful!");
              }
            }}
            style={styles.webview}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  PaymentContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  webview: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
});
