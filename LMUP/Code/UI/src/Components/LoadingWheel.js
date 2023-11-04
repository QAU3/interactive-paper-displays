import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
  }));
  
function LoadingWheel ()
{
    const classes = useStyles();

    return (
      <div style={{position:"absolute", left:"45%", top:"45%"}} >
        <h1 style={{color:"#fff"}}>Loading default...</h1>
        <CircularProgress style={{marginLeft:"100px"}} />
      </div>
    );
}
export default LoadingWheel