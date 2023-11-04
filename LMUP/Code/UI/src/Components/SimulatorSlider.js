import React from 'react'


import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';





function SimulatorSlider(props){
  const [value, setValue] = React.useState(props.defaultValue);

const handleChange = React.useCallback((event, newValue) => {
  setValue(newValue);
  props.parentCallback({status:"UPDATE", type:props.type ,value:newValue})
  props.parentCallback({status:"UPDATE", type:"isActive" ,value:false})

},[]);

return(
    <div style={{margin:10}}>
    <Typography id="discrete-slider" gutterBottom>
    {props.name}
    </Typography>
    <Slider
    id={props.id}
    key={props.key}
    value={value}
    onChange={handleChange}
    aria-labelledby="discrete-slider"
    valueLabelDisplay="auto"
    step={props.step}
    
    marks={props.marks}
    min={props.min}


    max={props.max}
    />
    </div>
);
}

export default SimulatorSlider