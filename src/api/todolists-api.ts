import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        // Не забываем заменить API-KEY на собственный
        'API-KEY': '8412fccc-7db9-4f8c-90b3-198e2eb93072',
    },
})

export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        const promise = instance.put<ResponseType<{}>>(
            `/todo-lists/${todolistId}`,
            { title: title },
        )
        return promise
    },
    deleteTodolist(todolistId:string){
        const promise=instance.delete<ResponseType<{}>>(
            `todo-lists/${todolistId}`,
        )
        return promise
    },
    createTodolist(title:string){
        const promise =instance.post<ResponseType<{item:TodolistType}>>('todo-lists', {title:title})
        return promise
    },
    getTodolist(){
        const promise =instance.get<Array<TodolistType>>('todo-lists')
        return promise
    }
}

type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type ResponseType<D> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}


