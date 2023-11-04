import time 
import numpy as np
import pandas as pd
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

from json import JSONEncoder
import os 
import subprocess as subprocess

class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)
     
UPLOAD_FOLDER = './img'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app= Flask(__name__,static_folder=os.path.abspath("./build"),static_url_path='/')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



## RENDERS UI (build)
@app.route('/',methods=['GET'])
def index():   
   return app.send_static_file('index.html')

## UPLOADS CUSTOM IMAGES
@app.route('/uploadFile',methods=['GET', 'POST'])
def uploaded_file():
   """
    Handle file uploads.
    This route accepts file uploads and saves them in the specified upload folder.

    Returns:
        Redirects to the uploaded file or displays an error message.
    """ 
   if request.method == 'POST':
         # check if the post request has the file part
         if 'file' not in request.files:
               flash('No file part')
               return redirect(request.url)
         file = request.files['file']
         # if user does not select file, browser also
         # submit an empty part without filename
         if file.filename == '':
               flash('No selected file')
               return redirect(request.url)
         if file and allowed_file(file.filename):
               filename = secure_filename(file.filename)
               file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
               return redirect(url_for('uploaded_file',
                                       filename=filename))
   return redirect(request.url)


@app.route('/updateData',methods = ['POST', 'GET'])
def dataManager():
    """
    Handle data updates.
    This route is responsible for managing data and configurations.
    
    Returns:
        JSON response containing data based on the user's configuration.
    """
    digObs=pd.read_excel('./data/camspec_database.xlsx', None)
    CP80inks=pd.read_excel('./data/inks_trans_interp.xlsx', None)
    emmiter=pd.read_excel('./data/ipadEmitter.xlsx', None)
    defaultPaper="CP80"
    ## if request is done, we return the names of the available data in .xlsx files 
    ## and data (GetData) accordingly to user's configuration. 
    ## This version allow user to control custom brighness (kW,kB)
    if request.method == 'POST':
      return {'digObs': MakeDictionary(GetBookSheets(digObs)),
           'inks': MakeDictionary(GetBookSheets(CP80inks)), 
           'emmiters':MakeDictionary(GetBookSheets(emmiter)),
           'defaultData':GetData(request.json["observer"],defaultPaper,request.json["emitter"], request.json["kW"], request.json["kB"])}

def GetData(observer,paperType,emmiter,kW,kB):
      """
      Retrieve and process data based on user configuration.
      
      Args:
         observer (str): Observer type.
         paperType (str): Type of paper.
         emmiter (str): Emitter type.
         kW (float): Custom brightness parameter.
         kB (float): Custom brightness parameter.
      
      Returns:
         JSON response containing computed data.
      """
      ##Read files
      S=pd.read_excel('./data/camspec_database.xlsx',observer)
      paper=pd.read_excel('./data/paper_trans_interpolated.xlsx',paperType)
      ##Compute data (string inktype, 2DArray observer,Array paperData, bool ink,string  Emmiter)
      inkjet=ComputeData("inkjet",S,paper, True,emmiter,kW,kB)
      laser=ComputeData("laser",S,paper, True,emmiter,kW,kB)
      bg=ComputeData("inkjet",S,paper, False,emmiter,kW,kB)
      ##Return json object
      ##obj={**inkjet,**laser,**bg}       
      ##return Object2Json(obj)
      return  {"inkjet":inkjet, "laser":laser, "bg":bg}
   
      



##Compute data (string inktype, 2DArray observer,Array paperData, bool ink,string  Emmiter)
def ComputeData(ink,digObs,paper,INKS,emmiter,kW,kB):
   """
    Compute data based on various parameters.
    
    Args:
        ink (str): Ink type.
        digObs (2D array): Observer data.
        paper (array): Paper data.
        INKS (bool): Whether ink is involved.
        emmiter (str): Emitter type.
        kW (float): Custom brightness parameter.
        kB (float): Custom brightness parameter.
    
    Returns:
        JSON response containing computed data.
    """   
   ## CUSTOM BRIGHTNESS 05.02.2022 (We limit the amount of with using low(kB) and high(kW) limits)
   ## Pixel Value = (Lambda*(kW-kB))+kB
   kCustom=(kW-kB)
   
   
   ###Data follows the definitions from Cuau Blackboad(p.39, 2.4.2021)
   wl=np.arange(start=400, stop=730, step=10)
   
   ##Default Paper plus ink (CP80)
   CP80_ink=pd.read_excel('./data/inks_trans_interp.xlsx',ink)
   
   #Observer data per channel (S) - NORMALIZED
   R=digObs.to_numpy()[0]
   G=digObs.to_numpy()[1]
   B=digObs.to_numpy()[2] 
   
   #JUST PAPER -NORMALIZED after division (transmittance is 0-100)
   _PAPER_=paper.to_numpy()[0]/100
   
   #Ink + paper -NORMALIZED after division (transmittance is 0-100)
   C=CP80_ink.to_numpy()[0]/100
   M=CP80_ink.to_numpy()[1]/100
   Y=CP80_ink.to_numpy()[2]/100
         
   #Ink CWR(1/ (ink+paper/paper)) 
   C_cwr=1/(C/_PAPER_)
   M_cwr=1/(M/_PAPER_)
   Y_cwr=1/(Y/_PAPER_)
   
   ###### LAMBDA BY LAMBDA (NORMAL APPROACH)######
   ## Black board 2.4.2021
   ##NORMAL APPROACH (CHECKED)##
   ##NON-CORRECTED VALUES##
   bgColors=GenericMult(1,[R,G,B], kCustom, kB,0.255)
   cyanColors=GenericMult(C_cwr,[R,G,B], kCustom, kB,0.00255)
   magentaColors=GenericMult(M_cwr,[R,G,B],kCustom, kB,0.00255)
   yellowColors=GenericMult(Y_cwr,[R,G,B],kCustom, kB,0.00255)
   
   ##NORMAL APPROACH (CHECKED)##  
   ##CORRECTED VALUES## (This apporach includes trnamittance of paper plus ink)
   bgColors_corrected=GenericMult(_PAPER_,[R,G,B],kCu
   stom, kB)
   cyanColors_corrected=GenericMult(C,[R,G,B],kCustom, kB)
   magentaColors_corrected=GenericMult(M,[R,G,B],kCustom, kB)
   yellowColors_corrected=GenericMult(Y,[R,G,B],kCustom, kB)
   
   ###### INTEGRATINO APPROACH #####
   ##CORRECTED VALUES##   
   ## BGi contains corrected and non corrected values
   BGi=IntegrationRGB([R,G,B],_PAPER_,False,emmiter)
  
   ##NON-CORRECTED VALUES##
   BGNCO= BGi[1]
   BR= BGNCO[0][0]
   BG= BGNCO[0][1]
   BB= BGNCO[0][2]
   
    ##BG INegration corrected values
   BGCO= BGi[0]
   BRc= BGCO[0][0]
   BGc= BGCO[0][1]
   BBc=  BGCO[0][2]
#INKSi=IntegrationRGB([R,G,B],[Cc,Mm,Yy],True)
  

   if(INKS):
       ##HARCODED VALUES
       ##per layer-> returns an array [l_bg->r,l_bg->g,l_bg->b]: where l is the layer parsed
       ### each value in array is an array with 3 values [r g b]. 
       ###THis are the rbg values per layer used in differetn backgorunds
       C_rgb=IntegrationRGB([R,G,B],C,True,emmiter)
       M_rgb=IntegrationRGB([R,G,B],M,True,emmiter)
       Y_rgb=IntegrationRGB([R,G,B],Y,True,emmiter)
       
       Ccwr_rgb=IntegrationRGB([R,G,B],C_cwr,True,emmiter)
       Mcwr_rgb=IntegrationRGB([R,G,B],M_cwr,True,emmiter)
       Ycwr_rgb=IntegrationRGB([R,G,B],Y_cwr,True,emmiter)
       
       ###Correction
       ##CORRECTED
       BG_corrected=[BRc,BGc,BBc]
       REDCYAN_c=GeneratorRGBVals(C_rgb[0],BG_corrected, kCustom, kB)
       REDMAGE_c=GeneratorRGBVals(M_rgb[0],BG_corrected,kCustom, kB)
       REDYELL_c=GeneratorRGBVals(Y_rgb[0],BG_corrected,kCustom, kB)

       GREENCYAN_c=GeneratorRGBVals(C_rgb[1],BG_corrected,kCustom, kB)
       GREENMAGE_c=GeneratorRGBVals(M_rgb[1],BG_corrected,kCustom, kB)
       GREENYELL_c=GeneratorRGBVals(Y_rgb[1],BG_corrected,kCustom, kB)
       
       BLUECYAN_c=GeneratorRGBVals(C_rgb[2],BG_corrected,kCustom, kB)
       BLUEMAGE_c=GeneratorRGBVals(M_rgb[2],BG_corrected,kCustom, kB)
       BLUEYELL_c=GeneratorRGBVals(Y_rgb[2],BG_corrected,kCustom, kB)
       ###NON CORRECTED
       BG_non_corrected=[BR,BG,BB]

       REDCYAN=GeneratorRGBVals(Ccwr_rgb[0],BG_non_corrected, kCustom, kB,0.0255)
       REDMAGE=GeneratorRGBVals(Mcwr_rgb[0],BG_non_corrected, kCustom, kB,0.0255)
       REDYELL=GeneratorRGBVals(Ycwr_rgb[0],BG_non_corrected,kCustom, kB,0.0255)
      
       GREENCYAN=GeneratorRGBVals(Ccwr_rgb[1],BG_non_corrected, kCustom, kB,0.0255)
       GREENMAGE=GeneratorRGBVals(Mcwr_rgb[1],BG_non_corrected, kCustom, kB,0.0255)
       GREENYELL=GeneratorRGBVals(Ycwr_rgb[1],BG_non_corrected, kCustom, kB,0.0255)
      
       BLUECYAN=GeneratorRGBVals(Ccwr_rgb[2],BG_non_corrected, kCustom, kB,0.0255)
       BLUEMAGE=GeneratorRGBVals(Mcwr_rgb[2],BG_non_corrected, kCustom, kB,0.0255)
       BLUEYELL=GeneratorRGBVals(Ycwr_rgb[2],BG_non_corrected, kCustom, kB,0.0255)
       ###Json wrappers
       cColors_= {
            "red":dict(zip(map(str, wl), cyanColors[0])),
            "green":dict(zip(map(str, wl),cyanColors[1])),
            "blue":dict(zip(map(str, wl), cyanColors[2]))
            }
       mColors_= {
            "red":dict(zip(map(str, wl), magentaColors[0])),
            "green":dict(zip(map(str, wl),magentaColors[1])),
            "blue":dict(zip(map(str, wl), magentaColors[2]))
            }
       yColors_= {
            "red":dict(zip(map(str, wl), yellowColors[0])),
            "green":dict(zip(map(str, wl),yellowColors[1])),
            "blue":dict(zip(map(str, wl), yellowColors[2]))
            }
       cColors_c_={
            "red":dict(zip(map(str, wl), cyanColors_corrected[0])),
            "green":dict(zip(map(str, wl),cyanColors_corrected[1])),
            "blue":dict(zip(map(str, wl), cyanColors_corrected[2]))
            }
       mColors_c_={
            "red":dict(zip(map(str, wl), magentaColors_corrected[0])),
            "green":dict(zip(map(str, wl),magentaColors_corrected[1])),
            "blue":dict(zip(map(str, wl), magentaColors_corrected[2]))
            }
       yColors_c_={
            "red":dict(zip(map(str, wl), yellowColors_corrected[0])),
            "green":dict(zip(map(str, wl),yellowColors_corrected[1])),
            "blue":dict(zip(map(str, wl), yellowColors_corrected[2]))
            }
       
       data={
         "cColors":cColors_,
         "mColors":mColors_,
         "yColors":yColors_,
         "cColors_c":cColors_c_,
         "mColors_c":mColors_c_,
         "yColors_c":yColors_c_,
         
         "rInks_c_cyan":REDCYAN_c,
         "rInks_c_magenta":REDMAGE_c,
         "rInks_c_yellow":REDYELL_c,
         "gInks_c_cyan":GREENCYAN_c,
         "gInks_c_magenta":GREENMAGE_c,
         "gInks_c_yellow":GREENYELL_c,
         "bInks_c_cyan":BLUECYAN_c,
         "bInks_c_magenta":BLUEMAGE_c,
         "bInks_c_yellow":BLUEYELL_c,

         "rInks_cyan":REDCYAN,
         "rInks_magenta":REDMAGE,
         "rInks_yellow":REDYELL,
         "gInks_cyan":GREENCYAN,
         "gInks_magenta":GREENMAGE,
         "gInks_yellow":GREENYELL,
         "bInks_cyan":BLUECYAN,
         "bInks_magenta":BLUEMAGE,
         "bInks_yellow":BLUEYELL,

       
            }
       
       return data

   else:
      RBGc=GeneratorRGBVals(BGCO[1],[BRc,BGc,BBc], kCustom, kB)
      GBGc=GeneratorRGBVals(BGCO[2],[BRc,BGc,BBc], kCustom, kB)
      BBGc=GeneratorRGBVals(BGCO[3],[BRc,BGc,BBc],kCustom, kB)
      
      RBG=GeneratorRGBVals(BGNCO[1],[BR,BG,BB], kCustom, kB)
      GBG=GeneratorRGBVals(BGNCO[2],[BR,BG,BB], kCustom, kB)
      BBG=GeneratorRGBVals(BGNCO[3],[BR,BG,BB], kCustom, kB)
      
      bgColors_corrected_dic= {
         "red":dict(zip(map(str, wl), bgColors_corrected[0])),
         "green":dict(zip(map(str, wl), bgColors_corrected[1])),
         "blue":dict(zip(map(str, wl), bgColors_corrected[2]))
         }
      bgColors_dic= {
            "red":dict(zip(map(str, wl), bgColors[0])),
            "green":dict(zip(map(str, wl), bgColors[1])),
            "blue":dict(zip(map(str, wl), bgColors[2]))
            }
      
      data={
         "bgColors_c": bgColors_corrected_dic, 
         "bgColors": bgColors_dic,
         "rMono_c": RBGc,
         "gMono_c": GBGc,
         "bMono_c": BBGc,
         "rMono":RBG,
         "gMono":GBG,
         "bMono":BBG,
      }
      return data

def GeneratorRGBVals(channels, whiteRef, kCustom,kB, Multiplier=1):
   """
    Generate RGB values based on input channels and white reference.

    Args:
        channels (list): RGB values of a color.
        whiteRef (list): White reference values for normalization.
        kCustom (float): Custom brightness parameter.
        kB (float): Custom brightness parameter.
        Multiplier (float, optional): Multiplier for RGB values. Defaults to 1.

    Returns:
        list: A list of rounded RGB values.

    Example:
        GeneratorRGBVals([255, 128, 0], [255, 255, 255], 2.0, 50.0, 0.5)
   """
    #TEMP=[(((channels[0]/whiteRef[0])*const)/255)*kCustom+kB, (((channels[1]/whiteRef[1])*const)/255)*kCustom+kB,(((channels[2]/whiteRef[2])*const)/255)*kCustom+kB]
   TEMP=[((channels[0]/whiteRef[0])*Multiplier*kCustom)+kB,((channels[1]/whiteRef[1])*Multiplier*kCustom)+kB,((channels[2]/whiteRef[2])*Multiplier*kCustom)+kB]
   return np.rint(TEMP).tolist()
    

def IntegrationRGB (digObs,layer, isInk,emmiter):
   """
    Integrate RGB values based on input parameters.

    Args:
        digObs (list): Observer data.
        layer (list): Layer data.
        isInk (bool): Flag indicating whether ink is used.
        emmiter (str): Emitter type.

    Returns:
        list: Integrated RGB values.

    Example:
        IntegrationRGB([0.8, 0.7, 0.6], [0.9, 0.8, 0.7], True, "v1")
    """
   
   # Spectral data from ipad v1 is a measurement captrure by me and v2 is the one captured with kuba
   # the file contain white, red, green and blue data in each row
   lightSource=pd.read_excel('./data/ipadEmitter.xlsx',emmiter)
   
   w=lightSource.to_numpy()[0]
   r=lightSource.to_numpy()[1]
   g=lightSource.to_numpy()[2]
   b=lightSource.to_numpy()[3]
   
   
   Er=r*layer
   Eg=g*layer
   Eb=b*layer

   if(isInk):
      return ComputeRGBVals (Er,Eg,Eb,digObs)
   else:
      Ew=w*layer
      BGc=ComputeIntegration(Ew,digObs)
      TEMP=ComputeRGBVals (Er,Eg,Eb,digObs)
      TEMP.insert(0, BGc)
      
      BG=ComputeIntegration(w,digObs)
      TEMP2=ComputeRGBVals (r,g,b,digObs)
      TEMP2.insert(0, BG)
      return [TEMP,TEMP2]
      
  
def ComputeRGBVals (Er,Eg,Eb,digObs):
    """
    Compute RGB values based on spectral data and observer data.

    Args:
        Er (list): Red channel data.
        Eg (list): Green channel data.
        Eb (list): Blue channel data.
        digObs (list): Observer data.

    Returns:
        list: Computed RGB values.

    Example:
        ComputeRGBVals([0.1, 0.2, 0.3], [0.4, 0.5, 0.6], [0.7, 0.8, 0.9], [0.8, 0.7, 0.6])
    """

    R=ComputeIntegration(Er,digObs)
    G=ComputeIntegration(Eg,digObs)
    B=ComputeIntegration(Eb,digObs)
    return [R,G,B]      
      
##(array,2D array)
def ComputeIntegration(channel,digObs):
   """
    Compute integration based on channel data and observer data.

    Args:
        channel (list): Channel data.
        digObs (list): Observer data.

    Returns:
        list: Computed integrated values.

    Example:
        ComputeIntegration([0.1, 0.2, 0.3], [0.8, 0.7, 0.6])
    """
   dx=0.01
   tr=channel*digObs[0]
   tg=channel*digObs[1]
   tb=channel*digObs[2]
   r=np.trapz(tr,dx=dx)
   g=np.trapz(tg,dx=dx)
   b=np.trapz(tb,dx=dx)
   return [r,g,b]

## HELPERS
### Gets the names of sheets
def GetBookSheets(df):
   """
    Get the names of sheets from a DataFrame.

    Args:
        df (pandas.DataFrame): A DataFrame containing multiple sheets.

    Returns:
        list: A list of sheet names.

    Example:
        df = pd.read_excel('data.xlsx', sheet_name=None)
        sheet_names = GetBookSheets(df)
    """
   return df.keys()

### Makes a dictionary fron GetBookSheet()
def MakeDictionary(data):
   """
    Create a dictionary from a list.

    Args:
        data (list): A list of items.

    Returns:
        dict: A dictionary with the items from the list.

    Example:
        data_list = ["item1", "item2", "item3"]
        data_dict = MakeDictionary(data_list)
    """
   temp=[]
   for d in data:
      temp.append(d)
   return temp

def allowed_file(filename):
    """
    Check if a filename has an allowed file extension.

    Args:
        filename (str): The filename to check.

    Returns:
        bool: True if the filename has an allowed extension, False otherwise.

    Example:
        is_allowed = allowed_file("example.jpg")
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

### Returns current time
@app.route('/time')
def get_curretn_time():
    """
    Get the current time and return it as a JSON object.

    Returns:
        dict: A JSON object containing the current time.

    Example:
        {"time": 1636003621.123456}
    """
    return {'time': time.time()}

def Object2Json(data):
   """
    Convert a Python object to a JSON string.

    Args:
        data: The Python object to convert to JSON.

    Returns:
        str: A JSON string representing the input object.

    Example:
        data = {"key1": "value1", "key2": "value2"}
        json_string = Object2Json(data)
    """
   return json.dumps(data, cls=NumpyArrayEncoder) 

## Color(array or constamt), Channels (RGB array), Multiplier (potional number 1-255)
## THis funciton is for Normal method (lambda by lambda)
def GenericMult(Color,Channels,kCustom, kB,Multiplier=1):
    """
    Apply a generic multiplication to each element of a list.

    Args:
        Color: Color value (can be an array or constant).
        Channels (list): List of values to be multiplied.
        kCustom (float): Custom brightness parameter.
        kB (float): Custom brightness parameter.
        Multiplier (float, optional): Multiplier for RGB values. Defaults to 1.

    Returns:
        list: A list of rounded, multiplied values.

    Example:
        Color = 2.0
        Channels = [1, 2, 3]
        kCustom = 0.5
        kB = 0.2
        Multiplier = 0.1
        result = GenericMult(Color, Channels, kCustom, kB, Multiplier)
    """
    TEMP=[]
    for channel in Channels:
        TEMP.append(np.rint((channel*Color*Multiplier*kCustom)+kB))
    return TEMP




if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True)
