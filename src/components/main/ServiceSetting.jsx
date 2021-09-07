import React, {useEffect,useState}from 'react';
import {connect, useDispatch} from 'react-redux';
import Swal from "sweetalert2";
import {
    Button, Divider, Grid, Typography, Paper, TextField, TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, IconButton,Box, Switch, AppBar, Tabs, Tab,Fab
} from "@material-ui/core";
import {withStyles,makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import {SimpleModal} from '../index';
import {ServiceSettingActionType} from '../../types';
const ServiceSettingAction = require('../../actions/main/ServiceSettingAction');
const PurchaseAction = require('../../actions/main/PurchaseAction');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
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
function ServiceSetting (props){
    const {serviceSettingReducer,purchaseReducer,getProductList,getSericeSettingList,changeStatus,updateServiceSettingItem,addProduct,getServiceSettingRelList,deleteRel} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [validation,setValidation] = useState({});
    const [serviceName,setServiceName] = useState('');
    const [serviceType,setServiceType] = useState('');
    const [servicePriceFlag, setServicePriceFlag] = useState(true);
    const [servicePriceType,setServicePriceType] = useState('');
    const [fixedPrice,setFixedPrice] = useState('');
    const [unitPrice,setUnitPrice] = useState('');
    const [servicePriceCount,setServicePriceCount] = useState('');
    const [serviceCostFlag, setServiceCostFlag] = useState(false);
    const [serviceCostType,setServiceCostType] = useState('');
    const [fixedCost,setFixedCost] = useState('');
    const [unitCost,setUnitCost] = useState('');
    const [serviceCostCount,setServiceCostCount] = useState('');
    const [totalPrice,setTotalPrice] = useState('');
    const [totalCost,setTotalCost] = useState('');
    const [salePerfTypeFlag, setSalePerfTypeFlag] = useState(1);
    const [salePerfType,setSalePerfType] = useState('');
    const [salePerfFixed,setSalePerfFixed] = useState('');
    const [salePerfRatio,setSalePerfRatio] = useState('');
    const [deployPerfTypeFlag, setDeployPerfTypeFlag] = useState(1);
    const [deployPerfType,setDeployPerfType] = useState('');
    const [deployPerfFixed,setDeployPerfFixed] = useState('');
    const [deployPerfRatio,setDeployPerfRatio] = useState('');
    const [checkPerfTypeFlag, setCheckPerfTypeFlag] = useState(1);
    const [checkPerfType,setCheckPerfType] = useState('');
    const [checkPerfFixed,setCheckPerfFixed] = useState('');
    const [checkPerfRatio,setCheckPerfRatio] = useState('');
    const [remarks,setRemarks] = useState('');
    const [modifyModalOpenFlag,setModifyModalOpenFlag]= useState(false);
    const [modifyValidation,setModifyValidation] = useState({});
    const [modifyServiceName,setModifyServiceName] = useState('');
    const [modifyServiceType,setModifyServiceType] = useState('');
    const [modifyServicePriceFlag, setModifyServicePriceFlag] = useState(true);
    const [modifyServicePriceType,setModifyServicePriceType] = useState('');
    const [modifyFixedPrice,setModifyFixedPrice] = useState('');
    const [modifyUnitPrice,setModifyUnitPrice] = useState('');
    const [modifyServicePriceCount,setModifyServicePriceCount] = useState('');
    const [modifyServiceCostFlag, setModifyServiceCostFlag] = useState(false);
    const [modifyServiceCostType,setModifyServiceCostType] = useState('');
    const [modifyFixedCost,setModifyFixedCost] = useState('');
    const [modifyUnitCost,setModifyUnitCost] = useState('');
    const [modifyServiceCostCount,setModifyServiceCostCount] = useState('');
    const [modifyTotalPrice,setModifyTotalPrice] = useState('');
    const [modifyTotalCost,setModifyTotalCost] = useState('');
    const [modifySalePerfTypeFlag, setModifySalePerfTypeFlag] = useState(1);
    const [modifySalePerfType,setModifySalePerfType] = useState('');
    const [modifySalePerfFixed,setModifySalePerfFixed] = useState('');
    const [modifySalePerfRatio,setModifySalePerfRatio] = useState('');
    const [modifyDeployPerfTypeFlag, setModifyDeployPerfTypeFlag] = useState(1);
    const [modifyDeployPerfType,setModifyDeployPerfType] = useState('');
    const [modifyDeployPerfFixed,setModifyDeployPerfFixed] = useState('');
    const [modifyDeployPerfRatio,setModifyDeployPerfRatio] = useState('');
    const [modifyCheckPerfTypeFlag, setModifyCheckPerfTypeFlag] = useState(1);
    const [modifyCheckPerfType,setModifyCheckPerfType] = useState('');
    const [modifyCheckPerfFixed,setModifyCheckPerfFixed] = useState('');
    const [modifyCheckPerfRatio,setModifyCheckPerfRatio] = useState('');
    const [modifyRemarks,setModifyRemarks] = useState('');
    const [modifyId,setModifyId] = useState('');
    const [value, setValue] = useState('1');
    const [productArray, setProductArray] = useState(null);
    const [productCount, setProductCount] = useState('');
    const [validationProduct,setValidationProduct] = useState({});
    useEffect(()=>{
        getSericeSettingList(serviceSettingReducer.start);
        getProductList();
    },[])
    useEffect(()=>{
        if(servicePriceType==1){
            setServicePriceFlag(false);
            setTotalPrice(fixedPrice);
            setUnitPrice(0);
            setServicePriceCount(0);
        }else {
            setServicePriceFlag(true)
            setTotalPrice(unitPrice*servicePriceCount);
            setFixedPrice(0);
        }
        if(serviceCostType==1){
            setServiceCostFlag(false)
            setTotalCost(fixedCost)
            setUnitCost(0);
            setServiceCostCount(0);
        }else {
            setServiceCostFlag(true)
            setTotalCost(unitCost*serviceCostCount);
            setFixedCost(0);
        }
        if(salePerfType==1){
            setSalePerfTypeFlag(1)
            setSalePerfFixed(0);
            setSalePerfRatio(0);
        }else if(salePerfType==2){
            setSalePerfTypeFlag(2);
            setSalePerfRatio(0);
        }else if(salePerfType==3){
            setSalePerfTypeFlag(3)
            setSalePerfFixed(0);
        }else {
            setSalePerfTypeFlag(4)
            setSalePerfFixed(0);
        }
        if(deployPerfType==1){
            setDeployPerfTypeFlag(1)
            setDeployPerfFixed(0)
            setDeployPerfRatio(0)
        }else if(deployPerfType==2){
            setDeployPerfTypeFlag(2)
            setDeployPerfRatio(0)
        }else if(deployPerfType==3){
            setDeployPerfTypeFlag(3)
            setDeployPerfFixed(0)
        }else {
            setDeployPerfTypeFlag(4)
            setDeployPerfFixed(0)
        }
        if(checkPerfType==1){
            setCheckPerfTypeFlag(1)
            setCheckPerfFixed(0)
            setCheckPerfRatio(0)
        }else if(checkPerfType==2){
            setCheckPerfTypeFlag(2)
            setCheckPerfRatio(0)
        }else if(checkPerfType==3){
            setCheckPerfTypeFlag(3)
            setCheckPerfFixed(0)
        }else {
            setCheckPerfTypeFlag(4)
            setCheckPerfFixed(0)
        }
    },[servicePriceType,serviceCostType,salePerfType,checkPerfType,deployPerfType,fixedPrice,unitPrice,servicePriceCount,fixedCost,unitCost,serviceCostCount])
    useEffect(()=>{
        if(modifyServicePriceType==1){
            setModifyServicePriceFlag(false);
            setModifyTotalPrice(modifyFixedPrice);
            setModifyUnitPrice(0);
            setModifyServicePriceCount(0);
        }else {
            setModifyServicePriceFlag(true)
            setModifyTotalPrice(modifyUnitPrice*modifyServicePriceCount);
            setModifyFixedPrice(0);
        }
        if(modifyServiceCostType==1){
            setModifyServiceCostFlag(false)
            setModifyTotalCost(modifyFixedCost)
            setModifyUnitCost(0);
            setModifyServiceCostCount(0);
        }else {
            setModifyServiceCostFlag(true)
            setModifyTotalCost(modifyUnitCost*modifyServiceCostCount);
            setModifyFixedCost(0);
        }
        if(modifySalePerfType==1){
            setModifySalePerfTypeFlag(1)
            setModifySalePerfFixed(0);
            setModifySalePerfRatio(0);
        }else if(modifySalePerfType==2){
            setModifySalePerfTypeFlag(2)
            setModifySalePerfRatio(0)
        }else if(modifySalePerfType==3){
            setModifySalePerfTypeFlag(3)
            setModifySalePerfFixed(0);
        }else {
            setModifySalePerfTypeFlag(4)
            setModifySalePerfFixed(0);
        }
        if(modifyDeployPerfType==1){
            setModifyDeployPerfTypeFlag(1)
            setModifyDeployPerfFixed(0);
            setModifyDeployPerfRatio(0);
        }else if(modifyDeployPerfType==2){
            setModifyDeployPerfTypeFlag(2)
            setModifyDeployPerfRatio(0);
        }else if(modifyDeployPerfType==3){
            setModifyDeployPerfTypeFlag(3)
            setModifyDeployPerfFixed(0);
        }else {
            setModifyDeployPerfTypeFlag(4)
            setModifyDeployPerfFixed(0);
        }
        if(modifyCheckPerfType==1){
            setModifyCheckPerfTypeFlag(1)
            setModifyCheckPerfFixed(0);
            setModifyCheckPerfRatio(0);
        }else if(modifyCheckPerfType==2){
            setModifyCheckPerfTypeFlag(2)
            setModifyCheckPerfRatio(0);
        }else if(modifyCheckPerfType==3){
            setModifyCheckPerfTypeFlag(3)
            setModifyCheckPerfFixed(0);
        }else {
            setModifyCheckPerfTypeFlag(4)
            setModifyCheckPerfFixed(0);
        }
    },[modifyServicePriceType,modifyServiceCostType,modifySalePerfType,modifyDeployPerfType,modifyCheckPerfType,modifyFixedCost,modifyUnitCost,modifyServiceCostCount,modifyUnitPrice,modifyServicePriceCount,modifyFixedPrice])
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if(newValue=='2'){
            getServiceSettingRelList(modifyId);
        }
    };
    const serviceSettingArray =() =>{
        getSericeSettingList(0);
    }
    //初始添加模态框值
    const modalOpen =() =>{
        setModalOpenFlag(true);
        setServiceName('');
        setServiceType(1);
        setServicePriceFlag(true);
        setServicePriceType(1);
        setFixedPrice('');
        setUnitPrice('');
        setServicePriceCount('');
        setServiceCostFlag(true);
        setServiceCostType(1);
        setFixedCost('');
        setUnitCost('');
        setServiceCostCount('');
        setTotalPrice('');
        setTotalCost('');
        setSalePerfTypeFlag(true);
        setSalePerfType(1);
        setSalePerfFixed('');
        setSalePerfRatio('');
        setDeployPerfTypeFlag(true);
        setDeployPerfType(1);
        setDeployPerfFixed('');
        setDeployPerfRatio('');
        setCheckPerfTypeFlag(true);
        setCheckPerfType(1);
        setCheckPerfFixed('');
        setCheckPerfRatio('');
        setRemarks('');
    }
    const handlePutOpen =(item) =>{
        setModifyId(item.id)
        setModifyModalOpenFlag(true);
        setModifyServiceName(item.service_name);
        setModifyServiceType(item.service_type);
        setModifyServicePriceType(item.service_price_type);
        setModifyFixedPrice(item.fixed_price)
        setModifyUnitPrice(item.unit_price)
        setModifyServicePriceCount(item.service_price_count)
        setModifyServiceCostType(item.service_cost_type)
        setModifyFixedCost(item.fixed_cost)
        setModifyUnitCost(item.unit_cost)
        setModifyServiceCostCount(item.service_cost_count)
        setModifyTotalPrice(item.total_price)
        setModifyTotalCost(item.total_cost)
        setModifySalePerfType(item.sale_perf_type)
        setModifySalePerfFixed(item.sale_perf_fixed)
        setModifySalePerfRatio(item.sale_perf_ratio*100)
        setModifyDeployPerfType(item.deploy_perf_type)
        setModifyDeployPerfFixed(item.deploy_perf_fixed)
        setModifyDeployPerfRatio(item.deploy_perf_ratio*100)
        setModifyCheckPerfType(item.check_perf_type)
        setModifyCheckPerfFixed(item.check_perf_fixed)
        setModifyCheckPerfRatio(item.check_perf_ratio*100)
        setModifyRemarks(item.remark)
        setProductArray(null);
        setProductCount('');
        setValidationProduct({});
        setValue('1');
    }
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
    };
    const modifyModalClose = () =>{
        setModifyModalOpenFlag(false);
    }
    //验证()
    const validate = ()=>{
        const validateObj ={}
        if (!serviceName) {
            validateObj.serviceName ='请输入服务名称';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    const validateProduct = ()=>{
        const validateObj ={}
        if (!productCount) {
            validateObj.productCount ='请输入数量';
        }
        if(!productArray){
            validateObj.productArray ='请输入商品';
        }
        setValidationProduct(validateObj);
        return Object.keys(validateObj).length
    }
    const modifyValidate =()=>{
        const validateObj ={}
        if (!modifyServiceName) {
            validateObj.modifyServiceName ='请输入服务名称';
        }
        setModifyValidation(validateObj);
        return Object.keys(validateObj).length
    }
    const addServiceSetting= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            props.addServiceSetting(
                {
                    serviceName,serviceType,servicePriceType,fixedPrice,unitPrice, servicePriceCount,serviceCostType,fixedCost,unitCost,serviceCostCount,totalPrice,totalCost,salePerfType,salePerfFixed,salePerfRatio,deployPerfType,
                    deployPerfFixed,deployPerfRatio,checkPerfType,checkPerfFixed,checkPerfRatio,remarks});
            setModalOpenFlag(false);
        }
    }
    const updateServiceSetting =() => {
        const errorCount = modifyValidate();
        if (errorCount == 0) {
            updateServiceSettingItem({modifyId,modifyRemarks,modifyServiceName, modifyServiceType, modifyServicePriceType, modifyFixedPrice, modifyUnitPrice, modifyServicePriceCount, modifyServiceCostType, modifyFixedCost, modifyUnitCost,
            modifyServiceCostCount, modifyTotalPrice, modifyTotalCost, modifySalePerfType, modifySalePerfFixed, modifySalePerfRatio, modifyDeployPerfType, modifyDeployPerfFixed, modifyDeployPerfRatio, modifyCheckPerfType, modifyCheckPerfFixed, modifyCheckPerfRatio,
            })
            setModifyModalOpenFlag(false);
        }
    }
    const addProductItem =()=>{
        const errorCount =validateProduct();
        if(errorCount==0){
            addProduct({productArray,productCount,modifyId,modifyServiceName});
            setProductArray(null);
            setProductCount('');
            setValidationProduct({});

        }
    }
    //下一页
    const getNextServiceSettingList = () => {
        getSericeSettingList(serviceSettingReducer.start+(serviceSettingReducer.size-1));
    };
    //上一页
    const getPreServiceSettingList = () => {
        getSericeSettingList(serviceSettingReducer.start-(serviceSettingReducer.size-1));
    };
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>服务项目设置</Typography>
            <Divider light className={classes.pageDivider}/>
            {/*查询条件*/}
            <Grid container  spacing={1}>
                <Grid container item xs={10} spacing={1}>
                    {/*服务类型serviceType*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.SERVICE_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={serviceSettingReducer.queryObj.serviceType}
                                      onChange={(e,value) => {
                                          dispatch(ServiceSettingActionType.setServiceSettingQueryObjs({name: "serviceType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="服务类型" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*服务价格类型servicePriceType*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.SERVICE_PRICE_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={serviceSettingReducer.queryObj.servicePriceType}
                                      onChange={(e,value) => {
                                          dispatch(ServiceSettingActionType.setServiceSettingQueryObjs({name: "servicePriceType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="服务价格类型" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*服务成本类型serviceCostType*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.SERVICE_PRICE_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={serviceSettingReducer.queryObj.serviceCostType}
                                      onChange={(e,value) => {
                                          dispatch(ServiceSettingActionType.setServiceSettingQueryObjs({name: "serviceCostType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="服务成本类型" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*销售提成类型salePerfType*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.SALE_PERF_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={serviceSettingReducer.queryObj.salePerfType}
                                      onChange={(e,value) => {
                                          dispatch(ServiceSettingActionType.setServiceSettingQueryObjs({name: "salePerfType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="销售提成类型" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*施工提成类型deployPerfType*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.SALE_PERF_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={serviceSettingReducer.queryObj.deployPerfType}
                                      onChange={(e,value) => {
                                          dispatch(ServiceSettingActionType.setServiceSettingQueryObjs({name: "deployPerfType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="施工提成类型" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*验收提成类型checkPerfType*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.SALE_PERF_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={serviceSettingReducer.queryObj.checkPerfType}
                                      onChange={(e,value) => {
                                          dispatch(ServiceSettingActionType.setServiceSettingQueryObjs({name: "checkPerfType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="验收提成类型" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*状态status*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.USE_FLAG}
                                      getOptionLabel={(option) => option.label}
                                      value={serviceSettingReducer.queryObj.status}
                                      onChange={(e,value) => {
                                          dispatch(ServiceSettingActionType.setServiceSettingQueryObjs({name: "status", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="状态" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                </Grid>
                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign: 'center',marginTop:10}}>
                    <Fab color="primary" size="small" onClick={serviceSettingArray}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
                {/*追加按钮*/}
                <Grid item xs={1} style={{textAlign: 'center',marginTop:10}}>
                    <Fab color="primary" size="small" onClick={() => {modalOpen()}}>
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
                                <StyledTableCell align="center">名称</StyledTableCell>
                                <StyledTableCell align="center">类型</StyledTableCell>
                                <StyledTableCell align="center">售价类型</StyledTableCell>
                                <StyledTableCell align="center">固定售价</StyledTableCell>
                                <StyledTableCell align="center">销售单价</StyledTableCell>
                                <StyledTableCell align="center">销售数量</StyledTableCell>
                                <StyledTableCell align="center">成本类型</StyledTableCell>
                                <StyledTableCell align="center">固定成本</StyledTableCell>
                                <StyledTableCell align="center">成本单价</StyledTableCell>
                                <StyledTableCell align="center">成本数量</StyledTableCell>
                                <StyledTableCell align="center">总售价</StyledTableCell>
                                <StyledTableCell align="center">总成本</StyledTableCell>
                                <StyledTableCell align="center">毛利润</StyledTableCell>
                               {/* <StyledTableCell align="center">销售提成类型</StyledTableCell>
                                <StyledTableCell align="center">销售固定提成金额</StyledTableCell>
                                <StyledTableCell align="center">销售提成比例</StyledTableCell>
                                <StyledTableCell align="center">施工提成类型</StyledTableCell>
                                <StyledTableCell align="center">施工固定提成金额</StyledTableCell>
                                <StyledTableCell align="center">施工提成比例</StyledTableCell>
                                <StyledTableCell align="center">验收提成类型</StyledTableCell>
                                <StyledTableCell align="center">验收固定提成金额</StyledTableCell>
                                <StyledTableCell align="center">验收提成比例</StyledTableCell>
                                <StyledTableCell align="center">状态</StyledTableCell>*/}
                                <StyledTableCell align="center">操作</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {serviceSettingReducer.serviceSettingArray.length > 0 &&serviceSettingReducer.serviceSettingArray.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center" >{row.id}</TableCell>
                                    <TableCell align="center" >{row.service_name}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SERVICE_TYPE,row.service_type)}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SERVICE_PRICE_TYPE,row.service_price_type)}</TableCell>
                                    <TableCell align="center" >{row.fixed_price}</TableCell>
                                    <TableCell align="center" >{row.unit_price}</TableCell>
                                    <TableCell align="center" >{row.service_price_count}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SERVICE_PRICE_TYPE,row.service_cost_type)}</TableCell>
                                    <TableCell align="center" >{row.fixed_cost}</TableCell>
                                    <TableCell align="center" >{row.unit_cost}</TableCell>
                                    <TableCell align="center" >{row.service_cost_count}</TableCell>
                                    <TableCell align="center" >{row.total_price}</TableCell>
                                    <TableCell align="center" >{row.total_cost}</TableCell>
                                    <TableCell align="center" >{row.total_profit}</TableCell>
                                 {/*   <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SALE_PERF_TYPE,row.sale_perf_type)}</TableCell>
                                    <TableCell align="center" >{row.sale_perf_fixed}</TableCell>
                                    <TableCell align="center" >{row.sale_perf_ratio}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SALE_PERF_TYPE,row.deploy_perf_type)}</TableCell>
                                    <TableCell align="center" >{row.deploy_perf_fixed}</TableCell>
                                    <TableCell align="center" >{row.deploy_perf_ratio}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SALE_PERF_TYPE,row.check_perf_type)}</TableCell>
                                    <TableCell align="center" >{row.check_perf_fixed}</TableCell>
                                    <TableCell align="center" >{row.check_perf_ratio}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.REFUND_STATUS,row.status)}</TableCell>*/}
                                    <TableCell align="center">

                                        {/* 停用/可用 状态 */}
                                        <Switch color='primary' size="small" name="状态"
                                                checked={row.status==sysConst.USE_FLAG[1].value}
                                                onChange={(e)=>{changeStatus(row.id, row.status)}}
                                        />
                                        <IconButton color="primary" edge="start" size="small"onClick={() => {handlePutOpen(row)}}>
                                                <i className="mdi mdi-table-search purple-font margin-left10"> </i>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>))}
                            {serviceSettingReducer.serviceSettingArray.length === 0 &&
                            <TableRow style={{height:60}}><TableCell align="center" colSpan="15">暂无数据</TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {serviceSettingReducer.dataSize >=serviceSettingReducer.size &&
                <Button className={classes.button} variant="contained" color="primary"  size="small" onClick={getNextServiceSettingList}>
                    下一页
                </Button>}
                {serviceSettingReducer.start > 0 &&serviceSettingReducer.dataSize > 0 &&
                <Button className={classes.button} variant="contained" color="primary"  size="small" onClick={getPreServiceSettingList}>
                    上一页
                </Button>}
            </Box>

            {/* 添加服务项目信息*/}
            <SimpleModal
                title= "新增服务项目信息"
                open={modalOpenFlag}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" onClick={addServiceSetting} color="primary">
                            确定
                        </Button>
                        <Button onClick={modalClose} color="primary" autoFocus>
                            关闭
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth
                                   size="small"
                                   name="serviceName"
                                   type="text"
                                   label="服务名称"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setServiceName(e.target.value)
                                   }}
                                   error={validation.serviceName && validation.serviceName!=''}
                                   helperText={validation.serviceName}
                                   value={serviceName}

                        />
                    </Grid>
                    <Grid item xs>
                        <TextField fullWidth
                                   size="small"
                                   select
                                   label="服务类型"
                                   name="serviceType"
                                   type="number"
                                   onChange={(e)=>{
                                       setServiceType(e.target.value)
                                   }}
                                   value={serviceType}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {sysConst.SERVICE_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs={4}>
                        <TextField style={{marginTop:8}}
                             fullWidth={true}
                             size="small"
                             select
                             margin="dense"
                             label="服务价格类型"
                             name="servicePriceType"
                             type="number"
                             onChange={(e)=>{ setServicePriceType(e.target.value)}}
                             value={servicePriceType}
                             SelectProps={{
                                   native: true,
                               }}
                             variant="outlined"
                        >
                            {sysConst.SERVICE_PRICE_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4}  style={{display:servicePriceFlag?'none':"block"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="固定售价"
                            value={fixedPrice}
                            onChange={(e)=>setFixedPrice(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:servicePriceFlag?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="销售单价"
                            value={unitPrice}
                            onChange={(e)=>setUnitPrice(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:servicePriceFlag?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="销售数量"
                            value={servicePriceCount}
                            onChange={(e)=>setServicePriceCount(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs={4}>
                        <TextField
                           style={{marginTop:8}}
                           fullWidth={true}
                           size="small"
                           select
                           label="服务成本类型"
                           name="serviceCostType"
                           type="number"
                           onChange={(e)=>{setServiceCostType(e.target.value)}}
                           value={serviceCostType}
                           SelectProps={{
                               native: true,
                           }}
                           variant="outlined"
                        >
                            {sysConst.SERVICE_PRICE_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4} style={{display:serviceCostFlag?'none':"block"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="固定成本"
                            value={fixedCost}
                            onChange={(e)=>setFixedCost(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:serviceCostFlag?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="成本单价"
                            value={unitCost}
                            onChange={(e)=>setUnitCost(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:serviceCostFlag?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="成本数量"
                            value={serviceCostCount}
                            onChange={(e)=>setServiceCostCount(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth disabled={true}
                                   size="small"
                                   name="totalPrice"
                                   type="number"
                                   label="总售价"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setTotalPrice(e.target.value)
                                   }}
                                   value={totalPrice}

                        />
                    </Grid>
                    <Grid item xs>
                        <TextField fullWidth disabled={true}
                                   size="small"
                                   name="totalCost"
                                   type="number"
                                   label="总成本"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setTotalCost(e.target.value)
                                   }}
                                   value={totalCost}

                        />
                    </Grid>
                    <Grid item xs>
                        <TextField fullWidth disabled={true}
                                   size="small"
                                   name="totalProfit"
                                   type="number"
                                   label="毛利润"
                                   variant="outlined"
                                   value={Number(totalPrice-totalCost)}

                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs={4}>
                        <TextField
                            style={{marginTop:8}}
                            fullWidth={true}
                            size="small"
                            select
                            label="销售提成类型"
                            name="salePerfType"
                            type="number"
                            onChange={(e)=>{setSalePerfType(e.target.value)}}
                            value={salePerfType}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            {sysConst.SALE_PERF_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4} style={{display:salePerfTypeFlag==1?'block':"none"}}>
                        <TextField
                            disabled={true}
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="提成金额"
                            value={0}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:salePerfTypeFlag==2?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="固定提成金额"
                            value={salePerfFixed}
                            onChange={(e)=>setSalePerfFixed(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:salePerfTypeFlag==3?'block':"none"}}>
                        <TextField fullWidth disabled={true}
                                   name="totalPrice"
                                   type="number"
                                   label="总售价"
                                   margin="dense"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setTotalPrice(e.target.value)
                                   }}
                                   value={totalPrice}

                        />
                    </Grid>
                    <Grid item xs={4} style={{display:salePerfTypeFlag==3?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="提成比例（%）"
                            value={salePerfRatio}
                            onChange={(e)=>setSalePerfRatio(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:salePerfTypeFlag==4?'block':"none"}}>
                        <TextField fullWidth disabled={true}
                                   name="totalProfit"
                                   type="number"
                                   margin="dense"
                                   label="毛利润"
                                   variant="outlined"
                                   value={Number(totalPrice-totalCost)}

                        />
                    </Grid>
                    <Grid item xs={4} style={{display:salePerfTypeFlag==4?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="提成比例（%）"
                            value={salePerfRatio}
                            onChange={(e)=>setSalePerfRatio(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs={4}>
                        <TextField
                            style={{marginTop:8}}
                            fullWidth={true}
                            size="small"
                            select
                            label="施工提成类型"
                            name="deployPerfType"
                            type="number"
                            onChange={(e)=>{setDeployPerfType(e.target.value)}}
                            value={deployPerfType}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            {sysConst.SALE_PERF_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4} style={{display:deployPerfTypeFlag==1?'block':"none"}}>
                        <TextField
                            disabled={true}
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="提成金额"
                            value={0}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:deployPerfTypeFlag==2?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="固定提成金额"
                            value={deployPerfFixed}
                            onChange={(e)=>setDeployPerfFixed(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:deployPerfTypeFlag==3?'block':"none"}}>
                        <TextField fullWidth disabled={true}
                                   name="totalPrice"
                                   type="number"
                                   label="总售价"
                                   margin="dense"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setTotalPrice(e.target.value)
                                   }}
                                   value={totalPrice}

                        />
                    </Grid>
                    <Grid item xs={4} style={{display:deployPerfTypeFlag==3?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="提成比例（%）"
                            value={deployPerfRatio}
                            onChange={(e)=>setDeployPerfRatio(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:deployPerfTypeFlag==4?'block':"none"}}>
                        <TextField fullWidth disabled={true}
                                   name="totalProfit"
                                   type="number"
                                   margin="dense"
                                   label="毛利润"
                                   variant="outlined"
                                   value={Number(totalPrice-totalCost)}

                        />
                    </Grid>
                    <Grid item xs={4} style={{display:deployPerfTypeFlag==4?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="提成比例（%）"
                            value={deployPerfRatio}
                            onChange={(e)=>setDeployPerfRatio(e.target.value)}
                        />
                    </Grid>

                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs={4}>
                        <TextField
                            style={{marginTop:8}}
                            fullWidth={true}
                            size="small"
                            select
                            label="验收提成类型"
                            name="checkPerfType"
                            type="number"
                            onChange={(e)=>{setCheckPerfType(e.target.value)}}
                            value={checkPerfType}
                            SelectProps={{
                                native: true,
                            }}
                            variant="outlined"
                        >
                            {sysConst.SALE_PERF_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4} style={{display:checkPerfTypeFlag==1?'block':"none"}}>
                        <TextField
                            disabled={true}
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="固定提成金额"
                            value={0}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:checkPerfTypeFlag==2?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="固定提成金额"
                            value={checkPerfFixed}
                            onChange={(e)=>setCheckPerfFixed(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:checkPerfTypeFlag==3?'block':"none"}}>
                        <TextField fullWidth disabled={true}
                                   name="totalPrice"
                                   type="number"
                                   margin="dense"
                                   label="总售价"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setTotalPrice(e.target.value)
                                   }}
                                   value={totalPrice}

                        />
                    </Grid>
                    <Grid item xs={4} style={{display:checkPerfTypeFlag==3?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="提成比例（%）"
                            value={checkPerfRatio}
                            onChange={(e)=>setCheckPerfRatio(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4} style={{display:checkPerfTypeFlag==4?'block':"none"}}>
                        <TextField fullWidth disabled={true}
                                   name="totalProfit"
                                   margin="dense"
                                   type="number"
                                   label="毛利润"
                                   variant="outlined"
                                   value={Number(totalPrice-totalCost)}

                        />
                    </Grid>
                    <Grid item xs={4} style={{display:checkPerfTypeFlag==4?'block':"none"}}>
                        <TextField
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="提成比例（%）"
                            value={checkPerfRatio}
                            onChange={(e)=>setCheckPerfRatio(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth margin="dense" variant="outlined" label="备注"  value={remarks}
                                   onChange={(e) => {
                                       setRemarks(e.target.value)
                                   }}/>
                    </Grid>
                </Grid>
            </SimpleModal>
            {/* 修改服务项目信息 */}
            <SimpleModal
                title= "修改服务项目信息"
                open={modifyModalOpenFlag}
                onClose={modifyModalClose}
                showFooter={true}
                footer={
                    <>
                        {modifyModalOpenFlag==true? <Button variant="contained" onClick={() => {updateServiceSetting()}}  color="primary">
                            确定
                        </Button>:'' }
                        <Button onClick={modifyModalClose} color="primary" autoFocus>
                            关闭
                        </Button>
                    </>
                }
            >
                <TabContext value={value} >
                    <AppBar position="static" color="default">
                        <Tabs value={value}
                              onChange={handleChange}
                              indicatorColor="primary"
                              textColor="primary"
                              variant="fullWidth">
                            <Tab label="基本信息"   value="1" />
                            <Tab label="产品关联"   value="2" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value='1' style={{height:'410px'}}>
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="serviceName"
                                           type="text"
                                           label="服务名称"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               setModifyServiceName(e.target.value)
                                           }}
                                           error={modifyValidation.modifyServiceName && modifyValidation.modifyServiceName!=''}
                                           helperText={modifyValidation.modifyServiceName}
                                           value={modifyServiceName}

                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           select
                                           label="服务类型"
                                           name="modifyServiceType"
                                           type="number"
                                           onChange={(e)=>{
                                               setModifyServiceType(e.target.value)
                                           }}
                                           value={modifyServiceType}
                                           SelectProps={{
                                               native: true,
                                           }}
                                           variant="outlined"
                                >
                                    {sysConst.SERVICE_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs={4}>
                                <TextField style={{marginTop:8}}
                                           fullWidth={true}
                                           size="small"
                                           select
                                           label="服务价格类型"
                                           name="modifyServicePriceType"
                                           type="number"
                                           onChange={(e)=>{ setModifyServicePriceType(e.target.value)}}
                                           value={modifyServicePriceType}
                                           SelectProps={{
                                               native: true,
                                           }}
                                           variant="outlined"
                                >
                                    {sysConst.SERVICE_PRICE_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4}  style={{display:modifyServicePriceFlag?'none':"block"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="固定售价"
                                    value={modifyFixedPrice}
                                    onChange={(e)=>setModifyFixedPrice(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyServicePriceFlag?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="销售单价"
                                    value={modifyUnitPrice}
                                    onChange={(e)=>setModifyUnitPrice(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyServicePriceFlag?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="销售数量"
                                    value={modifyServicePriceCount}
                                    onChange={(e)=>setModifyServicePriceCount(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    style={{marginTop:8}}
                                    fullWidth={true}
                                    size="small"
                                    select
                                    label="服务成本类型"
                                    name="serviceCostType"
                                    type="number"
                                    onChange={(e)=>{setModifyServiceCostType(e.target.value)}}
                                    value={modifyServiceCostType}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="outlined"
                                >
                                    {sysConst.SERVICE_PRICE_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4} style={{display:modifyServiceCostFlag?'none':"block"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="固定成本"
                                    value={modifyFixedCost}
                                    onChange={(e)=>setModifyFixedCost(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyServiceCostFlag?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="成本单价"
                                    value={modifyUnitCost}
                                    onChange={(e)=>setModifyUnitCost(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyServiceCostFlag?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="成本数量"
                                    value={modifyServiceCostCount}
                                    onChange={(e)=>setModifyServiceCostCount(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <TextField fullWidth disabled={true}
                                           size="small"
                                           name="totalPrice"
                                           type="number"
                                           label="总售价"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               setModifyServiceCostCount(e.target.value)
                                           }}
                                           value={modifyTotalPrice}

                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth disabled={true}
                                           size="small"
                                           name="totalCost"
                                           type="number"
                                           label="总成本"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               setModifyTotalCost(e.target.value)
                                           }}
                                           value={modifyTotalCost}

                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth disabled={true}
                                           size="small"
                                           name="totalProfit"
                                           type="number"
                                           label="毛利润"
                                           variant="outlined"
                                           value={Number(modifyTotalPrice-modifyTotalCost)}

                                />
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    style={{marginTop:8}}
                                    fullWidth={true}
                                    size="small"
                                    select
                                    label="销售提成类型"
                                    name="salePerfType"
                                    type="number"
                                    onChange={(e)=>{setModifySalePerfType(e.target.value)}}
                                    value={modifySalePerfType}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="outlined"
                                >
                                    {sysConst.SALE_PERF_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4} style={{display:modifySalePerfTypeFlag==1?'block':"none"}}>
                                <TextField
                                    disabled={true}
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="提成金额"
                                    value={0}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifySalePerfTypeFlag==2?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="固定提成金额"
                                    value={modifySalePerfFixed}
                                    onChange={(e)=>setModifySalePerfFixed(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifySalePerfTypeFlag==3?'block':"none"}}>
                                <TextField fullWidth disabled={true}
                                           name="totalPrice"
                                           margin="dense"
                                           type="number"
                                           label="总售价"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               setModifyServiceCostCount(e.target.value)
                                           }}
                                           value={modifyTotalPrice}

                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifySalePerfTypeFlag==3?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="提成比例（%）"
                                    value={modifySalePerfRatio}
                                    onChange={(e)=>setModifySalePerfRatio(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifySalePerfTypeFlag==4?'block':"none"}}>
                                <TextField fullWidth disabled={true}
                                           name="totalProfit"
                                           type="number"
                                           margin="dense"
                                           label="毛利润"
                                           variant="outlined"
                                           value={Number(modifyTotalPrice-modifyTotalCost)}

                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifySalePerfTypeFlag==4?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="提成比例（%）"
                                    value={modifySalePerfRatio}
                                    onChange={(e)=>setModifySalePerfRatio(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    style={{marginTop:8}}
                                    fullWidth={true}
                                    size="small"
                                    select
                                    label="施工提成类型"
                                    name="deployPerfType"
                                    type="number"
                                    onChange={(e)=>{setModifyDeployPerfType(e.target.value)}}
                                    value={modifyDeployPerfType}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="outlined"
                                >
                                    {sysConst.SALE_PERF_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4} style={{display:modifyDeployPerfTypeFlag==1?'block':"none"}}>
                                <TextField
                                    disabled={true}
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="提成金额"
                                    value={0}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyDeployPerfTypeFlag==2?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="固定提成金额"
                                    value={modifyDeployPerfFixed}
                                    onChange={(e)=>setModifyDeployPerfFixed(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyDeployPerfTypeFlag==3?'block':"none"}}>
                                <TextField fullWidth disabled={true}
                                           name="totalPrice"
                                           type="number"
                                           label="总售价"
                                           margin="dense"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               setModifyServiceCostCount(e.target.value)
                                           }}
                                           value={modifyTotalPrice}

                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyDeployPerfTypeFlag==3?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="提成比例（%）"
                                    value={modifyDeployPerfRatio}
                                    onChange={(e)=>setModifyDeployPerfRatio(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyDeployPerfTypeFlag==4?'block':"none"}}>
                                <TextField fullWidth disabled={true}
                                           name="totalProfit"
                                           type="number"
                                           label="毛利润"
                                           variant="outlined"
                                           margin="dense"
                                           value={Number(modifyTotalPrice-modifyTotalCost)}

                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyDeployPerfTypeFlag==4?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="提成比例（%）"
                                    value={modifyDeployPerfRatio}
                                    onChange={(e)=>setModifyDeployPerfRatio(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    style={{marginTop:8}}
                                    fullWidth={true}
                                    size="small"
                                    select
                                    label="验收提成类型"
                                    name="modifyCheckPerfType"
                                    type="number"
                                    onChange={(e)=>{setModifyCheckPerfType(e.target.value)}}
                                    value={modifyCheckPerfType}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="outlined"
                                >
                                    {sysConst.SALE_PERF_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4} style={{display:modifyCheckPerfTypeFlag==1?'block':"none"}}>
                                <TextField
                                    disabled={true}
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="提成金额"
                                    value={0}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyCheckPerfTypeFlag==2?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="固定提成金额"
                                    value={modifyCheckPerfFixed}
                                    onChange={(e)=>setModifyCheckPerfFixed(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyCheckPerfTypeFlag==3?'block':"none"}}>
                                <TextField fullWidth disabled={true}
                                           name="totalPrice"
                                           type="number"
                                           label="总售价"
                                           margin="dense"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               setModifyServiceCostCount(e.target.value)
                                           }}
                                           value={modifyTotalPrice}

                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyCheckPerfTypeFlag==3?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="提成比例（%）"
                                    value={modifyCheckPerfRatio}
                                    onChange={(e)=>setModifyCheckPerfRatio(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyCheckPerfTypeFlag==4?'block':"none"}}>
                                <TextField fullWidth disabled={true}
                                           name="totalProfit"
                                           type="number"
                                           margin="dense"
                                           label="毛利润"
                                           variant="outlined"
                                           value={Number(modifyTotalPrice-modifyTotalCost)}
                                />
                            </Grid>
                            <Grid item xs={4} style={{display:modifyCheckPerfTypeFlag==4?'block':"none"}}>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="提成比例（%）"
                                    value={modifyCheckPerfRatio}
                                    onChange={(e)=>setModifyCheckPerfRatio(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <TextField fullWidth margin="dense" variant="outlined" label="备注"  value={modifyRemarks}
                                           onChange={(e) => {
                                               setModifyRemarks(e.target.value)
                                           }}/>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value='2' style={{height:'410px'}}>
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth
                                              options={purchaseReducer.productArray}
                                              getOptionLabel={(option) => option.product_name}
                                              value={productArray}
                                              onChange={(event, value)=>setProductArray(value)}
                                              renderInput={(params) => <TextField {...params} label="商品" margin="dense" variant="outlined"
                                                  error={validationProduct.productArray && validationProduct.productArray!=''}
                                                  helperText={validationProduct.productArray}/>}

                                />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth={true}
                                    type='number'
                                    margin="dense"
                                    variant="outlined"
                                    label="数量"
                                    value={productCount}
                                    onChange={(e)=>setProductCount(e.target.value)}
                                    error={validationProduct.productCount && validationProduct.productCount!=''}
                                    helperText={validationProduct.productCount}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton color="primary" edge="start"  size="medium" style={{marginTop:5}}
                                            onClick={() => {addProductItem()}}>
                                    <i className="mdi mdi-plus mdi-24px"/>
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <TableContainer component={Paper} style={{marginTop:20}}>
                                <Table  size='small' aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:50}}>
                                            <StyledTableCell align="center">产品ID</StyledTableCell>
                                            <StyledTableCell align="center">产品名称</StyledTableCell>
                                            <StyledTableCell align="center">数量</StyledTableCell>
                                            <StyledTableCell align="center">操作</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {serviceSettingReducer.serviceSettingRelArray.length > 0 &&serviceSettingReducer.serviceSettingRelArray.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center" >{row.product_id}</TableCell>
                                                <TableCell align="center" >{row.product_name}</TableCell>
                                                <TableCell align="center" >{row.product_count}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="secondary" edge="start" size="small"onClick={() => {deleteRel(row)}}>
                                                        <i className="mdi mdi-delete purple-font margin-left10"> </i>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>))}
                                        {serviceSettingReducer.serviceSettingRelArray.length === 0 &&
                                        <TableRow style={{height:60}}><TableCell align="center" colSpan="4">暂无数据</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </TabPanel>
                </TabContext>
            </SimpleModal>
        </div>
    )
}
const mapStateToProps = (state, ownProps) => {
    return {
        serviceSettingReducer: state.ServiceSettingReducer,
        purchaseReducer:state.PurchaseReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    getProductList:() =>{
        dispatch(PurchaseAction.getProductList());
    },
    getSericeSettingList: (start) => {
        dispatch(ServiceSettingAction.getServiceSettingList(start));
    },
    addServiceSetting:({serviceName,serviceType,servicePriceType,fixedPrice,unitPrice, servicePriceCount,serviceCostType,fixedCost,
                           unitCost,serviceCostCount,totalPrice,totalCost,salePerfType,salePerfFixed,salePerfRatio,deployPerfType,
                           deployPerfFixed,deployPerfRatio,checkPerfType,checkPerfFixed,checkPerfRatio,remarks})=>{
        dispatch(ServiceSettingAction.addServiceSetting({serviceName,serviceType,servicePriceType,fixedPrice,unitPrice, servicePriceCount,serviceCostType,fixedCost,
            unitCost,serviceCostCount,totalPrice,totalCost,salePerfType,salePerfFixed,salePerfRatio,deployPerfType,
            deployPerfFixed,deployPerfRatio,checkPerfType,checkPerfFixed,checkPerfRatio,remarks}));
    },
    updateServiceSettingItem:({modifyId,modifyRemarks,modifyServiceName,modifyServiceType,modifyServicePriceType,modifyFixedPrice,modifyUnitPrice,modifyServicePriceCount,modifyServiceCostType, modifyFixedCost,
                                  modifyUnitCost, modifyServiceCostCount,modifyTotalPrice,modifyTotalCost, modifySalePerfType, modifySalePerfFixed, modifySalePerfRatio, modifyDeployPerfType, modifyDeployPerfFixed, modifyDeployPerfRatio, modifyCheckPerfType, modifyCheckPerfFixed, modifyCheckPerfRatio,
                              })=>{
        dispatch(ServiceSettingAction.updateServiceSettingItem({modifyId,modifyRemarks,modifyServiceName,modifyServiceType,modifyServicePriceType,modifyFixedPrice,modifyUnitPrice,modifyServicePriceCount,modifyServiceCostType, modifyFixedCost,
            modifyUnitCost, modifyServiceCostCount,modifyTotalPrice,modifyTotalCost, modifySalePerfType, modifySalePerfFixed, modifySalePerfRatio, modifyDeployPerfType, modifyDeployPerfFixed, modifyDeployPerfRatio, modifyCheckPerfType, modifyCheckPerfFixed, modifyCheckPerfRatio,
        }))
    },
    addProduct:({productArray,productCount,modifyId,modifyServiceName})=>{
        dispatch(ServiceSettingAction.addProduct({productArray,productCount,modifyId,modifyServiceName}));
    },
    getServiceSettingRelList:(modifyId)=>{
        dispatch(ServiceSettingAction.getServiceSettingRelList(modifyId));
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
                dispatch(ServiceSettingAction.changeStatus(id, status));
            }
        });
    },
    deleteRel:(item)=>{
        dispatch(ServiceSettingAction.deleteRel(item));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(ServiceSetting)

