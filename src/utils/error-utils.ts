import {setErrorAC, setStatusAC} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {AppDispatchType} from "../app/store";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatchType) => {
    if (data.messages.length) {
        dispatch(setErrorAC({error:data.messages[0]}))
    } else {
        dispatch(setErrorAC({error:'Some error occurred'}))
    }
    dispatch(setStatusAC({status:'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: AppDispatchType) => {
    dispatch(setErrorAC({error:error.message}))
    dispatch(setStatusAC({status:'failed'}))
}


