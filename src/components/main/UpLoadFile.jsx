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
        {name: '品牌名称', type: 'string', require: true},
        {name: '备注', type: 'string',require: false}];
    const fileCategoryParams = [
        {name: '分类名称', type: 'string', require: true},
        {name: '备注', type: 'string',require: false}];
    const handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e)
        }
    }
    const handleOnBrandFileLoad = (file)=>{
        if(file==null ||file.length ==0){
            Swal.fire("文件类型错误");
        } else {
            //表头验证
            setHeaderArray(file[0].data);
            if(commonUtil.titleFilter(file[0].data,fileBrandParams) != false){
                // 主体内容校验
                let content_filter_array = file.slice(1, file.length);
                let con_line = [];
                // excel换行过滤
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
                    Swal.fire("数据格式正确"+ resultBrand.tableContentFilter.length+"条" );
                    // 总条数
                    setDataLength(resultBrand.tableContentFilter.length);
                    setLocalSuccess(true);
                } else {
                    setSuccessData(false);
                    setDataBox(true);
                    Swal.fire("错误条数" + resultBrand.tableContentErrorFilter.length);
                }
            }else {
                Swal.fire("表头格式错误", "", "error");
            }
        }
    }
    const handleOnCategoryFileLoad =(file)=>{
        if(file==null ||file.length ==0){
            Swal.fire("文件类型错误");
        } else {
            //表头验证
            setHeaderArrayCategory(file[0].data);
            if(commonUtil.titleFilter(file[0].data,fileCategoryParams) != false){
                // 主体内容校验
                let content_filter_array = file.slice(1, file.length);
                let con_line = [];
                // excel换行过滤
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
                    Swal.fire("数据格式正确"+ resultCategory.tableContentFilter.length+"条" );
                    // 总条数
                    setDataLengthCategory(resultCategory.tableContentFilter.length);
                    setLocalSuccessCategory(true);
                } else {
                    setSuccessDataCategory(false);
                    setDataBoxCategory(true);
                    Swal.fire("错误条数" + resultCategory.tableContentErrorFilter.length);
                }
            }else {
                Swal.fire("表头格式错误", "", "error");
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
        window.open('/品牌名称导入模板.csv')
    }
    const downLoadCategoryCsv =()=>{
        window.open('/分类名称导入模板.csv')
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
                        <Tab label="导入说明" value="1" />
                        <Tab label="品牌导入" value="2" />
                        <Tab label="分类导入"   value="3" />
                    </Tabs>
                </AppBar>
                <TabPanel value='1'>
                    <Grid container xs={12} spacing={3} style={{marginTop:'50px'}}>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={6} style={{color:'#F44336',fontSize:'20px'}}>
                            <Grid item xs={12} align='center' style={{paddingBottom:'20px',borderBottom: '1px solid #ccc' ,fontSize:'30px',color:'#3f51b5'}} >数据导入须知</Grid>
                            <Grid item xs={12} style={{marginTop:'30px',marginLeft:'30px'}}>
                                <i className="mdi  mdi-checkbox-multiple-blank-circle" style={{color:'#3f51b5'}}></i>
                                上传得数据表格必须为csv格式的文件,不支持excel格式的表格文件上传;
                            </Grid>
                            <Grid item xs={12} style={{marginTop:'30px',marginLeft:'30px'}}>
                                <i className="mdi  mdi-checkbox-multiple-blank-circle" style={{color:'#3f51b5'}}></i>
                                上传得数据表格,必须遵守模板的数据表头顺序，若顺序错误将无法上传;
                            </Grid>
                            <Grid item xs={12} style={{marginTop:'30px',marginLeft:'30px'}}>
                                <i className="mdi  mdi-checkbox-multiple-blank-circle" style={{color:'#3f51b5'}}></i>
                                导入的数据各字段分为必填项(不得为空)和选填项(可为空);
                            </Grid>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value='2'>
                    {/*品牌上传文件*/}
                    <div className='brand'>
                        {/*按钮*/}
                        <Grid container xs={12} spacing={3}>
                            <Grid item xs={6} align='left'>
                                <Button variant="contained"  color="primary" onClick={() => {downLoadBrandCsv()}}>
                                    品牌导入模板
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
                                            <Button variant="contained"  color="primary" onClick={handleOpenDialog}>
                                                批量品牌数据导入
                                            </Button>
                                        )}}
                                </CSVReader>
                            </Grid>
                        </Grid>
                        {/*本地校验*/}
                        <div style={{display:dataBox?'block':'none'}}>
                            <p  xs={12} align='center' style={{padding: "20px",background:'#f50057',color:'white',fontSize:'18px'}}>错误数据<span>{errorNumber}</span>条，请修改后重新上传</p>
                            <TableContainer component={Paper}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:50}}>
                                            <TableCell className={classes.head} align="center">序号</TableCell>
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
                        </div>
                        {/*上传校验*/}
                        <div style={{display:successData?'block':'none'}}>
                            <Divider style={{marginTop: 20}}/>
                            <p><span>{uploadFileReducer.array.successedInsert}</span>/<span>{dataLength}</span></p>

                            <p style={{display:localSuccess?'block':'none'}} align='center'>
                                <i className="mdi mdi-check "></i><span>本地校验成功</span>
                            </p>
                            <p style={{display:uploadFileReducer.uploadFlag?'block':'none'}} align='center'>
                                <i className="mdi mdi-check"></i><span>上传完成</span>
                            </p>
                            <p  style={{display:uploadFileReducer.uploadFlag?'block':'none'}} align='center'>
                                <span>错误条数:<span>{uploadFileReducer.array.failedCase}</span></span>
                                <span>正确条数:<span>{uploadFileReducer.array.successedInsert}</span></span>
                                <span>总条数:<span>{dataLength}</span></span>
                            </p>
                            <p align='center'>
                                <Button variant="contained"  color="primary" style={{display:localSuccess?'block':'none'}} disabled={uploadFileReducer.uploadFlag} onClick={uploadBrandCsv} >
                                    导入数据库
                                </Button>
                            </p>

                        </div>
                        {/*大图*/}
                        <div style={{marginTop:'100px'}}>
                            <b style={{width:'60%',marginLeft:'30%'}}>品牌导入模板字段的解释说明:</b>
                            <TableContainer component={Paper} style={{width:'40%',marginLeft:'30%'}}>
                            <Table  size={'small'} aria-label="a dense table">
                                <TableHead >
                                    <TableRow style={{height:50}}>
                                        <TableCell className={classes.head} align="center"></TableCell>
                                        <TableCell className={classes.head} align="center">品牌名称</TableCell>
                                        <TableCell className={classes.head} align="center">备注</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow >
                                        <TableCell align="center" ><b>例如</b></TableCell>
                                        <TableCell align="center" >马自达cx4</TableCell>
                                        <TableCell align="center" >统一售卖</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell align="center" ><b>解释说明</b></TableCell>
                                        <TableCell align="center" >该字段为品牌名称</TableCell>
                                        <TableCell align="center" >该字段为此品牌备注</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value='3'>
                    {/*分类上传文件*/}
                    <div className='category'>
                        {/*按钮*/}
                        <Grid container xs={12} spacing={3}>
                            <Grid item xs={6} align='left'>
                                <Button variant="contained"  color="primary" onClick={() => {downLoadCategoryCsv()}}>
                                    分类导入模板
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
                                            <Button variant="contained"  color="primary" onClick={handleOpenDialog}>
                                                批量分类数据导入
                                            </Button>
                                        )}}
                                </CSVReader>
                            </Grid>
                        </Grid>
                        {/*本地校验*/}
                        <div style={{display:dataBoxCategory?'block':'none'}}>
                            <p  xs={12} align='center' style={{padding: "20px",background:'#f50057',color:'white',fontSize:'18px'}}>错误数据<span>{errorNumberCategory}</span>条，请修改后重新上传</p>
                            <TableContainer component={Paper}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:50}}>
                                            <TableCell className={classes.head} align="center">序号</TableCell>
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
                        </div>
                        {/*上传校验*/}
                        <div style={{display:successDataCategory?'block':'none'}}>
                            <Divider style={{marginTop: 20}}/>
                            <p><span>{uploadFileReducer.categoryArray.successedInsert}</span>/<span>{dataLengthCategory}</span></p>

                            <p style={{display:localSuccessCategory?'block':'none'}} align='center'>
                                <i className="mdi mdi-check "></i><span>本地校验成功</span>
                            </p>
                            <p style={{display:uploadFileReducer.categoryUploadFlag?'block':'none'}} align='center'>
                                <i className="mdi mdi-check"></i><span>上传完成</span>
                            </p>
                            <p  style={{display:uploadFileReducer.categoryUploadFlag?'block':'none'}} align='center'>
                                <span>错误条数:<span>{uploadFileReducer.categoryArray.failedCase}</span></span>
                                <span>正确条数:<span>{uploadFileReducer.categoryArray.successedInsert}</span></span>
                                <span>总条数:<span>{dataLengthCategory}</span></span>
                            </p>
                            <p align='center'>
                                <Button variant="contained"  color="primary" style={{display:localSuccessCategory?'block':'none'}} disabled={uploadFileReducer.categoryUploadFlag} onClick={uploadCategoryCsv} >
                                    导入数据库
                                </Button>
                            </p>

                        </div>
                        {/*大图*/}
                        <div style={{marginTop:'100px'}}>
                            <b style={{width:'60%',marginLeft:'30%'}}>分类导入模板字段的解释说明:</b>
                            <TableContainer component={Paper} style={{marginTop:'10px',width:'40%',marginLeft:'30%'}}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:50}}>
                                            <TableCell className={classes.head} align="center"></TableCell>
                                            <TableCell className={classes.head} align="center">分类名称</TableCell>
                                            <TableCell className={classes.head} align="center">备注</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow >
                                            <TableCell align="center" ><b>例如</b></TableCell>
                                            <TableCell align="center" >轿车</TableCell>
                                            <TableCell align="center" >打折商品</TableCell>
                                        </TableRow>
                                        <TableRow >
                                            <TableCell align="center" ><b>解释说明</b></TableCell>
                                            <TableCell align="center" >分类名称(必填)</TableCell>
                                            <TableCell align="center" >分类名称备注(选填)200字内</TableCell>
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