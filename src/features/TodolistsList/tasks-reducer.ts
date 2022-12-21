import {TasksStateType} from '../../app/App';
import {TaskStatuses, TaskType, todolistsAPI} from '../../api/todolists-api'
import {AppThunkType} from "../../app/store";
import {
    AddTodolistActionType,
    changeTodolistEntityStatusAC,
    RemoveTodolistActionType,
    SetTodolistActionType
} from "./todolists-reducer";
import {RequestStatusType, setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


export type TaskActionsType =
    ReturnType<typeof removeTaskAC>|
    ReturnType<typeof addTaskAC>|
    ReturnType<typeof changeTaskStatusAC>|
    ReturnType<typeof changeTaskTitleAC>|
    ReturnType<typeof setTaskAC>|
    RemoveTodolistActionType |
    AddTodolistActionType |
    SetTodolistActionType|
    ReturnType<typeof changeTaskEntityStatusAC>

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':return {...state,[action.todolistId]:state[action.todolistId].filter(t=>t.id!==action.taskId)}
        case 'ADD-TASK': return {...state,[action.task.todoListId]:[action.task,...state[action.task.todoListId]]}
        case 'CHANGE-TASK-STATUS': return {...state,[action.todolistId]:state[action.todolistId].map(t=>t.id===action.taskId?{...t,status:action.status}:t)}
        case 'CHANGE-TASK-TITLE': return {...state,[action.todolistId]:state[action.todolistId].map(t=>t.id===action.taskId?{...t,title:action.title}:t)}
        case 'ADD-TODOLIST':return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case "SET-TODOLIST": {
            const stateCopy = {...state}
            action.todoList.forEach(tl => {stateCopy[tl.id] = []})
            return stateCopy
        }
        case "SET-TASK": return {...state,[action.todolistId]:action.task}
        case "SET-TASK-ENTITY-STATUS":return {...state,[action.todolistId]:state[action.todolistId].map(t=>t.id===action.taskId?{...t,entityStatus:action.status}:t)}
        default:return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const
}
export const addTaskAC = (task:TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const
}
export const setTaskAC = (task: TaskType[], todolistId: string) => {
    return {type: "SET-TASK", task, todolistId} as const
}
export const changeTaskEntityStatusAC=(todolistId:string,taskId:string,status:RequestStatusType)=>{
    return {type:"SET-TASK-ENTITY-STATUS",todolistId,taskId,status} as const
}

export const fetchTaskTC = (todolistId: string): AppThunkType => (dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.getTasks(todolistId).then(
        (res) => {
            dispatch(setTaskAC(res.data.items, todolistId))
            dispatch(setStatusAC('succeeded'))
        }
    ).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}

export const removeTaskTC = (todolistId: string, taskId: string): AppThunkType => (dispatch) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId,taskId,'loading'))
    todolistsAPI.deleteTask(todolistId, taskId).then(res => {
        dispatch(removeTaskAC(taskId, todolistId))
        dispatch(setStatusAC('succeeded'))
    }).catch(error=>{
        handleServerNetworkError(error,dispatch)
    })
}

export const addTaskTC = (todolistId: string, title: string):AppThunkType => (dispatch) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                dispatch(addTaskAC(task))
                dispatch(setStatusAC('succeeded'))
                dispatch(changeTodolistEntityStatusAC(todolistId,'succeeded'))
            } else {
                handleServerAppError(res.data,dispatch)
                dispatch(changeTodolistEntityStatusAC(todolistId,'failed'))

            }
        }).catch((error)=>{
        handleServerNetworkError(error,dispatch)
    })
}

export const updateTaskStatusTC =(todolistId:string,taskId:string,status:TaskStatuses):AppThunkType=>(dispatch, getState)=>{
    dispatch(setStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId,taskId,'loading'))
    const allTasksFromState =getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task=tasksForCurrentTodolist.find(t=>{
        return t.id===taskId
    })
    if(task){
        todolistsAPI.updateTask(todolistId,taskId,{
            title:task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: status
        }).then(res=>{
            dispatch(changeTaskStatusAC(taskId,status,todolistId))
            dispatch(setStatusAC('succeeded'))
            dispatch(changeTaskEntityStatusAC(todolistId,taskId,'succeeded'))
        }).catch((error)=>{
            handleServerNetworkError(error,dispatch)
        })
    }
}

export const updateTaskTitleTC =(todolistId:string,taskId:string,title:string):AppThunkType=>(dispatch,getState)=>{
    dispatch(changeTaskEntityStatusAC(todolistId,taskId,'loading'))
    dispatch(setStatusAC('loading'))
    const allTasksFromState =getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task=tasksForCurrentTodolist.find(t=>{
        return t.id===taskId
    })
    if(task){
        todolistsAPI.updateTask(todolistId,taskId,{
            title:title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status
        }).then(res=>{
            if(res.data.resultCode===0){
                dispatch(changeTaskTitleAC(taskId,title,todolistId))
                dispatch(setStatusAC('succeeded'))
                dispatch(changeTaskEntityStatusAC(todolistId,taskId,'succeeded'))
            }
           else{
                handleServerAppError(res.data,dispatch)
            }
        }).catch((error)=>{
            handleServerNetworkError(error,dispatch)
        })
    }

}