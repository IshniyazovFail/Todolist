import {AppThunkType} from "./store";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
const initialState = {
    status: 'idle' as RequestStatusType,
    error:'' as string||null,
    isInitialized:false
}
export type AppActionsType = ReturnType<typeof setStatusAC>|ReturnType<typeof setErrorAC>|ReturnType<typeof setIsInitializedAC>


const slice=createSlice({
    name:"app",
    initialState:initialState,
    reducers:{
        setStatusAC(state,action:PayloadAction<{status:RequestStatusType}>){
            state.status =action.payload.status
        },
        setErrorAC(state,action:PayloadAction<{error:string|null}>){
            state.error = action.payload.error
        },
        setIsInitializedAC(state,action:PayloadAction<{initialized:boolean}>){
            state.isInitialized = action.payload.initialized
        }

    }
})
export const appReducer = slice.reducer
export const {setStatusAC,setErrorAC,setIsInitializedAC}=slice.actions


export const initializeAppTC = ():AppThunkType => (dispatch) => {
    authAPI.me().then(res => {
        dispatch(setIsInitializedAC({initialized:true}))
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value:true}));
        } else {
            handleServerAppError(res.data,dispatch)
        }
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}


