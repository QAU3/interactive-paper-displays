## Required libs
import time 
import numpy as np
import pandas as pd
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
import json
from json import JSONEncoder
import os 


UPLOAD_FOLDER = './img'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app=Flask(__name__,static_folder=os.path.abspath("./build"),static_url_path='/')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#####===============DEFINITIONS AND HELPER FUNCTIONS========########
DEFAULT_PAPER_TYPE="CP80"
T_CP80_p_i_DATA ='./data/inks_trans_interp.xlsx'
T_p_DATASET='./data/paper_trans_interpolated.xlsx'
S_DATASET = './data/camspec_database.xlsx'
E_DATASET ='./data/ipadEmitter.xlsx'

## Setup for images
def allowed_file(filename):
    """
    Checks if the given filename has an allowed file extension.
    Args:
        filename (str): The name of the file to be checked.
    Returns:
        bool: True if the file has an allowed extension; otherwise, False.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
           
## Gets data frame from file 
def GetDataFrame(path ,sheet_name=None):
   """
    Gets data from an Excel file and returns it as a DataFrame.
    Args:
        path (str): The path to the Excel file.
        sheet_name (str, optional): The name of the sheet to retrieve from the Excel file.
    Returns:
        pandas.DataFrame: A DataFrame containing the data from the specified sheet.
    """
   return pd.read_excel(path, sheet_name)

### Gets the names of sheets
def GetBookSheetsNames(df):
   """
    Gets the names of sheets from a DataFrame.
    Args:
        df (pandas.DataFrame): The DataFrame containing the Excel data.
    Returns:
        list: A list of sheet names present in the DataFrame.
    """
   return df.keys()

### Makes a dictionary fron GetBookSheet()
def MakeList(data):
    """
    Converts data to a list.
    Args:
        data (iterable): Data to be converted to a list.
    Returns:
        list: A list containing the elements from the input data.
    """
    return [item for item in data]


S_OPTIONS = MakeList(GetBookSheetsNames(GetDataFrame(S_DATASET)))
E_OPTIONS = MakeList(GetBookSheetsNames(GetDataFrame(E_DATASET)))
T_CP80_p_i_OPTIONS = MakeList(GetBookSheetsNames(GetDataFrame(T_CP80_p_i_DATA)))

def MakeRGBDictonary(data):
   """
    Creates a dictionary with RGB channel names as keys and corresponding values from the data.
    Args:
        data (list or iterable): Data containing RGB channel values.
    Returns:
        dict: A dictionary with channel names as keys and data values.
    """
   temp={"red":0, "green":1, "blue":2}
   i=0
   for channel in temp:
      temp[channel]=FitDataToWavelenght(data[i])
      i+=1
   return temp
   
def FitDataToWavelenght(values):
   """
    Fits the given data values to a wavelength range.
    Args:
        values (iterable): Data values to be fitted to a wavelength range.
    Returns:
        dict: A dictionary where wavelengths (in string format) are keys and values
              are from the input data.
    The function creates a dictionary with wavelength values (in string format)
    ranging from 400 to 720 in 10-step increments and assigns the corresponding
    data values from the input to each wavelength.
    """
   wl=np.arange(start=400, stop=730, step=10)
   return dict(zip(map(str, wl), values))

def GeneratorRGBVals(channels, whiteRef, kCustom,kB, Multiplier=1):
   """
    Generates RGB values based on input channels, white reference, and custom parameters.

    Args:
        channels (list): RGB channel values.
        whiteRef (list): White reference values for RGB channels.
        kCustom (float): Custom parameter for adjustment.
        kB (float): Parameter for adjusting brightness.
        Multiplier (float, optional): Multiplier for further adjustment (default is 1).

    Returns:
        list: RGB values after applying custom parameters and rounding to integers.

    This function generates RGB values based on the input channels, white reference values,
    custom parameter (kCustom), and brightness parameter (kB). The Multiplier parameter
    is optional and can be used for additional adjustment. The resulting RGB values are
    rounded to the nearest integers.
    """
    #TEMP=[(((channels[0]/whiteRef[0])*const)/255)*kCustom+kB, (((channels[1]/whiteRef[1])*const)/255)*kCustom+kB,(((channels[2]/whiteRef[2])*const)/255)*kCustom+kB]
   TEMP=[((channels[0]/whiteRef[0])*Multiplier*kCustom)+kB,((channels[1]/whiteRef[1])*Multiplier*kCustom)+kB,((channels[2]/whiteRef[2])*Multiplier*kCustom)+kB]
   return np.rint(TEMP).tolist()
    

def IntegrationRGB (s,layer,e, isInkType=True):
   """
    Computes RGB values based on spectral data, layers, and ink type.

    Args:
        s (list): Spectral data as a list containing values for each wavelength.
        layer (float): Layer value for integration.
        e (str): Emitter data source (e.g., 'v1' or 'v2').
        isInkType (bool, optional): Determines if ink type data is considered (default is True).

    Returns:
        list or dict: If isInkType is True, a list of RGB values is returned.
                      If isInkType is False, a dictionary with background and corrected values is returned.

    This function computes RGB values based on the input spectral data (s), layer value,
    and emitter data source (e). If isInkType is True, it calculates the RGB values
    considering ink type data using the ComputeRGBVals function. If isInkType is False,
    it calculates background values and corrected values based on the provided data.

    The function returns either a list of RGB values or a dictionary depending on the value of isInkType.
    """ 
   # Spectral data from ipad v1 is a measurement captrure by me and v2 is the one captured with kuba
   # the file contains white, red, green and blue data in each row
   E=GetDataFrame(E_DATASET,e)
   
   W=E.to_numpy()[0]
   R=E.to_numpy()[1]
   G=E.to_numpy()[2]
   B=E.to_numpy()[3]
   
   E_w=W*layer
   E_r=R*layer
   E_g=G*layer
   E_b=B*layer
   
   if(isInkType):
      return ComputeRGBVals (E_r,E_g,E_b,s)
   else:
     
      BGc=ComputeIntegration(E_w,s)
      TEMPc=ComputeRGBVals (E_r,E_g,E_b,s)
      TEMPc.insert(0, BGc)
      
      BG=ComputeIntegration(W,s)
      TEMPn=ComputeRGBVals (R,G,B,s)
      TEMPn.insert(0, BG)
      return [TEMPc,TEMPn]
      
  
def ComputeRGBVals (e_r,e_g,e_b,s):
    """
    Compute RGB values based on spectral data and sensitivity functions.

    Args:
        e_r (list): Spectral data for the red channel.
        e_g (list): Spectral data for the green channel.
        e_b (list): Spectral data for the blue channel.
        s (list): Sensitivity functions as a list containing values for each channel.

    Returns:
        list: A list of computed RGB values [R, G, B] based on spectral data and sensitivity functions.

    This function calculates the RGB values based on the provided spectral data (e_r, e_g, e_b)
    and sensitivity functions (s) for each channel (red, green, blue).

    The result is a list containing the computed RGB values [R, G, B].

    :param e_r: List of spectral data for the red channel.
    :param e_g: List of spectral data for the green channel.
    :param e_b: List of spectral data for the blue channel.
    :param s: Sensitivity functions as a list.
    :return: A list of computed RGB values [R, G, B].
    """
    R=ComputeIntegration(e_r,s)
    G=ComputeIntegration(e_g,s)
    B=ComputeIntegration(e_b,s)
    return [R,G,B]      
      
##(array,2D array)
def ComputeIntegration(channel,s):
   """
    Compute color channel integrals using the trapezoidal rule.
    Args:
        channel (list): Spectral data for a color channel.
        s (list): Sensitivity functions for red, green, and blue channels.
    Returns:
        list: Computed color channel integrals [R, G, B].
    This function calculates the color channel integrals using the trapezoidal rule
    based on the provided spectral data for a color channel and sensitivity functions.
    The result is a list containing the computed color channel integrals [R, G, B].
    :param channel: Spectral data for a color channel.
    :param s: Sensitivity functions for red, green, and blue channels.
    :return: Computed color channel integrals [R, G, B].
   """
   dx=0.01
   t_r=channel*s[0]
   t_g=channel*s[1]
   t_b=channel*s[2]
   R=np.trapz(t_r,dx=dx)
   G=np.trapz(t_g,dx=dx)
   B=np.trapz(t_b,dx=dx)
   return [R,G,B]


## Color(array or constant), Channels (RGB array), Multiplier (potional number 1-255)
## This funciton is for Normal method (lambda by lambda)
def GenericMultiplication(color,channels,kCustom, kB,multiplier=1):
    """
    Multiply color with an array of channels and apply custom factors.

    This function takes an input color and an array of channels (typically representing colors in the RGB format). It then multiplies each channel by the given color and applies custom factors, such as kCustom and kB, to adjust the result. The result is rounded and returned as a list.

    Args:
        color (float or int): A color value to be multiplied with each channel.
        channels (list of float or int): An array of channels, such as RGB values.
        kCustom (float or int): A custom factor to apply to the multiplication result.
        kB (float or int): A factor to adjust the result.
        multiplier (float or int, optional): An additional multiplier (default is 1).

    Returns:
        list of int: A list of integers representing the modified channel values.

    Example:
    >>> color = 0.5
    >>> channels = [100, 200, 50]
    >>> kCustom = 2
    >>> kB = 10
    >>> result = GenericMultiplication(color, channels, kCustom, kB)
    >>> print(result)
    [60, 120, 35]

    Note:
    - The function computes the result for each channel using the formula:
      (channel * color * multiplier * kCustom) + kB
    - The resulting values are rounded to the nearest integer.
    - The function is commonly used to adjust color values or brightness in image processing.

    """
    TEMP=[]
    for channel in channels:
        TEMP.append(np.rint((channel*color*multiplier*kCustom)+kB))
    return TEMP

#####===============API========########

## RENDERS  UI 
@app.route('/',methods=['GET'])
def index():   
   return app.send_static_file('index.html')

## Handles images
@app.route('/uploadFile',methods=['GET', 'POST'])
def uploaded_file():
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


## Main interaction with API
@app.route('/updateData',methods = ['POST', 'GET'])
def DataManager():
    """
    Handle data management and configuration.

    This function is responsible for managing data and configuration based on user requests. If the request method is 'POST', it returns a JSON object that contains the available data and custom configuration. Users can control the custom brightness using 'kW' and 'kB' parameters. The default paper type is set to 'CP80', as the collected data of inks was done using this specific paper for this research.

    Returns:
        dict: A JSON object containing available data and custom configuration options.

    Example:
    >>> # User sends a POST request with custom configuration.
    >>> custom_config = {
    ...     "observer": "SomeObserver",
    ...     "emitter": "SomeEmitter",
    ...     "kW": 1.5,
    ...     "kB": 0.8
    ... }
    >>> response = DataManager(request.json=custom_config)
    >>> print(response)
    {
        'digObs': ['Sheet1', 'Sheet2', ...],
        'inks': ['InkType1', 'InkType2', ...],
        'emitters': ['Emitter1', 'Emitter2', ...],
        'defaultData': {
            'inkjet': { ... },  # Custom data for inkjet
            'laser': { ... },   # Custom data for laser
            'bg': { ... }       # Custom data for backgrounds
        }
    }
    """
    ## if request is done, we return the names of the available data in .xlsx files 
    ## and data accordingly to user's configuration (see GetData()). 
    ## This version allow user to control custom brighness (KW_PARAM,KB_PARAM)
    ## DEFAULT_PAPER_TYPE is CP80 as the collected data of inks was done using this specific paper for this research.
    if request.method == 'POST':
      return {
         'digObs': S_OPTIONS,
         'inks': T_CP80_p_i_OPTIONS, 
         'emmiters': E_OPTIONS,
         'defaultData':GetData(request.json["observer"],
                                 DEFAULT_PAPER_TYPE,
                                 request.json["emitter"],
                                 request.json["kW"], 
                                 request.json["kB"])
         }
      
def GetData(s,paperType,e,kW,kB):
    """
    Retrieve and compute data based on user configuration.

    This function retrieves data from various sources, including observer data ('s'), paper type ('paperType'), emitter data ('e'), and custom configuration parameters ('kW' and 'kB'). It computes custom data for inkjet, laser, and background based on the user's input.

    Args:
        s (str): The observer data source.
        paperType (str): The type of paper for data collection.
        e (str): The emitter data source.
        kW (float or int): Custom parameter for brightness control.
        kB (float or int): Custom parameter for brightness control.

    Returns:
        dict: A JSON object containing custom data for inkjet, laser, and backgrounds.

    Example:
    >>> observer_data = "SomeObserver"
    >>> paper_type = "CP80"
    >>> emitter_data = "SomeEmitter"
    >>> kW_param = 1.5
    >>> kB_param = 0.8
    >>> custom_data = GetData(observer_data, paper_type, emitter_data, kW_param, kB_param)
    >>> print(custom_data)
    {
        'inkjet': { ... },  # Custom data for inkjet
        'laser': { ... },   # Custom data for laser
        'bg': { ... }       # Custom data for backgrounds
    }
    """
    ##Read files
    S=GetDataFrame(S_DATASET,s)
    paper=GetDataFrame(T_p_DATASET,paperType)  
    ##Compute data (df s,df paper, df e, int kW, int kB, string inktype(default inkjet),bool isInkType (default true))
    inkjet=ComputeData(S,paper,e,kW,kB)
    laser=ComputeData(S,paper,e,kW,kB,"laser")
    bg=ComputeData(S,paper,e,kW,kB,isInkType=False)

    ##Return json object
    return  {"inkjet":inkjet, "laser":laser, "bg":bg}
   
      
##Compute data (df s,df paper, df e, int kW, int kB, string inktype(default inkjet),bool isInkType (default true))
def ComputeData(s,paper,e,kW,kB,ink="inkjet",isInkType=True):
   """
    Compute custom color values for inkjet, laser, and backgrounds based on user configuration.

    This function computes custom color values for inkjet, laser, and backgrounds based on user-defined parameters and data sources. It takes observer data ('s'), paper type data ('paper'), emitter data ('e'), custom brightness parameters ('kW' and 'kB'), and the ink type ('ink') as input. Users can choose to compute values for inkjet or backgrounds. The function returns a dictionary containing custom color values for various color channels.

    Args:
        s (pd.DataFrame): Observer data for red, green, and blue channels.
        paper (pd.DataFrame): Paper transmittance data.
        e (pd.DataFrame): Emitter data.
        kW (float or int): Custom parameter for brightness control.
        kB (float or int): Custom parameter for brightness control.
        ink (str, optional): Type of ink (default is 'inkjet').
        isInkType (bool, optional): Flag to indicate whether to compute inkjet or background values (default is True).

    Returns:
        dict: A JSON object containing custom color values for inkjet, laser, and backgrounds.

    Example:
    >>> observer_data = pd.DataFrame({'Red': [0.1, 0.2, 0.3], 'Green': [0.2, 0.3, 0.4], 'Blue': [0.3, 0.4, 0.5]})
    >>> paper_data = pd.DataFrame({'PaperTransmittance': [80, 85, 90]})
    >>> emitter_data = pd.DataFrame({'EmitterValues': [0.7, 0.8, 0.9]})
    >>> kW_param = 1.5
    >>> kB_param = 0.8
    >>> custom_data = ComputeData(observer_data, paper_data, emitter_data, kW_param, kB_param)
    >>> print(custom_data)
    {
        'cColors': { ... },           # Cyan, magenta, yellow colors
        'cColors_c': { ... },         # Corrected cyan, magenta, yellow colors
        'rInks_c_cyan': [ ... ],      # Corrected red inks (cyan)
        'rInks_c_magenta': [ ... ],   # Corrected red inks (magenta)
        'rInks_c_yellow': [ ... ],    # Corrected red inks (yellow)
        # Other color and mono values
        ...
    }
   """
   ## CUSTOM BRIGHTNESS 05.02.2022 (We limit the amount of whitness using low(kB) and high(kW) limits)
   ## Pixel Value = (Lambda*(kW-kB))+kB
   kCustom=(kW-kB)
   
   ###Data follows the definitions from Blackboad(p.39, 2.4.2021)
   wl=np.arange(start=400, stop=730, step=10)
   
   ##Default Paper plus ink (CP80)
   T_CP80_p_i=GetDataFrame(T_CP80_p_i_DATA,ink)
   
   #Observer data per channel (S) - NORMALIZED
   R=s.to_numpy()[0]
   G=s.to_numpy()[1]
   B=s.to_numpy()[2] 
   
   #JUST PAPER -NORMALIZED after division (transmittance is 0-100)
   T_p=paper.to_numpy()[0]/100
   
   #Ink + paper -NORMALIZED after division (transmittance is 0-100)
   T_p_c=T_CP80_p_i.to_numpy()[0]/100
   T_p_m=T_CP80_p_i.to_numpy()[1]/100
   T_p_y=T_CP80_p_i.to_numpy()[2]/100
         
   #Ink CWR(1/ (ink+paper/paper)) 
   C_cwr=1/(T_p_c/T_p)
   M_cwr=1/(T_p_m/T_p)
   Y_cwr=1/(T_p_y/T_p)
   
   ######LAMBDA BY LAMBDA (NORMAL APPROACH)######
   ## Black board 2.4.2021
   ##NORMAL APPROACH (CHECKED)##
   ##NON-CORRECTED VALUES##
   bgColors=GenericMultiplication(1,[R,G,B], kCustom, kB,0.255)
   cyanColors=GenericMultiplication(C_cwr,[R,G,B], kCustom, kB,0.00255)
   magentaColors=GenericMultiplication(M_cwr,[R,G,B],kCustom, kB,0.00255)
   yellowColors=GenericMultiplication(Y_cwr,[R,G,B],kCustom, kB,0.00255)
   
   ##NORMAL APPROACH (CHECKED)##  
   ##CORRECTED VALUES## (This apporach includes trnamittance of paper plus ink)
   bgColors_corrected=GenericMultiplication(T_p,[R,G,B],kCustom, kB)
   cyanColors_corrected=GenericMultiplication(T_p_c,[R,G,B],kCustom, kB)
   magentaColors_corrected=GenericMultiplication(T_p_m,[R,G,B],kCustom, kB)
   yellowColors_corrected=GenericMultiplication(T_p_y,[R,G,B],kCustom, kB)
   
   ###### INTEGRATION APPROACH (CHECKED)#####
   ##CORRECTED VALUES##   
   ## BGi contains corrected and non corrected values
   BGi=IntegrationRGB([R,G,B],T_p,e,False)
  
   ##NON-CORRECTED VALUES##
   BGNCO= BGi[1]
   BR= BGNCO[0][0]
   BG= BGNCO[0][1]
   BB= BGNCO[0][2]
   
    ##BG integration corrected values
   BGCO= BGi[0]
   BRc= BGCO[0][0]
   BGc= BGCO[0][1]
   BBc=  BGCO[0][2]
#INKSi=IntegrationRGB([R,G,B],[Cc,Mm,Yy],True)
  

   if(isInkType):
      ##  COMPUTE FOREGROUNDS

       ##HARCODED VALUES
       ##per layer-> returns an array [l_bg->r,l_bg->g,l_bg->b]: where l is the layer parsed
       ### each value in array is an array with 3 values [r g b]. 
       ###This are the rbg values per layer used in differetn backgorunds
       C_rgb=IntegrationRGB([R,G,B],T_p_c,e)
       M_rgb=IntegrationRGB([R,G,B],T_p_m,e)
       Y_rgb=IntegrationRGB([R,G,B],T_p_y,e)
       
       Ccwr_rgb=IntegrationRGB([R,G,B],C_cwr,e)
       Mcwr_rgb=IntegrationRGB([R,G,B],M_cwr,e)
       Ycwr_rgb=IntegrationRGB([R,G,B],Y_cwr,e)
       
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
       cColors_=MakeRGBDictonary(cyanColors)
       mColors_=MakeRGBDictonary(magentaColors)
       yColors_=MakeRGBDictonary(yellowColors)
       cColors_c_=MakeRGBDictonary(cyanColors_corrected)
       mColors_c_=MakeRGBDictonary(magentaColors_corrected)
       yColors_c_=MakeRGBDictonary(yellowColors_corrected) 
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
      ##  COMPUTE BACKGROUNDS
      RBGc=GeneratorRGBVals(BGCO[1],[BRc,BGc,BBc], kCustom, kB)
      GBGc=GeneratorRGBVals(BGCO[2],[BRc,BGc,BBc], kCustom, kB)
      BBGc=GeneratorRGBVals(BGCO[3],[BRc,BGc,BBc],kCustom, kB)
      
      RBG=GeneratorRGBVals(BGNCO[1],[BR,BG,BB], kCustom, kB)
      GBG=GeneratorRGBVals(BGNCO[2],[BR,BG,BB], kCustom, kB)
      BBG=GeneratorRGBVals(BGNCO[3],[BR,BG,BB], kCustom, kB)
      bgColors_corrected_dic= MakeRGBDictonary(bgColors_corrected)
      bgColors_dic=MakeRGBDictonary(bgColors)
      
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

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True)