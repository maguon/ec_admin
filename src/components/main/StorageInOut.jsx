import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {
    AppBar,
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from "@material-ui/pickers";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import TabContext from "@material-ui/lab/TabContext";
import Alert from '@material-ui/lab/Alert';
// 引入Dialog
import {SimpleModal} from "../index";
import {CommonActionType, OrderActionType, StorageInOutActionType} from "../../types";

const storageInOutAction = require('../../actions/main/StorageInOutAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead: customTheme.tableHead,
}));

// 修改MuiAlert组件 的【.MuiAlert-message】样式
const useStyle = makeStyles({
    message:{width: '100%'}
}, { name: 'MuiAlert' });

function StorageInOut(props) {
    const {storageInOutReducer, commonReducer, downLoadCsv} = props;
    const classes = useStyles();
    useStyle();
    const dispatch = useDispatch();

    useEffect(() => {
        // 采购入库
        let purchaseParams = {
            storageStatus: '',
            storage: null,
            storageArea: null,
            supplier: null,
            purchaseId: '',
            productId: ''
        };
        dispatch(StorageInOutActionType.setPurchaseParams(purchaseParams));
        // 退货出库
        let refundParams = {
            refundStorageFlag: '',
            paymentStatus: '',
            transferCostType: '',
            supplier: null,
            purchaseId: '',
            productId: ''
        };
        dispatch(StorageInOutActionType.setRefundParams(refundParams));
        // 订单出库
        let orderOutParams = {
            orderItemStatus: '',
            orderId: '',
            reUser: '',
            orderDateStart: '',
            orderDateEnd: '',
            productId: '',
            supplier: null,
            storage: null,
            storageArea: null,
        };
        dispatch(StorageInOutActionType.setOrderOutParams(orderOutParams));

        // 出入库
        let storageParams = {
            storageType: '',
            storageSubType: '',
            storage: null,
            storageArea: null,
            supplier: null,
            purchaseId: '',
            productId: '',
            dateIdStart: '',
            dateIdEnd: '',
        };
        dispatch(StorageInOutActionType.setStorageProductDetailParams(storageParams));

        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        dispatch(storageInOutAction.getPurchaseItemStorage(0))
    }, []);

    // TAB 页面 TODO 加1个TAB，退单入库，订单出库，  出入库 TAB 加按钮 弹出 modal，领料出库，退料入库
    const [tabValue, setTabValue] = React.useState('orderOut');
    const changeTab = (event, newValue) => {
        setTabValue(newValue);
        switch (newValue) {
            case "purchase":
                if (storageInOutReducer.purchaseParams.storage != null) {
                    props.getStorageAreaList(storageInOutReducer.purchaseParams.storage.id);
                } else {
                    props.setStorageAreaList([]);
                }
                dispatch(storageInOutAction.getPurchaseItemStorage(0));
                break;
            case "refund":
                dispatch(storageInOutAction.getPurchaseRefund(0));
                break;
            case "orderOut":
                dispatch(storageInOutAction.getOrderItemProdStorage(0));
                break;
            case "storage":
                if (storageInOutReducer.storageProductDetailParams.storage != null) {
                    props.getStorageAreaList(storageInOutReducer.storageProductDetailParams.storage.id);
                } else {
                    props.setStorageAreaList([]);
                }
                dispatch(storageInOutAction.getStorageProductRelDetailList(0));
                break;
            default:
                break;
        }
    };

    /** 采购入库 TAB */

    // 模态属性
    const [purchaseModalOpen, setPurchaseModalOpen] = React.useState(false);
    // 模态数据
    const [purchaseModalData, setPurchaseModalData] = React.useState({purchaseItem:{}});
    // 模态校验
    const [validation,setValidation] = useState({});

    // 关闭模态
    const closePurchaseModal = () => {
        if (storageInOutReducer.purchaseParams.storage != null) {
            props.getStorageAreaList(storageInOutReducer.purchaseParams.storage.id);
        } else {
            props.setStorageAreaList([]);
        }
        setPurchaseModalOpen(false);
    };

    // 采购入库 TAB: 采购商品入库
    const initPurchaseModal =(item) =>{
        // 清空仓库分区
        props.setStorageAreaList([]);
        // 根据purchase_item_id 取得退货信息
        dispatch(storageInOutAction.getPurchaseItemRefund(item.purchase_item_id));
        // 清check内容
        setValidation({});
        // 页面属性
        setPurchaseModalData({purchaseItem:item,storage:null,storageArea:null,productCnt:'',remark:''});
        // 设定模态打开
        setPurchaseModalOpen(true);
    };

    const submitPurchaseModal= ()=>{
        const validateObj ={};
        if (!purchaseModalData.storage) {
            validateObj.storage ='请选择仓库';
        }
        if (!purchaseModalData.storageArea) {
            validateObj.storageArea ='请选择仓库分区';
        }
        if (!purchaseModalData.productCnt) {
            validateObj.productCnt ='请输入入库数';
        } else if (purchaseModalData.productCnt > purchaseModalData.purchaseItem.purchase_count) {
            validateObj.productCnt ='入库数不能比采购数量大';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            setPurchaseModalOpen(false);
            dispatch(storageInOutAction.putInStorage(purchaseModalData));
            if (storageInOutReducer.purchaseParams.storage != null) {
                props.getStorageAreaList(storageInOutReducer.purchaseParams.storage.id);
            } else {
                props.setStorageAreaList([]);
            }
        }
    };

    /** 订单出库 TAB */
    const [orderOutModalOpen, setOrderOutModalOpen] = React.useState(false);
    const [orderOutModalData, setOrderOutModalData] = React.useState({orderItem:{}});
    const initOrderOutModal = (item, pageType) => {
        // 清check内容
        setValidation({});
        setOrderOutModalData({pageType:pageType,orderItem:item,storageProduct:null,reUser:null,remark:''});
        // 取得库存商品信息
        if (pageType === 'info') {
            dispatch(storageInOutAction.getOrderOutModalDataList(item.id))
        } else {
            dispatch(storageInOutAction.getStorageProduct(item.prod_id))
        }
        // 设定模态打开
        setOrderOutModalOpen(true);
    };

    const submitOrderOutModal= ()=>{
        const validateObj ={};
        if (!orderOutModalData.reUser) {
            validateObj.reUser ='请选择领用人';
        }
        if (!orderOutModalData.storageProduct) {
            validateObj.storageProduct ='请选择库存商品';
        }else if (orderOutModalData.storageProduct.storage_count < orderOutModalData.orderItem.prod_count) {
            validateObj.storageProduct ='库存商品数量小于订单商品数量，不能出库';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            dispatch(storageInOutAction.outOrderProduct(orderOutModalData));
            setOrderOutModalOpen(false);
        }
    };

    /** 退货出库 TAB */
    const [refundModalOpen, setRefundModalOpen] = React.useState(false);
    const [refundModalData, setRefundModalData] = React.useState({purchaseRefund:{}});
    const initRefundModal = (item, pageType) => {
        // 清check内容
        setValidation({});
        setRefundModalData({...refundModalData,pageType:pageType,purchaseRefund:item,storageProduct:null,remark:''});
        // 取得库存商品信息
        if (pageType === 'info') {
            dispatch(storageInOutAction.getStorageProductRelDetail(item.storage_rel_id))
        } else {
            dispatch(storageInOutAction.getStorageProductRel(item.purchase_item_id))
        }
        // 设定模态打开
        setRefundModalOpen(true);
    };

    const submitRefundModal= ()=>{
        const validateObj ={};
        if (!refundModalData.storageProduct) {
            validateObj.storageProduct ='请选择库存商品';
        }else if (refundModalData.storageProduct.storage_count < refundModalData.purchaseRefund.refund_count) {
            validateObj.storageProduct ='库存商品数量小于退货数量，不能退货';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            dispatch(storageInOutAction.refundStorage(refundModalData));
            setRefundModalOpen(false);
        }
    };

    /** 出入库 TAB */
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalData, setModalData] = React.useState({purchaseRefund:{}});
    const initModal = (item, pageType) => {
        // 清check内容
        setValidation({});
        setRefundModalData({...refundModalData,pageType:pageType,purchaseRefund:item,storageProduct:null,remark:''});
        // 取得库存商品信息
        if (pageType === 'info') {
            dispatch(storageInOutAction.getStorageProductRelDetail(item.storage_rel_id))
        } else {
            dispatch(storageInOutAction.getStorageProductRel(item.purchase_item_id))
        }
        // 设定模态打开
        setRefundModalOpen(true);
    };

    const submitModal= ()=>{
        const validateObj ={};
        if (!refundModalData.storageProduct) {
            validateObj.storageProduct ='请选择库存商品';
        }else if (refundModalData.storageProduct.storage_count < refundModalData.purchaseRefund.refund_count) {
            validateObj.storageProduct ='库存商品数量小于退货数量，不能退货';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            dispatch(storageInOutAction.refundStorage(refundModalData));
            setRefundModalOpen(false);
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>出入库</Typography>
            <Divider light className={classes.divider}/>

            <TabContext value={tabValue}>
                <AppBar position="static" color="default">
                    <TabList onChange={changeTab} indicatorColor="primary" variant="fullWidth" textColor="primary">
                        <Tab label="采购入库" value="purchase" />
                        <Tab label="退货出库" value="refund" />
                        <Tab label="订单出库" value="orderOut" />
                        <Tab label="出入库" value="storage" />
                    </TabList>
                </AppBar>

                {/* 采购入库 */}
                <TabPanel value="purchase">
                    <Grid container spacing={3}>
                        <Grid container item xs={11} spacing={1}>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>仓储状态</InputLabel>
                                    <Select label="仓储状态"
                                            value={storageInOutReducer.purchaseParams.storageStatus}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setPurchaseParam({name: "storageStatus", value: e.target.value}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {sysConst.STORAGE_STATUS.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.storageList} getOptionLabel={(option) => option.storage_name}
                                              onChange={(event, value) => {
                                                  // 选择时 将当前选中值 赋值 reducer
                                                  dispatch(StorageInOutActionType.setPurchaseParam({name: "storage", value: value}));
                                                  // 清空 子分类
                                                  dispatch(StorageInOutActionType.setPurchaseParam({name: "storageArea", value: null}));
                                                  // 根据选择内容，刷新 子分类 列表
                                                  if (value != null) {
                                                      dispatch(commonAction.getStorageAreaList(value.id));
                                                  } else {
                                                      dispatch(CommonActionType.setStorageAreaList([]));
                                                  }
                                              }}
                                              value={storageInOutReducer.purchaseParams.storage}
                                              renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.storageAreaList} getOptionLabel={(option) => option.storage_area_name}
                                              noOptionsText="无选项"
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setPurchaseParam({name: "storageArea", value: value}));
                                              }}
                                              value={storageInOutReducer.purchaseParams.storageArea}
                                              renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.supplierList} getOptionLabel={(option) => option.supplier_name}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setPurchaseParam({name: "supplier", value: value}));
                                              }}
                                              value={storageInOutReducer.purchaseParams.supplier}
                                              renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="采购单ID" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.purchaseParams.purchaseId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setPurchaseParam({name: "purchaseId", value: e.target.value}))}}/>
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="商品ID" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.purchaseParams.productId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setPurchaseParam({name: "productId", value: e.target.value}))}}/>
                            </Grid>
                        </Grid>

                        {/*查询按钮*/}
                        <Grid item xs={1} style={{textAlign:'right'}}>
                            <Fab color="primary" size="small" onClick={()=>{dispatch(storageInOutAction.getPurchaseItemStorage(0))}}>
                                <i className="mdi mdi-magnify mdi-24px"/>
                            </Fab>
                        </Grid>
                    </Grid>

                    {/* 下部分：检索结果显示区域 */}
                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                                    <TableCell className={classes.tableHead} align="center">商品</TableCell>
                                    <TableCell className={classes.tableHead} align="center">数量</TableCell>
                                    <TableCell className={classes.tableHead} align="center">单价</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库分区</TableCell>
                                    <TableCell className={classes.tableHead} align="center">库存</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storageInOutReducer.purchaseItemStorage.dataList.map((row, index) => (
                                    <TableRow key={'purchase-item-storage-' + index}>
                                        <TableCell align="center">{row.purchase_id}</TableCell>
                                        <TableCell align="center">{row.supplier_name}</TableCell>
                                        <TableCell align="center">{row.product_name}</TableCell>
                                        <TableCell align="center">{row.purchase_count}</TableCell>
                                        <TableCell align="center">{row.unit_cost}</TableCell>
                                        <TableCell align="center">{row.storage_name}</TableCell>
                                        <TableCell align="center">{row.storage_area_name}</TableCell>
                                        <TableCell align="center">{row.storage_count}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="primary" size="small" edge="start" onClick={() => {initPurchaseModal(row)}}
                                                        disabled={row.storage_status === sysConst.STORAGE_STATUS[1].value}>
                                                <i className="mdi mdi-login"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {storageInOutReducer.purchaseItemStorage.dataList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={8} align="center">暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 上下页按钮 */}
                    <Box style={{textAlign: 'right', marginTop: 20}}>
                        {storageInOutReducer.purchaseItemStorage.start > 0 && storageInOutReducer.purchaseItemStorage.dataSize > 0 &&
                        <Button variant="contained" color="primary" style={{marginRight: 20}}
                                onClick={()=>{dispatch(storageInOutAction.getPurchaseItemStorage(storageInOutReducer.purchaseItemStorage.start-(storageInOutReducer.purchaseItemStorage.size-1)))}}>上一页</Button>}
                        {storageInOutReducer.purchaseItemStorage.dataSize >= storageInOutReducer.purchaseItemStorage.size &&
                        <Button variant="contained" color="primary"
                                onClick={()=>{dispatch(storageInOutAction.getPurchaseItemStorage(storageInOutReducer.purchaseItemStorage.start+(storageInOutReducer.purchaseItemStorage.size-1)))}}>下一页</Button>}
                    </Box>

                    <SimpleModal maxWidth={'md'}
                        title="采购商品入库"
                        open={purchaseModalOpen}
                        onClose={closePurchaseModal}
                        showFooter={true}
                        footer={
                            <>
                                <Button variant="contained" color="primary" onClick={submitPurchaseModal}>确定</Button>
                                <Button variant="contained" onClick={closePurchaseModal}>关闭</Button>
                            </>
                        }
                    >
                        <Grid container spacing={1}>
                            <Grid item sm={6}>采购单号：{purchaseModalData.purchaseItem.purchase_id}</Grid>
                            <Grid item sm={6}>供应商：{purchaseModalData.purchaseItem.supplier_name}</Grid>
                            <Grid item sm={6}>商品：{purchaseModalData.purchaseItem.product_name}</Grid>
                            <Grid item sm={6}>操作人：{purchaseModalData.purchaseItem.real_name}</Grid>
                            <Grid item sm={6}>单价：{purchaseModalData.purchaseItem.unit_cost}</Grid>
                            <Grid item sm={6}>数量：{purchaseModalData.purchaseItem.purchase_count}</Grid>
                            {storageInOutReducer.purchaseItemRefund.map((row, index) => (
                            <Grid item sm={12}>
                                <Alert severity="warning">
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={6}>退货：{row.product_name}</Grid>
                                        <Grid item xs={3}>{commonUtil.getDateTime(row.created_on)}</Grid>
                                        <Grid item xs={2}>数量：{row.refund_count}</Grid>
                                        <Grid item xs={1}>{commonUtil.getJsonValue(sysConst.REFUND_STATUS,row.status)}</Grid>
                                    </Grid>
                                </Alert>
                            </Grid>
                            ))}

                            <Grid item sm={5}>
                                <Autocomplete fullWidth options={commonReducer.storageList} getOptionLabel={(option) => option.storage_name}
                                              value={purchaseModalData.storage}
                                              onChange={(event, value) => {
                                                  setPurchaseModalData({...purchaseModalData, storage: value, storageArea: null});
                                                  // 仓库有选择时，取得仓库分区， 否则清空
                                                  if (value != null) {
                                                      props.getStorageAreaList(value.id);
                                                  } else {
                                                      props.setStorageAreaList([]);
                                                  }
                                              }}
                                              renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                                  error={validation.storage&&validation.storage!=''}
                                                                                  helperText={validation.storage}
                                              />}
                                />
                            </Grid>
                            <Grid item sm={5}>
                                <Autocomplete fullWidth options={commonReducer.storageAreaList} getOptionLabel={(option) => option.storage_area_name}
                                              noOptionsText="无选项"
                                              value={purchaseModalData.storageArea}
                                              onChange={(event, value) => {
                                                  setPurchaseModalData({...purchaseModalData, storageArea: value});
                                              }}
                                              renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"
                                                                                  error={validation.storageArea&&validation.storageArea!=''}
                                                                                  helperText={validation.storageArea}
                                              />}
                                />
                            </Grid>
                            <Grid item sm={2}>
                                <TextField label="入库数" fullWidth margin="dense" variant="outlined" type="number" value={purchaseModalData.productCnt}
                                           onChange={(e)=>{setPurchaseModalData({...purchaseModalData, productCnt: e.target.value})}}
                                           error={validation.productCnt&&validation.productCnt!=''}
                                           helperText={validation.productCnt}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={purchaseModalData.remark}
                                           onChange={(e) => {setPurchaseModalData({...purchaseModalData, remark: e.target.value})}}/>
                            </Grid>
                        </Grid>
                    </SimpleModal>
                </TabPanel>

                {/* 退货出库 */}
                <TabPanel value="refund">
                    <Grid container spacing={3}>
                        <Grid container item xs={11} spacing={1}>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>退仓状态</InputLabel>
                                    <Select label="退仓状态"
                                            value={storageInOutReducer.refundParams.refundStorageFlag}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setRefundParam({name: "refundStorageFlag", value: e.target.value}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {sysConst.REFUND_STORAGE_FLAG.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>退款状态</InputLabel>
                                    <Select label="退款状态"
                                            value={storageInOutReducer.refundParams.paymentStatus}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setRefundParam({name: "paymentStatus", value: e.target.value}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {sysConst.REFUND_PAYMENT_STATUS.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>运费类型</InputLabel>
                                    <Select label="运费类型"
                                            value={storageInOutReducer.refundParams.transferCostType}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setRefundParam({name: "transferCostType", value: e.target.value}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {sysConst.TRANSFER_COST_TYPE.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.supplierList} getOptionLabel={(option) => option.supplier_name}
                                              value={storageInOutReducer.refundParams.supplier}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setRefundParam({name: "supplier", value: value}));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="采购单ID" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.refundParams.purchaseId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setRefundParam({name: "purchaseId", value: e.target.value}))}}/>
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="商品ID" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.refundParams.productId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setRefundParam({name: "productId", value: e.target.value}))}}/>
                            </Grid>
                        </Grid>

                        {/*查询按钮*/}
                        <Grid item xs={1} style={{textAlign:'right'}}>
                            <Fab color="primary" size="small" onClick={()=>{dispatch(storageInOutAction.getPurchaseRefund(0))}}>
                                <i className="mdi mdi-magnify mdi-24px"/>
                            </Fab>
                        </Grid>
                    </Grid>

                    {/* 下部分：检索结果显示区域 */}
                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                                    <TableCell className={classes.tableHead} align="center">商品</TableCell>
                                    <TableCell className={classes.tableHead} align="center">退款日期</TableCell>
                                    <TableCell className={classes.tableHead} align="center">运费类型</TableCell>
                                    <TableCell className={classes.tableHead} align="center">运费</TableCell>
                                    <TableCell className={classes.tableHead} align="center">总成本</TableCell>
                                    <TableCell className={classes.tableHead} align="center">退货单价</TableCell>
                                    <TableCell className={classes.tableHead} align="center">退货数量</TableCell>
                                    <TableCell className={classes.tableHead} align="center">退款状态</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storageInOutReducer.purchaseRefundData.dataList.map((row) => (
                                    <TableRow key={'purchase-refund-data' + row.id}>
                                        <TableCell align="center">{row.purchase_id}</TableCell>
                                        <TableCell align="center">{row.supplier_name}</TableCell>
                                        <TableCell align="center">{row.product_name}</TableCell>
                                        <TableCell align="center">{row.date_id}</TableCell>
                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE, row.transfer_cost_type)}</TableCell>
                                        <TableCell align="center">{row.transfer_cost}</TableCell>
                                        <TableCell align="center">{row.total_cost}</TableCell>
                                        <TableCell align="center">{row.refund_unit_cost}</TableCell>
                                        <TableCell align="center">{row.refund_count}</TableCell>
                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.REFUND_PAYMENT_STATUS, row.payment_status)}</TableCell>
                                        <TableCell align="center">
                                            {row.storage_rel_id == null &&
                                            <IconButton color="primary" edge="start" size="small" onClick={() => {initRefundModal(row,'')}}>
                                                <i className="mdi mdi-logout"/>
                                            </IconButton>}
                                            {row.storage_rel_id != null &&
                                            <IconButton color="primary" edge="start" size="small" onClick={() => {initRefundModal(row,'info')}}>
                                                <i className="mdi mdi-table-of-contents"/>
                                            </IconButton>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {storageInOutReducer.purchaseRefundData.dataList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={11} align="center">暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 上下页按钮 */}
                    <Box style={{textAlign: 'right', marginTop: 20}}>
                        {storageInOutReducer.purchaseRefundData.start > 0 && storageInOutReducer.purchaseRefundData.dataSize > 0 &&
                        <Button variant="contained" color="primary" style={{marginRight: 20}}
                                onClick={()=>{dispatch(storageInOutAction.getPurchaseRefund(storageInOutReducer.purchaseRefundData.start-(storageInOutReducer.purchaseRefundData.size-1)))}}>上一页</Button>}
                        {storageInOutReducer.purchaseRefundData.dataSize >= storageInOutReducer.purchaseRefundData.size &&
                        <Button variant="contained" color="primary" onClick={()=>{dispatch(storageInOutAction.getPurchaseRefund(storageInOutReducer.purchaseRefundData.start+(storageInOutReducer.purchaseRefundData.size-1)))}}>下一页</Button>}
                    </Box>

                    <SimpleModal maxWidth={refundModalData.pageType === 'info' ? 'md' : 'sm'}
                                 title="退货出库"
                                 open={refundModalOpen}
                                 onClose={()=>{setRefundModalOpen(false)}}
                                 showFooter={true}
                                 footer={
                                     <>
                                         {refundModalData.pageType !== 'info' && <Button variant="contained" color="primary" onClick={submitRefundModal}>确定</Button>}
                                         <Button variant="contained" onClick={()=>{setRefundModalOpen(false)}}>关闭</Button>
                                     </>
                                 }
                    >
                        <Grid container spacing={2}>
                            <Grid item sm={6}>采购单号：{refundModalData.purchaseRefund.purchase_id}</Grid>
                            <Grid item sm={6}>供应商：{refundModalData.purchaseRefund.supplier_name}</Grid>
                            <Grid item sm={6}>商品：{refundModalData.purchaseRefund.product_name}</Grid>
                            <Grid item sm={6}>退货数量：{refundModalData.purchaseRefund.refund_count}</Grid>

                            {refundModalData.pageType === 'info' &&
                            <Table stickyHeader size="small" style={{marginTop: 10}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableHead} align="center">仓库</TableCell>
                                        <TableCell className={classes.tableHead} align="center">仓库分区</TableCell>
                                        <TableCell className={classes.tableHead} align="center">操作人员</TableCell>
                                        <TableCell className={classes.tableHead} align="center">操作日期</TableCell>
                                        <TableCell className={classes.tableHead} align="center">备注</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {storageInOutReducer.storageProductRelDetail.map((row) => (
                                        <TableRow key={'storage-product-rel-detail' + row.id}>
                                            <TableCell align="center">{row.storage_name}</TableCell>
                                            <TableCell align="center">{row.storage_area_name}</TableCell>
                                            <TableCell align="center">{row.real_name}</TableCell>
                                            <TableCell align="center">{commonUtil.getDate(row.created_on)}</TableCell>
                                            <TableCell align="center">{row.remark}</TableCell>
                                        </TableRow>
                                    ))}
                                    {storageInOutReducer.storageProductRelDetail.length === 0 &&
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">暂无数据</TableCell>
                                    </TableRow>}
                                </TableBody>
                            </Table>}

                            {refundModalData.pageType !== 'info' &&
                            <>
                                <Grid item sm={12}>
                                    <Autocomplete fullWidth options={storageInOutReducer.storageProductRelList}
                                                  noOptionsText="无选项"
                                                  getOptionLabel={(option) => option.storage_name + '-' + option.storage_area_name + '-' + option.product_name + '-' + option.storage_count}
                                                  value={refundModalData.storageProduct}
                                                  onChange={(event, value) => {
                                                      setRefundModalData({...refundModalData,storageProduct:value});
                                                  }}
                                                  renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                                      error={validation.storageProduct&&validation.storageProduct!=''}
                                                                                      helperText={validation.storageProduct}
                                                  />}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={refundModalData.remark}
                                               onChange={(e) => {setRefundModalData({...refundModalData,remark:e.target.value})}}/>
                                </Grid>
                            </>}
                        </Grid>
                    </SimpleModal>
                </TabPanel>

                {/* 订单出库 */}
                <TabPanel value="orderOut">
                    <Grid container spacing={3}>
                        <Grid container item xs={11} spacing={1}>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>出库状态</InputLabel>
                                    <Select label="出库状态"
                                            value={storageInOutReducer.orderOutParams.orderItemStatus}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setOrderOutParam({name: "orderItemStatus", value: e.target.value}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {sysConst.PROD_ITEM_STATUS.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.orderOutParams.orderId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setOrderOutParam({name: "orderId", value: e.target.value}))}}/>
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.userList} getOptionLabel={(option) => option.real_name}
                                              value={storageInOutReducer.orderOutParams.reUser}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setOrderOutParam({name: "reUser", value: value}));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="领用人" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="订单日期（始）"
                                            value={storageInOutReducer.orderOutParams.orderDateStart=="" ? null : storageInOutReducer.orderOutParams.orderDateStart}
                                            onChange={(date)=>{
                                                dispatch(StorageInOutActionType.setOrderOutParam({name: "orderDateStart", value: date}))
                                            }}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="订单日期（终）"
                                            value={storageInOutReducer.orderOutParams.orderDateEnd=="" ? null : storageInOutReducer.orderOutParams.orderDateEnd}
                                            onChange={(date)=>{
                                                dispatch(StorageInOutActionType.setOrderOutParam({name: "orderDateEnd", value: date}))
                                            }}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="商品编号" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.orderOutParams.productId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setOrderOutParam({name: "productId", value: e.target.value}))}}/>
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.supplierList} getOptionLabel={(option) => option.supplier_name}
                                              value={storageInOutReducer.orderOutParams.supplier}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setOrderOutParam({name: "supplier", value: value}));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.storageList} getOptionLabel={(option) => option.storage_name}
                                              onChange={(event, value) => {
                                                  // 选择时 将当前选中值 赋值 reducer
                                                  dispatch(StorageInOutActionType.setOrderOutParam({name: "storage", value: value}));
                                                  // 清空 子分类
                                                  dispatch(StorageInOutActionType.setOrderOutParam({name: "storageArea", value: null}));
                                                  // 根据选择内容，刷新 子分类 列表
                                                  if (value != null) {
                                                      dispatch(commonAction.getStorageAreaList(value.id));
                                                  } else {
                                                      dispatch(CommonActionType.setStorageAreaList([]));
                                                  }
                                              }}
                                              value={storageInOutReducer.orderOutParams.storage}
                                              renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.storageAreaList} getOptionLabel={(option) => option.storage_area_name}
                                              noOptionsText="无选项"
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setOrderOutParam({name: "storageArea", value: value}));
                                              }}
                                              value={storageInOutReducer.orderOutParams.storageArea}
                                              renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                        </Grid>

                        {/*查询按钮*/}
                        <Grid item xs={1} style={{textAlign:'right'}}>
                            <Fab color="primary" size="small" onClick={()=>{dispatch(storageInOutAction.getOrderItemProdStorage(0))}}>
                                <i className="mdi mdi-magnify mdi-24px"/>
                            </Fab>
                        </Grid>
                    </Grid>

                    {/* 下部分：检索结果显示区域 */}
                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="center">订单号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">商品</TableCell>
                                    <TableCell className={classes.tableHead} align="center">数量</TableCell>
                                    <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库分区</TableCell>
                                    <TableCell className={classes.tableHead} align="center">订单日期</TableCell>
                                    <TableCell className={classes.tableHead} align="center">领用人</TableCell>
                                    <TableCell className={classes.tableHead} align="center">状态</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storageInOutReducer.orderOutData.dataList.map((row,index) => (
                                    <TableRow key={'order-out-data-' + index}>
                                        <TableCell align="center">{row.order_id}</TableCell>
                                        <TableCell align="center">{row.prod_name}</TableCell>
                                        <TableCell align="center">{row.prod_count}</TableCell>
                                        <TableCell align="center">{row.st_supplier_name}</TableCell>
                                        <TableCell align="center">{row.st_storage_name}</TableCell>
                                        <TableCell align="center">{row.st_storage_area_name}</TableCell>
                                        <TableCell align="center">{row.or_date_id}</TableCell>
                                        <TableCell align="center">{row.or_re_user_name}</TableCell>
                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.PROD_ITEM_STATUS, row.status)}</TableCell>
                                        <TableCell align="center">
                                            {row.status === sysConst.PROD_ITEM_STATUS[0].value &&
                                            <IconButton color="primary" edge="start" size="small" onClick={() => {initOrderOutModal(row,'')}}>
                                                <i className="mdi mdi-logout"/>
                                            </IconButton>}
                                            {row.status === sysConst.PROD_ITEM_STATUS[1].value &&
                                            <IconButton color="primary" edge="start" size="small" onClick={() => {initOrderOutModal(row,'info')}}>
                                                <i className="mdi mdi-table-of-contents"/>
                                            </IconButton>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {storageInOutReducer.orderOutData.dataList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={9} align="center">暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 上下页按钮 */}
                    <Box style={{textAlign: 'right', marginTop: 20}}>
                        {storageInOutReducer.orderOutData.start > 0 && storageInOutReducer.orderOutData.dataSize > 0 &&
                        <Button variant="contained" color="primary" style={{marginRight: 20}}
                                onClick={()=>{dispatch(storageInOutAction.getOrderItemProdStorage(storageInOutReducer.orderOutData.start-(storageInOutReducer.orderOutData.size-1)))}}>上一页</Button>}
                        {storageInOutReducer.orderOutData.dataSize >= storageInOutReducer.orderOutData.size &&
                        <Button variant="contained" color="primary" onClick={()=>{dispatch(storageInOutAction.getOrderItemProdStorage(storageInOutReducer.orderOutData.start+(storageInOutReducer.orderOutData.size-1)))}}>下一页</Button>}
                    </Box>

                    <SimpleModal maxWidth={orderOutModalData.pageType === 'info' ? 'md' : 'sm'}
                                 title="订单出库"
                                 open={orderOutModalOpen}
                                 onClose={()=>{setOrderOutModalOpen(false)}}
                                 showFooter={true}
                                 footer={
                                     <>
                                         {orderOutModalData.pageType !== 'info' && <Button variant="contained" color="primary" onClick={submitOrderOutModal}>确定</Button>}
                                         <Button variant="contained" onClick={()=>{setOrderOutModalOpen(false)}}>关闭</Button>
                                     </>
                                 }
                    >
                        <Grid container spacing={2}>
                            <Grid item sm={6}>订单号：{orderOutModalData.orderItem.order_id}</Grid>
                            <Grid item sm={6}>商品：{orderOutModalData.orderItem.prod_name}</Grid>
                            <Grid item sm={6}>数量：{orderOutModalData.orderItem.prod_count}</Grid>

                            {orderOutModalData.pageType === 'info' &&
                            <Table stickyHeader size="small" style={{marginTop: 10}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableHead} align="center">仓库</TableCell>
                                        <TableCell className={classes.tableHead} align="center">仓库分区</TableCell>
                                        <TableCell className={classes.tableHead} align="center">操作人员</TableCell>
                                        <TableCell className={classes.tableHead} align="center">操作日期</TableCell>
                                        <TableCell className={classes.tableHead} align="center">备注</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {storageInOutReducer.storageProductList.map((row) => (
                                        <TableRow key={'order-out-modal-data-list' + row.id}>
                                            <TableCell align="center">{row.storage_name}</TableCell>
                                            <TableCell align="center">{row.storage_area_name}</TableCell>
                                            <TableCell align="center">{row.real_name}</TableCell>
                                            <TableCell align="center">{commonUtil.getDate(row.created_on)}</TableCell>
                                            <TableCell align="center">{row.remark}</TableCell>
                                        </TableRow>
                                    ))}
                                    {storageInOutReducer.storageProductList.length === 0 &&
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">暂无数据</TableCell>
                                    </TableRow>}
                                </TableBody>
                            </Table>}

                            {orderOutModalData.pageType !== 'info' &&
                            <>
                                <Grid item sm={12}>
                                    <Autocomplete fullWidth options={storageInOutReducer.storageProductList}
                                                  noOptionsText="无选项"
                                                  getOptionLabel={(option) => option.storage_name + '-' + option.storage_area_name + '-' + option.product_name + '-' + option.storage_count}
                                                  value={orderOutModalData.storageProduct}
                                                  onChange={(event, value) => {
                                                      setOrderOutModalData({...orderOutModalData,storageProduct:value});
                                                  }}
                                                  renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                              error={validation.storageProduct&&validation.storageProduct!=''} helperText={validation.storageProduct}
                                                  />}
                                    />
                                </Grid>
                                <Grid item sm={12}>
                                    <Autocomplete fullWidth options={commonReducer.userList} getOptionLabel={(option) => option.real_name}
                                                  value={orderOutModalData.reUser}
                                                  onChange={(event, value) => {
                                                      setOrderOutModalData({...orderOutModalData,reUser:value});
                                                  }}
                                                  renderInput={(params) => <TextField {...params} label="领用人" margin="dense" variant="outlined"
                                                              error={validation.reUser&&validation.reUser!=''} helperText={validation.reUser}/>}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={orderOutModalData.remark}
                                               onChange={(e) => {setOrderOutModalData({...orderOutModalData,remark:e.target.value})}}/>
                                </Grid>
                            </>}
                        </Grid>
                    </SimpleModal>
                </TabPanel>

                {/* 出入库 */}
                <TabPanel value="storage">
                    <Grid container spacing={3}>
                        <Grid container item xs={10} spacing={1}>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>出/入库</InputLabel>
                                    <Select label="出/入库"
                                            value={storageInOutReducer.storageProductDetailParams.storageType}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "storageType", value: e.target.value}));
                                                dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "storageSubType", value: null}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {sysConst.STORAGE_OP_TYPE.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>出/入库子分类</InputLabel>
                                    <Select label="出/入库子分类"
                                            value={storageInOutReducer.storageProductDetailParams.storageSubType}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "storageSubType", value: e.target.value}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {storageInOutReducer.storageProductDetailParams.storageType == sysConst.STORAGE_OP_TYPE[0].value &&
                                        sysConst.STORAGE_OP_IMPORT_TYPE.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                        {storageInOutReducer.storageProductDetailParams.storageType == sysConst.STORAGE_OP_TYPE[1].value &&
                                        sysConst.STORAGE_OP_EXPORT_TYPE.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.storageList} getOptionLabel={(option) => option.storage_name}
                                              value={storageInOutReducer.storageProductDetailParams.storage}
                                              onChange={(event, value) => {
                                                  // 选择时 将当前选中值 赋值 reducer
                                                  dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "storage", value: value}));
                                                  // 清空 子分类
                                                  dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "storageArea", value: null}));
                                                  // 根据选择内容，刷新 子分类 列表
                                                  if (value != null) {
                                                      dispatch(commonAction.getStorageAreaList(value.id));
                                                  } else {
                                                      dispatch(CommonActionType.setStorageAreaList([]));
                                                  }
                                              }}
                                              renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.storageAreaList} getOptionLabel={(option) => option.storage_area_name}
                                              noOptionsText="无选项"
                                              value={storageInOutReducer.storageProductDetailParams.storageArea}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "storageArea", value: value}));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth options={commonReducer.supplierList} getOptionLabel={(option) => option.supplier_name}
                                              value={storageInOutReducer.storageProductDetailParams.supplier}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "supplier", value: value}));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="采购单ID" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.storageProductDetailParams.purchaseId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "purchaseId", value: e.target.value}))}}/>
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="商品ID" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.storageProductDetailParams.productId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "productId", value: e.target.value}))}}/>
                            </Grid>

                            <Grid item xs={2}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="操作日期（始）"
                                            value={storageInOutReducer.storageProductDetailParams.dateIdStart=="" ? null : storageInOutReducer.storageProductDetailParams.dateIdStart}
                                            onChange={(date)=>{
                                                dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "dateIdStart", value: date}))
                                            }}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="操作日期（终）"
                                            value={storageInOutReducer.storageProductDetailParams.dateIdEnd=="" ? null : storageInOutReducer.storageProductDetailParams.dateIdEnd}
                                            onChange={(date)=>{
                                                dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "dateIdEnd", value: date}))
                                            }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item xs={2} spacing={1} style={{textAlign:'right',marginTop: 30}}>
                            {/*查询按钮*/}
                            <Grid item xs={4}>
                                <Fab color="primary" size="small" onClick={()=>{dispatch(storageInOutAction.getStorageProductRelDetailList(0))}}>
                                    <i className="mdi mdi-magnify mdi-24px"/>
                                </Fab>
                            </Grid>

                            <Grid item xs={4}>
                                <Fab color="primary" size="small" onClick={downLoadCsv}>
                                    <i className="mdi mdi-cloud-download mdi-24px"/>
                                </Fab>
                            </Grid>

                            <Grid item xs={4}>
                                <Fab color="primary" size="small" onClick={downLoadCsv}>
                                    <i className="mdi mdi-camera-switch mdi-24px"/>
                                </Fab>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* 下部分：检索结果显示区域 */}
                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                                    <TableCell className={classes.tableHead} align="center">商品</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库分区</TableCell>
                                    <TableCell className={classes.tableHead} align="center">出/入库</TableCell>
                                    <TableCell className={classes.tableHead} align="center">出/入库子分类</TableCell>
                                    <TableCell className={classes.tableHead} align="center">数量</TableCell>
                                    <TableCell className={classes.tableHead} align="center">领用人</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作人员</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作日期</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storageInOutReducer.storageProductDetail.dataList.map((row) => (
                                    <TableRow key={'storage-product-detail-' + row.id}>
                                        <TableCell align="center">{row.purchase_id == 0 ? '' : row.purchase_id}</TableCell>
                                        <TableCell align="center">{row.supplier_name}</TableCell>
                                        <TableCell align="center">{row.product_name}</TableCell>
                                        <TableCell align="center">{row.storage_name}</TableCell>
                                        <TableCell align="center">{row.storage_area_name}</TableCell>
                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.STORAGE_OP_TYPE, row.storage_type)}</TableCell>
                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.STORAGE_OP_SUB_TYPE, row.storage_sub_type)}</TableCell>
                                        <TableCell align="center">{row.storage_count}</TableCell>
                                        <TableCell align="center">{row.re_real_name}</TableCell>
                                        <TableCell align="center">{row.real_name}</TableCell>
                                        <TableCell align="center">{commonUtil.getDateTime(row.created_on)}</TableCell>
                                    </TableRow>
                                ))}
                                {storageInOutReducer.storageProductDetail.dataList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={8} align="center">暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 上下页按钮 */}
                    <Box style={{textAlign: 'right', marginTop: 20}}>
                        {storageInOutReducer.storageProductDetail.start > 0 && storageInOutReducer.storageProductDetail.dataSize > 0 &&
                        <Button variant="contained" color="primary" style={{marginRight: 20}}
                                onClick={()=>{dispatch(storageInOutAction.getStorageProductRelDetailList(storageInOutReducer.storageProductDetail.start-(storageInOutReducer.storageProductDetail.size-1)))}}>上一页</Button>}
                        {storageInOutReducer.storageProductDetail.dataSize >= storageInOutReducer.storageProductDetail.size &&
                        <Button variant="contained" color="primary"
                                onClick={()=>{dispatch(storageInOutAction.getStorageProductRelDetailList(storageInOutReducer.storageProductDetail.start+(storageInOutReducer.storageProductDetail.size-1)))}}>下一页</Button>}
                    </Box>
                </TabPanel>

                <SimpleModal maxWidth='md'
                             title="新增出入库"
                             open={modalOpen}
                             onClose={()=>{setModalOpen(false)}}
                             showFooter={true}
                             footer={
                                 <>
                                     {orderOutModalData.pageType !== 'info' && <Button variant="contained" color="primary" onClick={submitModal}>确定</Button>}
                                     <Button variant="contained" onClick={()=>{setModalOpen(false)}}>关闭</Button>
                                 </>
                             }
                >
                    <Grid container spacing={2}>
                        <Grid item sm={6}>订单号：{orderOutModalData.orderItem.order_id}</Grid>
                        <Grid item sm={6}>商品：{orderOutModalData.orderItem.prod_name}</Grid>
                        <Grid item sm={6}>数量：{orderOutModalData.orderItem.prod_count}</Grid>

                        {orderOutModalData.pageType === 'info' &&
                        <Table stickyHeader size="small" style={{marginTop: 10}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="center">仓库</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库分区</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作人员</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作日期</TableCell>
                                    <TableCell className={classes.tableHead} align="center">备注</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storageInOutReducer.storageProductList.map((row) => (
                                    <TableRow key={'order-out-modal-data-list' + row.id}>
                                        <TableCell align="center">{row.storage_name}</TableCell>
                                        <TableCell align="center">{row.storage_area_name}</TableCell>
                                        <TableCell align="center">{row.real_name}</TableCell>
                                        <TableCell align="center">{commonUtil.getDate(row.created_on)}</TableCell>
                                        <TableCell align="center">{row.remark}</TableCell>
                                    </TableRow>
                                ))}
                                {storageInOutReducer.storageProductList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={5} align="center">暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>}

                        {orderOutModalData.pageType !== 'info' &&
                        <>
                            <Grid item sm={12}>
                                <Autocomplete fullWidth options={storageInOutReducer.storageProductList}
                                              noOptionsText="无选项"
                                              getOptionLabel={(option) => option.storage_name + '-' + option.storage_area_name + '-' + option.product_name + '-' + option.storage_count}
                                              value={orderOutModalData.storageProduct}
                                              onChange={(event, value) => {
                                                  setOrderOutModalData({...orderOutModalData,storageProduct:value});
                                              }}
                                              renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                                  error={validation.storageProduct&&validation.storageProduct!=''} helperText={validation.storageProduct}
                                              />}
                                />
                            </Grid>
                            <Grid item sm={12}>
                                <Autocomplete fullWidth options={commonReducer.userList} getOptionLabel={(option) => option.real_name}
                                              value={orderOutModalData.reUser}
                                              onChange={(event, value) => {
                                                  setOrderOutModalData({...orderOutModalData,reUser:value});
                                              }}
                                              renderInput={(params) => <TextField {...params} label="领用人" margin="dense" variant="outlined"
                                                                                  error={validation.reUser&&validation.reUser!=''} helperText={validation.reUser}/>}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={orderOutModalData.remark}
                                           onChange={(e) => {setOrderOutModalData({...orderOutModalData,remark:e.target.value})}}/>
                            </Grid>
                        </>}
                    </Grid>
                </SimpleModal>
            </TabContext>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        storageInOutReducer: state.StorageInOutReducer,
        commonReducer: state.CommonReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getStorageList());
        dispatch(commonAction.getSupplierList());
        dispatch(commonAction.getUserList());
    },
    // select控件，联动检索
    getStorageAreaList: (storageId) => {
        dispatch(commonAction.getStorageAreaList(storageId));
    },
    setStorageAreaList: (value) => {
        dispatch(CommonActionType.setStorageAreaList(value));
    },
    // 出入库 TAB
    downLoadCsv: () => {
        dispatch(storageInOutAction.downLoadCsv())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageInOut)