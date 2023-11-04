import React,{useContext} from 'react'


import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { AppContext } from '../App';
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


function SpecialCounter(props){
    const appContext=useContext(AppContext)
const classes = useStyles();
const [getCount,setCount]= React.useState(1)

var global_state=appContext.state


const Increment= ()=>{
  
    switch(global_state.curr_laychannel){
        case "cyan":
            if(global_state.cyanOpacity<props.max){
                return appContext.distpach({
                    status:"UPDATE",
                    type:"cyanOpacity",
                    payload:global_state.cyanOpacity+props.step
                })
            }
            break;
        case "magenta":
            if(global_state.magentaOpacity<props.max){
                return appContext.distpach({
                    status:"UPDATE",
                    type:"magentaOpacity",
                    payload:global_state.magentaOpacity+props.step
                })
            }
            break;
        case "yellow":
            if(global_state.yellowOpacity<props.max){
                return appContext.distpach({
                    status:"UPDATE",
                    type:"yellowOpacity",
                    payload:global_state.yellowOpacity+props.step
                })
            }
            break;
        default:
        return
    }

    }

   


const Decrement=()=>{

    switch(global_state.curr_laychannel){
        case "cyan":
            if(global_state.cyanOpacity>0){
                return appContext.distpach({
                    status:"UPDATE",
                    type:"cyanOpacity",
                    payload:global_state.cyanOpacity-props.step
                })
            }
            break;
        case "magenta":
            if(global_state.magentaOpacity>0){
                return appContext.distpach({
                    status:"UPDATE",
                    type:"magentaOpacity",
                    payload:global_state.magentaOpacity-props.step
                })
            }
            break;
        case "yellow":
            if(global_state.yellowOpacity>0){
                return appContext.distpach({
                    status:"UPDATE",
                    type:"yellowOpacity",
                    payload:global_state.yellowOpacity-props.step
                })
            }
            break;
        default:
        return
    }
    

}


  return (
    <div className={classes.root}>
    {/* <Typography variant="subtitle2"  gutterBottom>  Opacity</Typography> */}
      {/* <span>{getCount}</span> */}
      
      <Button  onClick={Decrement} variant="outlined" className={classes.button}>{props.icon[0]}</Button>
      <Button onClick={Increment} variant="outlined" className={classes.button}>{props.icon[1]}</Button>
    
    
    </div>
  );

}


export default SpecialCounter