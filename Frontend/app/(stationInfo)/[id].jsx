import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import station1 from "../../assets/images/station1.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URI } from "../../constants/SERVER_URI.jsx";
import Loader from "../../components/loader.jsx";
import ToastComponent from "../../components/Toast";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import useAuthStore from "../../zustand/store.jsx";

export default function StationInfoScreen() {
  const user = useAuthStore((state) => state.user);
  const { id } = useLocalSearchParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    location: "",
    clientPhoneNo: "",
    fuelType: "",
    fuelVolume: "",
    amount: "",
    email: "",
    status: "",
    customer: "",
  });

  const [orderInitiated, setOrderInitiated] = useState(false);
  const [settingOrder, setSettingOrder] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [location, setLocation] = useState(null);
  const [orderPayLoad, setOrderPayLoad] = useState(null);
  const [stationStats, setStationStats] = useState([]);

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

  //   fetching the station data from the server
  useEffect(() => {
    const getStation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${SERVER_URI}/api/v1/station/${id}`);
        const result = response.data;
        if (result.station) {
          setStation(result.station);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getStation();
  }, [id]);

  //fetching the station stats-likes-dislikes
  useEffect(() => {
    const getStationStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${SERVER_URI}/api/v1/station/${id}/stats`
        );
        const result = response.data;
        if (result.success) {
          setStationStats(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getStationStats();
  }, [id]);

  // like station
  const handleLikeStation = async () => {
    try {
      const response = await axios.post(
        `${SERVER_URI}/api/v1/station/${id}/like/${user.id}`
      );
      const result = response.data;
      if (result.success) {
        ToastComponent("success", result.message);
        setLoading(true);
        setStationStats((prev) => ({
          ...prev,
          likes: result.likes,
          dislikes: result.dislikes,
          starsRating: result.starsRating,
        }));
      } else {
        ToastComponent("error", result.message);
      }
    } catch (error) {
      if (error.response) {
        ToastComponent("error", error.response.data.message);
      } else {
        ToastComponent("error", error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // dislike station
  const handleDisLikeStation = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${SERVER_URI}/api/v1/station/${id}/dislike/${user.id}`
      );
      console.log(response);
      const result = response.data;
      if (result.success) {
        ToastComponent("success", result.message);
        setStationStats((prev) => ({
          ...prev,
          likes: result.likes,
          dislikes: result.dislikes,
          starsRating: result.starsRating,
        }));
        setLoading(true);
      } else {
        ToastComponent("error", result.message);
      }
    } catch (error) {
      if (error.response) {
        ToastComponent("error", error.response.data.message);
      } else {
        ToastComponent("error", error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // order placement
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      location: locationName,
      customer: user.id,
      [name]: value,
    });
  };
  const handlePlaceOrder = async () => {
    if (!locationName) {
      ToastComponent(
        "error",
        "Location is required. Please enable location services or try again."
      );
      setModalOpen(!modalOpen);
      return;
    }

    const completeFormData = {
      ...formData,
      location: locationName,
      customer: user.id,
    };

    try {
      setSettingOrder(true);
      console.log("initiating pay");
      const response = await axios.post(
        `${SERVER_URI}/api/v1/paystack/Init/`,
        completeFormData
      );
      const result = response.data;

      if (result.success) {
        setOrderPayLoad(completeFormData);
        setOrderInitiated(true);
        router.push({
          pathname: "/PaymentScreen",
          params: {
            authorizationUrl: result.authorization_url,
            reference: result.reference,
          },
        });
        setModalOpen(!modalOpen);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        ToastComponent("error", `${error.response.data.message}`);
      } else {
        ToastComponent("error", "An unexpected error occured");
      }
    } finally {
      setSettingOrder(false);
    }
  };

  // send order to backend
  useEffect(() => {
    if (orderInitiated && orderPayLoad) {
      const sendOrder = async () => {
        try {
          const response = await axios.post(
            `${SERVER_URI}/api/v1/order/create/${id}`,
            orderPayLoad
          );
        } catch (error) {
          console.log(error);
        } finally {
          setOrderInitiated(false);
          setOrderPayLoad(null);
        }
      };

      sendOrder();
    }
  }, [orderInitiated, orderPayLoad]);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <View style={styles.ImageContainer}>
              <Image
                source={{ uri: station?.profileImg } || station1}
                style={styles.stationImg}
              />
            </View>
            <View style={styles.Stationinfo}>
              <View style={styles.topInfo}>
                <View>
                  <Text style={styles.stationName}>{station?.username}</Text>
                  {/* rating */}
                  <TouchableOpacity style={styles.ratingContainer}>
                    <Text style={styles.ratingTxt}>
                      {stationStats?.starsRating}
                    </Text>
                    <FontAwesome6 name="star" size={18} color="#ff6d1f" />
                  </TouchableOpacity>
                </View>
                {/* likes */}
                <View style={styles.likesContainer}>
                  <TouchableOpacity onPress={handleLikeStation}>
                    <FontAwesome6 name="thumbs-up" size={18} color="#ff6d1f" />
                    <Text>{stationStats?.likes || 0}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDisLikeStation}>
                    <FontAwesome6 name="thumbs-down" size={18} color="red" />
                    <Text>{stationStats?.dislikes || 0}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* location View */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.locationContainer}>
                  <Text style={styles.headingTxt}>Location</Text>
                  <Text>
                    {station?.county} - {station?.town}
                  </Text>
                  <Text>Address: {station?.physicalAddress}</Text>
                </View>
                <View style={styles.locationContainer}>
                  <Text style={styles.headingTxt}>Status</Text>
                  <Text style={styles.subTxt}>{station?.status}</Text>
                </View>
              </View>
              {/* stationMeta */}
              <View style={styles.MetaConatiner}>
                <View style={styles.MetaInfo}>
                  <FontAwesome6 name="phone" size={18} color="#ff6d1f" />
                  <View>
                    <Text>Contact</Text>
                    <Text style={styles.subTxt}>{station?.phoneNo}</Text>
                  </View>
                </View>
                <View style={styles.MetaInfo2}>
                  <FontAwesome6
                    name={station?.isOpen ? "door-open" : "door-closed"}
                    size={18}
                    color={station?.isOpen ? "#28a745" : "#dc3545"}
                  />
                  <View>
                    <Text style={{ fontWeight: "semibold" }}>
                      {station?.isOpen ? "Open Now" : "Closed"}
                    </Text>
                    <Text style={styles.subTxt}>
                      {station?.isOpen
                        ? "We're currently serving customers"
                        : "We'll be back soon"}
                    </Text>
                  </View>
                </View>
              </View>
              {/* gas types */}
              <View>
                <Text style={styles.headingTxt}>Available Gas Types</Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.gasContainer}>
                    {station?.fuel?.map((fuelType, index) => (
                      <TouchableOpacity key={index} style={styles.gas}>
                        <Text>{fuelType.type}</Text>
                        <Text style={styles.subTxt}>
                          Ksh {parseFloat(fuelType.price).toFixed(2)} /Ltr
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              {/* services */}
              <View style={{ width: "100%" }}>
                <Text style={styles.headingTxt}>Services Offered</Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.servicesContainer}>
                    {station?.services?.map((service, index) => (
                      <TouchableOpacity key={index} style={styles.services}>
                        <Text>{service}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              {/* lowerInfo */}
              <View style={styles.lowerInfoContainer}>
                <TouchableOpacity
                  style={styles.orderBtn}
                  onPress={() => setModalOpen(!modalOpen)}
                >
                  <Text style={styles.orderTxt}>Order Now!</Text>
                </TouchableOpacity>
              </View>
              {/* modal section */}
              <Modal
                visible={modalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalOpen(!modalOpen)}
              >
                <TouchableWithoutFeedback
                  onPress={() => setModalOpen(!modalOpen)}
                >
                  <View style={styles.modalOverlay}>
                    <View>
                      {settingOrder ? (
                        <View style={{ flexDirection: "column" }}>
                          <Loader />
                          <Text
                            style={{
                              color: "#ff6d1f",
                              textAlign: "center",
                              paddingTop: 20,
                            }}
                          >
                            Placing order ...Please wait...
                          </Text>
                        </View>
                      ) : (
                        <Text>Order placed</Text>
                      )}
                    </View>
                    <Text style={styles.modalText}>Place Order</Text>
                    {/* inputs */}
                    <View>
                      <Text style={styles.label}>Phone Number</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.clientPhoneNo}
                        onChangeText={(text) =>
                          handleInputChange("clientPhoneNo", text)
                        }
                        keyboardType="numeric"
                        placeholder="Enter M-Pesa phone Number"
                      />
                    </View>

                    <View>
                      <Text style={styles.label}>Fuel Type</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.fuelType}
                        onChangeText={(text) =>
                          handleInputChange("fuelType", text)
                        }
                        placeholder="e.g diesel, kerosene, petrol"
                      />
                    </View>

                    <View>
                      <Text style={styles.label}>Fuel Volume</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.fuelVolume}
                        onChangeText={(text) =>
                          handleInputChange("fuelVolume", text)
                        }
                        keyboardType="numeric"
                        placeholder="Enter fuel Volume"
                      />
                    </View>

                    <View>
                      <Text style={styles.label}>Email</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) =>
                          handleInputChange("email", text)
                        }
                        placeholder="Enter Your Email"
                      />
                    </View>

                    <View>
                      <Text style={styles.label}>Amount</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.amount}
                        onChangeText={(text) =>
                          handleInputChange("amount", text)
                        }
                        keyboardType="numeric"
                        placeholder="Enter fuel price"
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.orderBtn2}
                      onPress={() => handlePlaceOrder()}
                    >
                      <Text style={styles.btnTxt}>Confirm Order</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ImageContainer: {
    width: "100%",
    height: 250,
  },
  stationImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  Stationinfo: {
    padding: 15,
    gap: 20,
  },
  topInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 5,
  },
  ratingTxt: {
    fontSize: 16,
  },
  stationName: {
    fontWeight: "semibold",
    fontSize: 20,
    color: "#00478F",
  },
  subTxt: {
    color: "#00478F",
  },
  likesContainer: {
    flexDirection: "row",
    gap: 30,
  },
  locationContainer: {
    flexDirection: "column",
    gap: 10,
  },
  headingTxt: {
    fontWeight: "semibold",
    fontSize: 18,
    color: "#525151",
  },
  MetaConatiner: {
    flexDirection: "column",
    gap: 20,
    justifyContent: "space-between",
  },
  MetaInfo: {
    flexDirection: "row",
    gap: 20,
    backgroundColor: "#E3E2E2",
    padding: 10,
    width: "43%",
    borderRadius: 10,
  },
  MetaInfo2: {
    flexDirection: "row",
    gap: 20,
    backgroundColor: "#E3E2E2",
    padding: 10,
    width: "auto",
    borderRadius: 10,
  },
  gasContainer: {
    flexDirection: "row",
    paddingTop: 10,
    gap: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  servicesContainer: {
    flexDirection: "row",
    paddingTop: 10,
    gap: 40,
    paddingLeft: 10,
    paddingRight: 10,
    width: "auto",
  },
  services: {
    backgroundColor: "#E3E2E2",
    padding: 5,
    width: "auto",
    alignItems: "center",
    borderRadius: 10,
  },
  gas: {
    backgroundColor: "#E3E2E2",
    padding: 6,
    width: "auto",
    alignItems: "center",
    borderRadius: 10,
  },
  lowerInfoContainer: {
    paddingBottom: 20,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 20,
  },
  price: {
    fontWeight: "semibold",
    fontSize: 24,
    color: "#ff6d1f",
  },
  orderBtn: {
    backgroundColor: "#00478F",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 30,
    width: 250,
  },
  orderTxt: {
    color: "#fff",
  },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    height: 560,
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#ffff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  label: {
    color: "#ffff",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#ffff",
    marginTop: 10,
    borderRadius: 10,
  },
  orderBtn2: {
    backgroundColor: "#00478F",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  btnTxt: {
    color: "#fff",
  },
});
