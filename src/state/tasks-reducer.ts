import {TasksStateType} from '../App';
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";


type ActionsType = removeTaskACType|addTaskACType|changeTaskStatusACType|changeTaskTitleACType|RemoveTodolistActionType|AddTodolistActionType

export const tasksReducer = (state: TasksStateType, action: ActionsType) => {
    switch (action.type) {
        case "REMOVE_TASK":
            return {...state,[action.todolistID]:state[action.todolistID].filter(el=>el.id!==action.taskID)}
        case "ADD_TASK":
            let newTask={id:v1(),title:action.title,isDone:false}
            return{...state,[action.todolistID]:[newTask,...state[action.todolistID]]}
        case "CHANGE_TASK_STATUS":
            return{...state,[action.todolistID]:state[action.todolistID].map(el=>el.id===action.taskID?{...el,isDone:action.isDone}:el)}
        case "CHANGE_TASK_TITLE":
            return{...state,[action.todolistID]:state[action.todolistID].map(el=>el.id===action.taskID?{...el,title:action.title}:el)}
        case "REMOVE-TODOLIST":
            delete state[action.id]
            return{...state}
        case "ADD-TODOLIST":
            return{...state,[action.todolistId]:[]}
        default:
            return state
    }
}

type removeTaskACType=ReturnType<typeof removeTaskAC>
export const removeTaskAC=(taskID:string,todolistID:string)=>{
    return{
        type:"REMOVE_TASK",
        todolistID,
        taskID
    }as const
}

type addTaskACType=ReturnType<typeof addTaskAC>
export const addTaskAC=(title:string,todolistID:string)=>{
    return{
        type:"ADD_TASK",
        title,
        todolistID

    }as const
}

type changeTaskStatusACType=ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC=(taskID:string,isDone:boolean,todolistID:string)=>{
    return {
        type:"CHANGE_TASK_STATUS",
        taskID,isDone,todolistID

    } as const
}

type changeTaskTitleACType=ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC=(taskID:string,title:string,todolistID:string)=>{
    return{
        type:"CHANGE_TASK_TITLE",
        taskID,title,todolistID
    }as const
}

