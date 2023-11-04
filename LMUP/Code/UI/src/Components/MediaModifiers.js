import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';

function MediaModifiers(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange=(event,ink)=>{
    props.parentCallback({status:"UPDATE",type:ink,value:event.target.value})
  }



  const handleImageLoader=(event)=>{
    props.parentCallback({status:"UPDATE", type:event.target.name, value:URL.createObjectURL(event.target.files[0])})
  }


  return (
    <div>
      <Button className={props.className} variant="outlined" color="primary" onClick={handleClickOpen}>
        {props.icon}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Media modifier</DialogTitle>
        <DialogContent>
       
         {props.isText ? 
        <div>
           <TextField
            autoFocus
            margin="dense"
            id="cyan"
            label="Cyan text"
            fullWidth
            onChange={(event,ink)=>handleChange(event,"cyanText")}
          />
          <TextField
            autoFocus
            margin="dense"
            id="magenta"
            label="Magenta text"
            fullWidth
            onChange={(event,ink)=>handleChange(event,"magentaText")}

          />
          <TextField
            autoFocus
            margin="dense"
            id="yellow"
            label="Yellow text"
            fullWidth
            onChange={(event,ink)=>handleChange(event,"yellowText")}

          />
        </div> 
        :
        <div>
          <span >Cyan:</span> <br/>
          <Input
           margin="dense" 
           fullWidth
           style={{border:" 1px solid cyan"}} 
           type="file"  
           name="cyanImage" 
           onChange={(e)=>handleImageLoader(e)}/>
          <span >Magenta:</span> <br/>
          <Input 
          margin="dense" 
          fullWidth
          style={{border:" 1px solid magenta"}} 
          type="file"
           name="magentaImage" 
           onChange={(e)=>handleImageLoader(e)}/>

          <span >Yellow:</span> <br/>
          <Input
          margin="dense" 
          fullWidth
          style={{border:" 1px solid yellow"}} 
          type="file" 
          name="yellowImage" 
          onChange={(e)=>handleImageLoader(e)} />
        </div>
        }

        </DialogContent>
        <DialogActions>
      
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default MediaModifiers