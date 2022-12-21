import {TaskActionsType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {TodoListActionsType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppActionsType, appReducer} from "./app-reducer";
import {AuthActionsType, authReducer} from "../features/Login/auth-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app:appReducer,
    auth:authReducer
})
// непосредственно создаём store
export const store = legacy_createStore(rootReducer,applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>
export type RootState = ReturnType<typeof store.getState>

export type AppDispatchType = ThunkDispatch<RootState, unknown, RootAction>

export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, RootAction>
type RootAction=TodoListActionsType|TaskActionsType|AppActionsType|AuthActionsType
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
