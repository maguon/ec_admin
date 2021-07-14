import React, {useState,useRef}from 'react';
import {connect} from 'react-redux';
import { CSVReader } from 'react-papaparse';
import Swal from 'sweetalert2';
import {
    Button, Divider, Grid,Paper, TableContainer,Table, TableHead, TableRow, TableCell, TableBody
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
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
    const {uploadFileReducer,brandFileUpload} = props;
    const classes = useStyles();
    const [successData,setSuccessData]=useState(false);
    const [dataBox,setDataBox]=useState(false);
    const [localSuccess,setLocalSuccess]=useState(true);
    const [headerArray,setHeaderArray]=useState([]);
    const [dataLength,setDataLength]=useState(0);
    const [errorNumber,setErrorNumber]=useState('0');
    const [tContent,setTContent]=useState([]);
    const [inputFile,setInputFile] =useState(null);
    const buttonRef = useRef();
    const fileParams = [
        {name: '月份', type: 'number', require: true},
        {name: '司机姓名', type: 'string',require: true},
        {name: '手机号', type: 'number',require: true},
        {name: '社保费', type: 'number', require: true}];
    const handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e)
        }
    }
    const handleOnFileLoad = (file)=>{
        if(file==null ||file.length ==0){
            Swal.fire("文件类型错误");
        } else {
            //表头验证
            setHeaderArray(file[0].data);
            if(commonUtil.titleFilter(file[0].data,fileParams) != false){
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
                let result=commonUtil.ContentFilter(con_line,fileParams);
                setErrorNumber(result.tableContentErrorFilter.length);
                setTContent(result.tableContentErrorFilter);
                if (result.tableContentErrorFilter.length == 0) {
                    setSuccessData(true);
                    setDataBox(false);
                    Swal.fire("数据格式正确"+ result.tableContentFilter.length+"条" );
                    // 总条数
                    setDataLength(result.tableContentFilter.length);
                    setLocalSuccess(true);
                } else {
                    setSuccessData(false);
                    setDataBox(true);
                    Swal.fire("错误条数" + result.tableContentErrorFilter.length);
                }
            }else {
                Swal.fire("表头格式错误", "", "error");
            }
        }

    }
    const uploadBrandCsv =()=>{
        brandFileUpload(inputFile);
    }
    return(
        <div>
            {/*品牌上传文件*/}
            <div className='brand'>
                {/*按钮*/}
                <Grid container xs={12} spacing={3}>
                    <Grid item xs={6} align='left'>
                        <Button variant="contained"  color="primary">
                            下载模板格式
                        </Button>
                    </Grid>
                    <Grid item xs={6} align='right'>
                        <CSVReader
                            ref={buttonRef}
                            noClick
                            noDrag
                            noProgressBar
                            onFileLoad={handleOnFileLoad}
                        >
                            {( {file} ) => {
                                setInputFile(file);
                                return (
                                    <Button variant="contained"  color="primary" onClick={handleOpenDialog}>
                                        批量数据导入
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
            </div>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        uploadFileReducer: state.UpLoadFileReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    brandFileUpload:(inputFile)=>{
        dispatch(UpLoadFileAction.brandFileUpload(inputFile));
    }

});
export default connect(mapStateToProps, mapDispatchToProps)(UpLoadFile)