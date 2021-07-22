import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
import Swal from "sweetalert2";
import {Button, Divider, Grid, Typography, Paper, TextField, TableContainer, Table, TableHead, TableRow,TableCell, TableBody,Box, Switch,Fab, IconButton,} from "@material-ui/core";
import {withStyles,makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {ClientInformationActionType} from '../../types';
import {SimpleModal} from "../index";
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const ClientInformationAction = require('../../actions/main/ClientInformationAction');
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
    button:{
        margin:'15px',
        float:'right'
    },
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    pdfPage:customTheme.pdfPage,
    pdfTitle:customTheme.pdfTitle,
    tblHeader:customTheme.tblHeader,
    tblLastHeader:customTheme.tblLastHeader,
    tblBody:customTheme.tblBody,
    tblLastBody:customTheme.tblLastBody
}));
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}))(TableCell);

function ClientInformation (props) {
    const {clientInformationReducer,getClientInformationList,getUserArray,changeStatus,fromDetail,getClientAgent,addClientInformation} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [clientAgentId, setClientAgentId] = useState(null);
    const [remark, setRemark] = useState('');
    const [clientSerial, setClientSerial] = useState('');
    const [clientSerialDetail, setClientSerialDetail] = useState('');
    const [sourceType, setSourceType] = useState('-1');
    const [tel, setTel] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [referUser, setReferUser] = useState(null);
    const [validation,setValidation] = useState({});
    useEffect(()=>{
        if (!fromDetail) {
            let queryClientObj={
                tel:'',
                clientSerial:'',
                clientSerialDetail:'',
                referUser :null,
                dateIdStart :'',
                dateIdEnd :'',
                sourceType :null,
                status:null
            }
            dispatch(ClientInformationActionType.setClientInformationQueryObj(queryClientObj));
        }
        getUserArray();
        getClientInformationList(clientInformationReducer.start);
    },[]);
    //验证()
    const validate = ()=>{
        const validateObj ={}
            if (!clientAgentId||clientAgentId==null) {
                validateObj.clientAgentId ='请选择客户集群';
            }
        if (!referUser||referUser==null) {
            validateObj.referUser ='请选择推荐人';
        }

        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    //查询采购列表
    const getClientInformationArray =() =>{
        getClientInformationList(0);
    }
    const modalOpenModal=()=>{
        getClientAgent();
        setModalOpenFlag(true);
    }
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
    };
    const addClientInfo=()=>{
        const errorCount = validate();
        if(errorCount==0){
            addClientInformation({clientAgentId,remark,clientSerial,clientSerialDetail,sourceType,tel,name,address,referUser});
            setModalOpenFlag(false);
        }
    }
    //下一页
    const getNextClientList = () => {
        getClientInformationList(clientInformationReducer.start+(clientInformationReducer.size-1));
    };
    //上一页
    const getPreClientList = () => {
        getClientInformationList(clientInformationReducer.start-(clientInformationReducer.size-1));
    };
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>客户信息</Typography>
            <Divider light className={classes.pageDivider}/>
            {/*查询条件*/}
            <Grid container  spacing={1}>
                <Grid container item xs={10} spacing={1}>
                    {/*推荐人 referUser*/}
                    <Grid item xs>
                        <Autocomplete fullWidth
                                      options={clientInformationReducer.referUserArray}
                                      getOptionLabel={(option) => option.real_name}
                                      value={clientInformationReducer.queryClientObj.referUser}
                                      onChange={(e,value) => {
                                          dispatch(ClientInformationActionType.setClientInformationQueryObjs({name:'referUser',value:value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="推荐人" margin="dense" variant="outlined"/>}
                                      />
                    </Grid>
                    {/*车牌号*/}
                    <Grid item xs>
                        <TextField fullWidth={true} margin="dense" variant="outlined" label="车牌号"
                                   value={clientInformationReducer.queryClientObj.clientSerial}
                                   onChange={(e,value) => {
                                       dispatch(ClientInformationActionType.setClientInformationQueryObjs({name: "clientSerial", value: e.target.value}));
                                   }}
                        />
                    </Grid>
                    {/*VIN*/}
                    <Grid item xs>
                        <TextField fullWidth={true} margin="dense" variant="outlined" label="VIN"
                                   value={clientInformationReducer.queryClientObj.clientSerialDetail}
                                   onChange={(e,value) => {
                                       dispatch(ClientInformationActionType.setClientInformationQueryObjs({name: "clientSerialDetail", value: e.target.value}));
                                   }}
                        />
                    </Grid>
                    {/*客户来源*/}
                    <Grid item  xs>
                        <Autocomplete fullWidth={true}
                                      options={sysConst.SOURCE_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={clientInformationReducer.queryClientObj.sourceType}
                                      onChange={(e,value) => {
                                          dispatch(ClientInformationActionType.setClientInformationQueryObjs({name: "sourceType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="客户来源" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*电话*/}
                    <Grid item xs>
                        <TextField fullWidth={true} margin="dense" variant="outlined" label="电话号" type='number'
                                   value={clientInformationReducer.queryClientObj.tel}
                                   onChange={(e,value) => {
                                       dispatch(ClientInformationActionType.setClientInformationQueryObjs({name: "tel", value: e.target.value}));
                                   }}
                        />
                    </Grid>

                    {/*状态status*/}
                    <Grid item  xs>
                        <Autocomplete fullWidth={true}
                                      options={sysConst.USE_FLAG}
                                      getOptionLabel={(option) => option.label}
                                      value={clientInformationReducer.queryClientObj.status}
                                      onChange={(e,value) => {
                                          dispatch(ClientInformationActionType.setClientInformationQueryObjs({name: "status", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="状态" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*创建时间*/}
                    <Grid item  xs>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建时间（始）"
                                    value={clientInformationReducer.queryClientObj.dateIdStart=="" ? null :clientInformationReducer.queryClientObj.dateIdStart}
                                    onChange={(date) => {
                                        dispatch(ClientInformationActionType.setClientInformationQueryObjs({name: "dateIdStart", value:date}));
                                    }}
                        />
                    </Grid>
                    <Grid item  xs>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建时间（终）"
                                    value={clientInformationReducer.queryClientObj.dateIdEnd=="" ? null :clientInformationReducer.queryClientObj.dateIdEnd}
                                    onChange={(date) => {
                                        dispatch(ClientInformationActionType.setClientInformationQueryObjs({name: "dateIdEnd", value:date}));
                                    }}
                        />
                    </Grid>
                </Grid>
                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign: 'right',marginTop:10}}>
                    <Fab color="primary" size="small" onClick={getClientInformationArray}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
                {/*追加按钮*/}
                <Grid item xs={1} style={{textAlign: 'right',marginTop:10}}>
                    <Fab color="primary" size="small"  onClick={() => {modalOpenModal()}}>
                        <i className="mdi mdi-plus mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>
            {/*主体*/}
            <Grid container spacing={1}>
                <TableContainer component={Paper} style={{marginTop:20}}>
                    <Table  size='small' aria-label="a dense table">
                        <TableHead >
                            <TableRow style={{height:50}}>
                                <StyledTableCell align="center">ID</StyledTableCell>
                                <StyledTableCell align="center">车牌号</StyledTableCell>
                                <StyledTableCell align="center">VIN</StyledTableCell>
                               {/* <StyledTableCell align="center">类型名称</StyledTableCell>*/}
                                <StyledTableCell align="center">客户来源</StyledTableCell>
                                <StyledTableCell align="center">用户</StyledTableCell>
                                <StyledTableCell align="center">电话</StyledTableCell>
                                <StyledTableCell align="center">地址</StyledTableCell>
                                <StyledTableCell align="center">推荐人</StyledTableCell>
                                <StyledTableCell align="center">创建时间</StyledTableCell>
                                <StyledTableCell align="center">操作</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientInformationReducer.clientInformationArray.length > 0 &&clientInformationReducer.clientInformationArray.map((row,index) => (
                                <TableRow key={index}>
                                    <TableCell align="center" >{row.id}</TableCell>
                                    <TableCell align="center" >{row.client_serial}</TableCell>
                                    <TableCell align="center" >{row.client_serial_detail}</TableCell>
                                    {/*<TableCell align="center" >{row.model_name}</TableCell>*/}
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SOURCE_TYPE,row.source_type)}</TableCell>
                                    <TableCell align="center" >{row.name}</TableCell>
                                    <TableCell align="center" >{row.tel}</TableCell>
                                    <TableCell align="center" >{row.address}</TableCell>
                                    <TableCell align="center" >{row.refer_real_name}</TableCell>
                                    <TableCell align="center" >{row.date_id}</TableCell>
                                    <TableCell align="center">
                                        {/* 停用/可用 状态 */}
                                        <Switch color='primary' size="small" name="状态"
                                                checked={row.status==sysConst.USE_FLAG[1].value}
                                                onChange={(e)=>{changeStatus(row.id, row.status)}}
                                        />
                                        <IconButton color="primary" edge="start" size="small">
                                            <Link to={{pathname: '/client_information/' + row.id}}>
                                                <i className="mdi mdi-table-search"/>
                                            </Link>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>))}
                            {clientInformationReducer.clientInformationArray.length === 0 &&
                            <TableRow style={{height:60}}><TableCell align="center" colSpan="10">暂无数据</TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {clientInformationReducer.dataSize >=clientInformationReducer.size &&
                <Button className={classes.button} variant="contained" color="primary"  size="small" onClick={getNextClientList}>
                    下一页
                </Button>}
                {clientInformationReducer.start > 0 &&clientInformationReducer.dataSize > 0 &&
                <Button className={classes.button} variant="contained" color="primary"  size="small" onClick={getPreClientList}>
                    上一页
                </Button>}
            </Box>
            {/*模态框*/}
            <SimpleModal
                maxWidth="md"
                maxHeight="md"
                title="新增客户信息"
                open={modalOpenFlag}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" onClick={addClientInfo} color="primary">
                            确定
                        </Button>
                        <Button onClick={modalClose} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >

                <Grid  container spacing={3}>
                    {/*客户集群clientAgentId*/}
                    <Grid item xs>
                        <Autocomplete fullWidth
                                      options={clientInformationReducer.clientAgentArray}
                                      getOptionLabel={(option) => option.name}
                                      value={clientAgentId}
                                      onChange={(e,value)=>{setClientAgentId(value)}}
                                      renderInput={(params) => <TextField {...params} label="客户集群" margin="dense" variant="outlined"
                                                                          error={validation.clientAgentId&&validation.clientAgentId!=''}
                                                                          helperText={validation.clientAgentId}
                                       />}
                        />
                    </Grid>
                    {/*车牌号 clientSerial*/}
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="车牌号"
                            value={clientSerial}
                            onChange={(e)=>setClientSerial(e.target.value)}
                        />
                    </Grid>
                    {/*VIN clientSerialDetail*/}
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="VIN"
                            value={clientSerialDetail}
                            onChange={(e)=>setClientSerialDetail(e.target.value)}
                        />
                    </Grid>
                    {/*类型名称 modelId,modelName*/}
                   {/* <Grid item xs></Grid>*/}
                    {/*客户来源 sourceType*/}
                    <Grid item xs>
                        <TextField style={{marginTop:'7px'}} fullWidth
                                   size="small"
                                   select
                                   label="客户来源"
                                   name="sourceType"
                                   type="number"
                                   onChange={(e)=>setSourceType(e.target.value)}
                                   value={sourceType}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {sysConst.SOURCE_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <Grid  container spacing={3}>
                    {/*用户 name*/}
                    <Grid item xs>
                        <Grid item xs>
                            <TextField
                                fullWidth={true}
                                margin="dense"
                                variant="outlined"
                                label="用户"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    {/*电话 tel*/}
                    <Grid item xs>
                        <Grid item xs>
                            <TextField
                                fullWidth={true}
                                margin="dense"
                                variant="outlined"
                                type='number'
                                label="电话"
                                value={tel}
                                onChange={(e)=>setTel(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    {/*地址 address*/}
                    <Grid item xs>
                        <Grid item xs>
                            <TextField
                                fullWidth={true}
                                margin="dense"
                                variant="outlined"
                                label="地址"
                                value={address}
                                onChange={(e)=>setAddress(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    {/*推荐人 referUser*/}
                    <Grid item xs>
                        <Autocomplete fullWidth
                                      options={clientInformationReducer.referUserArray}
                                      getOptionLabel={(option) => option.real_name}
                                      value={referUser}
                                      onChange={(e,value)=>setReferUser(value)}
                                      renderInput={(params) => <TextField {...params} label="推荐人" margin="dense" variant="outlined"
                                                                          error={validation.referUser&&validation.referUser!=''}
                                                                          helperText={validation.referUser}/>}
                        />
                    </Grid>

                </Grid>
                <Grid  container spacing={3}>
                    {/*备注remark*/}
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="备注"
                            value={remark}
                            onChange={(e)=>setRemark(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
}
const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        fromDetail = true;
    }
    return {
        clientInformationReducer: state.ClientInformationReducer,
        fromDetail: fromDetail
    }
}
const mapDispatchToProps = (dispatch) => ({
    getClientAgent:()=>{
        dispatch(ClientInformationAction.getClientAgent());
    },
    getUserArray:()=>{
        dispatch(ClientInformationAction.getUserArray());
    },
    getClientInformationList: (start) => {
        dispatch(ClientInformationAction.getClientInformationList(start));
    },
    changeStatus: (id, status) => {
        Swal.fire({
            title: status === 1 ? "确定停用该数据？" : "确定重新启用该数据？",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(ClientInformationAction.changeStatus(id, status));
            }
        });
    },
    addClientInformation:({clientAgentId,remark,clientSerial,clientSerialDetail,sourceType,tel,name,address,referUser})=>{
        dispatch(ClientInformationAction.addClientInformation({clientAgentId,remark,clientSerial,clientSerialDetail,sourceType,tel,name,address,referUser}));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ClientInformation)