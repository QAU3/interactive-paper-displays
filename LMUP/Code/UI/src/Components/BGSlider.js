import React, { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import {AppContext} from '../App.js'
const useStyles = makeStyles({
  root: {
    width: "auto",
    margin: 10
  },
});


export default function BGSlider(props) {
    const appContext= useContext(AppContext)
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
const [channel, setChannel]= React.useState(props.channel);

const global_state=appContext.state
  useEffect(()=>{
setValue(props.value)   
},[props])
    
const handleChange = React.useCallback((event, newValue) => {
  setValue(newValue);
  switch(global_state.curr_bgchannel){
     case "red":
        return appContext.distpach({
            status:"UPDATE", 
            type:"r",
           payload:newValue}) 
     case "green":
        return appContext.distpach({
            status:"UPDATE", 
            type:"g",
           payload:newValue})     
    case "blue":
       return appContext.distpach({
        status:"UPDATE", 
        type:"b",
       payload:newValue}) 
     default:
         return       
  }
  
} ,[props])
  

  return (
    <div className={classes.root}>
     
      <Slider
        disabled={props.disabled}
        onChange={handleChange}
        value={value}
        aria-labelledby="discrete-slider-small-steps"
        step={5}
        marks
        min={0}
        max={255}
        valueLabelDisplay="auto"
      />
    </div>
  );
}
