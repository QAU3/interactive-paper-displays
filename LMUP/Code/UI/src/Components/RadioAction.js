import React,{useContext, useEffect} from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
export default function RadioAction(props) {

  const [checked, setChecked] = React.useState(props.isActive);

  useEffect(()=>{
      setChecked(props.isActive)
  },[props])




  const handleChange = (event) => {
    setChecked(event.target.checked);
    props.parentCallback({status:"UPDATE", 
    type:"isActive", 
    value: event.target.checked,
    })

    props.parentCallback({
        status:"UPDATE", 
    type:"r", 
    value: props.bg_color[0],
    })

    props.parentCallback({
        status:"UPDATE", 
    type:"g", 
    value: props.bg_color[1],
    })

    props.parentCallback({
        status:"UPDATE", 
    type:"b", 
    value: props.bg_color[2],
    })
};

  return (
    <div >
       
    <FormGroup row style={{marginLeft: "33%"}}> 
      <FormControlLabel
        control={
            <Checkbox
            checked={checked}
            onChange={handleChange}
            color="primary"
          /> }
          label="Custom background:"
          labelPlacement="start"
      />
      </FormGroup>
    </div>
  );
}