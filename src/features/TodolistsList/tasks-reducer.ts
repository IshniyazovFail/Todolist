import {TasksStateType} from '../../app/App';
import {TaskStatuses, TaskType, todolistsAPI} from '../../api/todolists-api'
import {AppDispatchType, AppRootStateType} from "../../app/store";
import {
    addTodolistAC,
    AddTodolistActionType,
    changeTodolistEntityStatusAC,
    removeTodolistAC,
    RemoveTodolistActionType,
    setTodolistAC,
    SetTodolistActionType
} from "./todolists-reducer";
import {RequestStatusType, setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export type TaskActionsType =
    ReturnType<typeof removeTaskAC> |
    ReturnType<typeof addTaskAC> |
    ReturnType<typeof changeTaskStatusAC> |
    ReturnType<typeof changeTaskTitleAC> |
    ReturnType<typeof setTaskAC> |
    RemoveTodolistActionType |
    AddTodolistActionType |
    SetTodolistActionType |
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
const slice = createSlice({
    name: "task",
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        changeTaskStatusAC(state, action: PayloadAction<{ taskId: string, status: TaskStatuses, todolistId: string }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId][index].status = action.payload.status

        },
        changeTaskTitleAC(state, action: PayloadAction<{ taskId: string, title: string, todolistId: string }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId][index].title = action.payload.title
        },
        setTaskAC(state, action: PayloadAction<{ task: TaskType[], todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.task
        },
        changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            state[action.payload.todolistId][index].entityStatus = action.payload.status
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(addTodolistAC,(state,action)=>{
            state[action.payload.todolist.id] =[]
        });
        builder.addCase(removeTodolistAC,(state,action)=>{
            delete  state[action.payload.todolistId]
        });
        builder.addCase(setTodolistAC,(state,action)=>{
             action.payload.todoList.forEach(tl => {
                state[tl.id] = []
            })
        });
    }

})

export const tasksReducer =slice.reducer

export const {removeTaskAC,addTaskAC,changeTaskStatusAC,changeTaskTitleAC,setTaskAC,changeTaskEntityStatusAC} = slice.actions


export const fetchTaskTC = (todolistId: string) => (dispatch:AppDispatchType) => {
    dispatch(setStatusAC({status: 'loading'}))
    todolistsAPI.getTasks(todolistId).then(
        (res) => {
            dispatch(setTaskAC({task:res.data.items, todolistId}))
            dispatch(setStatusAC({status: 'succeeded'}))
        }
    ).catch(error => {
        handleServerNetworkError(error, dispatch)
    })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch:AppDispatchType) => {
    dispatch(setStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatusAC({todolistId, taskId,status:'loading'}))
    todolistsAPI.deleteTask(todolistId, taskId).then(res => {
        dispatch(removeTaskAC({taskId, todolistId}))
        dispatch(setStatusAC({status: 'succeeded'}))
    }).catch(error => {
        handleServerNetworkError(error, dispatch)
    })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch:AppDispatchType) => {
    dispatch(setStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                dispatch(addTaskAC({task}))
                dispatch(setStatusAC({status: 'succeeded'}))
                dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'failed'}))

            }
        }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch:AppDispatchType, getState:AppRootStateType) => {
    dispatch(setStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatusAC({todolistId, taskId, status:'loading'}))
    const allTasksFromState = getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find(t => {
        return t.id === taskId
    })
    if (task) {
        todolistsAPI.updateTask(todolistId, taskId, {
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: status
        }).then(res => {
            dispatch(changeTaskStatusAC({taskId, status, todolistId}))
            dispatch(setStatusAC({status: 'succeeded'}))
            dispatch(changeTaskEntityStatusAC({todolistId, taskId, status:'succeeded'}))
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
}

export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => (dispatch:AppDispatchType, getState:AppRootStateType) => {
    dispatch(changeTaskEntityStatusAC({todolistId, taskId,status: 'loading'}))
    dispatch(setStatusAC({status: 'loading'}))
    const allTasksFromState = getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find(t => {
        return t.id === taskId
    })
    if (task) {
        todolistsAPI.updateTask(todolistId, taskId, {
            title: title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status
        }).then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTaskTitleAC({taskId, title, todolistId}))
                dispatch(setStatusAC({status: 'succeeded'}))
                dispatch(changeTaskEntityStatusAC({todolistId, taskId, status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }

}