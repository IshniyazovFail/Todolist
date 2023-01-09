import {setIsLoggedInAC, SetIsLoggedInActionType} from "../features/Login/auth-reducer";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
const initialState = {
    status: 'idle'as RequestStatusType,
    error: '' as string||null,
    isInitialized: false
}

const slice=createSlice({
    name:"app",
    initialState:initialState,
    reducers:{
        setAppStatusAC(state,action:PayloadAction<{status:RequestStatusType}>){
            state.status =action.payload.status
        },
        setAppErrorAC(state,action:PayloadAction<{error:string|null}>){
            state.error = action.payload.error
        },
        setAppInitializedAC(state,action:PayloadAction<{initialized:boolean}>){
            state.isInitialized = action.payload.initialized
        }

    }
})
export const appReducer = slice.reducer
export const {setAppStatusAC,setAppErrorAC,setAppInitializedAC}=slice.actions
export const initializeAppTC = () => (dispatch: ThunkDispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value:true}));
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setIsLoggedInAC({value:false}));
        }

        dispatch(setAppInitializedAC({initialized:true}));
    })
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type setAppInitializedActionType = ReturnType<typeof setAppInitializedAC>
type ThunkDispatch= Dispatch< setAppInitializedActionType|SetIsLoggedInActionType>


