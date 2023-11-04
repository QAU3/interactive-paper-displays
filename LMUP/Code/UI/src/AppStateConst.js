import { requirePropFactory } from "@material-ui/core"
//IMAGES
import square from './data/img/placeholders/toogleButton_example-01.png'
import hex from './data/img/placeholders/placeholder-02.png'
import star from './data/img/placeholders/toogleButton_example-02.png'


export const initialState={
  loading:true, 
  error:'',
  data:{},

  font_size:58,
  grid_size:0,
  offset_:0,
  gain_:0,
  //Data configuration
  paper_correction:true,
  is_laserink:true,
  is_individual:false,
  is_text:true,
  media_modifier:false,
  //Data sources
  observer_src:"Canon 40D",
  emitter_src:"iPad_n_v2",
  grid_type:"Vertical",
  //Background control
  is_bgon:true,
  curr_bgchannel:"red",
  channel_bgvalue:[0,0,1],
  //Layers control
  curr_laychannel:"cyan",
  channel_layvalue:100,
  wavelenght:400,
  loading_request:true,

  //VIEWER
  cyanText:"BACK-PRINT ILLUMINATION",
  magentaText: "INTERACTICVE SURFACES AND SPACES",
  yellowText: "@ACM ISS INTERNATIONAL",
  cyanImage:star,
  magentaImage:hex,
  yellowImage:square,
  cyanOpacity:40,
  magentaOpacity:0,
  yellowOpacity:100,

//Printing 
is_printing:false,
// Swicth app
is_simulator:true,
file:"",
//Custom colors
isActive:false,

r:0,
g:0,
b:0,

//Multpliers
kW:220,
kB:10,

}


  export const reducer=(state, action)=>{
    switch (action.status){
      case 'FETCH_SUCCESS':
        return {...state,
          loading:false,
          loading_request:false,
          data:action.payload,
          error:'',
        }
        case 'FETCH_ERROR':
          return {
            loading:false,
            loading_request:false,
            data:{},
            error:'Something went wrong!'
          }
        case 'UPDATE':
          return {...state, [action.type]:action.payload}
        default:
          return state
    }
  }


const GetRGBString = (data,state) =>{
switch(state.is_individual){
  case true:
    var r=data["red"][state.wavelenght]
    var g= data["green"][state.wavelenght]
    var b= data["blue"][state.wavelenght]
  return [r,g,b]
  case false:
    return data
  default:
      return
}
}

const DefineBGData= (state)=>{
switch(state.is_individual){
  case true:
    return state.paper_correction ? "bgColors_c": "bgColors"
    default:
      return
  case false:
    switch(state.wavelenght){
      case 400:
        return state.paper_correction ? "rMono_c": "rMono"
      case 410:
        return state.paper_correction ? "gMono_c": "gMono"
      case 420:
        return state.paper_correction ? "bMono_c": "bMono"
      default:
          return state.paper_correction ? "rMono_c": "rMono"
            

    }

}
}
const GetIntegratedData = (state, ink)=>{
  switch(state.wavelenght){
    case 400:
      return state.paper_correction ? "rInks_c_" + ink : "rInks_" +ink
    case 410:
      return state.paper_correction ? "gInks_c_"+ ink : "gInks_"+ ink
    case 420:
      return state.paper_correction ? "bInks_c_"+ ink : "bInks_"+ ink
    default:
        return state.paper_correction ? "rInks_c_"+ ink : "rInks_"+ ink
  }
}

const DefineInkData= (state, ink)=>{
  switch(state.is_individual)
  {
    case true:
      switch(ink)
        {
        case "cyan":
          return state.paper_correction ? "cColors_c" : "cColors"
        case "magenta":
          return state.paper_correction ? "mColors_c" : "mColors"
        case "yellow":
          return state.paper_correction ? "yColors_c" : "yColors"
        default:
          return
        }
    case false:
      return GetIntegratedData(state,ink)
    default:
      return

  }
  }

export const GetColor=({state, backgroundColor, ink})=>{
  if(backgroundColor)
  {
    return state.is_printing ? [255,255,255]: state.is_bgon  ? 
    GetRGBString (state.data.defaultData.bg[DefineBGData(state)],state) : [255,255,255]
     
  }
  else
  {
    if(state.is_printing){
      switch(ink){
        case "cyan":
          return [0,255,255];
        case "magenta":
          return [255,0,255]

        case "yellow":
          return [255,255,0]
        default:
          return;

      }
    }else{
      return GetRGBString (state.data.defaultData[GetInk(state)][DefineInkData(state,ink)],state)

    }
  }

}


export const GetGridType=(state)=>{
  switch (state.grid_type)
  {
    case "Vertical":

      return 1
    case "Horizontal":

      return 2
    case "Pixel":

      return 3
    case "Random":
      return 4
    default:
      return
  }
}



const GetInk= (state)=>{
  return state.is_laserink ? "laser":"inkjet"
}

export const GetChannelVal =(state)=>{
  switch(state.curr_bgchannel)
  {
    case "red":
      return state.r
    case "green":
      return  state.g
        case "blue":
      return  state.b
    default:
      return
  }

}


export const mymarks = [
  {
    value: 400,
    label: 'Red',
  },
  {
    value: 410,
    label: 'Green',
  },
  {
    value: 420,
    label: 'Blue',
  }
]

export const GetFontSize=(state)=>{
  return state.font_size
}