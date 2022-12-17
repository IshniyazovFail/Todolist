import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {AppThunkType} from "./store";


export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>

export type TodoListActionsType =
    RemoveTodolistActionType |
    AddTodolistActionType |
    SetTodolistActionType |
    ReturnType<typeof changeTodolistTitleAC> |
    ReturnType<typeof changeTodolistFilterAC>


const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodoListActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST': return [{...action.todolist, filter: 'all'}, ...state]
        case 'CHANGE-TODOLIST-TITLE': return state.map(tl => tl.id === action.id?{...tl,title:action.title}:tl);
        case 'CHANGE-TODOLIST-FILTER': return state.map(tl=>tl.id===action.id?{...tl,filter:action.filter}:tl)
        case "SET-TODOLIST":return action.todoList.map(tl => ({...tl, filter: "all"}))
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

export const fetchTodoListTC = (): AppThunkType => (dispatch) => {
    todolistsAPI.getTodolists().then((res) => {
        dispatch(setTodolistAC(res.data))
    })
}

export const addTodolistTC = (title: string): AppThunkType => (dispatch) => {
    todolistsAPI.createTodolist(title).then(res => {
        dispatch(addTodolistAC(res.data.data.item))
    })
}
export const removeTodolistTC = (todolistId: string): AppThunkType => (dispatch) => {
    todolistsAPI.deleteTodolist(todolistId).then(res => {
        dispatch(removeTodolistAC(todolistId))
    })
}

export const updateTodolistTitleTC = (id: string, title: string): AppThunkType => (dispatch) => {
    todolistsAPI.updateTodolist(id, title).then(res => {
        dispatch(changeTodolistTitleAC(id, title))
    })
}