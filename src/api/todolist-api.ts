import axios from "axios";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        // Не забываем заменить API-KEY на собственный
        'API-KEY': '8412fccc-7db9-4f8c-90b3-198e2eb93072',
    },
})

export const todolistAPI = {
    getTodolist() {
        let promise = instance.get<Array<TodolistType>>('todo-lists');
        return promise
    },
    createTodolist(title: string) {
        let promise = instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});
        return promise
    },
    deleteTodolist(todolistID: string) {
        let promise = instance.delete<ResponseType<{}>>(`todo-lists/${todolistID}`);
        return promise
    },
    updateTodolist(todolistID: string, title: string) {
        let promise = instance.put<ResponseType<{}>>(`todo-lists/${todolistID}`, {title: title})
        return promise
    },
    getTask(todolistId: string) {
        let promise = instance.get<GetTaskType>(`todo-lists/${todolistId}/tasks`)
        return promise
    },
    updateTask(todolistId: string, taskID: string, title: string) {
        let promise = instance.put<ResponseTaskType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks/${taskID}`, {title: title})
        return promise
    },
    createTask(todolistId: string, title: string) {
        let promise = instance.post<ResponseTaskType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title: title})
        return promise
    },
    deleteTask(todolistId: string, taskID: string) {
        let promise = instance.delete<ResponseTaskType<{}>>(`todo-lists/${todolistId}/tasks/${taskID}`)
        return promise
    }
}

type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}
type TaskType={
    todoListId:string
    id:string
    title:string
    description:null
    order:number
    status:number
    addedDate:string
    priority:number

}

export type ResponseType<D> = {
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

type ResponseTaskType<D>={
    fieldsErrors: Array<string>
    messages: Array<string>
    resultCode: number
    data: D
}


