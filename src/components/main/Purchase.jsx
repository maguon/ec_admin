import React, {useEffect,useState}from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
import {
    Button, Divider, Grid, Typography, Paper, TextField, TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, IconButton, FormControl, InputLabel, Select, MenuItem, Box, Fab, AppBar, Tabs, Tab
} from "@material-ui/core";
import {withStyles,makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {SimpleModal} from '../index';
import {CommonActionType, PurchaseActionType} from '../../types';
import TabPanel from "@material-ui/lab/TabPanel";
import TabContext from "@material-ui/lab/TabContext";
const PurchaseAction = require('../../actions/main/PurchaseAction');
const commonAction = require('../../actions/layout/CommonAction');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
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
    addCategory:{
        marginTop:'8px'
    },
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

//采购
function Purchase (props){
    const {purchaseReducer,getSupplierList,getProductList,getPurchaseList,getPurchaseProductList,downLoadPDF,fromDetail,commonReducer} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [transferCostTypeFlag, setTransferCostTypeFlag] = useState(true);
    const [supplier, setSupplier] = useState("");
    const [transferCost, setTransferCost] = useState("");
    const [transferCostType, setTransferCostType] = useState("");
    const [transferRemark, setTransferRemark] = useState("");
    const [purchaseCountTotal, setPurchaseCountTotal] = useState(0);
    const [validationSupplier,setValidationSupplier] = useState({});
    const [purchaseItem,setPurchaseItem]  = useState([{product:-1,unitCost:0,unitNumber:0,purchaseCount:0,remark:""}])
    const [validation,setValidation] = useState({validateItem:[{product:'',unitCost:'',unitNumber:''}]});
    const [value, setValue] = React.useState('1');
    useEffect(()=>{
        getSupplierList();
        getProductList('1');
        if(transferCostType==2){
            setTransferCostTypeFlag(false)
        }else {
            setTransferCostTypeFlag(true)
            setTransferCost(0);
        }
    },[transferCostType]);
    useEffect(()=>{
        if (!fromDetail) {
            let queryPurchaseObj={
                supplierId:null,
                storageStatus:'-1',
                paymentStatus:'-1',
                status:'-1',
                planDateStart :'',
                planDateEnd:'',
                finishDateStart:'',
                finishDateEnd:''
            };
            let queryProductObj={
                category: null,
                categorySub: null,
                brand: null,
                brandModelId: null,
                productId: null,
                purchaseId:'',
                supplierName:null,
                planDateStart:'',
                planDateEnd:'',
            }
            dispatch(PurchaseActionType.setPurchaseQueryObj(queryPurchaseObj));
            dispatch(PurchaseActionType.setPurchaseQueryParams(queryProductObj));
        }
        getSupplierList();
        getPurchaseList(purchaseReducer.start);

    },[])
    const setPurchaseItemParams = (index,name,value)=>{
        if(name=='product'){
            dispatch(PurchaseActionType.setPurchaseAddObj({index,name:value}))
            purchaseItem[index].product=value;
        }else if(name=='unitCost'){
            dispatch(PurchaseActionType.setPurchaseAddObj({index,name:value}))
            purchaseItem[index].unitCost=value;
            purchaseItem[index].purchaseCount= value*purchaseItem[index].unitNumber;
            let num=0;
            for(let i=0;i<purchaseItem.length;i++){
                num+=purchaseItem[i].purchaseCount
            }
            setPurchaseCountTotal(num);
        }else if(name=='unitNumber'){
            dispatch(PurchaseActionType.setPurchaseAddObj({index,name:value}))
            purchaseItem[index].unitNumber=value;
            purchaseItem[index].purchaseCount=value*purchaseItem[index].unitCost;
            let num=0;
            for(let i=0;i<purchaseItem.length;i++){
                num+=purchaseItem[i].purchaseCount
            }
            setPurchaseCountTotal(num);
        }else if(name=='remark'){
            dispatch(PurchaseActionType.setPurchaseAddObj({index,name:value}))
            purchaseItem[index].remark=value;
        }
    }
    //查询采购列表
    const getPurchaseArray =() =>{
        getPurchaseList(0);
    }
    const getPurchaseProductArray =()=>{
        getPurchaseProductList(0);
    }
    //初始添加模态框值
    const modalOpenPurchase =() =>{
        setValidationSupplier({});
        setModalOpenFlag(true);
        setSupplier('-1');
        setTransferCostType('1');
        setPurchaseCountTotal(0);
        setTransferRemark('');
        setPurchaseItem([{product:-1,unitCost:0,unitNumber:0,purchaseCount:0,remark:""}]);
        setValidation({validateItem:[{product:'',unitCost:'',unitNumber:''}]});
    }
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
    };
    //验证()
    const validate = (index)=>{
        let errors = 0;
        const validateObj ={};
        if (supplier=='-1'||supplier==''||supplier==null) {
            validateObj.supplier ='请输入供应商';
            errors++;
        }
        for(let i=0;i<index;i++){
            validation.validateItem[i].product='';
            validation.validateItem[i].unitCost='';
            validation.validateItem[i].unitNumber='';
            if(purchaseItem[i].product=='-1'||purchaseItem[i].product==''||purchaseItem[i].product==null){
                validation.validateItem[i].product='请输入商品';
                errors++;
            }
            if(!purchaseItem[i].unitCost){
                validation.validateItem[i].unitCost='请输入商品单价';
                errors++;
            }
            if (!purchaseItem[i].unitNumber) {
                validation.validateItem[i].unitNumber ='请输入商品数量';
                errors++;

            }
        }

        setValidationSupplier(validateObj);
        setValidation({...validation});
        return errors
    }
    //添加采购
    const addPurchase= ()=>{
        const errorCount = validate(purchaseItem.length);
        if(errorCount==0){
            setModalOpenFlag(false);
            setPurchaseItem([{product:-1,unitCost:0,unitNumber:0,purchaseCount:0,remark:""}]);
            setValidation({validateItem:[{product:'',unitCost:'',unitNumber:''}]});
            props.addPurchaseInfo(supplier,purchaseItem,transferCostType,transferCost,transferRemark);
        }
    }
    const addCategoryItem = () =>{
        let tmpArray =[...purchaseItem,{product:-1,unitCost:0,unitNumber:0,purchaseCount:0,remark:""}];
        const errorCount = validate(tmpArray.length-1);
        if(errorCount==0){
            setPurchaseItem(tmpArray);
            validation.validateItem.push({product:'',unitCost:'',unitNumber:''});
        }
    }
    const deleteItem =(index,item) =>{
      let tep=purchaseItem.filter(e=>e!=item)
      setPurchaseItem(tep);
    }
    const changeTab = (event, newValue) => {
        setValue(newValue);
        if(newValue=='1'){
            getPurchaseArray()
        }
        if(newValue=='2'){
            props.getBaseSelectList();
            getPurchaseProductArray()
        }
    };
    //上一页
    const getPreSupplierList = () => {
            getPurchaseList(purchaseReducer.start-(purchaseReducer.size-1));
    };
    //下一页
    const getNextSupplierList = () => {
        getPurchaseList(purchaseReducer.start+(purchaseReducer.size-1));
    };
    const getPreProductList= () =>{
        getPurchaseProductList(purchaseReducer.productData.start-(purchaseReducer.productData.size-1));
    }
    const getNextProductList  = () =>{
        getPurchaseProductList(purchaseReducer.productData.start+(purchaseReducer.productData.size-1));
    }
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>采购</Typography>
            <Divider light className={classes.pageDivider}/>
            <TabContext value={value}>
                <AppBar position="static" color="default">
                    <Tabs value={value}
                          onChange={changeTab}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth">
                        <Tab label="采购单"   value="1" />
                        <Tab label="商品"   value="2" />
                    </Tabs>
                </AppBar>
                <TabPanel value='1'>
                    {/*查询条件*/}
                    <Grid container  spacing={1}>
                        <Grid container item xs={10} spacing={1}>
                            {/*供应商名称*/}
                            <Grid item xs={3}>
                                <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth
                                              id="condition-category"
                                              options={purchaseReducer.supplierArray}
                                              getOptionLabel={(option) => option.supplier_name}
                                              value={purchaseReducer.queryPurchaseObj.supplierId}
                                              onChange={(e,value) => {
                                                  dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "supplierId", value: value}));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="供应商名称" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl variant="outlined" fullWidth={true} margin="dense">
                                    <InputLabel id="status-select-outlined-label">仓储状态</InputLabel>
                                    <Select
                                        label="仓储状态"
                                        labelId="status-select-outlined-label"
                                        id="status-select-outlined"
                                        value={purchaseReducer.queryPurchaseObj.storageStatus}
                                        onChange={(e, value) => {
                                            dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "storageStatus", value: e.target.value}));
                                        }}
                                    >
                                        <MenuItem  key={-1} value='-1'>请选择</MenuItem>
                                        {sysConst.STORAGE_STATUS.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl variant="outlined" fullWidth={true} margin="dense">
                                    <InputLabel id="status-select-outlined-label">支付状态</InputLabel>
                                    <Select
                                        label="支付状态"
                                        labelId="status-select-outlined-label"
                                        id="status-select-outlined"
                                        value={purchaseReducer.queryPurchaseObj.paymentStatus}
                                        onChange={(e, value) => {
                                            dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "paymentStatus", value: e.target.value}));
                                        }}
                                    >
                                        <MenuItem key={-1} value='-1'>请选择</MenuItem>
                                        {sysConst.PAYMENT_STATUS.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl variant="outlined" fullWidth={true} margin="dense">
                                    <InputLabel id="status-select-outlined-label">采购状态</InputLabel>
                                    <Select
                                        label="采购状态"
                                        labelId="status-select-outlined-label"
                                        id="status-select-outlined"
                                        value={purchaseReducer.queryPurchaseObj.status}
                                        onChange={(e, value) => {
                                            dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "status", value: e.target.value}));
                                        }}
                                    >
                                        <MenuItem key={-1} value='-1'>请选择</MenuItem>
                                        {sysConst.PURCHASE_STATUS.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* 计划开始时间*/}
                            <Grid item  xs={3}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="开始日期（始）"
                                            value={purchaseReducer.queryPurchaseObj.planDateStart=="" ? null :purchaseReducer.queryPurchaseObj.planDateStart}
                                            onChange={(date) => {
                                                dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "planDateStart", value:date}));
                                            }}
                                />
                            </Grid>
                            <Grid item  xs={3}>

                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="开始日期(终)"
                                            value={purchaseReducer.queryPurchaseObj.planDateEnd=="" ? null :purchaseReducer.queryPurchaseObj.planDateEnd}
                                            onChange={(date) => {
                                                dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "planDateEnd", value: date}));
                                            }}
                                />
                            </Grid>
                            {/*完成时间*/}
                            <Grid item  xs={3}>

                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="完成日期(始)"
                                            value={purchaseReducer.queryPurchaseObj.finishDateStart=="" ? null :purchaseReducer.queryPurchaseObj.finishDateStart}
                                            onChange={(date) => {
                                                dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "finishDateStart", value: date}));
                                            }}
                                />
                            </Grid>
                            <Grid item  xs={3}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="完成日期(终)"
                                            value={purchaseReducer.queryPurchaseObj.finishDateEnd=="" ? null :purchaseReducer.queryPurchaseObj.finishDateEnd}
                                            onChange={(date) => {
                                                dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "finishDateEnd", value: date}));
                                            }}
                                />
                            </Grid>
                        </Grid>
                        {/*查询按钮*/}
                        <Grid item xs={1} align="center">
                            <Fab size="small" color="primary" aria-label="add"  onClick={() => {getPurchaseArray()}} style={{marginTop: 40}}>
                                <i className="mdi mdi-magnify mdi-24px"/>
                            </Fab>
                        </Grid>
                        {/*添加按钮*/}
                        <Grid item xs={1} align="center">
                            <Fab size="small" color="primary" aria-label="add" onClick={()=>{modalOpenPurchase()}} style={{marginTop: 40}}>
                                <i className="mdi mdi-plus mdi-24px" />
                            </Fab>
                        </Grid>
                        {/*主体*/}
                        <Grid container spacing={2}>
                            <TableContainer component={Paper} style={{marginTop:20}}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:50}}>
                                            <StyledTableCell align="center">ID</StyledTableCell>
                                            <StyledTableCell align="center">供应商</StyledTableCell>
                                            <StyledTableCell align="center">开始时间</StyledTableCell>
                                            <StyledTableCell align="center">结束时间</StyledTableCell>
                                            <StyledTableCell align="center">仓储状态</StyledTableCell>
                                            <StyledTableCell align="center">支付状态</StyledTableCell>
                                            <StyledTableCell align="center">支付时间</StyledTableCell>
                                            <StyledTableCell align="center">运费</StyledTableCell>
                                            <StyledTableCell align="center">商品金额</StyledTableCell>
                                            <StyledTableCell align="center">总价</StyledTableCell>
                                            <StyledTableCell align="center">状态</StyledTableCell>
                                            <StyledTableCell align="center">操作</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {purchaseReducer.purchaseArray.length > 0 &&purchaseReducer.purchaseArray.map((row) => (
                                            <TableRow key={'purchase-'+row.id}>
                                                <TableCell align="center" >{row.id}</TableCell>
                                                <TableCell align="center" >{row.supplier_name}</TableCell>
                                                <TableCell align="center" >{row.plan_date_id}</TableCell>
                                                <TableCell align="center" >{row.finish_date_id}</TableCell>
                                                <TableCell align="center" >{commonUtil.getJsonValue(sysConst.STORAGE_STATUS, row.storage_status)}</TableCell>
                                                <TableCell align="center" >{commonUtil.getJsonValue(sysConst.PAYMENT_STATUS, row.payment_status)}</TableCell>
                                                <TableCell align="center" >{row.payment_date_id}</TableCell>
                                                <TableCell align="center" >{row.transfer_cost}</TableCell>
                                                <TableCell align="center" >{row.product_cost}</TableCell>
                                                <TableCell align="center" >{row.total_cost}</TableCell>
                                                <TableCell align="center" >{commonUtil.getJsonValue(sysConst.PURCHASE_STATUS, row.status)}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="primary" edge="start"  size="small" onClick={()=>{downLoadPDF(row)}}>
                                                        <i className="mdi mdi-file-pdf"/>
                                                    </IconButton>
                                                    {/* 详情按钮*/}
                                                    <IconButton color="primary" edge="start"  size="small">
                                                        <Link to={{pathname: '/purchase/' + row.id}}>
                                                            <i className="mdi mdi-table-search purple-font margin-left10"> </i>
                                                        </Link>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>))}
                                        {purchaseReducer.purchaseArray.length === 0 &&
                                        <TableRow style={{height:60}}><TableCell align="center" colSpan="12">暂无数据</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    {/* 上下页按钮 */}
                    <Box style={{textAlign: 'right', marginTop: 20}}>
                        {purchaseReducer.dataSize >=purchaseReducer.size &&
                        <Button className={classes.button} variant="contained" color="primary"  onClick={getNextSupplierList}>
                            下一页
                        </Button>}
                        {purchaseReducer.start > 0 &&purchaseReducer.dataSize > 0 &&
                        <Button className={classes.button} variant="contained" color="primary" onClick={getPreSupplierList}>
                            上一页
                        </Button>}
                    </Box>
                </TabPanel>
                <TabPanel value='2'>
                    {/* 上部分：检索条件输入区域 */}
                    <Grid container spacing={1}>
                        <Grid container item xs={11} spacing={1}>
                            <Grid item xs={3}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.categoryList}
                                              getOptionLabel={(option) => option.category_name}
                                              value={purchaseReducer.queryParams.categoryId}
                                              onChange={(event, value) => {
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "categoryId", value: value}));
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "categorySubId", value: null}));
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "productId", value: null}));
                                                  dispatch(PurchaseAction.getProductList('2'));
                                                  if (value != null) {
                                                      dispatch(commonAction.getCategorySubList(value.id));
                                                  } else {
                                                      dispatch(CommonActionType.setCategorySubList([]));
                                                  }
                                              }}
                                              renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.categorySubList}
                                              noOptionsText="无选项"
                                              getOptionLabel={(option) => option.category_sub_name}
                                              value={purchaseReducer.queryParams.categorySubId}
                                              onChange={(event, value) => {
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "categorySubId", value: value}));
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "productId", value: null}));
                                                  dispatch(PurchaseAction.getProductList('2'));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.brandList}
                                              getOptionLabel={(option) => option.brand_name}
                                              value={purchaseReducer.queryParams.brandId}
                                              onChange={(event, value) => {
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "brandId", value: value}));
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "brandModelId", value: null}));
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "productId", value: null}));
                                                  dispatch(PurchaseAction.getProductList('2'));
                                                  // 品牌有选择时，取得品牌型号， 否则清空
                                                  if (value != null) {
                                                      dispatch(commonAction.getBrandModelList(value.id));
                                                  } else {
                                                      dispatch(CommonActionType.setBrandModelList([]));
                                                  }
                                              }}
                                              renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.brandModelList}
                                              noOptionsText="无选项"
                                              getOptionLabel={(option) => option.brand_model_name}
                                              value={purchaseReducer.queryParams.brandModelId}
                                              onChange={(event, value) => {
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "brandModelId", value: value}));
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "productId", value: null}));
                                                  dispatch(PurchaseAction.getProductList('2'));

                                              }}
                                              renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }}
                                              options={purchaseReducer.productListArray}
                                              getOptionLabel={(option) => option.product_name}
                                              onChange={(event, value) => {
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "productId", value: value}));
                                              }}
                                              value={purchaseReducer.queryParams.productId}
                                              renderInput={(params) => <TextField {...params} label="商品名称" margin="dense" variant="outlined"/>}
                                />
                            </Grid>


                            {/*采购单号*/}
                            <Grid item xs={3}>
                                <TextField label="采购单号" fullWidth={true} margin="dense" variant="outlined"  type="number"  value={purchaseReducer.queryParams.purchaseId}
                                           onChange={(e, value) => {
                                               dispatch(PurchaseActionType.setPurchaseQueryParam({name: "purchaseId", value: e.target.value}));
                                           }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }}
                                              options={purchaseReducer.supplierArray}
                                              getOptionLabel={(option) => option.supplier_name}
                                              onChange={(e, value) => {
                                                  dispatch(PurchaseActionType.setPurchaseQueryParam({name: "supplierId", value: value}));
                                              }}
                                              value={purchaseReducer.queryParams.supplierId}
                                              renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                            format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="开始日期（始）"
                                            value={purchaseReducer.queryParams.planDateStart == "" ? null : purchaseReducer.queryParams.planDateStart}
                                            onChange={(date) => {
                                                dispatch(PurchaseActionType.setPurchaseQueryParam({name: "planDateStart", value: date}));
                                            }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                            format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="开始日期（终）"
                                            value={purchaseReducer.queryParams.planDateEnd == "" ? null : purchaseReducer.queryParams.planDateEnd}
                                            onChange={(date) => {
                                                dispatch(PurchaseActionType.setPurchaseQueryParam({name: "planDateEnd", value: date}));
                                            }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={1} align="right">
                            {/*查询按钮*/}
                            <Fab color="primary" size="small" onClick={()=>{getPurchaseProductArray()}} style={{marginTop: 40}}>
                                <i className="mdi mdi-magnify mdi-24px"/>
                            </Fab>
                        </Grid>
                        {/*主体*/}
                        <Grid container spacing={2}>
                            <TableContainer component={Paper} style={{marginTop:20}}>
                                <Table stickyHeader size={"small"}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                                            <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                                            <TableCell className={classes.tableHead} align="center">商品</TableCell>
                                            <TableCell className={classes.tableHead} align="center">单价</TableCell>
                                            <TableCell className={classes.tableHead} align="center">采购数量</TableCell>
                                            <TableCell className={classes.tableHead} align="center">总成本</TableCell>
                                            <TableCell className={classes.tableHead} align="center">采购日期</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {purchaseReducer.productData.purchaseProductList.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center">{row.purchase_id}</TableCell>
                                                <TableCell align="center">{row.supplier_name}</TableCell>
                                                <TableCell align="center">{row.product_name}</TableCell>
                                                <TableCell align="center">{row.unit_cost}</TableCell>
                                                <TableCell align="center">{row.purchase_count}</TableCell>
                                                <TableCell align="center">{row.total_cost}</TableCell>
                                                <TableCell align="center">{commonUtil.getDate(row.created_on)}</TableCell>
                                            </TableRow>
                                        ))}

                                        {purchaseReducer.productData.purchaseProductList.length === 0 &&
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">暂无数据</TableCell>
                                        </TableRow>}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>

                    {/* 上下页按钮 */}
                    <Box style={{textAlign: 'right', marginTop: 20}}>
                        {purchaseReducer.productData.dataSize >=purchaseReducer.productData.size &&
                        <Button className={classes.button} variant="contained" color="primary"  onClick={getNextProductList}>
                            下一页
                        </Button>}
                        {purchaseReducer.productData.start > 0 &&purchaseReducer.productData.dataSize > 0 &&
                        <Button className={classes.button} variant="contained" color="primary" onClick={getPreProductList}>
                            上一页
                        </Button>}
                    </Box>
                </TabPanel>
            </TabContext>


            {/*模态框*/}
            <SimpleModal
                maxWidth="md"
                maxHeight="md"
                title="新增采购信息"
                open={modalOpenFlag}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" onClick={addPurchase} color="primary">
                            确定
                        </Button>
                        <Button onClick={modalClose} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                {/*供应商选择*/}
                <Grid  container spacing={3}>
                    <Grid item xs={2}>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }}
                                      options={purchaseReducer.supplierArray}
                                      getOptionLabel={(option) => option.supplier_name}
                                      onChange={(e,value)=>setSupplier(value)}
                                      value={supplier}
                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"
                                                                          error={validationSupplier.supplier&&validationSupplier.supplier!=''}
                                                                          helperText={validationSupplier.supplier}/>}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField className={classes.selectCondition}
                                   select
                                   margin="dense"
                                   label="运费类型"
                                   value={transferCostType}
                                   onChange={(e)=>setTransferCostType(e.target.value)}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {sysConst.TRANSFER_COST_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            step="0.01"
                            fullWidth={true}
                            disabled={transferCostTypeFlag}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="运费"
                            value={transferCost>9999999.99?0:transferCost<0?0:transferCost}
                            onChange={(e)=>setTransferCost(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            disabled={true}
                            fullWidth={true}
                            type='number'
                            margin="dense"
                            variant="outlined"
                            label="总价"
                            value={Number(transferCost>9999999.99?0:transferCost<0?0:transferCost)+Number(purchaseCountTotal)}
                        />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}  align="center" className={classes.addCategory}>
                        <Fab size="small" color="primary" aria-label="add" onClick={addCategoryItem}>
                            <i className="mdi mdi-plus mdi-24px" />
                        </Fab>
                    </Grid>
                </Grid>
                {/*商品选择*/}
                {purchaseItem.map((item,index)=>(
                    <Grid  container spacing={3} key={'purchaseItem-'+index}>
                        <Grid item xs={2}>
                            <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }}
                                          options={purchaseReducer.productArray}
                                          getOptionLabel={(option) => option.product_name}
                                          onChange={(e,value)=>setPurchaseItemParams(index,'product',value)}
                                          value={item.product}
                                          renderInput={(params) => <TextField {...params} label="商品" margin="dense" variant="outlined"
                                                                              error={validation.validateItem[index].product!=''}
                                                                              helperText={validation.validateItem[index].product}/>}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth={true}
                                type='number'
                                margin="dense"
                                variant="outlined"
                                label="商品单价"
                                value={item.unitCost}
                                onChange={(e)=>setPurchaseItemParams(index,'unitCost',e.target.value)}
                                error={validation.validateItem[index].unitCost!=''}
                                helperText={validation.validateItem[index].unitCost}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth={true}
                                type='number'
                                margin="dense"
                                variant="outlined"
                                label="商品数量"
                                value={item.unitNumber}
                                onChange={(e)=>setPurchaseItemParams(index,'unitNumber',e.target.value)}
                                error={validation.validateItem[index].unitNumber!=''}
                                helperText={validation.validateItem[index].unitNumber}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                disabled={true}
                                type='number'
                                fullWidth={true}
                                margin="dense"
                                variant="outlined"
                                label="商品总价"
                                value={item.purchaseCount}
                                onChange={(e)=>setPurchaseItemParams(index,'purchaseCount',e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth={true}
                                margin="dense"
                                variant="outlined"
                                label="备注"
                                value={item.remark}
                                onChange={(e)=>setPurchaseItemParams(index,'remark',e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={2} align='center'>
                            <IconButton color="secondary" edge="start" size="small"  style={{paddingTop:'18px'}} onClick={()=>{deleteItem(index,item)}}>
                                <i className="mdi mdi-delete purple-font"> </i>
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                {/*运费*/}
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="备注"
                            value={transferRemark}
                            onChange={(e)=>setTransferRemark(e.target.value)}
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
        purchaseReducer: state.PurchaseReducer,
        commonReducer: state.CommonReducer,
        fromDetail: fromDetail
    }
};
const mapDispatchToProps = (dispatch) => ({
    //获取列表
    getPurchaseList: (start) => {
        dispatch(PurchaseAction.getPurchaseList(start))
    },
    getPurchaseProductList: (start) => {
        dispatch(PurchaseAction.getPurchaseProductList(start))
    },
    //获取供应商
    getSupplierList:() =>{
        dispatch(PurchaseAction.getSupplierList())
    },
    //获取商品
    getProductList:(value) =>{
        dispatch(PurchaseAction.getProductList(value))
    },
    //添加商品
    addPurchaseInfo:(supplier,purchaseItem,transferCostType,transferCost,transferRemark) =>{
        dispatch(PurchaseAction.addPurchaseInfo(supplier,purchaseItem,transferCostType,transferCost,transferRemark))
    },
    downLoadPDF: (purchaseInfo) => {
        dispatch(PurchaseActionType.setPurchasePdfData(purchaseInfo));
        dispatch(PurchaseAction.downLoadPDF(purchaseInfo,null,purchaseInfo.supplier_name));
    },
     getBaseSelectList: () => {
         dispatch(commonAction.getCategoryList());
         dispatch(commonAction.getBrandList());
     },
});
export default connect(mapStateToProps, mapDispatchToProps)(Purchase)