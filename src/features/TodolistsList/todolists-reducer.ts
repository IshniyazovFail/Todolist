import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice=createSlice({
    name:"todolist",
    initialState:initialState,
    reducers:{
        removeTodolistAC(state,action:PayloadAction<{ todolistId: string }>){
            const index = state.findIndex(t=>t.id===action.payload.todolistId)
            if(index>-1){
                state.splice(index,1)
            }
        },
        addTodolistAC(state,action:PayloadAction<{todolist: TodolistType}>){
            state.unshift({...action.payload.todolist, filter: 'all',entityStatus:'idle'})
        },
        changeTodolistTitleAC(state,action:PayloadAction<{id: string, title: string}>){
            const index = state.findIndex(t=>t.id===action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC(state,action:PayloadAction<{id: string, filter: FilterValuesType}>){
            const index = state.findIndex(t=>t.id===action.payload.id)
            state[index].filter = action.payload.filter
        },
        setTodolistsAC(state,action:PayloadAction<{todoList: TodolistType[]}>){
            return  action.payload.todoList.map(tl => ({...tl, filter: "all",entityStatus:'idle'}))
        },
        changeTodolistEntityStatusAC(state,action:PayloadAction<{id:string,status:RequestStatusType}>){
            const index = state.findIndex(t=>t.id===action.payload.id)
            state[index].entityStatus = action.payload.status
        },

    }
})

export const todolistsReducer =slice.reducer

export const {removeTodolistAC,addTodolistAC,changeTodolistTitleAC,changeTodolistFilterAC
    ,setTodolistsAC,changeTodolistEntityStatusAC} =slice.actions
// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC({status:'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC({todoList:res.data}))
                dispatch(setAppStatusAC({status:'succeeded'}))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(setAppStatusAC({status:'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(changeTodolistEntityStatusAC({id:todolistId,status: 'loading'}))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC({todolistId}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(setAppStatusAC({status:'succeeded'}))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC({status:'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC({todolist:res.data.data.item}))
                dispatch(setAppStatusAC({status:'succeeded'}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(changeTodolistEntityStatusAC({id, status:'loading'}))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC({id, title}))
                dispatch(changeTodolistEntityStatusAC({id, status:'succeeded'}))
            })
    }
}

// types

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | ReturnType<typeof changeTodolistEntityStatusAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType>
