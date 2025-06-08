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



const statusData = {
  labels: ["Received","Delivered","Canceled"],
  datasets: [
    {
      data: [apiResponse,deliveredOrders,declinedOrders,]
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
    />
    </View>
  );
};



export const SalesPieChart=({deliveredOrders,declinedOrders,apiResponse})=>{
// sales pie chart
const salesData = [
  {
    name: "Delivered",
    population:deliveredOrders,
    color: "#4CAF50",
    legendFontColor: "#333",
    legendFontSize: 12
  },
  {
    name: "Canceled",
    population:declinedOrders,
    color: "#F44336",
    legendFontColor: "#333",
    legendFontSize: 12
  },
];

return(
    <View>
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
    </View>
)

}



const styles=StyleSheet.create({
analyticsContainer:{
    width:"100%",
}
})
