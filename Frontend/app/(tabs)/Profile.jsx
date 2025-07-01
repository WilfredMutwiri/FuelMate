import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import userImg from "../../assets/images/user.jpg";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Loader from "../../components/loader.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import useAuthStore from "../../zustand/store.jsx";
import { SERVER_URI } from "../../constants/SERVER_URI.jsx";
import * as Location from "expo-location";
import ToastComponent from "../../components/Toast";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);

  // get user info

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        console.log("initiating info fetch");
        setLoading(true);
        const response = await axios.get(
          `${SERVER_URI}/api/v1/user/info/${user.id}`
        );
        const result = response.data;
        console.log(result);
        if (result.success) {
          setUserData(result);
          setLoading(false);
        }
      } catch (error) {
        console.log("API fetch error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  // get user's current location
  useEffect(() => {
    setLoading(true);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status != "granted") {
        Alert.alert(
          "permission denied",
          "Location is required to show your current location"
        );
        setLocationName("Location unavailabe (Permission denied).");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      let addressArray = await Location.reverseGeocodeAsync(
        currentLocation.coords
      );
      if (addressArray.length > 0) {
        const address = addressArray[0];
        setLocationName(
          `${address.name} | ${address.city} | ${address.region}`
        );
      }
    })();
  }, []);

  // handleSignout
  const handleSignout = async (req, res) => {
    try {
      const response = await axios.post(`${SERVER_URI}/api/v1/signout/`);
      console.log(response);
      if (response.data.success) {
        router.push("/Signin");
      }
    } catch (error) {
      ToastComponent("error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.profileCont}>
          {/* header section */}
          {Loading ? (
            <Loader />
          ) : (
            <>
              <View style={styles.header}>
                <Image source={userImg} style={styles.profileImg} />
                <View>
                  <Text style={styles.label}>{userData?.user?.email}</Text>
                  <Text style={styles.subTitle}>
                    {locationName ? (
                      locationName
                    ) : (
                      <Text>Location not found!</Text>
                    )}
                  </Text>
                </View>
              </View>

              {/* data section */}
              <View>
                <View style={styles.dataContainer}>
                  <Text style={styles.label}>Username</Text>
                  <Text style={styles.subTitle}>
                    {userData?.user?.username}
                  </Text>
                </View>

                <View style={styles.dataContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <Text style={styles.subTitle}>{userData?.user?.phoneNo}</Text>
                </View>

                <View style={styles.dataContainer}>
                  <Text style={styles.label}>Email Address</Text>
                  <Text style={styles.subTitle}>{userData?.user?.email}</Text>
                </View>
              </View>

              {/* buttons */}
              <View style={styles.BTNsContainer}>
                <TouchableOpacity
                  style={styles.signoutBtn}
                  onPress={handleSignout}
                >
                  <Text style={styles.btnTxt}>Signout</Text>
                  <FontAwesome6
                    name="right-from-bracket"
                    size={18}
                    color="#ffff"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCont: {
    width: "90%",
    alignSelf: "center",
    paddingTop: 25,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    gap: 25,
    borderWidth: 1,
    borderColor: "#E19540",
    borderRadius: 10,
    padding: 10,
  },
  profileImg: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    alignSelf: "center",
    borderRadius: 50,
  },
  dataContainer: {
    borderWidth: 1,
    borderColor: "#E19540",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  subTitle: {
    color: "#05367C",
  },
  BTNsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    justifyContent: "space-between",
    marginTop: "40%",
  },
  signoutBtn: {
    backgroundColor: "#E42629",
    width: 250,
    alignSelf: "center",
    padding: 13,
    marginTop: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnTxt: {
    textAlign: "center",
    color: "#ffff",
  },
});
