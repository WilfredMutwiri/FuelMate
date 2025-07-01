import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { SERVER_URI } from "../constants/SERVER_URI.jsx";
import axios from "axios";
import ToastComponent from "../components/Toast";
import useAuthStore from "../zustand/store.jsx";

export default function Recovery() {
  const { user } = useAuthStore();
  console.log(user);
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    try {
      const emailToUse = formData.email || user?.email;
      if (!emailToUse) {
        return ToastComponent("error", "Email is required");
      }
      const response = await axios.post(
        `${SERVER_URI}/api/v1/requestOTP`,
        formData
      );
      if (response.data.success) {
        ToastComponent("success", "OTP sent successfully!");
        router.push("/Recovery2");
      } else {
        ToastComponent(
          "error",
          response.data.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      ToastComponent(
        "error",
        error.respose?.data?.message ||
          "Something went wrong. Please try again."
      );
      return res.status(500).json({ message: error.message });
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.LogoContainer}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.logoText}>
                Account<Text style={styles.logoSubText}> Recovery!</Text>
              </Text>
              <Text style={styles.IntroTxt}>
                If you have an existing account, you will receive an email to
                reset your password.
              </Text>
            </View>
            {/* second container */}
            <View style={styles.secondContainer}>
              {/* email button */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  style={styles.inputText}
                  placeholder={`${user?.email} ` || "Enter your email"}
                />
              </View>

              {/* sign in button */}
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={handleSubmit}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "semibold",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  LogoContainer: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    backgroundColor: "#ffff",
    alignItems: "center",
    borderRadius: 100,
  },
  logo: {
    marginTop: 20,
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "semibold",
    textAlign: "center",
    marginTop: 10,
  },
  logoSubText: {
    fontSize: 24,
    fontWeight: "semibold",
    textAlign: "center",
    color: "#05367C",
  },

  // buttons
  secondContainer: {
    flexDirection: "column",
    gap: 25,
    justifyContent: "center",
    width: "100%",
  },
  inputContainer: {
    flexDirection: "column",
    gap: 10,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  // input text
  inputLabel: {
    fontSize: 16,
    fontWeight: "semibold",
    marginBottom: 5,
    left: 45,
    alignSelf: "flex-start",
  },
  inputText: {
    height: 50,
    width: "85%",
    borderWidth: 1,
    borderColor: "#05367C",
    fontSize: 16,
    borderRadius: 50,
    fontWeight: "semibold",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 25,
  },
  IntroTxt: {
    fontSize: 16,
    fontWeight: "semibold",
    padding: 25,
    textAlign: "center",
  },

  buttonContainer: {
    width: "85%",
    height: 50,
    backgroundColor: "#05367C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
