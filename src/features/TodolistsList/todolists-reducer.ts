import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {AppDispatchType} from "../../app/store";
import {RequestStatusType, setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>

export type TodoListActionsType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    SetTodolistActionType |
    ReturnType<typeof changeTodolistTitleAC> |
    ReturnType<typeof changeTodolistFilterAC>|
    ReturnType<typeof changeTodolistEntityStatusAC>


const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

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
        setTodolistAC(state,action:PayloadAction<{todoList: TodolistType[]}>){
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
,setTodolistAC,changeTodolistEntityStatusAC} =slice.actions

export const fetchTodoListTC = () => (dispatch:AppDispatchType) => {
    dispatch(setStatusAC({status:'loading'}))
    todolistsAPI.getTodolists().then((res) => {
        dispatch(setTodolistAC({todoList:res.data}))
        dispatch(setStatusAC({status:'succeeded'}))
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}

export const addTodolistTC = (title: string) => (dispatch:AppDispatchType) => {
    dispatch(setStatusAC({status:'loading'}))
    todolistsAPI.createTodolist(title).then(res => {
        if (res.data.resultCode === 0) {
            const todolist = res.data.data.item
            dispatch(addTodolistAC({todolist}))
            dispatch(setStatusAC({status:'succeeded'}))
        } else {
            handleServerAppError(res.data,dispatch)
        }
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}
export const removeTodolistTC = (todolistId: string) => (dispatch:AppDispatchType) => {
    dispatch(setStatusAC({status:'loading'}))
    dispatch(changeTodolistEntityStatusAC({id:todolistId,status: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId).then(res => {
        dispatch(removeTodolistAC({todolistId}))
        dispatch(setStatusAC({status:'succeeded'}))
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}

export const updateTodolistTitleTC = (id: string, title: string) => (dispatch:AppDispatchType) => {
    dispatch(setStatusAC({status:'loading'}))
    dispatch(changeTodolistEntityStatusAC({id,status: 'loading'}))
    todolistsAPI.updateTodolist(id, title).then(res => {
        if(res.data.resultCode===0){
            dispatch(changeTodolistTitleAC({id, title}))
            dispatch(setStatusAC({status:'succeeded'}))
            dispatch(changeTodolistEntityStatusAC({id,status: 'succeeded'}))
        }
        else {
            handleServerAppError(res.data,dispatch)
            dispatch(setStatusAC({status:'failed'}))
            dispatch(changeTodolistEntityStatusAC({id,status: 'failed'}))
        }
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}