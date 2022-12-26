import {TaskActionsType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {TodoListActionsType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {combineReducers} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppActionsType, appReducer} from "./app-reducer";
import {AuthActionsType, authReducer} from "../features/Login/auth-reducer";
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

export type AppRootStateType = ReturnType<typeof rootReducer>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatchType = ThunkDispatch<RootState, unknown, RootAction>

export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, RootAction>
type RootAction=TodoListActionsType|TaskActionsType|AppActionsType|AuthActionsType

// @ts-ignore
window.store = store;
