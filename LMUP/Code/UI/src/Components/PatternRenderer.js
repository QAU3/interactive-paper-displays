import React from 'react';
import '../App.css';
//import data from './d.json'
import data from '../coordinates.json'
const VERTICAL= 1
const HORIZONTAL=2
const DOTS=3
const RANDOM=4

class PatternRenderer extends React.Component {
 

      
    render() {
   /*      var f=[]
        for (var i=0; i<data.data.length;i++){
            for(var j =0; j<data.data[0].length;j++){
                f.push([i+130,data.data[i][j]])
            }
        }
        console.log({"coord":f}) */
        
/* console.log(data) 

 */        switch (this.props.gridType){
            case VERTICAL:
            return (
                <g clipPath={this.props.maskingPath}>
                    {this.props.Values2Map.map((value)=>(
                        <rect  x={`${value}`} y="0"  key={value} width={`${this.props.gridSize}`} height="400" style={this.props.style} />
                        ))}
                </g>
            )
            case HORIZONTAL:

                return (
                    <g clipPath={this.props.maskingPath}>
                        {this.props.Values2Map.map((value)=>(
                            <rect  x="0" y={`${value}`}   key={value} width="1000" height={`${this.props.gridSize}`} style={this.props.style} />
                            ))}
                    </g>
                )

           case DOTS:
            switch (this.props.identity){
                case "cyan":
                 return(
                     <g clipPath={this.props.maskingPath} >
         
                     {/* {data.map((value)=>(
                             <rect  x={`${value[1]}`} y={`${value[0]}`} key={value} width="1" height="1" style={this.props.style} />
                             
                             ))}
      */}
                        <pattern  id="pattern-checkers" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse" >
                            <rect class="red" x="0" width="1" height="1" y="0" style={this.props.style}/>
                            <rect class="red" x="1" width="1" height="1" y="1" style={this.props.style}/>
                            <rect class="red" x="2" width="1" height="1" y="2" style={this.props.style}/>
                        </pattern>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-checkers)" />
                     </g> 
                     )
                case "magenta":
                 return(
                     <g clipPath={this.props.maskingPath} >
         
                     {/* {data.map((value)=>(
                             <rect  x={`${value[1]+1}`} y={`${value[0]}`} key={value} width="1" height="1" style={this.props.style} />
                             
                             ))}
      */}
                        <pattern id="pattern-checkers2" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse"  >
                            <rect class="green" x="1" width="1" height="1" y="0" style={this.props.style}/>
                            <rect class="green" x="0" width="1" height="1" y="2" style={this.props.style}/>
                            <rect class="green" x="2" width="1" height="1" y="1" style={this.props.style}/>

                        </pattern>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-checkers2)"/>
                     </g> 
                     )
                 case "yellow":
                     return(
                         <g clipPath={this.props.maskingPath} >
             
                         {/* {data.map((value)=>(
                                 <rect  x={`${value[1]+2}`} y={`${value[0]}`} key={value} width="1" height="1" style={this.props.style} />
                                 
                                 ))} */}
                    <pattern id="pattern-checkers3"  x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
                        <rect class="blue" x="0" width="1" height="1" y="1" style={this.props.style}/>
                        <rect class="blue" x="2" width="1" height="1" y="0" style={this.props.style}/>
                        <rect class="blue" x="1" width="1" height="1" y="2" style={this.props.style}/>

                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-checkers3)"  />
                         </g> 
                         )
     
            }

            case RANDOM:
                switch(this.props.identity)
                {
                    case "cyan":
                        return(
                            <g clipPath={this.props.maskingPath} >
             
                                
                                <pattern  id="pattern-checkers1" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse" >                                    <rect class="blue" x="0" width="1" height="1" y="1"/>
                                     <rect class="red" x="0" width="1" height="1" y="0" style={this.props.style}/>
                                    <rect class="red" x="2" width="1" height="1" y="0" style={this.props.style}/>
                                    <rect class="red" x="4" width="1" height="1" y="3"  style={this.props.style}/>
                                    <rect class="red" x="2" width="1" height="1" y="2" style={this.props.style}/>

                                 </pattern>
                                 <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-checkers1)" />
                            </g> 
                        )
                    case "magenta":
                        return(
                            <g clipPath={this.props.maskingPath} >
             
                                
                            <pattern  id="pattern-checkers2" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse" >                                    <rect class="blue" x="0" width="1" height="1" y="1"/>
                                <rect class="green" x="3" width="1" height="1" y="2" style={this.props.style}/>
                                <rect class="green" x="2" width="1" height="1" y="0" style={this.props.style}/>
                                <rect class="green" x="1" width="1" height="1" y="1" style={this.props.style}/>
                             </pattern>
                             <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-checkers2)" />
                        </g> 
                        )
                    case "yellow":
                        return(
                            <g clipPath={this.props.maskingPath} >
             
                                
                            <pattern id="pattern-checkers3" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse" >                                    <rect class="blue" x="0" width="1" height="1" y="1"/>
                                <rect class="blue" x="0" width="1" height="1" y="4" style={this.props.style}/>
                                <rect class="blue" x="4" width="1" height="1" y="2" style={this.props.style}/>
                                <rect class="blue" x="3" width="1" height="1" y="3" style={this.props.style}/>
                                <rect class="blue" x="1" width="4" height="1" y="3" style={this.props.style}/>
                             </pattern>
                             <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-checkers3)" />
                        </g> 
                        )
                    
                }


            default:
                       
                
                return (
                    <g clipPath={this.props.maskingPath}>
                    {this.props.Values2Map.map((value)=>(
                        <rect  x={`${value}`} y="0"  key={value} width={`${this.props.gridSize}`} height="400" style={this.props.style} />
                        ))}
                </g>
                 
                   
                )
             
        }
       
    }
}

export default PatternRenderer; 