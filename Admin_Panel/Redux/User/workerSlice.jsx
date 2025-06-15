import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {SERVER_URL} from '../../src/constants/SERVER_URL'
const initialState={
    workers:[],
    w_loading:false,
    w_error:null
};

export const fetchWorkers=createAsyncThunk('workers/fetchWorkers',async(_,{rejectWithValue})=>{
    try {
        const res=await fetch(SERVER_URL+'/api/users/getWorkers',{
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

const workerSlice=createSlice({
    name:'worker',
    initialState,
    reducers:{
        // adding teacher reducers
        addWorkerStart:(state)=>{
            state.w_loading=true,
            state.w_error=null
        },
        addWorkerSuccess:(state,action)=>{
            state.w_loading=false,
            state.w_error=null,
            state.currentWorker=action.payload
        },
        addWorkerFailure:(state,action)=>{
            state.w_loading=false,
            state.w_error=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchWorkers.pending,(state)=>{
            state.w_loading=true;
            state.w_error=null;
        })
        .addCase(fetchWorkers.fulfilled,(state,action)=>{
            state.w_loading=false;
            state.workers=action.payload;
        })
        .addCase(fetchWorkers.rejected,(state,action)=>{
            state.w_loading=false;
            state.w_error=action.error.message;
        })
    }
})

export const{
    addWorkerStart,
    addWorkerSuccess,
    addWorkerFailure,
}=workerSlice.actions;

export default workerSlice.reducer;