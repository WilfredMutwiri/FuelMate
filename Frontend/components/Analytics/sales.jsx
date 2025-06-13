import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
import Loader from '../../components/loader.jsx';
import axios from 'axios';
import useAuthStore from '../../zustand/store.jsx';

const screenWidth = Dimensions.get("window").width;

export const StationSalesBarGraph = () => {
  const station = useAuthStore((state) => state.station);
  const [monthlyTotals, setMonthlyTotals] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMonthlyOrders = async () => {
      if (!station?.id) {
        console.log("station.id not yet available");
        return;
      }

      setLoading(true);
      const currentYear = new Date().getFullYear();
      const totals = [];

      for (let month = 1; month <= 12; month++) {
        try {
          const res = await axios.get(
            `${SERVER_URI}/api/v1/order/getOrdersByMonth/${station.id}/${month}/${currentYear}`
          );

          totals.push(res.data.totalOrders || 0);
        } catch (err) {
          console.error(`Error fetching month ${month}:`, err.message);
          totals.push(0); // fallback to 0
        }
      }

      setMonthlyTotals(totals);
      setLoading(false);
    };

    fetchMonthlyOrders();
  }, [station?.id]);

  const statusData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: monthlyTotals
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: () => "#077E8C",
    decimalPlaces: 0,
    barPercentage: 0.4
  };

  return (
    <View style={styles.analyticsContainer}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8, textAlign: 'center', paddingTop: 10 }}>
        Sales Summary for the year {new Date().getFullYear()}
      </Text>

      {loading ? (
        <Loader />
      ) : (
        <BarChart
          data={statusData}
          width={screenWidth - 32}
          height={310}
          chartConfig={chartConfig}
          verticalLabelRotation={90}
          style={{ borderRadius: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  analyticsContainer: {
    width: "100%",
  }
});
