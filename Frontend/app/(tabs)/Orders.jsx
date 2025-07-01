import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SERVER_URI } from "../../constants/SERVER_URI.jsx";
import useAuthStore from "../../zustand/store.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/loader.jsx";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";

export default function Orders() {
  const user = useAuthStore((state) => state.user);
  const [customerData, setCustomerData] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [apiResponse, setAPIResponse] = useState(null);
  const [userEmergencyOrders, setUserEmergencyOrders] = useState([]);
  const [emergencyOrders, setEmergencyOrders] = useState(0);

  // get all user's normal orders
  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SERVER_URI}/api/v1/order/customer/${user.id}`
      );
      // console.log("order response",response)
      const result = response.data;
      if (result.customerOrders) {
        setAPIResponse(result);
        setCustomerData(result.customerOrders);
        setLoading(false);
      }
    } catch (error) {
      console.log("API fetch error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // get all user's emergency orders
  const getEmergencyOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SERVER_URI}/api/v1/order/emergency/user/${user.id}`
      );
      const result = response.data;
      if (result.success) {
        setEmergencyOrders(result.totalOrders);
        setUserEmergencyOrders(result.orders);
        setLoading(false);
      }
    } catch (error) {
      console.log("API fetch error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
    getEmergencyOrders();
  }, []);

  useEffect(() => {}, [customerData]);

  const handleReceiptDownload = async (orderId) => {
    try {
      const url = `${SERVER_URI}/api/v1/order/${orderId}/receipt`;
      const fileUri =
        FileSystem.documentDirectory + `fuelmate_receipt_${orderId}.pdf`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      });

      const blob = await response.blob();

      const reader = new FileReader();

      // Set up the onloadend callback
      reader.onloadend = async () => {
        try {
          const base64data = reader.result.split(",")[1];

          // Save the base64 PDF to local file
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Share or alert
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          } else {
            ToastComponent("success", "Receipt downloaded successfully!");
          }
        } catch (err) {
          console.error("Error saving PDF:", err.message);
          ToastComponent("error", "Failed to save or share receipt");
        }
      };

      reader.onerror = (err) => {
        console.error("FileReader error:", err);
        Alert.alert("Error", "Failed to read PDF blob.");
      };

      // Start reading the blob
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Receipt download failed:", error.message);
      Alert.alert("Download Error", "Failed to generate or open the receipt.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.orderCont}>
          <View>
            <Text style={styles.orderID}>
              Hello <Text style={styles.subTxt}>{user?.username}</Text>
            </Text>
            <View style={styles.ordersSummary}>
              <Text>
                Normal orders : <Text>{apiResponse?.totalOrders || 0}</Text>
              </Text>
              <Text style={styles.subTxt}>
                Emergency orders : <Text>{emergencyOrders || 0}</Text>
              </Text>
            </View>
          </View>
          {/* emergency orders */}
          <View>
            {Loading ? (
              <View>
                <Loader />
              </View>
            ) : (
              <View style={{ gap: 10, marginTop: 20, paddingBottom: 4 }}>
                {userEmergencyOrders.map((order) => (
                  <View key={order?._id} style={styles.orderContainer}>
                    <Text style={styles.subTxt}>Order ID: {order?._id}</Text>
                    <Text>Delivery Location: {order?.readableLocation}</Text>
                    <Text>Fuel Type: {order?.fuelType}</Text>
                    <Text>Fuel Volume: {order?.fuelVolume} L</Text>
                    <Text>
                      Assigned Station : {order?.assignedStation?.stationName}
                    </Text>
                    <View style={styles.StatusContainer}>
                      <Text>
                        Status :{" "}
                        <Text style={styles.subTxt}>{order?.status}</Text>
                      </Text>
                    </View>
                    <Text style={{ paddingTop: 4, color: "#05367C" }}>
                      ~emergency order~
                    </Text>

                    <TouchableOpacity
                      style={styles.BTNContainer}
                      onPress={() => handleReceiptDownload(order._id)}
                    >
                      <Text style={styles.BTNTxt}>Download Receipt</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
          <Text>
            {" "}
            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            - - - - - -
          </Text>
          {/* normal orders*/}
          <View>
            {Loading ? (
              <View>
                <Loader />
              </View>
            ) : (
              <View style={{ gap: 10, marginTop: 10 }}>
                {customerData?.map((order, index) => (
                  <View key={index._id || index} style={styles.orderContainer}>
                    <Text style={styles.subTxt}>Order ID: {order._id}</Text>
                    <Text>Delivery Location: {order?.location}</Text>
                    <Text>Fuel Type: {order?.fuelType}</Text>
                    <Text>Fuel Volume: {order?.fuelVolume} L</Text>
                    <Text>Amount Charged : {order?.amount}</Text>
                    <View style={styles.StatusContainer}>
                      <Text>
                        Status :{" "}
                        <Text style={styles.subTxt}>{order?.status}</Text>
                      </Text>
                    </View>
                    <Text style={{ paddingTop: 4, color: "#05367C" }}>
                      ~normal order~
                    </Text>

                    <TouchableOpacity
                      style={styles.BTNContainer}
                      onPress={() => handleReceiptDownload(order._id)}
                    >
                      <Text style={styles.BTNTxt}>Download Receipt</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ordersSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderCont: {
    width: "85%",
    alignSelf: "center",
    paddingBottom: 25,
  },
  orderID: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    marginBottom: 10,
  },
  subTxt: {
    color: "#05367C",
  },
  orderContainer: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    padding: 10,
  },
  BTNContainer: {
    backgroundColor: "#077E8C",
    padding: 6,
    borderRadius: 10,
    width: "auto",
    marginTop: 10,
  },
  BTNTxt: {
    color: "#ffff",
    textAlign: "center",
  },
});
