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
import {Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const status = useAppSelector(state => state.app.status)
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTodoListTC())
    }, [])
    return (
        <div className="App">
            <ErrorSnackbar/>
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
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistsList/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='*' element={<h1>404: PAGE NOT FOUND</h1>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;
