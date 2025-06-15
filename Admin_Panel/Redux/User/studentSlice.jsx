import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {SERVER_URL} from '../../src/constants/SERVER_URL'
const initialState={
    students:[],
    sloading:false,
    serror:null
};

export const fetchStudents=createAsyncThunk('students/fetchStudents',async(_,{rejectWithValue})=>{
    try {
        const res=await fetch(SERVER_URL+'/api/users/getStudents',{
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

const studentSlice=createSlice({
    name:'student',
    initialState,
    reducers:{
        // adding students reducers
        addStudentStart:(state)=>{
            state.sloading=true,
            state.serror=null
        },
        addStudentSuccess:(state,action)=>{
            state.sloading=false,
            state.serror=null,
            state.currentStudent=action.payload
        },
        addStudentFailure:(state,action)=>{
            state.sloading=false,
            state.serror=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchStudents.pending,(state)=>{
            state.sloading=true;
            state.serror=null;
        })
        .addCase(fetchStudents.fulfilled,(state,action)=>{
            state.sloading=false;
            state.students=action.payload;
        })
        .addCase(fetchStudents.rejected,(state,action)=>{
            state.sloading=false;
            state.serror=action.error.message;
        })
    }
})

export const{
    addStudentStart,
    addStudentSuccess,
    addStudentFailure,
}=studentSlice.actions;

export default studentSlice.reducer;