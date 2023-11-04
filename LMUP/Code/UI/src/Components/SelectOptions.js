import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      borderColor:"#fff",

    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    itemStyle:{
      color:"#fff",

    }
  }));

  
function SelectOptions(props){
    const classes = useStyles();
    const [state, setState] = React.useState(props.defaultVal);
  
    const handleChange = (event) => {
      const name = event.target.name;
      setState({
        ...state,
        [name]: event.target.value,
      });
       props.parentCallback({status:"UPDATE", type:"isActive" ,value:false})

       return props.parentCallback({status:"UPDATE", type:props.type, value:event.target.value})

    };


    return(
        <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="age-native-label-placeholder" className={classes.itemStyle}>
            {props.name}
            </InputLabel>
            <NativeSelect
            disabled={props.disabled}
            className={classes.itemStyle}
            value={props.defaultVal}
            onChange={handleChange}
            inputProps={{
                name: 'age',
                id: 'age-native-label-placeholder',
            }}
            >
            {props.data.map((v)=>(
              <option key={v} className={classes.itemStyle} value={v}>{v}</option>
            ) )}  
          
            </NativeSelect>
            <FormHelperText>{props.label}</FormHelperText>
        </FormControl>

    )
}

export default SelectOptions;