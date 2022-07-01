import {TasksStateType} from '../App';
import {v1} from "uuid";


type ActionsType=removeTaskACType|addTaskACTYpe|changeTaskStatusACType|changeTaskTitlesACType|AddTodolistACType|RemoveTodolistACType

export const tasksReducer = (state: TasksStateType, action: ActionsType) => {
    switch (action.type) {
        case "REMOVE-TASKS": {
            return {...state,[action.payload.todoId]:state[action.payload.todoId].filter(el=>el.id!=action.payload.id)}
        }
        case "ADD-TASKS":{
            let newTask ={id:v1(),title:action.title,isDone:false}
            return {...state,[action.todoID]:[newTask,...state[action.todoID]]}
        }
        case "CHANGE-TASK-STATUS":{
            return {...state,[action.todoID]:state[action.todoID].map(el=>el.id===action.id?{...el,isDone:action.isDone}:el)}
        }
        case "CHANGE-TASKS-TITLE":{
            return{...state,[action.todoID]:state[action.todoID].map(el=>el.id===action.id?{...el,title:action.title}:el)}
        }
        case "ADD-TODOLIST":{
            return {...state,[action.todolistId]:[]}
        }
        case "REMOVE-TODOLIST":{
            let copyState={...state}
            delete copyState[action.todoID]
            return copyState
        }
        default:
          return state;
    }
}


type removeTaskACType =ReturnType<typeof removeTaskAC >
export const removeTaskAC=(id:string,todoId:string)=>{
    return {
        type:"REMOVE-TASKS",
        payload:{
            id,
            todoId
        }
    } as const
}

type addTaskACTYpe=ReturnType<typeof addTaskAC>
export const addTaskAC=(title:string,todoID:string)=>{
    return{
        type:"ADD-TASKS",
        title,
        todoID

    } as const
}

type changeTaskStatusACType=ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC=(id:string,isDone:boolean,todoID:string)=>{
    return{
        type:"CHANGE-TASK-STATUS",
        id,isDone,todoID
    } as const
}

type changeTaskTitlesACType=ReturnType<typeof changeTaskTitlesAC>
export const changeTaskTitlesAC=(id:string,title:string,todoID:string)=>{
    return{
        type:"CHANGE-TASKS-TITLE",
        id,title,todoID
    } as const
}

type AddTodolistACType=ReturnType<typeof AddTodolistAC>
export const AddTodolistAC=(title:string,todolistId:string)=>{
    return{
        type:"ADD-TODOLIST",
        title,
        todolistId
    } as const
}


type RemoveTodolistACType=ReturnType<typeof RemoveTodolistAC>
export const RemoveTodolistAC=(todoID:string)=>{
    return{
        type:"REMOVE-TODOLIST",
        todoID
    } as const
}