import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {AppThunkType} from "../../app/store";
import {RequestStatusType, setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


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

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodoListActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST': return [{...action.todolist, filter: 'all',entityStatus:'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE': return state.map(tl => tl.id === action.id?{...tl,title:action.title}:tl);
        case 'CHANGE-TODOLIST-FILTER': return state.map(tl=>tl.id===action.id?{...tl,filter:action.filter}:tl)
        case "SET-TODOLIST":return action.todoList.map(tl => ({...tl, filter: "all",entityStatus:'idle'}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":return state.map(tl=>tl.id===action.id?{...tl,entityStatus:action.status}:tl)
        default:return state;
    }
}

export const removeTodolistAC = (todolistId: string) => {
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
}

export const fetchTodoListTC = (): AppThunkType => (dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.getTodolists().then((res) => {
        dispatch(setTodolistAC(res.data))
        dispatch(setStatusAC('succeeded'))
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}

export const addTodolistTC = (title: string): AppThunkType => (dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.createTodolist(title).then(res => {
        if (res.data.resultCode === 0) {
            const todolist = res.data.data.item
            dispatch(addTodolistAC(todolist))
            dispatch(setStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data,dispatch)
        }
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}
export const removeTodolistTC = (todolistId: string): AppThunkType => (dispatch) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
    todolistsAPI.deleteTodolist(todolistId).then(res => {
        dispatch(removeTodolistAC(todolistId))
        dispatch(setStatusAC('succeeded'))
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}

export const updateTodolistTitleTC = (id: string, title: string): AppThunkType => (dispatch) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(id,'loading'))
    todolistsAPI.updateTodolist(id, title).then(res => {
        if(res.data.resultCode===0){
            dispatch(changeTodolistTitleAC(id, title))
            dispatch(setStatusAC('succeeded'))
            dispatch(changeTodolistEntityStatusAC(id,'succeeded'))
        }
        else {
            handleServerAppError(res.data,dispatch)
            dispatch(setStatusAC('failed'))
            dispatch(changeTodolistEntityStatusAC(id,'failed'))
        }
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}