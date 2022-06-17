import React, {useReducer} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';
import AppTodolistBar from "./AppTodolistBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTaskAC,
    addTaskForTodolistsAC,
    changeStatusAC, changeTaskTitleAC,
    DeleteTaskAC,
    removeTaskAC,
    TasksReducer
} from "./reducers/TasksReducer";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    TodolistReduser
} from "./reducers/TodolistReduser";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    function removeTask(id: string, todolistId: string) {
        switchTasks(removeTaskAC(id, todolistId))
    }

    function addTask(title: string, todolistId: string) {
        switchTasks(addTaskAC(title, todolistId))
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        switchTodolists(changeFilterAC(value, todolistId))
    }

    function changeStatus(id: string, isDone: boolean, todolistId: string) {
        switchTasks(changeStatusAC(id, isDone, todolistId))
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        switchTasks(changeTaskTitleAC(id, newTitle, todolistId))
    }

    function removeTodolist(id: string) {
        switchTodolists(removeTodolistAC(id))
        switchTasks(DeleteTaskAC(id))
    }

    function changeTodolistTitle(id: string, title: string) {
        switchTodolists(changeTodolistTitleAC(id, title))
    }

    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, switchTodolists] = useReducer(TodolistReduser, [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ])

    let [tasks, switchTasks] = useReducer(TasksReducer, {
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true}
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "React Book", isDone: true}
        ]
    });

    function addTodolist(title: string) {
        let newTodolistId = v1();
        switchTodolists(addTodolistAC(newTodolistId, title))
        switchTasks(addTaskForTodolistsAC(newTodolistId, title))
    }

    return (
        <div className="App">
            <AppTodolistBar/>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;

                            if (tl.filter === "active") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
                            }
                            if (tl.filter === "completed") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
                            }

                            return <Grid key={tl.id} item>
                                <Paper elevation={3} style={{padding: '10px'}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>

                            </Grid>

                        })
                    }
                </Grid>
            </Container>


        </div>
    );
}

export default App;
