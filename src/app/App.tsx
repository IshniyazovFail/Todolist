import React, {useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {fetchTodoListTC} from '../features/TodolistsList/todolists-reducer'
import {TaskType} from '../api/todolists-api'
import {useAppDispatch, useAppSelector} from "../hooks/hooks";
import {LinearProgress} from "@mui/material";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackBar";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const status=useAppSelector(state=>state.app.status)
    const dispatch = useAppDispatch();

    useEffect(()=>{
            dispatch(fetchTodoListTC())
    },[])
    return (
        <div className="App">
            <ErrorSnackbar />
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status==='loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <TodolistsList/>
                {/*<Grid container style={{padding: '20px'}}>
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
                </Grid>*/}
            </Container>
        </div>
    );
}

export default App;
