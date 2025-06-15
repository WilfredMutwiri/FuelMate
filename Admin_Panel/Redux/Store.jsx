import React from 'react'
import {configureStore,combineReducers} from '@reduxjs/toolkit'
import userReducer from './User/userSlice';
import teacherReducer from './User/teacherSlice';
import studentReducer from './User/studentSlice'
import parentReducer from './User/parentSlice'
import workerReducer from './User/workerSlice'
import {persistReducer} from 'redux-persist';
import storage from  'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';

const rootReducer=combineReducers({
    user:userReducer,
    teacher:teacherReducer,
    parent:parentReducer,
    worker:workerReducer,
    student:studentReducer
});

const persistConfig={
    key:'root',
    storage,
    version:1
}
const persistedReducer=persistReducer(persistConfig,rootReducer);
export const store=configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false})
})
export const persistor=persistStore(store);

