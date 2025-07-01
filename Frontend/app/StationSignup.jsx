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

import { imagePicker, docPicker } from "../components/filePicker.jsx";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "../constants/SERVER_URI";
import ToastComponent from "../components/Toast";
import useAuthStore from "../zustand/store.jsx";
import * as Location from "expo-location";
import Loader from "../components/loader.jsx";

export default function StationSignup() {
  const { signup } = useAuthStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [certUrl, setCertUrl] = useState(null);

  // get station's current location
  useEffect(() => {
    let timeout;
    (async () => {
      try {
        // Timeout in case location fetching hangs
        timeout = setTimeout(() => {
          setLocationError(
            "Location fetch timed out. Please check your internet connection or enable device location."
          );
          setLocationLoaded(false);
        }, 10000); // 10 seconds

        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status != "granted") {
          clearTimeout(timeout);
          Alert.alert(
            "Permission denied",
            "Location is needed register your station"
          );
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        let addressArray = await Location.reverseGeocodeAsync(
          currentLocation.coords
        );
        if (addressArray.length > 0) {
          const address = addressArray[0];
          const coords = [
            currentLocation.coords.longitude,
            currentLocation.coords.latitude,
          ];

          const geoLocation = {
            type: "Point",
            coordinates: coords,
          };

          setFormData((prev) => ({
            ...prev,
            county: address.region || "",
            town: address.city || address.district || "",
            location: geoLocation,
          }));
          setLocation(geoLocation);
          setLocationName(
            `${address.name} | ${address.city} | ${address.region}`
          );
        } else {
          setLocationError(
            "Could not resolve address from location coordinates."
          );
        }
        setLocationLoaded(true);
      } catch (error) {
        setLocationError(
          "Error getting location. Please ensure device Location is enabled."
        );
      } finally {
        clearTimeout(timeout);
      }
    })();
  }, []);

  // profile Image upload
  const handleFileUpload = async () => {
    const file = await imagePicker();
    if (file) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name || `file-${Date.now()}`,
      });

      try {
        console.log("initiating file upload");
        const response = await axios.post(
          `${SERVER_URI}/api/v1/upload/images/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response) {
          console.log("File uploaded successfully", response.data);
          setFileUrl(response.data.fileUrl);
        }
      } catch (error) {
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Request error (no response):", error.request);
        } else {
          console.error("Unknown axios error:", error.message);
        }
      }
    }
  };

  // Business Certificate upload
  const handleCertUpload = async () => {
    const file = await docPicker();
    if (file) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name || `file-${Date.now()}`,
      });

      try {
        console.log("initiating file upload");
        const response = await axios.post(
          `${SERVER_URI}/api/v1/upload/docs/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response) {
          console.log("File uploaded successfully", response.data);
          setCertUrl(response.data.fileUrl);
        }
      } catch (error) {
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Request error (no response):", error.request);
        } else {
          console.error("Unknown axios error:", error.message);
        }
      }
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    RegNo: "",
    physicalAddress: "",
    county: "",
    town: "",
    stationName: "",
    phoneNo: "",
    profileImg: "",
    fuel: [],
    services: [],
    BusinessCert: "",
  });

  const handleInputChange = (name, value) => {
    const updatedValue =
      name === "fuel" || name === "services"
        ? value.split(",").map((item) => item.trim())
        : value;
    setFormData({
      ...formData,
      profileImg: fileUrl,
      BusinessCert: certUrl,
      [name]: updatedValue,
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignUp = async () => {
    try {
      // confirm password
      if (formData.password !== formData.confirmPassword) {
        return ToastComponent("error", "Passwords don't match");
      }

      if (
        !formData.location ||
        !formData.location.coordinates ||
        formData.location.coordinates.length !== 2
      ) {
        return ToastComponent(
          "error",
          "Location not ready. Please wait a moment and try again."
        );
      }

      console.log("Submitting signup with location:", formData.location);

      const processedFuel = formData.fuel.map((f) => ({
        type: f.toLowerCase(),
        price: 0,
      }));

      const response = await axios.post(`${SERVER_URI}/api/v1/station/signup`, {
        ...formData,
        profileImg: fileUrl,
        BusinessCert: certUrl,
        RegNo: formData.RegNo.toString().trim(),
        location: formData.location,
        fuel: processedFuel,
      });

      const result = response.data;
      if (response.data.success) {
        await signup(result.user.email, result.user.username);
        ToastComponent("success", "Account created successfully!");
        console.log(user);
        router.push("/StationSignin");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error);
        ToastComponent(
          "error",
          error.response.data.message || "An error occurred"
        );
      } else {
        console.log(error);
        ToastComponent("error", `An error occured ${error.message}`);
      }
    }
  };
  const handleLogin = () => {
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
            {!locationLoaded ? (
              <Loader />
            ) : locationError ? (
              <>
                <Text
                  style={{ textAlign: "center", color: "red", marginTop: 20 }}
                >
                  {locationError}
                </Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => {
                    setLocationError(null);
                    setLocationLoaded(false);
                  }}
                >
                  <Text style={styles.retryTxt}>Retry</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.LogoContainer}>
                  <Image
                    source={require("../assets/images/logo.png")}
                    style={styles.logo}
                  />
                  <Text style={styles.logoText}>
                    Glad you are here{" "}
                    <Text style={styles.logoSubText}>Admin!</Text>
                  </Text>
                </View>

                <Text style={styles.welcomeTxt}>
                  Register your fuel station to continue
                </Text>

                {/* second container */}
                <View style={styles.secondContainer}>
                  {/* username button */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Station Name</Text>
                    <TextInput
                      style={styles.inputText}
                      value={formData.stationName}
                      onChangeText={(text) =>
                        handleInputChange("stationName", text)
                      }
                      placeholder="Enter your station name"
                    />
                  </View>
                  {/* email button */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      Business Registration Number
                    </Text>
                    <TextInput
                      value={formData.RegNo}
                      onChangeText={(text) => handleInputChange("RegNo", text)}
                      style={styles.inputText}
                      placeholder="Enter business registration number"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Physical Address</Text>
                    <TextInput
                      value={formData.physicalAddress}
                      onChangeText={(text) =>
                        handleInputChange("physicalAddress", text)
                      }
                      style={styles.inputText}
                      placeholder="Enter your Address"
                    />
                  </View>
                  {/* city_postal_container */}
                  <View style={styles.flex_Container}>
                    <View style={styles.inputContainer2}>
                      <Text style={styles.inputLabel2}>County</Text>
                      <TextInput
                        value={formData.county}
                        editable={false}
                        onChangeText={(text) =>
                          handleInputChange("county", text)
                        }
                        style={[
                          styles.inputText,
                          { backgroundColor: "#f2f2f2" },
                        ]}
                        placeholder="County"
                      />
                    </View>

                    <View style={styles.inputContainer2}>
                      <Text style={styles.inputLabel2}>Town</Text>
                      <TextInput
                        value={formData.town}
                        editable={false}
                        onChangeText={(text) => handleInputChange("town", text)}
                        style={[
                          styles.inputText,
                          { backgroundColor: "#f2f2f2" },
                        ]}
                        placeholder="city/town"
                      />
                    </View>
                  </View>

                  {/* username_phone_container */}
                  <View style={styles.flex_Container}>
                    <View style={styles.inputContainer2}>
                      <Text style={styles.inputLabel2}>Username</Text>
                      <TextInput
                        value={formData.username}
                        onChangeText={(text) =>
                          handleInputChange("username", text)
                        }
                        style={styles.inputText}
                        placeholder="B/S Username"
                      />
                    </View>

                    <View style={styles.inputContainer2}>
                      <Text style={styles.inputLabel2}>Phone No.</Text>
                      <TextInput
                        value={formData.phoneNo}
                        onChangeText={(text) =>
                          handleInputChange("phoneNo", text)
                        }
                        style={styles.inputText}
                        keyboardType="numeric"
                        placeholder="B/S Phone"
                      />
                    </View>
                  </View>
                  {/* profile image upload section */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Profile Image</Text>
                    <View style={styles.fileUploadCont}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleFileUpload()}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            textAlign: "center",
                            fontSize: 12,
                            fontWeight: "semibold",
                          }}
                        >
                          {fileUrl ? "File selected" : " Select file"}
                        </Text>
                      </TouchableOpacity>
                      <Text>
                        {fileUrl ? "file uploaded" : "No file uploaded"}
                      </Text>
                    </View>
                  </View>
                  {/* Business cert upload section*/}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      Business Registration Certificate
                    </Text>
                    <View style={styles.fileUploadCont}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleCertUpload()}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            textAlign: "center",
                            fontSize: 12,
                            fontWeight: "semibold",
                          }}
                        >
                          {certUrl ? "File selected" : " Select file"}
                        </Text>
                      </TouchableOpacity>
                      <Text>
                        {certUrl ? "file uploaded" : "No file uploaded"}
                      </Text>
                    </View>
                  </View>
                  {/* fuel types container */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Fuel Types Available</Text>
                    <TextInput
                      value={formData.fuel.join(",")}
                      onChangeText={(text) => handleInputChange("fuel", text)}
                      style={styles.inputText}
                      placeholder="e.g Petrol, Diesel, Kerosene"
                    />
                  </View>
                  {/* services container */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Services Offered</Text>
                    <TextInput
                      value={formData.services.join(",")}
                      onChangeText={(text) =>
                        handleInputChange("services", text)
                      }
                      style={styles.inputText}
                      placeholder="e.g Car Wash, Balancing"
                    />
                  </View>
                  {/* email container */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      value={formData.email}
                      onChangeText={(text) => handleInputChange("email", text)}
                      style={styles.inputText}
                      placeholder="Enter your business Email"
                    />
                  </View>

                  {/* password btn */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        placeholder="Enter your password"
                        value={formData.password}
                        onChangeText={(text) =>
                          handleInputChange("password", text)
                        }
                        secureTextEntry={!passwordVisible}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
                      >
                        {passwordVisible ? (
                          <FontAwesome6 name="eye" size={18} color="black" />
                        ) : (
                          <FontAwesome6
                            name="eye-slash"
                            size={18}
                            color="black"
                          />
                        )}
                      </TouchableOpacity>
                    </View>

                    {/* confirm password */}
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChangeText={(text) =>
                          handleInputChange("confirmPassword", text)
                        }
                        secureTextEntry={!passwordVisible}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
                      >
                        {passwordVisible ? (
                          <FontAwesome6 name="eye" size={18} color="black" />
                        ) : (
                          <FontAwesome6
                            name="eye-slash"
                            size={18}
                            color="black"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* sign up button */}
                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={handleSignUp}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 16,
                          fontWeight: "semibold",
                        }}
                      >
                        Create Account
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* signup text */}
                  <View style={styles.BottomContainer}>
                    <Text>Already have an account?</Text>
                    <TouchableOpacity onPress={handleLogin}>
                      <Text
                        style={{
                          color: "#05367C",
                          fontSize: 14,
                          fontWeight: "semibold",
                        }}
                      >
                        Sign in
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
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
    paddingBottom: 100,
  },
  LogoContainer: {
    flexDirection: "column",
    width: "100%",
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
  welcomeTxt: {
    fontSize: 15,
    textAlign: "center",
    paddingTop: 10,
  },
  // buttons
  secondContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  inputContainer: {
    marginTop: 10,
    flexDirection: "column",
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  // input text
  inputLabel: {
    marginTop: 10,
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
    fontSize: 14,
    borderRadius: 50,
    fontWeight: "semibold",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 25,
  },
  forgotPasswordTxt: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "#05367C",
    marginTop: 5,
    left: 90,
    // alignSelf:'flex-end',
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
  buttonContainer: {
    width: "85%",
    height: 50,
    backgroundColor: "#05367C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  BottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 15,
  },
  flex_Container: {
    flexDirection: "row",
    width: "85%",
    alignSelf: "center",
    marginTop: 15,
    justifyContent: "space-between",
    alignContent: "center",
  },
  inputContainer2: {
    width: "54%",
  },
  inputLabel2: {
    paddingBottom: 5,
    paddingLeft: 15,
  },
  button: {
    backgroundColor: "#05367C",
    padding: 5,
    borderRadius: 10,
    width: 100,
  },
  fileUploadCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#05367C",
    width: "82%",
    borderRadius: 10,
    paddingRight: 5,
  },
  retryBtn: {
    backgroundColor: "#05367C",
    padding: 10,
    borderRadius: 10,
    width: 150,
    marginTop: 20,
    alignSelf: "center",
  },
  retryTxt: {
    textAlign: "center",
    color: "#fff",
  },
});
