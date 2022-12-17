import {TasksStateType} from '../App';
import {TaskStatuses, TaskType, todolistsAPI} from '../api/todolists-api'
import {AppThunkType} from "./store";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from "./todolists-reducer";


export type TaskActionsType =
    ReturnType<typeof removeTaskAC>|
    ReturnType<typeof addTaskAC>|
    ReturnType<typeof changeTaskStatusAC>|
    ReturnType<typeof changeTaskTitleAC>|
    ReturnType<typeof setTaskAC>|
    RemoveTodolistActionType |
    AddTodolistActionType |
    SetTodolistActionType

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

export const fetchTaskTC = (todolistId: string): AppThunkType => (dispatch) => {
    todolistsAPI.getTasks(todolistId).then(
        (res) => {
            dispatch(setTaskAC(res.data.items, todolistId))
        }
    )
}

export const removeTaskTC = (todolistId: string, taskId: string): AppThunkType => (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then(res => {
        dispatch(removeTaskAC(taskId, todolistId))
    })
}

export const addTaskTC = (todolistId: string, title: string): AppThunkType => (dispatch) => {
    todolistsAPI.createTask(todolistId, title).then(
       res=>{ dispatch(addTaskAC(res.data.data.item))}
    )
}

export const updateTaskStatusTC =(todolistId:string,taskId:string,status:TaskStatuses):AppThunkType=>(dispatch, getState)=>{
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
        })
    }
}

export const updateTaskTitleTC =(todolistId:string,taskId:string,title:string):AppThunkType=>(dispatch,getState)=>{
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
            dispatch(changeTaskTitleAC(taskId,title,todolistId))
        })
    }

}