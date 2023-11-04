import React from 'react';


function ColorViewer(props){
    
    return(
        <div>
             <span style={props.txtStyle}><b>{props.name}:</b> ({props.color}) </span>
               <br/>
               <svg width="50" height="50" className={props.swStyle}>
                 <rect width="300" height="100" style={{fill:`rgb(${props.color})`}} />
               </svg>
               <br/>
        </div>
     )
}


export default ColorViewer;