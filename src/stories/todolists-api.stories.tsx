
import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolist().then(res=>{
                setState(res.data)
        })


    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.createTodolist("new Todolist").then(res=>{
            setState(res.data)})
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const todolistID='01a0f8f7-058a-4ec9-b3b8-5db3a225deb3'

    useEffect(() => {
        todolistAPI.deleteTodolist(todolistID).then(res=>setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {

    const todolistID='b627ba4f-657b-4088-8623-8437ab660941'
    const [state, setState] = useState<any>(null)
    todolistAPI.updateTodolist(todolistID,"update todolist").then(res=>setState(res.data))
    useEffect(() => {
    }, [])

    return <div>{JSON.stringify(state)}</div>
}


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const todolistID='b627ba4f-657b-4088-8623-8437ab660941'
    useEffect(() => {
        todolistAPI.getTask(todolistID).then(res=>{
            setState(res.data)
        })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTasks = () => {
    const [state, setState] = useState<any>(null)
    const todolistID='b627ba4f-657b-4088-8623-8437ab660941'
    useEffect(() => {
        todolistAPI.createTask(todolistID,'new task').then(res=>{
            setState(res.data)
        })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTasks = () => {
    const [state, setState] = useState<any>(null)
    const todolistID='b627ba4f-657b-4088-8623-8437ab660941'
    const taskID='f7a7069b-568b-42bb-a270-f9df95f03ff9'
    useEffect(() => {
        todolistAPI.deleteTask(todolistID,taskID).then(res=>{
            setState(res.data)
        })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTasks = () => {
    const [state, setState] = useState<any>(null)
    const todolistID='b627ba4f-657b-4088-8623-8437ab660941'
    const taskID='f2da3252-37d8-451d-bdd8-b3e47dfb186d'
    useEffect(() => {
        todolistAPI.updateTask(todolistID,taskID,"update task").then(res=>{
            setState(res.data)
        })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
