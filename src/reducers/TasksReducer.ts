import {TasksStateType} from "../App";
import {v1} from "uuid";


type ActionType = addTodolistsACType|addTaskACType|changeStatusACType|removeTaskACType|DeleteTaskACType|changeTaskTitleACType

export const TasksReducer =(state:TasksStateType,action:ActionType)=>{
    switch (action.type){
        case "ADD-TASK-FOR-TODOLIST":{
            let newTodolist = {id: action.payload.newTodolistId, title: action.payload.title, filter: 'all'}
            return {...state,[action.payload.newTodolistId]:[]}
        }
        case "ADD-TASK":{
            let task = {id: v1(), title: action.payload.title, isDone: false}
            return {...state,[action.payload.todolistId]:[task,...state[action.payload.todolistId]]}
        }
        case "CHANGE-STATUS":{
            return {...state,[action.payload.todolistId]:state[action.payload.todolistId].map(el=>el.id===action.payload.id? {...el,isDone:action.payload.isDone}:el)}
        }
        case "REMOVE-TASK":{
            return {...state,[action.payload.todolistId]:state[action.payload.todolistId].filter(el=>el.id!==action.payload.id)}
        }
        case "DELETE-TASK":{
            delete state[action.payload.id]
            return state}
        case "CHANGE-TASK-TITLE":{
            return {...state,[action.payload.todolistId]:state[action.payload.todolistId].map(el=>el.id===action.payload.id? {...el,title:action.payload.newTitle}:el)}
        }

        default:return state
    }
}





type addTodolistsACType = ReturnType<typeof addTaskForTodolistsAC>

export const addTaskForTodolistsAC=(newTodolistId:string,title:string)=>{
    return{
        type:"ADD-TASK-FOR-TODOLIST",
        payload:{
            newTodolistId,
            title
        }
    }as const
}


type addTaskACType=ReturnType<typeof addTaskAC>
export const addTaskAC=(title: string, todolistId: string)=>{
    return{
        type:"ADD-TASK",
        payload:{
            title,
            todolistId
        }
    }as const
}

type changeStatusACType = ReturnType<typeof changeStatusAC>
export const changeStatusAC=(id: string, isDone: boolean, todolistId: string)=>{
    return{
        type:"CHANGE-STATUS",
        payload:{
            id, isDone, todolistId
        }
    }as const
}

type removeTaskACType=ReturnType<typeof removeTaskAC>
export const removeTaskAC=(id: string, todolistId: string)=>{
    return{
        type:"REMOVE-TASK",
        payload:{
            id,todolistId
        }
    }as const
}

type DeleteTaskACType =ReturnType<typeof DeleteTaskAC>
export const DeleteTaskAC=(id:string)=>{
    return{type:"DELETE-TASK",payload:{id}} as const
}

type changeTaskTitleACType=ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC=(id: string, newTitle: string, todolistId: string)=>{
    return{
        type:"CHANGE-TASK-TITLE",
        payload:{
            id,newTitle,todolistId
        }
    }as const
}