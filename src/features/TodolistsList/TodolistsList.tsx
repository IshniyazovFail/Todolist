import React, {useCallback, useEffect} from 'react';
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {addTaskTC, removeTaskTC, updateTaskStatusTC, updateTaskTitleTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {
    addTodolistTC,
    changeTodolistFilterAC, fetchTodoListTC,
    FilterValuesType,
    removeTodolistTC,
    updateTodolistTitleTC
} from "./todolists-reducer";
import {Navigate} from "react-router-dom";

export const TodolistsList:React.FC = () => {

    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn=useAppSelector(state=>state.auth.isLoggedIn)
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!isLoggedIn){
            return;
        }
        dispatch(fetchTodoListTC())
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskTC(todolistId, id));
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC(todolistId,title));
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskStatusTC(todolistId,id,status));
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTitleTC(todolistId, id, newTitle));
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC({id:todolistId,filter: value});
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id));
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(updateTodolistTitleTC(id,title));
    }, []);

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [dispatch]);


if(!isLoggedIn){
    return <Navigate to={'/login'}/>
}
    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm  addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={allTodolistTasks}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                    entityStatus={tl.entityStatus}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    );
};

