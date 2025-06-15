import React from "react";
import {Bar} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);
const data={
    labels:["2020","2021","2022","2023","2024","2025"],
    datasets:[
        {
            label:"School Financial Report",
            data:[100000,200000,400000,600000,500000,700000],
            backgroundColor:"rgba(75,192,192,0.5)",
        },
    ],
};

const options={
    responsive:true,
    plugins:{
        legend:{
            position:"top",
        },
    },
    title:{
        display:true,
        text:"School Financial Report"
    },
};

const BarChart=()=>{
    return <Bar data={data} options={options}/>
}

export default BarChart;
