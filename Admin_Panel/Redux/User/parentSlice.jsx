import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {SERVER_URL} from '../../src/constants/SERVER_URL'
const initialState={
    parents:[],
    ploading:false,
    perror:null
};

export const fetchParents=createAsyncThunk('parents/fetchParents',async(_,{rejectWithValue})=>{
    try {
        const res=await fetch(SERVER_URL+'/api/users/getParents',{
            method:'GET'
        })
        if(!res.ok){
            throw new Error("Failed to fetch, Network error")
        } 
        
        const data=await res.json();
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
});

const parentSlice=createSlice({
    name:'parent',
    initialState,
    reducers:{
        // adding teacher reducers
        addParentStart:(state)=>{
            state.ploading=true,
            state.perror=null
        },
        addParentSuccess:(state,action)=>{
            state.ploading=false,
            state.perror=null,
            state.currentParent=action.payload
        },
        addParentFailure:(state,action)=>{
            state.ploading=false,
            state.perror=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchParents.pending,(state)=>{
            state.ploading=true;
            state.perror=null;
        })
        .addCase(fetchParents.fulfilled,(state,action)=>{
            state.ploading=false;
            state.parents=action.payload;
        })
        .addCase(fetchParents.rejected,(state,action)=>{
            state.ploading=false;
            state.perror=action.error.message;
        })
    }
})

export const{
    addParentStart,
    addParentSuccess,
    addParentFailure,
}=parentSlice.actions;

export default parentSlice.reducer;