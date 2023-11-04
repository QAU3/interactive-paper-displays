import React from 'react';
import '../App.css';

import PatternRenderer from './PatternRenderer.js'

/* IMPORTATN 
FOR COMPARISONS
I have changed custome style and pattern to get rid of 
the grid
Uncooment the following
{/* <clipPath id="myClip"> */
//style={styles.textMod}
/* <PatternRenderer
identity={"cyan"}
gridType={this.props.gridType}
gridSize={gridSize}
maskingPath="url(#myClip)"
Values2Map={cyanText}
style={styles.cyan}
    */

class DynamicTextView extends React.Component {

GetSteps(offset, gridSize){
    return ((offset+gridSize)*3)
}

render(){
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
        opacity:this.props.cyanOpacity,
     },
    magenta:{
        fill:"rgb("+this.props.magenta+")",
        opacity:this.props.mageOpacity,
    },
    yellow:{
        fill:"rgb("+this.props.yellow+")",
        opacity:this.props.yellowOpacity,
    },
    textMod:{
        fontSize: ""+this.props.textSize+"px",

    }
}

//style={{fill:`"${this.props.cyan}"`}}
    return(
        <div className="viewerContainer">

<svg  width="100%" height="400" className="klen">

<clipPath id="myClip">
    <text  
        className="dynText" 
        style={styles.textMod}
        // style={{
        //     fontSize: ""+this.props.textSize+"px",
        //     fill: "rgb("+this.props.cyan+")",
        //     opacity:this.props.cyanOpacity,

        // }}
        x="50%" y="50%" 
        dominantBaseline="middle" 
        textAnchor="middle">{(this.props.cyanText).toUpperCase()}</text>


    </clipPath>

    <PatternRenderer
        identity={"cyan"}
        gridType={this.props.gridType}
        gridSize={gridSize}
        maskingPath="url(#myClip)"
        Values2Map={cyanText}
        style={styles.cyan}
        />

<g clipPath="url(#myClip)" >

  {cyanText.map((value)=>(
            <rect className="t" x={`${value}px`} y="0"  height="500" key={value}  style={styles.cyan} />

  ))}

</g>

</svg>

<svg  className="klun" width="100%" height="400">

<clipPath id="myClip2">

    <text 
    className="dynText" 
    style={styles.textMod} 
    // style={{
    //     fontSize: ""+this.props.textSize+"px",
    //     fill:"rgb("+this.props.magenta+")",
    //     opacity:this.props.mageOpacity,

    // }}
    x="50%" y="50%"  
    dominantBaseline="middle" 
    textAnchor="middle" >{(this.props.magentaText).toUpperCase()}</text>

</clipPath>

    <PatternRenderer
        identity={"magenta"}
        gridType={this.props.gridType}
        gridSize={gridSize}
        maskingPath="url(#myClip2)"
        Values2Map={magentaText}
        style={styles.magenta}
        />


{/* <g clipPath="url(#myClip2)" >
{magentaText.map((value)=>(
            <rect  x={`${value}px`} y="0"  key={value}  height="500" style={styles.magenta} />

  ))}



</g> */}

</svg>



<svg  className="cuau" width="100%" height="400">

<clipPath id="myClip3">

    <text
    className="dynText"
    style={styles.textMod}
    // style={{
    //     fontSize: ""+this.props.textSize+"px",
    //     fill:"rgb("+this.props.yellow+")",
    //     opacity:this.props.yellowOpacity,

    // }}
    x="50%" y="50%"
    dominantBaseline="middle" 
    textAnchor="middle">{(this.props.yellowText).toUpperCase()}</text>

</clipPath>

    <PatternRenderer
    identity={"yellow"}
    gridType={this.props.gridType}
    gridSize={gridSize}
     maskingPath="url(#myClip3)"
    Values2Map={yellowText}
    style={styles.yellow}
    />


{/* 
<g clipPath="url(#myClip3)" >
{yellowText.map((value)=>(
            <rect  x={`${value}px`} y="0"  height="500" key={value}  style={styles.yellow} />

  ))}
</g> */}

</svg>
        </div>
    );
}
}

export default DynamicTextView;