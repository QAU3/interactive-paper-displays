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
import React,{useCallback, useEffect, useReducer,  createContext, useRef} from 'react'
//Other libraries
import axios from 'axios'
import ReactToPrint from 'react-to-print';

//Myc components
import Viewer from './Components/Viewer';
import SimulatorSlider from './Components/SimulatorSlider';
import ColorViewer  from './Components/ColorViewer';
import SelectOptions from './Components/SelectOptions'
import RadioOptions from './Components/RadioOptions'
import DataOption from './Components/DataOption';
import LoadingWheel from './Components/LoadingWheel'
import LoadingRequest from './Components/LoadingRequest';
import MediaModifiers from './Components/MediaModifiers'
import BGSlider from './Components/BGSlider';
import RadioAction from './Components/RadioAction'; 
import SpecialCounter from './Components/SpecialCounter';
import CustomCounter from './Components/CustomCounter';

import RGB2CMYK from './Components/RGB2CMYK';
//MATERIAL
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button, Typography, Accordion } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

//ICONS
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/Print';
import RemoveIcon from '@material-ui/icons/Remove';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import * as APP_CONSTANTS from './AppStateConst'

export const AppContext = createContext()

const reducer = APP_CONSTANTS.reducer
const initialState=APP_CONSTANTS.initialState


const GetColor=APP_CONSTANTS.GetColor
const GetGridType = APP_CONSTANTS.GetGridType
const GetChannelVal = APP_CONSTANTS.GetChannelVal
const mymarks= APP_CONSTANTS.mymarks

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
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  }
}));





function App() {
const classes = useStyles();
//Printing
const componentRef = useRef(null);
const loadingRequest=useRef(null);

const onBeforeGetContentResolve = React.useRef(null);

///***REDUCERS****////
//Counter

const [state, distpach]=useReducer(reducer, initialState)


///Fetching initial data
const callback = useCallback((obj) => {
  // setCount(count);
distpach({
  status:obj.status,
  type:obj.type,
  payload:obj.value
})
}, []); 


useEffect(()=>{
 
  distpach({
    status:'UPDATE',
    type:"loading_request",
    payload: true,
    error:'',
  })

  axios.post('/updateData',{
    "observer":state.observer_src,
    "emitter":state.emitter_src,
    "kW":state.kW,
    "kB":state.kB
  })
  .then(response=>{
    distpach({
      status:'FETCH_SUCCESS',
      payload: response.data,
      error:'',
    })
    //distpach({status:"UPDATE"})
  })
  .catch(error=>{
    distpach({
      status:'FETCH_ERROR',      
    })
  })


},[state.observer_src, state.emitter_src, state.kW,state.kB])




//Helpers
const handleAppType=()=>{
  distpach({
    status:"UPDATE",
    type:"is_simulator",
    payload:false
  })
}

const ModifyKW=(sum)=>{
  let temp=state.kW
  sum ? temp+=5: temp-=5
  
  distpach({
    status:'UPDATE',
    type:"kW",
    payload: temp,
  })
}

const ModifyKB=(sum)=>{
  let temp=state.kB
  sum ? temp+=5: temp-=5
  
  distpach({
    status:'UPDATE',
    type:"kB",
    payload: temp,
  })
}


const handleOnBeforeGetContent = React.useCallback(() => {
  console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console

  distpach({
    status:"UPDATE",
    type:"is_printing",
    payload:true
  })

  distpach({
    status:"UPDATE",
    type:"loading_request",
    payload:true
  })
  return new Promise ((resolve) => {
    onBeforeGetContentResolve.current = resolve;
    setTimeout(() => {
      distpach({
        status:"UPDATE",
        type:"loading_request",
        payload:false
      })
      resolve();
    }, 2000);
  });
}, []);

const handleAfterPrint = React.useCallback(() => {
  console.log("`onAfterPrint` called"); // tslint:disable-line no-console
  distpach({
    status:"UPDATE",
    type:"is_printing",
    payload:false
  })
}, []);
const handleBeforePrint = React.useCallback(() => {
  console.log("`onBeforePrint` called"); // tslint:disable-line no-console
}, []);


console.log(state)

///***GUI****////
  return (
    <AppContext.Provider value={{state:state, distpach:distpach}}>
    <div className="container">
         { state.is_simulator ? 
              state.loading ? <LoadingWheel /> : 
          <div>
             
              <Grid container 
              alignItems="stretch"
              direction="row"
             justifyContent="center"
             className={classes.root}
              spacing={1}>
              
            {/* LOADING REQUEST */}
             {state.loading_request ?  
               <LoadingRequest/> :
                null
              }
    
               {/* LEFT CONTORLS */}
               <Grid item xs={1}>
                 <Paper className={classes.paper}>
                 <CustomCounter 
                       type="font_size"
                       defaultVal={state.font_size}
                       step={4}
                       name="MEDIA SIZE (px): "
                       max={700}
                       icon={[<RemoveIcon/>, <AddIcon/>]}
                       parentCallback={callback}/>
       
       
                  {/*     <CustomCounter
                      type="grid_size"
                       defaultVal={state.grid_size}
                       step={1}
                       name="GRID  SIZE (px): "
                       max={700}
                       icon={[<RemoveIcon/>, <AddIcon/>]}
                       parentCallback={callback}/> */}

                 
                  
                  <Typography> BLACK LIM (kB): {state.kB}</Typography>
                    <Button 
                      onClick={()=>ModifyKB(true)}
                      variant="outlined"
                      className={classes.button}><AddIcon/></Button>
                    <Button 
                     onClick={()=>ModifyKB(false)} 
                     variant="outlined" 
                     className={classes.button}><RemoveIcon/></Button>
                 </Paper>
               </Grid>
       

            

               {/* VIEWER 
               Contain the view of text an images individually. 
               Fixed size 1000x400px
               */ }
               <Grid item xs={10} className="text_centered" ref={componentRef}> 
                   <Viewer

  
                  bg_color={state.isActive ? `${state.r},${state.g},${state.b}` :GetColor({state:state, backgroundColor:true}).join(',')}
                  cyan={GetColor({state:state, backgroundColor:false, ink:"cyan"}).join(',')}
                  magenta={GetColor({state:state, backgroundColor:false, ink:"magenta"}).join(',')}
                  yellow={GetColor({state:state, backgroundColor:false, ink:"yellow"}).join(',')}

                  fontSize={state.font_size}
                  grid_size={state.grid_size ==0 ? 1:state.grid_size}
                  offset={state.offset_ }
                  gridType={GetGridType(state)}
                  cyanOpacity={state.cyanOpacity/100}
                  magentaOpacity={state.magentaOpacity/100}
                  yellowOpacity={state.yellowOpacity/100}
    
                   cyanText={state.cyanText}
                   magentaText={state.magentaText}
                   yellowText={state.yellowText}
                   isText={state.is_text}
                   
                    cyanImage={state.cyanImage}
                    magentaImage={state.magentaImage}
                    yellowImage={state.yellowImage}
  
                    />
               </Grid>
       
              {/* RIGHT CONTORLS */}
               <Grid item xs={1}  >
                 <Paper className={classes.paper} >
                 {/* <CustomCounter
                       type="offset_"
                       defaultVal={state.offset_}
                       step={1}
                       name="OFFSET (px): "
                       max={500}
                       icon={[<RemoveIcon/>, <AddIcon/>]}
                       parentCallback={callback}/>
                     <CustomCounter
                       type="gain_"
                       defaultVal={state.gain_}
                       step={1}
                       name="GAIN : "
                       max={255}
                       icon={[<RemoveIcon/>, <AddIcon/>]}
                       parentCallback={callback}/> */}
                      <Typography variant="subtitle2"  gutterBottom>MEDIA</Typography>
                   
                      <MediaModifiers 
                      isText={state.is_text}
                      icon={<SettingsIcon/>}
                      className={classes.button}
                      parentCallback={callback}/>

                      
                     <Typography variant="subtitle2"  gutterBottom>PRINT</Typography>

                  
                      <ReactToPrint
                                        trigger={() =>  <Button 
                                          variant="outlined" 
                                          color="primary" aria-label="add" className={classes.button}
                                          style={{margin:5}}> <PrintIcon/> </Button>}
                                        onBeforeGetContent={handleOnBeforeGetContent}
                                        onBeforePrint={handleBeforePrint}
                                        onAfterPrint={handleAfterPrint}
                                        content={() => componentRef.current}
                                      />
                   
                      {/* <Button 
                      onClick={handleAppType}
                      variant="outlined" color="primary" className={classes.button} >
                        <ExitToAppIcon/>
                      </Button> */}
                    
                      <Typography>WHITE LIM (kW): {state.kW} </Typography>
                        <Button
                          onClick={()=>ModifyKW(true)}
                          variant="outlined"
                          className={classes.button}><AddIcon/></Button>
                        <Button 
                          onClick={()=>ModifyKW(false)} 
                          variant="outlined"
                          className={classes.button}><RemoveIcon/></Button>
                       
                    </Paper>
               </Grid>
       
       
               {/* SLIDER */ }
               <Grid  item xs={12}>
                 <Paper className={classes.paper} >
                    {state.is_individual ? 
                     <SimulatorSlider
                     type="wavelenght"
                     name="Wavelength"
                     defaultValue={state.wavelenght}
                     step={10}
                     min={400}
                     max={700}
                     marks
                     parentCallback={callback}
                     />:
                     <SimulatorSlider
                     id="smallSlider"
                     type="wavelenght"
                     name="Wavelength"
                     defaultValue={400}
                     marks={mymarks}
                     step={10}
                     min={400}
                     max={420}
                     parentCallback={callback}
                     />
                     }
                   </Paper>
               </Grid>
               {/* COLOR MONITOR*/}
       
                 <Grid item xs={3} className="text_centered">
                   <Paper className={classes.paper} >
                       <ColorViewer 
                       name="Background"
                       color={GetColor({state:state, backgroundColor:true}).join(',')}
                       swStyle={classes.swatch}
                       />
                     </Paper>
                 </Grid>
       
                 <Grid item xs={3} className="text_centered">
                   <Paper className={classes.paper} >
                     <ColorViewer 
                         name="Cyan"
                         color={GetColor({state:state, backgroundColor:false, ink:"cyan"}).join(',')}
                         swStyle={classes.swatch}
                         />
                     </Paper>
                 </Grid>
       
                 <Grid item xs={3} className="text_centered">
                   <Paper className={classes.paper} >
                     <ColorViewer 
                         name="Magenta"
                         color={GetColor({state:state, backgroundColor:false, ink:"magenta"}).join(',')}
                         swStyle={classes.swatch}
                         />
                     </Paper>
                 </Grid>
       
                 <Grid item xs={3} className="text_centered">
                   <Paper className={classes.paper} >
                     <ColorViewer 
                         name="Yellow"
                         color={GetColor({state:state, backgroundColor:false, ink:"yellow"}).join(',')} 
                         swStyle={classes.swatch}
                         />
                     </Paper>
                 </Grid>
       
                 
               {/* DATA CONTROLS*/ }
                 {/* <DataConfiguration/> */}
                {/*  <Grid  item xs={3}>
                   <Paper className={classes.paper} >
                    
                     <b>Paper correction:</b>
                     <DataOption 
                     name="paper_correction" 
                     opone="Off"
                     optwo="On"
                     defaultVal={state.paper_correction}
                     parentCallback={callback}
                     disabled
                     />
                     </Paper>
                 </Grid> */}

                  <Grid  item xs={3}>
                   <Paper className={classes.paper} >
                   <b>Calculation method:</b>
                 <DataOption 
                 name="is_individual" 
                 opone="Integration"
                 optwo="Lambda"
                 defaultVal={state.is_individual}
                 parentCallback={callback}
                 />
                     </Paper>
                 </Grid>
       
                 <Grid  item xs={3}>
                   <Paper className={classes.paper} >
                   <b>Ink type:</b>
                 <DataOption 
                 name="is_laserink" 
                 opone="Inkjet"
                 optwo="Laser"
                 defaultVal={state.is_laserink}
                 parentCallback={callback}
                 />
                     </Paper>
                 </Grid>
       
       
                 <Grid  item xs={3}>
                   <Paper className={classes.paper} >
                    <b>Media type:</b>
                 <DataOption 
                 name="is_text" 
                 opone="Images"
                 optwo="Text"
                 defaultVal={state.is_text}
                 parentCallback={callback}
                 />
                     </Paper>
                 </Grid>

                 
                 {/** ACCORDION */}
                 <Grid item xs={12}>
                   <Paper className={classes.paper} >
                    <Accordion className={classes.paper}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon className={classes.button}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>Advance options</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container className={classes.root} spacing={2}>
                          {/* Data sources*/ }
                        <Grid item xs={12}>
                            <Paper className={classes.paper} style={{border:"1px solid #ffffff"}}>
                              <SelectOptions 
                              name="Observer (S)"
                              label=""
                              data={state.data.digObs}
                              defaultVal={state.observer_src}
                              parentCallback={callback}
                              type="observer_src"
                              />
                
                              <SelectOptions 
                              name="Emitter (E)"
                              label=""
                              disabled={state.is_individual}
                              data={state.data.emmiters}
                              defaultVal={state.emitter_src}
                              parentCallback={callback}
                              type="emitter_src"/>
                
                              <SelectOptions 
                              name="Grid type"
                              label=""
                              data={["Horizontal","Vertical","Pixel"]}
                              defaultVal={state.grid_type}
                              parentCallback={callback}
                              type="grid_type"/>
                
                          
                              </Paper>    
                          </Grid>
                          

       
               {/* MODIFIERS (COLOR)*/ }
                {/* BACKGROUND*/ }
                 <Grid item xs={6}>
                   <Paper className={classes.paper} style={{border:"1px solid #ffffff", height:220}}>
                     <b>Background color:</b>
                    <DataOption 
                     opone="Off"
                     optwo="On"
                     defaultVal={state.is_bgon}
                     name="is_bgon"
                     parentCallback={callback}
                     />
                     
                     <RadioAction
                    bg_color={GetColor({state:state, backgroundColor:true})}
                    isActive={state.isActive}
                     parentCallback={callback}
                     />

                     <RadioOptions
                     defaultVal={state.curr_bgchannel}
                     type="curr_bgchannel"
                     data={["red", "green", "blue"]}
                     parentCallback={callback}
                   
                     />
                    <div>
                      {`(${state.r}, ${state.g}, ${state.b})`}
                    </div>
                     <BGSlider 
                        disabled={!state.isActive}
                        parentCallback={callback}
                        channel={state.curr_bgchannel}
                        value={GetChannelVal(state)}
                       />
                                
                     </Paper>
                 </Grid>
                 {/* LAYERS*/ }
                 <Grid item xs={6}>
                   <Paper className={classes.paper} style={{border:"1px solid #ffffff", height:220}} >
                   <Typography  gutterBottom> 
                   <b>Layer:</b>
                       </Typography>

                     <RadioOptions
                     defaultVal={state.curr_laychannel}
                     parentCallback={callback}
                     type="curr_laychannel"
                      data={["cyan", "magenta", "yellow"]}
                     />
                      <Typography variant="subtitle2"  gutterBottom> 
                      Opacity (%): {state.curr_laychannel === "cyan" ? 
                      state.cyanOpacity
                      :
                        state.curr_laychannel === "magenta" ? 
                          state.magentaOpacity : state.yellowOpacity}
                       </Typography>
                       <SpecialCounter
                     step={5}
                     max={100}
                     icon={[<RemoveIcon/>, <AddIcon/>]}
                   
                      />
        
                     
                     </Paper>
                 </Grid>


                          

                        </Grid>
       

                      </AccordionDetails>
                    </Accordion>
                   </Paper>
                </Grid>

       
      


               {/* MODIFIERS (MEDIA)*/ }
       
             {/*     <Grid item xs={12}>
                   <Paper className={classes.paper} >
                     <MediaModifiers/>
                   </Paper>
                 </Grid> */}
       
       
               </Grid>
               
          </div>
          :
         <RGB2CMYK customeStyle={classes} />}

         {state.error ? state.error:null}
    </div>
    </AppContext.Provider>
  );
}

export default App;
