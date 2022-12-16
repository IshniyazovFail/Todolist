import axios from "axios";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '8412fccc-7db9-4f8c-90b3-198e2eb93072',
    },
})

export const todolistAPI = {
    getTodolist() {
        return  instance.get<Array<TodolistType>>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});

    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}`);

    },
    updateTodolist(todolistID: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistID}`, {title})
    },
    getTask(todolistId: string) {
        return instance.get<GetTaskType>(`todo-lists/${todolistId}/tasks`)
    },
    updateTask(todolistId: string, taskID: string, title: string) {
        return instance.put<ResponseTaskType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks/${taskID}`, {title: title})
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseTaskType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskID: string) {
        return instance.delete<ResponseTaskType>(`todo-lists/${todolistId}/tasks/${taskID}`)
    }
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}
export type TaskType={
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string

}

export type ResponseType<D={}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
type GetTaskType = {
    error: null
    items: Array<TaskType>
    totalCount: number
}

type ResponseTaskType<D={}>={
    fieldsErrors: Array<string>
    messages: Array<string>
    resultCode: number
    data: D
}


