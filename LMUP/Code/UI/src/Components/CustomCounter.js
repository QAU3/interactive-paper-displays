import React from 'react'


import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
     margin: theme.spacing(0),
    
    },
    button:{
      borderColor:"#fff",
      color:"#fff",
      margin:5
    }
  }));


function CustomCounter(props){

const classes = useStyles();
const initialVal=props.defaultVal;
const [getCount,setCount]= React.useState(initialVal)


const Increment= ()=>{
   if(getCount<props.max)
   {
    setCount(prevCount=>prevCount+ props.step)
        return  props.parentCallback({value:getCount+ props.step, type: props.type, status:"UPDATE"});

    }

   }


const Decrement=()=>{
    if(getCount>0)
    {
        setCount(prevCount=>prevCount-props.step)
      
            return  props.parentCallback({value:getCount- props.step, type: props.type, status:"UPDATE"});
    
    }

    

}


  return (
    <div className={classes.root}>
    <Typography variant="subtitle2"  gutterBottom> {props.name} {getCount}</Typography>
      {/* <span>{getCount}</span> */}
      {props.normalArrange ? 
      <div >
      <Button  onClick={Decrement} variant="outlined" className={classes.button}>{props.icon[0]}</Button>
      <Button onClick={Increment} variant="outlined" className={classes.button}>{props.icon[1]}</Button>
      </div>
      :
      <div>
        <Button onClick={Increment} variant="outlined" className={classes.button}>{props.icon[1]}</Button>

        <Button onClick={Decrement} variant="outlined" className={classes.button}>{props.icon[0]}</Button>
      </div>
      }

    </div>
  );

}


export default CustomCounter