import React from 'react'

//My Components

import DynamicTextView from './DynamicTextView'
import ImageLoader from './ImageLoader';
function Viewer(props) {
  
 

    return (
      <div style={{background:`rgb(${props.bg_color})`, height:"400px" }}>
        
       {props.isText ?
        <DynamicTextView
        cyan={props.cyan}
        magenta={props.magenta}
        yellow={props.yellow}

        gridType={props.gridType}
    
        textSize= {props.fontSize} 
        gridSize={props.grid_size}
        offset={props.offset}
        

        cyanOpacity={props.cyanOpacity}
        mageOpacity={props.magentaOpacity}
        yellowOpacity={props.yellowOpacity}
    
        cyanText={props.cyanText}
        magentaText={props.magentaText}
        yellowText={props.yellowText}/>
        :
        <ImageLoader
        cyan={props.cyan}
        magenta={props.magenta}
        yellow={props.yellow}
        gridType={props.gridType}
    
        textSize= {props.fontSize} 
        gridSize={props.grid_size}
        offset={props.offset}
    
        cyanOpacity={props.cyanOpacity}
        mageOpacity={props.magentaOpacity}
        yellowOpacity={props.yellowOpacity}
    
    
        cyanImage={props.cyanImage}
        magentaImage={props.magentaImage}
        yellowImage={props.yellowImage}
        
        />
      }


        
      </div>
    );
  }
  
  export default Viewer;
  