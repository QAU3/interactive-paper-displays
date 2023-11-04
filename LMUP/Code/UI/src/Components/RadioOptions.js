import React from 'react'


import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';



function RadioOptions(props){
    const [value, setValue] = React.useState(props.defaultVal);
  
    const handleRadioChange = (event) => {
      setValue(event.target.value);
    props.parentCallback({status:"UPDATE", type:props.type, value:event.target.value })
    };
    return (
        <FormControl component="fieldset">
            <RadioGroup row aria-label="position" 
            value={value}
            onChange={handleRadioChange}
            name="position" defaultValue="top">
                {props.data.map((v)=>(
                      <FormControlLabel
                      style={{color:v}}
                      key={v}
                        value={v}
                        control={<Radio color="primary" />}
                        label={v}
                        labelPlacement="top"
                      />
                ))}
                
            </RadioGroup>
        </FormControl>)
}

export default RadioOptions