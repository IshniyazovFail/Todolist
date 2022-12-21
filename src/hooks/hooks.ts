import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {AppDispatchType, RootState} from "../app/store";


export const useAppDispatch: () => AppDispatchType = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector