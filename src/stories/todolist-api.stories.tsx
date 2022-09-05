
import React, {useEffect, useState} from 'react'
import axios from "axios";
import {todolistAPI} from "../api/todolists-api";

export default {
    title: 'API'
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
       todolistAPI.getTodolist().then(res=>setState(res.data))

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title="new todolist"
        todolistAPI.createTodolist(title).then(res=>setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '5fd05107-d3ad-432e-8c1f-29d65dfcec06'
        todolistAPI.updateTodolist(todolistId, 'SOME NEW TITLE').then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}


export const RemoveTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "2d816146-3594-4534-9518-eddf175b0068"
        todolistAPI.deleteTodolist(todolistId).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}


