import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {combineReducers} from 'redux';
import thunk from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app:appReducer,
    auth:authReducer
})

//export const store = legacy_createStore(rootReducer,applyMiddleware(thunk));
export const store=configureStore({
    reducer:rootReducer,
    middleware:getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})


export type AppRootStateType = typeof store.getState
export type RootState = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch



// @ts-ignore
window.store = store;
