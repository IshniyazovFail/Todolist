import {TasksStateType, TodolistType} from "../App";
import { tasksReducer} from "./tasks-reducer";
import {AddTodolistAC, todolistsReducer} from "./todolists-reducer";
import {v1} from "uuid";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistType> = []


    const action = AddTodolistAC('new todolist',v1())

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.newTodolistId)
    expect(idFromTodolists).toBe(action.newTodolistId)
})
