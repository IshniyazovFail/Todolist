import {setStatusAC} from "../../app/app-reducer";
import {AppThunkType} from "../../app/store";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn: false
}


const slice= createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setIsLoggedInAC(state,action:PayloadAction<{value:boolean}>){
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
// actions
export const {setIsLoggedInAC} = slice.actions
// thunks
export const loginTC = (data: LoginParamsType):AppThunkType => (dispatch) => {
    dispatch(setStatusAC({status:'loading'}))
    authAPI.login(data).then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value:true}))
            dispatch(setStatusAC({status:'succeeded'}))
        } else {
            handleServerAppError(res.data,dispatch)
            dispatch(setStatusAC({status:'failed'}))
        }
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
        dispatch(setStatusAC({status:'failed'}))
    })
}

export const logoutTC = ():AppThunkType => (dispatch) => {
    dispatch(setStatusAC({status:'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:false}))
                dispatch(setStatusAC({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}


// types
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC>
