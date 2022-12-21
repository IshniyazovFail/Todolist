import {AppThunkType} from "./store";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error:'' as string||null,
    isInitialized:false
}
export type AppActionsType = ReturnType<typeof setStatusAC>|ReturnType<typeof setErrorAC>|ReturnType<typeof setIsInitializedAC>
type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':return {...state, status: action.status}
        case "APP/SET-ERROR":return {...state,error: action.error}
        case "APP/SET-IS-INITIALIZED":return {...state,isInitialized: action.initialized}
        default:
            return state
    }
}

export const setStatusAC=(status:RequestStatusType)=>{
    return { type: 'APP/SET-STATUS',status } as const
}
export const setErrorAC=(error:string|null)=>{
    return {type: 'APP/SET-ERROR',error} as const
}
export const setIsInitializedAC=(initialized:boolean)=>{
    return {type:'APP/SET-IS-INITIALIZED',initialized}as const
}

export const initializeAppTC = ():AppThunkType => (dispatch) => {
    authAPI.me().then(res => {
        dispatch(setIsInitializedAC(true))
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
            handleServerAppError(res.data,dispatch)
        }
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}


