/* 
SUMMARY
-Each component accepts at least 3 props that are nessesary
to define the reducer state. (parentCallback, type/name, defaultVal)
-The callback returns the 3 parameters (status, type and value)
-There are multiple reducer to control objects with
similar behaibors
-Reducers and states are store in APP_CONSTANT.js
*/

import './App.css';
import React,{useCallback, useEffect, useReducer} from 'react'
import axios from 'axios'
//Myc components
import Viewer from './Components/Viewer';
import SimulatorSlider from './Components/SimulatorSlider';
import ColorViewer  from './Components/ColorViewer';
import SelectOptions from './Components/SelectOptions'
import RadioOptions from './Components/RadioOptions'
import DataOption from './Components/DataOption';


//MATERIAL
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CustomCounter from './Components/CustomCounter';
import { Button, Typography } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
//ICONS
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/Print';
import RemoveIcon from '@material-ui/icons/Remove';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';


import * as APP_CONSTANTS from './AppStateConst'


const countersReducer = APP_CONSTANTS.countersReducer; 
const counterState = APP_CONSTANTS.counterState;
const wavelenghtReducer = APP_CONSTANTS.wavelenghtReducer;
const wavelenghtState= APP_CONSTANTS.wavelenghtState
const dataConfReducer= APP_CONSTANTS.dataConfReducer
const dataconfState=APP_CONSTANTS.dataconfState
const datasrcReducer= APP_CONSTANTS.datasrcReducer
const datasourceState=APP_CONSTANTS.datasourceState
const bgReducer= APP_CONSTANTS.bgReducer
const backgroundState= APP_CONSTANTS.backgroundState
const layersReducer= APP_CONSTANTS.layersReducer
const layersState= APP_CONSTANTS.layersState
const reducer = APP_CONSTANTS.reducer
const initialState=APP_CONSTANTS.initialState


const GetRGBString= APP_CONSTANTS.GetRGBString



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    backgroundColor: "#231f20",
    color:"#fff",
    textAlign: "center"
  },
  control: {
    padding: theme.spacing(2),
  },
  swatch:{
    margin: 5
  },
  button:{
    borderColor:"#fff",
    color:"#fff",
    margin:5
  }
}));


function App() {
const classes = useStyles();
///***REDUCERS****////
//Counter
const [getCounters, dispatchCounters ] = useReducer(countersReducer, counterState);
const [getWavelenght, dispatchWavelenght ] = useReducer(wavelenghtReducer, wavelenghtState)
const [getDataConfig, dispatchConfig]= useReducer(dataConfReducer, dataconfState)
const [getDataSrc, dispatchSrc]= useReducer(datasrcReducer, datasourceState)
const [getBG, dispatchBG]= useReducer(bgReducer, backgroundState)
const [getLayers, dispatchLayers]= useReducer(layersReducer, layersState)
const [state, distpach]=useReducer(reducer, initialState)

const callback = useCallback((obj) => {
    // setCount(count);
    dispatchCounters({
      status:obj.status,
      type:obj.type,
      payload:obj.value
    })
  }, []); 

//Slider
const waveCallback = useCallback((obj) => {
    // setCount(count);
    dispatchWavelenght({
      status:obj.status,
      type:obj.type,
      payload:obj.value
    })

  
    distpach({
      type:"UPDATE",
      name:"bg_Color",
      payload:GetRGBString(state.data.defaultData.bg[state.curr_BGData],obj.value)
    })

   
  }, [state]); 


//Data options
const dataconfCallback = useCallback((obj) => {
  dispatchConfig({
    status:obj.status,
    type:obj.type,
    payload:obj.value
  })
  distpach({
    type:"UPDATE",
    name:"curr_BGData",
    payload:obj.value ?  "bgColors_c" : "bgColors"
  })

 
}, [state]); 

//Data sources
const datasrcCallback = useCallback((obj) => {
  dispatchSrc({
    status:obj.status,
    type:obj.type,
    payload:obj.value
  })
}, []);

//Background
const bgCallback = useCallback((obj) => {
  dispatchBG({
    status:obj.status,
    type:obj.type,
    payload:obj.value
  })
}, []);

//Layers
const layersCallback = useCallback((obj) => {
  dispatchLayers({
    status:obj.status,
    type:obj.type,
    payload:obj.value
  })
}, []);


///Fetching initial data
useEffect(()=>{
  axios.get('/startApp')
  .then(response=>{
    distpach({
      type:'FETCH_SUCCESS',
      payload: response.data,
      error:'',
    })
  })
  .catch(error=>{
    distpach({
      type:'FETCH_ERROR',      
    })
  })
},[])



console.log(state)
///***GUI****////

  return (
    <div className="container">
         {state.loading ? <h1 style={{color:"#fff"}}>Loading...</h1> : 
          <Grid container 
          direction="row"
         justifyContent="center"
         className={classes.root}
          spacing={1}>
           {/* LEFT CONTORLS */}
           <Grid item xs={1}>
             <Paper className={classes.paper}>
             <CustomCounter 
                   type="font_size"
                   defaultVal={getCounters.font_size}
                   step={4}
                   name="FONT SIZE (px): "
                   max={700}
                   icon={[<RemoveIcon/>, <AddIcon/>]}
                   parentCallback={callback}/>
   
   
                  <CustomCounter
                  type="grid_size"
                   defaultVal={getCounters.grid_size}
                   step={1}
                   name="GRID  SIZE (px): "
                   max={700}
                   icon={[<RemoveIcon/>, <AddIcon/>]}
                   parentCallback={callback}/>
               <Typography variant="subtitle2"  gutterBottom>MEDIA</Typography>
               <Button  variant="outlined" className={classes.button}>
                 <SettingsIcon/>
               </Button>
   
   
             </Paper>
           </Grid>
   
           {/* VIEWER 
           Contain the view of text an images individually. 
           Fixed size 1000x400px
           */ }
           <Grid item xs={10} className="text_centered" > 
             <Paper >
               <Viewer
               bg_color={state.bg_Color}
                />
             </Paper> 
           </Grid>
   
          {/* RIGHT CONTORLS */}
           <Grid item xs={1}  >
             <Paper className={classes.paper} >
             <CustomCounter
                   type="offset_"
                   defaultVal={getCounters.offset_}
                   step={1}
                   name="OFFSET (px): "
                   max={500}
                   icon={[<RemoveIcon/>, <AddIcon/>]}
                   parentCallback={callback}/>
                 <CustomCounter
                   type="gain_"
                   defaultVal={getCounters.gain_}
                   step={1}
                   name="GAIN : "
                   max={255}
                   icon={[<RemoveIcon/>, <AddIcon/>]}
                   parentCallback={callback}/>
   
                 <Typography variant="subtitle2"  gutterBottom>ASSET TYPE</Typography>
                 <Button  variant="outlined" className={classes.button}>
                   <CropOriginalIcon/>
                 </Button>
             </Paper>
           </Grid>
   
   
           {/* SLIDER */ }
           <Grid  item xs={12}>
             <Paper className={classes.paper} >
                 <SimulatorSlider
                 type="wavelenght"
                 name="Wavelength"
                 defaultValue={getWavelenght.wavelenght}
                 step={10}
                 min={400}
                 max={700}
                 parentCallback={waveCallback}
                 />
               </Paper>
           </Grid>
           {/* COLOR MONITOR*/}
   
             <Grid item xs={3} className="text_centered">
               <Paper className={classes.paper} >
                   <ColorViewer 
                   name="Lambda"
                   color={state.bg_Color}
                   swStyle={classes.swatch}
                   />
                 </Paper>
             </Grid>
   
             <Grid item xs={3} className="text_centered">
               <Paper className={classes.paper} >
                 <ColorViewer 
                     name="Cyan"
                     color="255,0,0" 
                     swStyle={classes.swatch}
                     />
                 </Paper>
             </Grid>
   
             <Grid item xs={3} className="text_centered">
               <Paper className={classes.paper} >
                 <ColorViewer 
                     name="Magenta"
                     color="255,0,0" 
                     swStyle={classes.swatch}
                     />
                 </Paper>
             </Grid>
   
             <Grid item xs={3} className="text_centered">
               <Paper className={classes.paper} >
                 <ColorViewer 
                     name="Yellow"
                     color="255,0,0" 
                     swStyle={classes.swatch}
                     />
                 </Paper>
             </Grid>
   
             
           {/* DATA CONTROLS*/ }
   
             <Grid  item xs={3}>
               <Paper className={classes.paper} >
                 {/* <DataConfiguration/> */}
                 <b>Paper correction:</b>
                 <DataOption 
                 name="paper_correction" 
                 opone="Off"
                 optwo="On"
                 defaultVal={getDataConfig.paper_correction}
                 parentCallback={dataconfCallback}/>
                 </Paper>
             </Grid>
   
   
             <Grid  item xs={3}>
               <Paper className={classes.paper} >
               <b>Ink type:</b>
             <DataOption 
             name="is_laserink" 
             opone="Inkjet"
             optwo="Laser"
             defaultVal={getDataConfig.is_laserink}
             parentCallback={dataconfCallback}/>
                 </Paper>
             </Grid>
   
   
             <Grid  item xs={3}>
               <Paper className={classes.paper} >
               <b>Calculation method:</b>
             <DataOption 
             name="is_individual" 
             opone="Integration"
             optwo="Individual"
             defaultVal={getDataConfig.is_individual}
             parentCallback={dataconfCallback}/>
                 </Paper>
             </Grid>
   
             <Grid  item xs={3}>
               <Paper className={classes.paper} >
                <b>Media type:</b>
             <DataOption 
             name="is_text" 
             opone="Images"
             optwo="Text"
             defaultVal={getDataConfig.is_text}
             parentCallback={dataconfCallback}/>
                 </Paper>
             </Grid>
   
           {/* Data sources*/ }
           <Grid item xs={12}>
               <Paper className={classes.paper} >
                 <SelectOptions 
                 name="Observer"
                 label=""
                 data={state.data.digObs}
                 defaultVal={getDataSrc.observer_src}
                 parentCallback={datasrcCallback}
                 type="observer_src"
                 />
   
                 <SelectOptions 
                 name="Emitter"
                 label=""
                 data={state.data.emmiters}
                 defaultVal={getDataSrc.emitter_src}
                 parentCallback={datasrcCallback}
                 type="emitter_src"/>
   
                 <SelectOptions 
                 name="Grid type"
                 label=""
                 data={["Horizontal","Vertical","Pixel"]}
                 defaultVal={getDataSrc.grid_type}
                 parentCallback={datasrcCallback}
                 type="grid_type"/>
   
                 <Fab color="primary" aria-label="add" style={{margin:5}}>
                   <PrintIcon/>
                 </Fab>
                 </Paper>    
   
             </Grid>
             
   
   
           {/* MODIFIERS (COLOR)*/ }
   
             <Grid item xs={6}>
               <Paper className={classes.paper} >
                 <b>Background color:</b>
                 <DataOption 
                 opone="Off"
                 optwo="On"
                 defaultVal={getBG.is_bgOn}
                 name="is_bgOn"
                 parentCallback={bgCallback}
                 />
   
                 <RadioOptions
                 defaultVal={getBG.curr_channel}
                 type="curr_channel"
                 data={["red", "green", "blue"]}
                 parentCallback={bgCallback}
                 />
   
                 <SimulatorSlider
                   name="Background color modifier"
                   step={1}
                   min={0}
                   max={255}
                   type="channel_value"
                   parentCallback={bgCallback}
                   defaultValue={getBG.channel_value}
   
                   />           
                 </Paper>
             </Grid>
   
             <Grid item xs={6}>
               <Paper className={classes.paper} >
                 <RadioOptions
                 defaultVal={getLayers.curr_channel}
                 parentCallback={layersCallback}
                 type="curr_channel"
                  data={["cyan", "magenta", "yellow"]}
                 />
   
                 <CustomCounter 
                 name="Opacity (%): "
                 defaultVal={getLayers.channel_value}
                 type="channel_value"
                 parentCallback={layersCallback}
                 step={10}
                 max={100} 
                 normalArrange={true}
                 icon={[<RemoveIcon/>, <AddIcon/>]}/>
                 
                 </Paper>
             </Grid>
           {/* MODIFIERS (MEDIA)*/ }
   
         {/*     <Grid item xs={12}>
               <Paper className={classes.paper} >
                 <MediaModifiers/>
               </Paper>
             </Grid> */}
   
   
           </Grid>
         }

         {state.error ? state.error:null}
    </div>
    
  );
}

export default App;
//Slider
const waveCallback = useCallback((obj) => {
    // setCount(count);
    dispatchWavelenght({
      status:obj.status,
      type:obj.type,
      payload:obj.value
    })

  
    distpach({
      type:"UPDATE",
      name:"bg_Color",
      payload:GetRGBString(state.data.defaultData.bg[state.curr_BGData],obj.value)
    })

   
  }, [state]); 


//Data options
const dataconfCallback = useCallback((obj) => {
  dispatchConfig({
    status:obj.status,
    type:obj.type,
    payload:obj.value
  })
  updateApp()
 
}, [state]); 

//Data sources
const datasrcCallback = useCallback((obj) => {
  dispatchSrc({
    status:obj.status,
    type:obj.type,
    payload:obj.value
  })
}, []);

//Background
const bgCallback = useCallback((obj) => {
  dispatchBG({
    status:obj.status,
    type:obj.type,
    payload:obj.value
  })
}, []);

//Layers
const layersCallback = useCallback((obj) => {
  dispatchLayers({
    status:obj.status,
    type:obj.type,
    payload:obj.value
  })
}, []);
