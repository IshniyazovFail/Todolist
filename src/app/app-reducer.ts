

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error:'' as string||null
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':return {...state, status: action.status}
        case "APP/SET-ERROR":return {...state,error: action.error}
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

export type AppActionsType = ReturnType<typeof setStatusAC>|ReturnType<typeof setErrorAC>
