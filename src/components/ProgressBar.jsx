import React from 'react';
import "./progressBarStyle.css"

const Filler = (props) => {
    var percentage = (props.percentage/90)*100;

    return (
        <div className = "filler" style = {{width: percentage + "%"}}>
            <h6>{props.percentage}</h6>
        </div>
    )
}

const ProgressBar = (props) =>{

    return (
        <div className = "progressBar">
            <Filler percentage = {props.percentage}/>
        </div>

    )
}

export default ProgressBar;