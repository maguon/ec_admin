import React, {useState,useRef}from 'react';
import {connect} from 'react-redux';
import { CSVReader } from 'react-papaparse';
import Swal from 'sweetalert2';
import {
    Button, Divider, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, AppBar, Tabs, Tab
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TabPanel from "@material-ui/lab/TabPanel";
import TabContext from "@material-ui/lab/TabContext";
const UpLoadFileAction = require('../../actions/main/UpLoadFileAction');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: 30
    },
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    select: {
        width: '100%',
        marginTop:'16px'
    },
    selectCondition: {width: '100%'},
    button:{
        margin:'15px',
        float:'right'
    },
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}));
function UpLoadFile (props) {
    const {uploadFileReducer,brandFileUpload,categoryFileUpload} = props;
    const classes = useStyles();
    const [value, setValue] = React.useState('1');
    const [successData,setSuccessData]=useState(false);
    const [dataBox,setDataBox]=useState(false);
    const [localSuccess,setLocalSuccess]=useState(true);
    const [headerArray,setHeaderArray]=useState([]);
    const [dataLength,setDataLength]=useState(0);
    const [errorNumber,setErrorNumber]=useState('0');
    const [tContent,setTContent]=useState([]);
    const [inputFile,setInputFile] =useState(null);
    const [successDataCategory,setSuccessDataCategory]=useState(false);
    const [dataBoxCategory,setDataBoxCategory]=useState(false);
    const [localSuccessCategory,setLocalSuccessCategory]=useState(true);
    const [headerArrayCategory,setHeaderArrayCategory]=useState([]);
    const [dataLengthCategory,setDataLengthCategory]=useState(0);
    const [errorNumberCategory,setErrorNumberCategory]=useState('0');
    const [tContentCategory,setTContentCategory]=useState([]);
    const [inputFileCategory,setInputFileCategory] =useState(null);
    const buttonRef = useRef();
    const fileBrandParams = [
        {name: '????????????', type: 'string', require: true},
        {name: '??????', type: 'string',require: false}];
    const fileCategoryParams = [
        {name: '????????????', type: 'string', require: true},
        {name: '??????', type: 'string',require: false}];
    const handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e)
        }
    }
    const handleOnBrandFileLoad = (file,fileName)=>{
        let ext = fileName&&fileName.name.slice(fileName.name.lastIndexOf(".")+1).toLowerCase();
        if ("csv" != ext) { Swal.fire("??????????????????");
        } else {
            //????????????
            setHeaderArray(file[0].data);
            if(commonUtil.titleFilter(file[0].data,fileBrandParams) != false){
                // ??????????????????
                let content_filter_array = file.slice(1, file.length);
                let con_line = [];
                // excel????????????
                for (let i = 0; i < content_filter_array.length; i++) {
                    if (content_filter_array[i].data.length == 1 && content_filter_array[i].data[0] == "") {
                        break;
                    } else {
                        con_line.push(content_filter_array[i]);
                    }
                }
                let resultBrand=commonUtil.ContentFilter(con_line,fileBrandParams);
                setErrorNumber(resultBrand.tableContentErrorFilter.length);
                setTContent(resultBrand.tableContentErrorFilter);
                if (resultBrand.tableContentErrorFilter.length == 0) {
                    setSuccessData(true);
                    setDataBox(false);
                    Swal.fire("??????????????????"+ resultBrand.tableContentFilter.length+"???" );
                    // ?????????
                    setDataLength(resultBrand.tableContentFilter.length);
                    setLocalSuccess(true);
                } else {
                    setSuccessData(false);
                    setDataBox(true);
                    Swal.fire("????????????" + resultBrand.tableContentErrorFilter.length);
                }
            }else {
                Swal.fire("??????????????????", "", "error");
            }
        }
    }
    const handleOnCategoryFileLoad =(file,fileName)=>{
        let ext = fileName&&fileName.name.slice(fileName.name.lastIndexOf(".")+1).toLowerCase();
        if ("csv" != ext) { Swal.fire("??????????????????");
        } else {
            //????????????
            setHeaderArrayCategory(file[0].data);
            if(commonUtil.titleFilter(file[0].data,fileCategoryParams) != false){
                // ??????????????????
                let content_filter_array = file.slice(1, file.length);
                let con_line = [];
                // excel????????????
                for (let i = 0; i < content_filter_array.length; i++) {
                    if (content_filter_array[i].data.length == 1 && content_filter_array[i].data[0] == "") {
                        break;
                    } else {
                        con_line.push(content_filter_array[i]);
                    }
                }
                let resultCategory=commonUtil.ContentFilter(con_line,fileCategoryParams);
                setErrorNumberCategory(resultCategory.tableContentErrorFilter.length);
                setTContentCategory(resultCategory.tableContentErrorFilter);
                if (resultCategory.tableContentErrorFilter.length == 0) {
                    setSuccessDataCategory(true);
                    setDataBoxCategory(false);
                    Swal.fire("??????????????????"+ resultCategory.tableContentFilter.length+"???" );
                    // ?????????
                    setDataLengthCategory(resultCategory.tableContentFilter.length);
                    setLocalSuccessCategory(true);
                } else {
                    setSuccessDataCategory(false);
                    setDataBoxCategory(true);
                    Swal.fire("????????????" + resultCategory.tableContentErrorFilter.length);
                }
            }else {
                Swal.fire("??????????????????", "", "error");
            }
        }
    }
    const uploadBrandCsv =()=>{
        brandFileUpload(inputFile);
    }
    const uploadCategoryCsv =()=>{
        categoryFileUpload(inputFileCategory);
    }
    const downLoadBrandCsv =()=>{
        window.open('/????????????????????????.csv')
    }
    const downLoadCategoryCsv =()=>{
        window.open('/????????????????????????.csv')
    }
    const changeTab = (event, newValue) => {
        setValue(newValue);
    };
    return(
        <div>
            <TabContext value={value}>
                <AppBar position="static" color="default">
                    <Tabs value={value}
                          onChange={changeTab}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth">
                        <Tab label="????????????" value="1" />
                        <Tab label="????????????" value="2" />
                        <Tab label="????????????"   value="3" />
                    </Tabs>
                </AppBar>
                <TabPanel value='1'>
                    <Grid container xs={12} spacing={3} style={{marginTop:'50px'}}>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={6} style={{color:'#F44336',fontSize:'20px'}}>
                            <Grid item xs={12} align='center' style={{paddingBottom:'20px',borderBottom: '1px solid #ccc' ,fontSize:'30px',color:'#3f51b5'}} >??????????????????</Grid>
                            <Grid item xs={12} style={{marginTop:'30px',marginLeft:'30px'}}>
                                <i className="mdi  mdi-checkbox-multiple-blank-circle" style={{color:'#3f51b5'}}></i>
                                ??????????????????????????????csv???????????????,?????????excel???????????????????????????;
                            </Grid>
                            <Grid item xs={12} style={{marginTop:'30px',marginLeft:'30px'}}>
                                <i className="mdi  mdi-checkbox-multiple-blank-circle" style={{color:'#3f51b5'}}></i>
                                ?????????????????????,????????????????????????????????????????????????????????????????????????;
                            </Grid>
                            <Grid item xs={12} style={{marginTop:'30px',marginLeft:'30px'}}>
                                <i className="mdi  mdi-checkbox-multiple-blank-circle" style={{color:'#3f51b5'}}></i>
                                ???????????????????????????????????????(????????????)????????????(?????????);
                            </Grid>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value='2'>
                    {/*??????????????????*/}
                    <div className='brand'>
                        {/*??????*/}
                        <Grid container xs={12} spacing={3}>
                            <Grid item xs={6} align='left'>
                                <Button variant="contained"  color="primary" onClick={() => {downLoadBrandCsv()}}>
                                    ??????????????????
                                </Button>
                            </Grid>
                            <Grid item xs={6} align='right'>
                                <CSVReader
                                    ref={buttonRef}
                                    noClick
                                    noDrag
                                    noProgressBar
                                    onFileLoad={handleOnBrandFileLoad}
                                >
                                    {( {file} ) => {
                                        setInputFile(file);
                                        return (
                                            <aside>
                                                <Button variant="contained"  color="primary" onClick={handleOpenDialog}>
                                                    ????????????????????????
                                                </Button>
                                            </aside>
                                        )}}
                                </CSVReader>
                            </Grid>
                        </Grid>
                        {/*????????????*/}
                        {dataBox&&<div>
                            <p  xs={12} align='center' style={{padding: "20px",background:'#f50057',color:'white',fontSize:'18px'}}>????????????<span>{errorNumber}</span>??????????????????????????????</p>
                            <TableContainer component={Paper}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:50}}>
                                            <TableCell className={classes.head} align="center">??????</TableCell>
                                            {headerArray.map((row,index)=>(
                                                <TableCell key={'head-'+index} className={classes.head} align="center">{row}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tContent.map((item,index)=>(
                                            <TableRow key={'csv-'+index}>
                                                <TableCell align="center" >{index+1}</TableCell>
                                                {item.data.map((row)=>(
                                                    <TableCell key={index} align="center" >{row}</TableCell>
                                                ))}
                                            </TableRow>

                                        ))}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>}
                        {/*????????????*/}
                        {successData&&<div>
                            <Divider style={{marginTop: 20}}/>
                            <p><span>{uploadFileReducer.array.successedInsert}</span>/<span>{dataLength}</span></p>

                            {localSuccess&&<p align='center'>
                                <i className="mdi mdi-check "></i><span>??????????????????</span>
                            </p>}
                            {uploadFileReducer.uploadFlag&&<p align='center'>
                                <i className="mdi mdi-check"></i><span>????????????</span>
                            </p>}
                            {uploadFileReducer.uploadFlag&&<p align='center'>
                                <span>????????????:<span>{uploadFileReducer.array.failedCase}</span></span>
                                <span>????????????:<span>{uploadFileReducer.array.successedInsert}</span></span>
                                <span>?????????:<span>{dataLength}</span></span>
                            </p>}
                            <p align='center'>
                                {localSuccess&& <Button variant="contained"  color="primary" disabled={uploadFileReducer.uploadFlag} onClick={uploadBrandCsv} >
                                    ???????????????
                                </Button>}
                            </p>

                        </div>}
                        {/*??????*/}
                        <div style={{marginTop:'100px'}}>
                            <b style={{width:'60%',marginLeft:'30%'}}>???????????????????????????????????????:</b>
                            <TableContainer component={Paper} style={{width:'40%',marginLeft:'30%'}}>
                            <Table  size={'small'} aria-label="a dense table">
                                <TableHead >
                                    <TableRow style={{height:50}}>
                                        <TableCell className={classes.head} align="center"></TableCell>
                                        <TableCell className={classes.head} align="center">????????????</TableCell>
                                        <TableCell className={classes.head} align="center">??????</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow >
                                        <TableCell align="center" ><b>??????</b></TableCell>
                                        <TableCell align="center" >?????????cx4</TableCell>
                                        <TableCell align="center" >????????????</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell align="center" ><b>????????????</b></TableCell>
                                        <TableCell align="center" >????????????????????????</TableCell>
                                        <TableCell align="center" >???????????????????????????</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value='3'>
                    {/*??????????????????*/}
                    <div className='category'>
                        {/*??????*/}
                        <Grid container xs={12} spacing={3}>
                            <Grid item xs={6} align='left'>
                                <Button variant="contained"  color="primary" onClick={() => {downLoadCategoryCsv()}}>
                                    ??????????????????
                                </Button>
                            </Grid>
                            <Grid item xs={6} align='right'>
                                <CSVReader
                                    ref={buttonRef}
                                    noClick
                                    noDrag
                                    noProgressBar
                                    onFileLoad={handleOnCategoryFileLoad}
                                >
                                    {( {file} ) => {
                                        setInputFileCategory(file);
                                        return (
                                            <aside>
                                                <Button variant="contained"  color="primary" onClick={handleOpenDialog}>
                                                    ????????????????????????
                                                </Button>
                                            </aside>
                                        )}}
                                </CSVReader>
                            </Grid>
                        </Grid>
                        {/*????????????*/}
                        {dataBoxCategory&&<div>
                            <p  xs={12} align='center' style={{padding: "20px",background:'#f50057',color:'white',fontSize:'18px'}}>????????????<span>{errorNumberCategory}</span>??????????????????????????????</p>
                            <TableContainer component={Paper}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:50}}>
                                            <TableCell className={classes.head} align="center">??????</TableCell>
                                            {headerArrayCategory.map((row,index)=>(
                                                <TableCell key={'head-'+index} className={classes.head} align="center">{row}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tContentCategory.map((item,index)=>(
                                            <TableRow key={'csv-'+index}>
                                                <TableCell align="center" >{index+1}</TableCell>
                                                {item.data.map((row)=>(
                                                    <TableCell key={index} align="center" >{row}</TableCell>
                                                ))}
                                            </TableRow>

                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>}
                        {/*????????????*/}
                        {successDataCategory&&<div>
                            <Divider style={{marginTop: 20}}/>
                            <p><span>{uploadFileReducer.categoryArray.successedInsert}</span>/<span>{dataLengthCategory}</span></p>

                            {localSuccessCategory&&<p align='center'>
                                <i className="mdi mdi-check "></i><span>??????????????????</span>
                            </p>}
                            {uploadFileReducer.categoryUploadFlag&&<p align='center'>
                                <i className="mdi mdi-check"></i><span>????????????</span>
                            </p>}
                            {uploadFileReducer.categoryUploadFlag&&<p align='center'>
                                <span>????????????:<span>{uploadFileReducer.categoryArray.failedCase}</span></span>
                                <span>????????????:<span>{uploadFileReducer.categoryArray.successedInsert}</span></span>
                                <span>?????????:<span>{dataLengthCategory}</span></span>
                            </p>}
                            <p align='center'>
                                {localSuccessCategory&&<Button variant="contained"  color="primary" disabled={uploadFileReducer.categoryUploadFlag} onClick={uploadCategoryCsv} >
                                    ???????????????
                                </Button>}
                            </p>

                        </div>}
                        {/*??????*/}
                        <div style={{marginTop:'100px'}}>
                            <b style={{width:'60%',marginLeft:'30%'}}>???????????????????????????????????????:</b>
                            <TableContainer component={Paper} style={{marginTop:'10px',width:'40%',marginLeft:'30%'}}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:50}}>
                                            <TableCell className={classes.head} align="center"></TableCell>
                                            <TableCell className={classes.head} align="center">????????????</TableCell>
                                            <TableCell className={classes.head} align="center">??????</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow >
                                            <TableCell align="center" ><b>??????</b></TableCell>
                                            <TableCell align="center" >??????</TableCell>
                                            <TableCell align="center" >????????????</TableCell>
                                        </TableRow>
                                        <TableRow >
                                            <TableCell align="center" ><b>????????????</b></TableCell>
                                            <TableCell align="center" >????????????(??????)</TableCell>
                                            <TableCell align="center" >??????????????????(??????)200??????</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                    </div>
                </TabPanel>
            </TabContext>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        uploadFileReducer: state.UpLoadFileReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    brandFileUpload:(inputFile)=>{
        dispatch(UpLoadFileAction.brandFileUpload(inputFile));
    },
    categoryFileUpload:(inputFileCategory)=>{
        dispatch(UpLoadFileAction.categoryFileUpload(inputFileCategory));
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(UpLoadFile)