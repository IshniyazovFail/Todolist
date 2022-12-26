import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {AppThunkType} from "../../app/store";
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
                state.slice(index,1)
            }
        },
        addTodolistAC(state,action:PayloadAction<{todolist: TodolistType}>){
          state.push({...action.payload.todolist, filter: 'all',entityStatus:'idle'})
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
   /*
    (state: Array<TodolistDomainType> = initialState, action: TodoListActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST': return [{...action.todolist, filter: 'all',entityStatus:'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE': return state.map(tl => tl.id === action.id?{...tl,title:action.title}:tl);
        case 'CHANGE-TODOLIST-FILTER': return state.map(tl=>tl.id===action.id?{...tl,filter:action.filter}:tl)
        case "SET-TODOLIST":return action.todoList.map(tl => ({...tl, filter: "all",entityStatus:'idle'}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":return state.map(tl=>tl.id===action.id?{...tl,entityStatus:action.status}:tl)
        default:return state;
    }
}*/

export const {removeTodolistAC,addTodolistAC,changeTodolistTitleAC,changeTodolistFilterAC
,setTodolistAC,changeTodolistEntityStatusAC} =slice.actions
/*(todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const
}
export const setTodolistAC = (todoList: TodolistType[]) => {
    return {type: "SET-TODOLIST", todoList} as const
}
export const changeTodolistEntityStatusAC=(id:string,status:RequestStatusType)=>{
    return {type:"CHANGE-TODOLIST-ENTITY-STATUS",id,status} as const
}*/

export const fetchTodoListTC = (): AppThunkType => (dispatch) => {
    dispatch(setStatusAC({status:'loading'}))
    todolistsAPI.getTodolists().then((res) => {
        dispatch(setTodolistAC({todoList:res.data}))
        dispatch(setStatusAC({status:'succeeded'}))
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}

export const addTodolistTC = (title: string): AppThunkType => (dispatch) => {
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
export const removeTodolistTC = (todolistId: string): AppThunkType => (dispatch) => {
    dispatch(setStatusAC({status:'loading'}))
    dispatch(changeTodolistEntityStatusAC({id:todolistId,status: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId).then(res => {
        dispatch(removeTodolistAC({todolistId}))
        dispatch(setStatusAC({status:'succeeded'}))
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}

export const updateTodolistTitleTC = (id: string, title: string): AppThunkType => (dispatch) => {
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