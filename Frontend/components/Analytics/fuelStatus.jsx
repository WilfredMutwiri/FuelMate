import React from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions, View, Text,StyleSheet} from "react-native";
import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
import Loader from '../../components/loader.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../../zustand/store.jsx';
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;



export const FuelStatusBarGraph = () => {
    const station=useAuthStore((state)=>state.station)
    const [apiResponse,setAPIResponse]=useState(0);
    const [deliveredOrders,setDeliveredOrders]=useState(0)
    const [declinedOrders,setDeclinedOrders]=useState(0)
    const [Loading,setLoading]=useState(false);
    const [emergencyOrders,setEmergencyOrders]=useState(0)
    const [receivedOrders,setReceivedOrders]=useState(0)

    // fetch received orders
        useEffect(() => {

        const getStation = async () => {
        if (!station?.id) {
        console.log("station.id not yet available");
        return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URI}/api/v1/order/station/${station.id}`);
            const result = response.data;
            // console.log(result.totalOrders)
            if (result.stationOrders) {
                setAPIResponse(result.totalOrders)
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
        catch (error) {
            console.log("an error occured",error.message);
            ToastComponent("error",error.message)
        }
        setLoading(false);
        };
        getStation();
    }, []);

    // get delivered orders
    useEffect(() => {
        const getDeliveredOrders = async () => {
        if (!station?.id) {
        console.log("station.id not yet available");
        return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URI}/api/v1/order/delivered/station/${station.id}`);
            const result = response.data;
            // console.log(result)
            if (result.success) {
                setDeliveredOrders(result.totalOrders);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
        catch (error) {
            console.log("an error occured",error.message);
            ToastComponent("error",error.message)
        }
        setLoading(false);
        };
        getDeliveredOrders();
    }, []);

    // get received orders
    useEffect(() => {
        const getReceivedOrders = async () => {
        if (!station?.id) {
        console.log("station.id not yet available");
        return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${SERVER_URI}/api/v1/order/station/${station.id}`);
            const result = response.data;
            // console.log(result)
            if (result.success) {
                setReceivedOrders(result.totalOrders);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
        catch (error) {
            console.log("an error occured",error.message);
            ToastComponent("error",error.message)
        }
        setLoading(false);
        };
        getReceivedOrders();
    }, []);

    // get declined/canceled orders
            useEffect(() => {
            const getDeclinedrders = async () => {
            if (!station?.id) {
            console.log("station.id not yet available");
            return;
            }
    
            try {
                setLoading(true);
                const response = await axios.get(`${SERVER_URI}/api/v1/order/canceled/station/${station.id}`);
                const result = response.data;
                // console.log(result)
                if (result.success) {
                    setDeclinedOrders(result.totalOrders);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            }
            catch (error) {
                console.log("an error occured",error.message);
                ToastComponent("error",error.message)
            }
            setLoading(false);
            };
            getDeclinedrders();
        }, []);

        // get emergency orders
        useEffect(() => {
            const getEmergencyOrders = async () => {
            if (!station?.id) {
            console.log("station.id not yet available");
            return;
            }
    
            try {
                setLoading(true);
                const response = await axios.get(`${SERVER_URI}/api/v1/order/emergency/station/${station.id}`);
                const result = response.data;
                console.log(result.total)
                if (result.success) {
                    setEmergencyOrders(result.total);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            }
            catch (error) {
                console.log("an error occured",error.message);
                ToastComponent("error",error.message)
            }
            setLoading(false);
            };
            getEmergencyOrders();
        }, []);


const statusData = {
labels: ["Received","Delivered","Canceled"],
  datasets: [
    {
      data: [apiResponse,deliveredOrders,declinedOrders,emergencyOrders,receivedOrders]
    }
  ]
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => "#000",
  decimalPlaces: 0,
};


    
  return (
    <View style={styles.analyticsContainer}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8,textAlign:'center',paddingTop:10}}>
        Order Status Summary
      </Text>
      
    <SalesPieChart
      deliveredOrders={deliveredOrders}
      declinedOrders={declinedOrders}
      apiResponse={apiResponse}
      emergencyOrders={emergencyOrders}
      receivedOrders={receivedOrders}
    />
    
    </View>
  );
};



export const SalesPieChart=({deliveredOrders,declinedOrders,emergencyOrders,receivedOrders})=>{
// sales pie chart
const salesData = [
    {
    name: "Received",
    population:receivedOrders,
    color: "#F29339",
    legendFontColor: "#333",
    legendFontSize: 12
  },
  {
    name: "Delivered",
    population:deliveredOrders,
    color: "#2ECC71",
    legendFontColor: "#333",
    legendFontSize: 12
  },
  {
    name: "Canceled",
    population:declinedOrders,
    color: "#CD5C5C",
    legendFontColor: "#333",
    legendFontSize: 12
  },
];

const ordersData = [
  {
    name: "Normal Orders",
    population:receivedOrders,
    color: "#F29339",
    legendFontColor: "#333",
    legendFontSize: 12
  },
  {
    name: "Emergency",
    population:emergencyOrders,
    color: "#DC143C",
    legendFontColor: "#333",
    legendFontSize: 12
  },
];
return(
    <View>
      {/* chart one */}
        <PieChart
        data={salesData}
        width={screenWidth - 42}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: () => "#000",
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* chart two */}
      <PieChart
        data={ordersData}
        width={screenWidth - 42}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: () => "#000",
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
)

}



const styles=StyleSheet.create({
analyticsContainer:{
    width:"100%",
}
})
