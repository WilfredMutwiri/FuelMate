import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import {SERVER_URL} from '../../src/constants/SERVER_URL'
const initialState={
    teachers:[],
    loading:false,
    error:null
};

export const fetchTeachers=createAsyncThunk('teachers/fetchTeachers',async(_,{rejectWithValue})=>{
    try {
        const res=await fetch(SERVER_URL+'/api/users/getTeachers',{
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

const teacherSlice=createSlice({
    name:'teacher',
    initialState,
    reducers:{
        // adding teacher reducers
        addTeacherStart:(state)=>{
            state.loading=true,
            state.error=null
        },
        addTeacherSuccess:(state,action)=>{
            state.loading=false,
            state.error=null,
            state.currentTeacher=action.payload
        },
        addTeacherFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchTeachers.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchTeachers.fulfilled,(state,action)=>{
            state.loading=false;
            state.teachers=action.payload;
        })
        .addCase(fetchTeachers.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message;
        })
    }
})

export const{
    addTeacherStart,
    addTeacherSuccess,
    addTeacherFailure,
}=teacherSlice.actions;

export default teacherSlice.reducer;