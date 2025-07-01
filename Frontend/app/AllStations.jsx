import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import Loader from "../components/loader.jsx";
import axios from "axios";
import { SERVER_URI } from "../constants/SERVER_URI.jsx";

export default function AllStations() {
  const router = useRouter();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const getAStations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${SERVER_URI}/api/v1/Station/approved/`
        );
        const result = response.data;
        if (result.stations) {
          setStations(result.stations);
          setSuccess(true);
          setMessage(result.message);
        } else {
          setError(true);
          setMessage(result.message);
        }
      } catch (error) {
        setError(true);
        setMessage("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    getAStations();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <View style={styles.StationsContainer}>
            {loading ? (
              <Loader />
            ) : error ? (
              <Text>Error fetching all stations</Text>
            ) : (
              // Split into chunks of 3
              stations
                .reduce((chunks, item, index) => {
                  const chunkIndex = Math.floor(index / 2);
                  if (!chunks[chunkIndex]) {
                    chunks[chunkIndex] = [];
                  }
                  chunks[chunkIndex].push(item);
                  return chunks;
                }, [])
                .map((group, groupIndex) => (
                  <View style={styles.stationContainer} key={groupIndex}>
                    {group.map((station) => (
                      <TouchableOpacity
                        key={station._id}
                        onPress={() =>
                          router.push(`/(stationInfo)/${station._id}`)
                        }
                      >
                        <Image
                          source={{ uri: station?.profileImg }}
                          style={{
                            width: 160,
                            height: 150,
                            resizeMode: "cover",
                          }}
                        />
                        <View style={styles.stationInfoContainer}>
                          <View style={styles.ratingContainer}>
                            <Text>{station?.username}</Text>
                            <View style={styles.ratingContainer}>
                              <FontAwesome6
                                name="star"
                                size={16}
                                color="#ff6d1f"
                              />
                              <Text>{station?.starsRating || 0}</Text>
                            </View>
                          </View>
                          <View>
                            {station?.fuel.map((fuelType, index) => (
                              <Text key={index}>
                                {fuelType.type} : Ksh{" "}
                                {parseFloat(fuelType.price).toFixed(2)} /Ltr
                              </Text>
                            ))}
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  StationsContainer: {
    padding: 10,
    width: "auto",
  },

  stationContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: "row",
    gap: 15,
  },
  stationInfoContainer: {
    flexDirection: "column",
    backgroundColor: "#EBF5FF",
    gap: 5,
    width: "100%",
    marginTop: -45,
    padding: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
