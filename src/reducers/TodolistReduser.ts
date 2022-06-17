import {FilterValuesType, TodolistType} from "../App";


type ActionType = changeFilterACType | addTodolistACType | removeTodolistACType|changeTodolistTitleACType

export const TodolistReduser = (state: Array<TodolistType>, action: ActionType) => {
    switch (action.type) {
        case "CHANGE-FILTER": {
            return state.map(el => el.id === action.payload.todolistId ? {...el, filter: action.payload.value} : el)
        }
        case "ADD-TODO": {
            let newTodolist: TodolistType = {
                id: action.payload.newTodolistId,
                title: action.payload.title,
                filter: 'all'
            };
            return [newTodolist, ...state]
        }
        case "REMOVE-TODO": {
            return state.filter(el=>el.id!==action.payload.id)
        }
        case "CHANGE-TODO-TITLE":{
            return state.map(el=>el.id===action.payload.id?{...el,title:action.payload.title}:el )
        }
        default:
            return state
    }
}


type changeFilterACType = ReturnType<typeof changeFilterAC>
export const changeFilterAC = (value: FilterValuesType, todolistId: string) => {
    return {
        type: "CHANGE-FILTER",
        payload: {
            value,
            todolistId
        }
    } as const
}

type addTodolistACType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (newTodolistId: string, title: string) => {
    return {
        type: "ADD-TODO",
        payload: {
            newTodolistId,
            title
        }
    } as const
}

type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (id: string) => {
    return {
        type: "REMOVE-TODO",
        payload: {
            id
        }
    } as const
}

type changeTodolistTitleACType =ReturnType<typeof changeTodolistTitleAC>
export const changeTodolistTitleAC=(id:string,title:string)=>{
    return{
        type:"CHANGE-TODO-TITLE",
        payload:{
            id,title
        }
    }as const
}