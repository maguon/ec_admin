import React, {useEffect, useState} from 'react';
import {connect,useDispatch} from 'react-redux';
import {Link, useParams} from "react-router-dom";
import {Button, Grid, Typography, TextField, IconButton, AppBar, Tab, Tabs, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, Fab,} from "@material-ui/core";
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles} from "@material-ui/core/styles";
import {SimpleModal} from "../index";
import {ClientAgentDetailActionType} from '../../types';
const commonUtil = require('../../utils/CommonUtil');
const ClientAgentDetailAction = require('../../actions/main/ClientAgentDetailAction');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
    // 标题样式
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    },
    select: {
        width: '100%',
    },
    selectCondition: {
        width: '100%',
    },
    button:{
        margin:'15px',
        float:'right'
    },
    divider:{
        margin:'20px 0'
    },
    updateButton:{
        marginTop:'20px',
        float:'right'
    }
}));
function ClientAgentDetail (props){
    const {clientAgentDetailReducer,updateClientAgent,getClientAgentInfo,getClientAgentArray,getInvoiceList} = props;
    const dispatch = useDispatch();
    const {id} = useParams();
    const classes = useStyles();
    const [value, setValue] = useState('1');
    const [validation,setValidation] = useState({});
    const [addValidation,setAddValidation] = useState({});
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [invoiceTitle, setInvoiceTitle] = useState('');
    const [invoiceType, setInvoiceType] = useState('1');
    const [invoiceBank, setInvoiceBank] = useState('');
    const [invoiceBankSer, setInvoiceBankSer] = useState('');
    const [settleType, setSettleType] = useState('1');
    const [invoiceAddress, setInvoiceAddress] = useState('');
    const [addInvoiceRemark, setAddInvoiceRemark] = useState('');
    const [modalOpenUpdateFlag, setModalOpenUpdateFlag] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [updateInvoiceTitle, setUpdateInvoiceTitle] = useState('');
    const [updateInvoiceType, setUpdateInvoiceType] = useState('1');
    const [updateInvoiceBank, setUpdateInvoiceBank] = useState('');
    const [updateInvoiceBankSer, setUpdateInvoiceBankSer] = useState('');
    const [updateSettleType, setUpdateSettleType] = useState('1');
    const [updateInvoiceAddress, setUpdateInvoiceAddress] = useState('');
    const [updateInvoiceRemark, setUpdateInvoiceRemark] = useState('');
    const [updatevalidation,setUpdateValidation] = useState({});

    useEffect(()=>{
        getClientAgentInfo(id);
        getClientAgentArray();
    },[]);
    const changeTab = (event, newValue) => {
        clientAgentDetailReducer.invoiceArray=[];
        setValue(newValue);
        if(newValue==1){
            setValidation({});
            getClientAgentInfo(id);
        }
        if(newValue==2){
            getInvoiceList(id)
        }
    };
    //验证()
    const validate = ()=>{
        const validateObj ={};
        if (!clientAgentDetailReducer.clientAgentInfo.name) {
            validateObj.name ='请输入客户名称';
        }
        if (!clientAgentDetailReducer.clientAgentInfo.sales_user_id) {
            validateObj.salesUserId ='请输入联系人';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    const validateAdd = ()=>{
        const validateObj ={};
        if (!invoiceTitle) {
            validateObj.invoiceTitle ='请输入发票抬头';
        }
        setAddValidation(validateObj);
        return Object.keys(validateObj).length
    }
    const validateUpdate = ()=>{
        const validateObj ={};
        if (!updateInvoiceTitle) {
            validateObj.updateInvoiceTitle ='请输入发票抬头';
        }
        setUpdateValidation(validateObj);
        return Object.keys(validateObj).length
    }
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
    };
    const modalUpdateClose=()=>{
        setModalOpenUpdateFlag(false)
    }
    const updateClientAgentArray=()=>{
        const errorCount = validate();
        if(errorCount==0){
            updateClientAgent(id);
        }
    }
    const addInvoiceModalOpen=()=>{
        setAddValidation({});
        setModalOpenFlag(true);
        setInvoiceTitle('');
        setInvoiceType('1');
        setInvoiceBank('');
        setInvoiceBankSer('');
        setSettleType('1');
        setInvoiceAddress('');
        setAddInvoiceRemark('');
    }
    const addInvoiceInfo=()=>{
        const errorCount = validateAdd();
        if(errorCount==0){
            props.addInvoice(id,{invoiceTitle,invoiceType,invoiceBank,invoiceBankSer,settleType,invoiceAddress,addInvoiceRemark});
            setModalOpenFlag(false);
        }
    }
    const updateInvoiceModalOpen=(item)=>{
        setUpdateValidation({});
        setModalOpenUpdateFlag(true);
        setUpdateInvoiceTitle(item.invoice_title);
        setUpdateInvoiceType(item.invoice_type);
        setUpdateInvoiceBank(item.invoice_bank);
        setUpdateInvoiceBankSer(item.invoice_bank_ser);
        setUpdateSettleType(item.settle_type);
        setUpdateInvoiceAddress(item.invoice_address);
        setUpdateInvoiceRemark(item.remark);
        setUpdateId(item.id);
    }
    const updateInvoiceInfo=()=>{
        const errorCount = validateUpdate();
        if(errorCount==0){
            props.updateInvoice(updateId,{updateInvoiceTitle,updateInvoiceType,updateInvoiceBank,updateInvoiceBankSer,updateSettleType,updateInvoiceAddress,updateInvoiceRemark});
            setModalOpenUpdateFlag(false)
        }
    }

    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>
                <Link to={{pathname: '/client_agent', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"></i>
                    </IconButton>
                </Link>
                客户集群 - {clientAgentDetailReducer.clientAgentInfo.name}({clientAgentDetailReducer.clientAgentInfo.id})
            </Typography>
            <div className={classes.pageDivider}></div>
            {/*选项卡*/}
            <div>
                <TabContext value={value}>
                    <AppBar position="static" color="default">
                        <Tabs value={value}
                              onChange={changeTab}
                              indicatorColor="primary"
                              textColor="primary"
                              variant="fullWidth">
                            <Tab label="客户集群" value="1" />
                            <Tab label="发票"   value="2" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value='1'>
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="serviceName"
                                           type="text"
                                           label="客户名称"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(ClientAgentDetailActionType.setClientAgentInfo({name:'name',value:e.target.value}));
                                           }}
                                           error={validation.name && validation.name!=''}
                                           helperText={validation.name}
                                           value={clientAgentDetailReducer.clientAgentInfo.name}

                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           select
                                           label="客户类型"
                                           name="modifyServiceType"
                                           type="number"
                                           onChange={(e)=>{
                                               dispatch(ClientAgentDetailActionType.setClientAgentInfo({name:'client_type',value:e.target.value}));
                                           }}
                                           value={clientAgentDetailReducer.clientAgentInfo.client_type}
                                           SelectProps={{
                                               native: true,
                                           }}
                                           variant="outlined"
                                >
                                    {sysConst.CLIENT_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           select
                                           label="客户来源"
                                           name="sourceType"
                                           type="number"
                                           onChange={(e)=>{
                                               dispatch(ClientAgentDetailActionType.setClientAgentInfo({name:'source_type',value:e.target.value}));
                                           }}
                                           value={clientAgentDetailReducer.clientAgentInfo.source_type}
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
                            <Grid item xs>
                                <TextField type='number' label="电话" fullWidth margin="dense" variant="outlined"
                                           value={clientAgentDetailReducer.clientAgentInfo.tel}
                                           onChange={(e) => {
                                               dispatch(ClientAgentDetailActionType.setClientAgentInfo({name:'tel',value:e.target.value}));
                                           }}

                                />
                            </Grid>
                            <Grid item xs>
                                <TextField type='text' label="身份证号" fullWidth margin="dense"  variant="outlined"
                                           value={clientAgentDetailReducer.clientAgentInfo.id_serial}
                                           onChange={(e) => {
                                               dispatch(ClientAgentDetailActionType.setClientAgentInfo({name:'id_serial',value:e.target.value}));
                                           }}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField label="地址" fullWidth margin="dense" variant="outlined"
                                           value={clientAgentDetailReducer.clientAgentInfo.address}
                                           onChange={(e) => {
                                               dispatch(ClientAgentDetailActionType.setClientAgentInfo({name:'address',value:e.target.value}));
                                           }}
                                />
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <Autocomplete fullWidth
                                              options={clientAgentDetailReducer.currentUserArray}
                                              getOptionLabel={(option) => option.real_name}
                                              value={clientAgentDetailReducer.clientAgentInfo.sales_user_id}
                                              onChange={(e,value) => {
                                                  dispatch(ClientAgentDetailActionType.setClientAgentInfo({name:'sales_user_id',value:value}));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="联系人" margin="dense" variant="outlined"
                                                                                  error={validation.salesUserId&&validation.salesUserId!=''}
                                                                                  helperText={validation.salesUserId}/>}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth margin="dense" variant="outlined" label="备注" multiline value={clientAgentDetailReducer.clientAgentInfo.remark}
                                           onChange={(e) => {
                                               dispatch(ClientAgentDetailActionType.setClientAgentInfo({name:'remark',value:e.target.value}));
                                           }}/>
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs={12} align='center' style={{marginTop:'30px'}}><Button variant="contained" color="primary"  onClick={updateClientAgentArray}>修改</Button></Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value='2'>
                        <Grid item xs align="right">
                            <Fab color="primary" aria-label="add" size="small" onClick={()=>{addInvoiceModalOpen()}}>
                                <i className="mdi mdi-plus mdi-24px" />
                            </Fab>
                        </Grid>
                        <Grid container spacing={2}>
                            <TableContainer component={Paper} style={{marginTop:40}}>
                                <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.head} align="center">ID</TableCell>
                                            <TableCell className={classes.head} align="center">发票类型</TableCell>
                                            <TableCell className={classes.head} align="center">发票抬头</TableCell>
                                            <TableCell className={classes.head} align="center">开户行</TableCell>
                                            <TableCell className={classes.head} align="center">开户账号</TableCell>
                                            <TableCell className={classes.head} align="center">开户地址</TableCell>
                                            <TableCell className={classes.head} align="center">结算类型</TableCell>
                                            <TableCell className={classes.head} align="center">操作</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {clientAgentDetailReducer.invoiceArray.map((row) => (
                                            <TableRow className={classes.tableRow} key={'table-row-' + row.id} style={{paddingTop:15}}>
                                                <TableCell align="center">{row.id}</TableCell>
                                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.INVOICE_TYPE,row.invoice_type)}</TableCell>
                                                <TableCell align="center">{row.invoice_title}</TableCell>
                                                <TableCell align="center">{row.invoice_bank}</TableCell>
                                                <TableCell align="center">{row.invoice_bank_ser}</TableCell>
                                                <TableCell align="center">{row.invoice_address}</TableCell>
                                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.SETTLE_TYPE,row.settle_type)}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="primary" edge="start" size="small"  onClick={() => {updateInvoiceModalOpen(row)}}>
                                                        <i className="mdi mdi-table-search"/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {clientAgentDetailReducer.invoiceArray.length === 0 &&
                                        <TableRow>
                                            <TableCell colSpan={9} style={{textAlign: 'center'}}>暂无数据</TableCell>
                                        </TableRow>}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </TabPanel>
                </TabContext>
            </div>
            {/* 新增发票信息*/}
            <SimpleModal
                title= "新增发票信息"
                open={modalOpenFlag}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained"  color="primary"  onClick={() => {addInvoiceInfo()}}>
                            确定
                        </Button>
                        <Button onClick={modalClose} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField className={classes.selectCondition}
                                   margin="dense"
                                   label="发票抬头"
                                   value={invoiceTitle}
                                   onChange={(e)=>setInvoiceTitle(e.target.value)}
                                   variant="outlined"
                                   error={addValidation.invoiceTitle&&addValidation.invoiceTitle!=''}
                                   helperText={addValidation.invoiceTitle}
                        >
                        </TextField>
                    </Grid>
                    <Grid item xs>
                        <TextField className={classes.selectCondition}
                                   select
                                   margin="dense"
                                   label="发票类型"
                                   value={invoiceType}
                                   onChange={(e)=>setInvoiceType(e.target.value)}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {sysConst.INVOICE_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth
                                   size="small"
                                   name="invoiceBank"
                                   type="text"
                                   label="开户行"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setInvoiceBank(e.target.value)
                                   }}
                                   value={invoiceBank}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField fullWidth
                                   size="small"
                                   name="invoiceBankSer"
                                   type="number"
                                   label="开户账号"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setInvoiceBankSer(e.target.value)
                                   }}
                                   value={invoiceBankSer}
                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth
                                   size="small"
                                   name="invoiceAddress"
                                   type="text"
                                   label="开户地址"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setInvoiceAddress(e.target.value)
                                   }}
                                   value={invoiceAddress}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField className={classes.select}
                                   size="small"
                                   select
                                   label="结算类型"
                                   name="settleType"
                                   type="text"
                                   onChange={(e)=>{
                                       setSettleType(e.target.value)
                                   }}
                                   value={settleType}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            <option key={1} value={0}>请选择 </option>
                            {sysConst.SETTLE_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="备注"
                            value={addInvoiceRemark}
                            onChange={(e)=>setAddInvoiceRemark(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>

            {/*修改发票信息*/}
            <SimpleModal
                title= "修改发票信息"
                open={modalOpenUpdateFlag}
                onClose={modalUpdateClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained"  color="primary"  onClick={() => {updateInvoiceInfo()}}>
                            确定
                        </Button>
                        <Button onClick={modalUpdateClose} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField className={classes.selectCondition}
                                   margin="dense"
                                   label="发票抬头"
                                   value={updateInvoiceTitle}
                                   onChange={(e)=>setUpdateInvoiceTitle(e.target.value)}
                                   variant="outlined"
                                   error={updatevalidation.updateInvoiceTitle&&updatevalidation.updateInvoiceTitle!=''}
                                   helperText={updatevalidation.updateInvoiceTitle}
                        >
                        </TextField>
                    </Grid>
                    <Grid item xs>
                        <TextField className={classes.selectCondition}
                                   select
                                   margin="dense"
                                   label="发票类型"
                                   value={updateInvoiceType}
                                   onChange={(e)=>setUpdateInvoiceType(e.target.value)}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {sysConst.INVOICE_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth
                                   size="small"
                                   name="updateInvoiceBank"
                                   type="text"
                                   label="开户行"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setUpdateInvoiceBank(e.target.value)
                                   }}
                                   value={updateInvoiceBank}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField fullWidth
                                   size="small"
                                   name="updateInvoiceBankSer"
                                   type="number"
                                   label="开户账号"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setUpdateInvoiceBankSer(e.target.value)
                                   }}
                                   value={updateInvoiceBankSer}
                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth
                                   size="small"
                                   name="updateInvoiceAddress"
                                   type="text"
                                   label="开户地址"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setUpdateInvoiceAddress(e.target.value)
                                   }}
                                   value={updateInvoiceAddress}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField className={classes.select}
                                   size="small"
                                   select
                                   label="结算类型"
                                   name="updateSettleType"
                                   type="text"
                                   onChange={(e)=>{
                                       setUpdateSettleType(e.target.value)
                                   }}
                                   value={updateSettleType}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            <option key={1} value={0}>请选择 </option>
                            {sysConst.SETTLE_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="备注"
                            value={updateInvoiceRemark}
                            onChange={(e)=>setUpdateInvoiceRemark(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        clientAgentDetailReducer: state.ClientAgentDetailReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    getClientAgentArray:()=>{
        dispatch(ClientAgentDetailAction.getClientAgentArray());
    },
    getClientAgentInfo:(id)=>{
        dispatch(ClientAgentDetailAction.getClientAgentInfo(id));
    },
    updateClientAgent:(id)=>{
        dispatch(ClientAgentDetailAction.updateClientAgent(id));
    },
    getInvoiceList:(id)=>{
        dispatch(ClientAgentDetailAction.getInvoiceList(id));
    },
    addInvoice:(id,{invoiceTitle,invoiceType,invoiceBank,invoiceBankSer,settleType,invoiceAddress,addInvoiceRemark})=>{
        dispatch(ClientAgentDetailAction.addInvoice(id,{invoiceTitle,invoiceType,invoiceBank,invoiceBankSer,settleType,invoiceAddress,addInvoiceRemark}));
    },
    updateInvoice:(updateId,{updateInvoiceTitle,updateInvoiceType,updateInvoiceBank,updateInvoiceBankSer,updateSettleType,updateInvoiceAddress,updateInvoiceRemark})=>{
        dispatch(ClientAgentDetailAction.updateInvoice(updateId,{updateInvoiceTitle,updateInvoiceType,updateInvoiceBank,updateInvoiceBankSer,updateSettleType,updateInvoiceAddress,updateInvoiceRemark}));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(ClientAgentDetail)