import React, {ChangeEvent} from "react";

type PropsType={
    isDone:boolean
    callback:(isDone:boolean)=>void
}


export const Checkbox=(props:PropsType)=>{
    const onChangeIsDoneHandler=(event:ChangeEvent<HTMLInputElement>)=>{
        props.callback(event.currentTarget.checked)
    }

    return(
        <input  type="checkbox" checked={props.isDone} onChange={onChangeIsDoneHandler}/>

    )
}