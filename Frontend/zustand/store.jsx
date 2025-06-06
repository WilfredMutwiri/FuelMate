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
            login:async(username,token,id)=>{
                set({user:{username,token,id},isUserAuthenticated:true})
            },
            signup:async(email,username)=>{
                set({user:{email,username},isUserAuthenticated:true})
            },
            logout:async(username,email)=>{
                set({user:null,isUserAuthenticated:false})
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