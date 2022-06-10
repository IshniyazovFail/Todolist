import {TaskType} from "../Todolist";
import {v1} from "uuid";

export const TasksReducer = (state: Array<TaskType>, action: tsarACType) => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return state.filter(el => el.id !== action.payload.id)
        }
        case "ADD-TASK": {
            let newTask = {id: v1(), title: action.payload.title, isDone: false};
            return [newTask, ...state]
        }
        default:
            return state
    }
}

type tsarACType = removeTaskACType | addTaskACType
type removeTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (id: string) => {
    return {
        type: "REMOVE-TASK",
        payload: {
            id
        }
    } as const
}

type addTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (title: string) => {
    return {
        type: "ADD-TASK",
        payload: {title}
    } as const
}