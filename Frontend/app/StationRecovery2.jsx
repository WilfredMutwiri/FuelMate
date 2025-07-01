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
import useAuthStore from "../zustand/store.jsx";
import axios from "axios";
import { SERVER_URI } from "../constants/SERVER_URI";
import ToastComponent from "../components/Toast";

export default function StationRecovery2() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    // email:user.email,
    newPassword: "",
    otp: "",
    confirmPassword: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async () => {
    // if(formData.newPassword !== formData.confirmPassword){
    //     return ToastComponent("error","Passwords do not match!");
    // }

    // try {
    //     const response=await axios.post(`${SERVER_URI}/api/v1/resetPassword`,formData)
    //     console.log(response)
    //     if(response.data.success){
    //         ToastComponent("success","Password reset successfully!");
    //         router.push('/Signin');
    //     }
    // } catch (error) {
    //     if(error.response && error.response.data && error.response.data.message){
    //         ToastComponent("error",error.response.data.message);
    //     }else{
    //         ToastComponent("error","Something went wrong. Try again!");
    //     }
    //     console.log(error.response.data.message)
    // }

    router.push("/StationSignin");
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
                We’ve sent an OTP to{" "}
                <Text style={styles.userMail}>{`you!`}</Text> . Enter the OTP
                code to reset your password below.
              </Text>
            </View>
            {/* second container */}
            <View style={styles.secondContainer}>
              <Text style={styles.inputLabel}>Enter OTP Code</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Enter OTP"
                  keyboardType="numeric"
                  value={formData.otp}
                  onChangeText={(text) => handleInputChange("otp", text)}
                />
              </View>

              {/* confirm password */}
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Enter new password"
                  secureTextEntry={!passwordVisible}
                  value={formData.newPassword}
                  onChangeText={(text) =>
                    handleInputChange("newPassword", text)
                  }
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <FontAwesome6 name="eye" size={18} color="black" />
                  ) : (
                    <FontAwesome6 name="eye-slash" size={18} color="black" />
                  )}
                </TouchableOpacity>
              </View>

              {/* confirm password */}
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirm your password"
                  secureTextEntry={!passwordVisible}
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <FontAwesome6 name="eye" size={18} color="black" />
                  ) : (
                    <FontAwesome6 name="eye-slash" size={18} color="black" />
                  )}
                </TouchableOpacity>
              </View>

              {/*back button*/}
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
                    Reset Password
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
  },
  LogoContainer: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    backgroundColor: "#ffff",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "semibold",
    textAlign: "center",
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
    gap: 10,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
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

  IntroTxt: {
    fontSize: 16,
    fontWeight: "semibold",
    padding: 10,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "85%",
    height: 50,
    backgroundColor: "#05367C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  userMail: {
    color: "#05367C",
  },
  inputContainer: {
    flexDirection: "column",
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
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
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
    borderWidth: 1,
    borderColor: "#05367C",
    borderRadius: 50,
    paddingLeft: 25,
    height: 50,
    marginBottom: 15,
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
  },
});
