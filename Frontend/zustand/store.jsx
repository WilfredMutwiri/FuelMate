import {create} from "zustand"
import {createJSONStorage,persist} from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"


const useAuthStore=create(
    persist(
        set=>({
            user:null,
            isAuthenticated:false,

            //login
            login:async(username,token)=>{
                set({user:{username,token},isAuthenticated:true})
            },

            //signup
            signup:async(email,username)=>{
                set({user:{email,username},isAuthenticated:true})
            },

            //signup
            logout:async(username,email)=>{
                set({user:null,isAuthenticated:false})
            }

        }),
        {
            name:"auth-storage",
            storage:createJSONStorage(()=>AsyncStorage)
        }
    )
);

export default useAuthStore