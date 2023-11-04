import React,{useContext, useEffect} from 'react'
import { AppContext } from '../App';

//MATERIAL
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button, Typography } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Input from '@material-ui/core/Input';
import axios from 'axios'

import ExitToAppIcon from '@material-ui/icons/ExitToApp';



function RGB2CMYK (props){
    const appContext=useContext(AppContext)

    const handleAppType=()=>{
        appContext.distpach({
          status:"UPDATE",
          type:"is_simulator",
          payload:true
        })
      }

     
useEffect(()=>{
 
  axios.post('/updateData',{
    "file":appContext.state.image_file,
  })
  .then(response=>{
    appContext.distpach({
      status:'SUBPROCESS_SUCCESS',
      payload: response.data,
      error:'',
    })
  })
  .catch(error=>{
    appContext.distpach({
      status:'SUBPROCESS_ERROR',      
    })
  })


},[]) 
    return (
        <Grid container 
        alignItems="stretch"
        direction="row"
       justifyContent="center"
        spacing={1}
        className={props.customeStyle.root}>
            
            <Grid item xs={10}>
                <Paper className={props.customeStyle.paper}>
                <Input
                  margin="dense" 
                  style={{border:" 1px solid cyan"}} 
                  type="file"  
                  />
                 <Button 
                      onClick={handleAppType}
                      variant="outlined" color="primary" className={props.customeStyle.button} >
                        Process
                      </Button>  
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <Paper className={props.customeStyle.paper}>
                <Typography variant="subtitle2"  gutterBottom>SWITCH APP</Typography>
                      <Button 
                      onClick={handleAppType}
                      variant="outlined" color="primary" className={props.customeStyle.button} >
                        <ExitToAppIcon/>
                      </Button>    
                        
                </Paper>
            </Grid>

</Grid>
    )
}

export default RGB2CMYK