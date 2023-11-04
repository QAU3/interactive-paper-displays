import React from 'react';

import PatternRenderer from './PatternRenderer.js'


class ImageLoader extends React.Component{

GetSteps(offset, gridSize){
  return ((offset+gridSize)*3)
}
render (){
  var cyanText=[]
var magentaText=[]
var yellowText=[]

var gridSize=this.props.gridSize
var offset=this.props.offset

for(var i=gridSize; i<1000; i+=this.GetSteps(offset,gridSize)){
cyanText.push(i)
magentaText.push(i+gridSize+offset)
yellowText.push(i+gridSize*2+offset*2)


}

var styles={
    cyan:{
        fill: "rgb("+this.props.cyan+")",
        //width: this.props.gridSize+"px",
        opacity:this.props.cyanOpacity,
    },
    magenta:{
        fill:"rgb("+this.props.magenta+")",
        //width: this.props.gridSize+"px",
        opacity:this.props.mageOpacity,
    },
    yellow:{
        fill:"rgb("+this.props.yellow+")",
        //width: this.props.gridSize+"px",
        opacity:this.props.yellowOpacity,
    },
    textMod:{
        fontSize: ""+this.props.textSize+"px",

    }
}
    return (

<div className="viewerContainer">
  <svg className="klen"  width="100%" height="400px" style={{
            width:"100%",height:"400px",
            WebkitMaskImage: `url(${this.props.cyanImage})`,
            WebkitMaskPosition:"center center",
            WebkitMaskSize:this.props.textSize,
            WebkitMaskRepeat:"no-repeat",
            maskImage: `url(${this.props.cyanImage})`, 
            maskPosition:"center center",
            maskSize:this.props.textSize,
            maskRepeat:"no-repeat"}} >

    <defs>
      <clipPath id="mask">
      <rect x="0" y="0" width="100%" height="400" >
    </rect>
      </clipPath>
    </defs>

   {/*  <g clipPath="url(#mask)" >

    {cyanText.map((value)=>(
                <rect  x={`${value}px`} y="0"  height="400" key={value}  style={styles.cyan} />

      ))}
    </g>  */}

<PatternRenderer
        identity={"cyan"}
        gridType={this.props.gridType}
        gridSize={gridSize}
        maskingPath="url(#mask)"
        Values2Map={cyanText}
        style={styles.cyan}
        />
    
  </svg>


  <svg className="klun" width="100%" height="400px" style={{
            width:"100%",height:"400px",
            WebkitMaskImage: `url(${this.props.magentaImage})`,
            WebkitMaskPosition:"center center",
            WebkitMaskSize:this.props.textSize,
            WebkitMaskRepeat:"no-repeat",
            maskImage: `url(${this.props.magentaImage})`,
             maskPosition:"center center", 
             maskSize:this.props.textSize, 
             maskRepeat:"no-repeat"}} >

    <defs>
      <clipPath id="mask2">
      <rect x="0" y="0" width="100%" height="400" >
    </rect>
      </clipPath>
    </defs>

  {/*   <g clipPath="url(#mask2)" >

    {magentaText.map((value)=>(
                <rect  x={`${value}px`} y="0"  height="400" key={value}  style={styles.magenta} />

      ))}
    </g>  */}
       <PatternRenderer
        identity={"magenta"}
        gridType={this.props.gridType}
        gridSize={gridSize}
        maskingPath="url(#mask2)"
        Values2Map={magentaText}
        style={styles.magenta}
        />


  </svg>
  <svg  className="cuau" width="100%" height="400px" style={{
            width:"100%",height:"400px",
            WebkitMaskImage: `url(${this.props.yellowImage})`,
            WebkitMaskPosition:"center center",
            WebkitMaskSize:this.props.textSize,
            WebkitMaskRepeat:"no-repeat",
              maskImage: `url(${this.props.yellowImage})`,
               maskPosition:"center center",
                maskSize:this.props.textSize, 
                maskRepeat:"no-repeat"}} >
    <defs>
      <clipPath id="mask3">
      <rect x="0" y="0" width="100%" height="400" >
    </rect>
      </clipPath>
    </defs>
  {/*   <g clipPath="url(#mask3)" >

    {yellowText.map((value)=>(
                <rect  x={`${value}px`} y="0"  height="400" key={value}  style={styles.yellow} />

      ))}
    </g> */}

<PatternRenderer
    identity={"yellow"}
    gridType={this.props.gridType}
    gridSize={gridSize}
     maskingPath="url(#mask3)"
    Values2Map={yellowText}
    style={styles.yellow}
    />

  </svg>
</div>


    )
}
}

export default ImageLoader;