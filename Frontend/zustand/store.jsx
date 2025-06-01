import {create} from "zustand"
import {createJSONStorage,persist} from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"


const useAuthStore=create(
    persist(
        set=>({
            user:null,
            isUserAuthenticated:false,
            isStationAuthenticated:false,
            station:null,

            //user
            login:async(username,token)=>{
                set({user:{username,token},isAuthenticated:true})
            },
            signup:async(email,username)=>{
                set({user:{email,username},isAuthenticated:true})
            },
            logout:async(username,email)=>{
                set({user:null,isAuthenticated:false})
            },

            // station
            stationLogin:async(stationData)=>{
                set({station:{...stationData},isStationAuthenticated:true})
            },
        }),
        {
            name:"auth-storage",
            storage:createJSONStorage(()=>AsyncStorage)
        }
    )
);

export default useAuthStore