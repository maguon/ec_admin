import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {
    Box,
    Grid,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    Paper,
    Typography,
    Divider,
    Button, Fab, makeStyles, AppBar, Tab, FormControl, InputLabel, Select, MenuItem, IconButton, Switch
} from "@material-ui/core";

// 引入Dialog
import Autocomplete from "@material-ui/lab/Autocomplete";
import {CommonActionType, StorageInOutActionType} from "../../types";
import {DatePicker} from "@material-ui/pickers";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import TabContext from "@material-ui/lab/TabContext";
import {Link} from "react-router-dom";
import {SimpleModal} from "../index";
import Swal from "sweetalert2";

const storageInOutAction = require('../../actions/main/StorageInOutAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;

const useStyles = makeStyles((theme) => ({
    root:{
        marginBottom: 20,
    },
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableRow: {
        padding: 5,
    },
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'
    },
    tblHeader:customTheme.tblHeader,
    tblLastHeader:customTheme.tblLastHeader,
    tblBody:customTheme.tblBody,
    tblLastBody:customTheme.tblLastBody
}));

function StorageInOut(props) {
    const {storageInOutReducer, commonReducer} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        // 清空reducer
        let purchaseParams = {
            storageStatus: null,
            storage: null,
            storageArea: null,
            supplier: null,
            purchaseId: '',
            productId: ''
        };
        dispatch(StorageInOutActionType.setPurchaseParams(purchaseParams));
        let refundParams = {
            refundStorageFlag: null,
            paymentStatus: null,
            transferCostType: null,
            supplier: null,
            purchaseId: '',
            productId: ''
        };
        dispatch(StorageInOutActionType.setRefundParams(refundParams));

        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        props.getPurchaseItemStorage(0);
    }, []);

    // TAB 页面
    const [tabValue, setTabValue] = React.useState('purchase');
    const changeTab = (event, newValue) => {
        setTabValue(newValue);
        switch (newValue) {
            case "purchase":
                props.getPurchaseItemStorage(0);
                break;
            case "refund":
                props.getPurchaseRefund(0);
                break;
            case "storage":
                break;
            default:
                break;
        }
    };

    /** 采购入库 TAB */

    // 查询列表，默认第一页
    const queryPurchaseItemStorage = () => {
        props.getPurchaseItemStorage(0);
    };

    // 上一页
    const getPrePage = () => {
        props.getPurchaseItemStorage(props.storageInOutReducer.purchaseItemStorage.start - (props.storageInOutReducer.purchaseItemStorage.size - 1));
    };

    // 下一页
    const getNextPage = () => {
        props.getPurchaseItemStorage(props.storageInOutReducer.purchaseItemStorage.start + (props.storageInOutReducer.purchaseItemStorage.size - 1));
    };

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 关闭模态
    const closeModal = () => {
        if (storageInOutReducer.purchaseParams.storage != null) {
            props.getStorageAreaList(storageInOutReducer.purchaseParams.storage.id);
        } else {
            props.setStorageAreaList([]);
        }
        setModalOpen(false);
    };

    // 采购明细：商品信息
    const [purchaseItem, setPurchaseItem] = React.useState({});
    // 仓库
    const [storage, setStorage] = React.useState(null);
    // 仓库分区
    const [storageArea, setStorageArea] = React.useState(null);
    // 备注
    const [remark, setRemark] = React.useState('');

    //初始添加模态框值
    const initModal =(item) =>{
        // 清空仓库分区
        props.setStorageAreaList([]);
        // 清楚check内容
        setValidation({});
        setPurchaseItem(item);
        setStorage(null);
        setStorageArea(null);
        setRemark('');
        // 设定模态打开
        setModalOpen(true);
    };

    const [validation,setValidation] = useState({});
    const validate = ()=>{
        const validateObj ={};
        if (!storage) {
            validateObj.storage ='请选择仓库';
        }
        if (!storageArea) {
            validateObj.storageArea ='请选择仓库分区';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const submitModal= ()=>{
        const errorCount = validate();
        if(errorCount===0){
            props.putInStorage(purchaseItem, storage, storageArea, remark);
            setModalOpen(false);
            if (storageInOutReducer.purchaseParams.storage != null) {
                props.getStorageAreaList(storageInOutReducer.purchaseParams.storage.id);
            } else {
                props.setStorageAreaList([]);
            }
        }
    };

    /** 退货出库 TAB */

    // 查询列表，默认第一页
    const queryPurchaseRefund = () => {
        props.getPurchaseRefund(0);
    };

    // 上一页
    const getRefundPrePage = () => {
        props.getPurchaseRefund(props.storageInOutReducer.purchaseRefundData.start - (props.storageInOutReducer.purchaseRefundData.size - 1));
    };

    // 下一页
    const getRefundNextPage = () => {
        props.getPurchaseRefund(props.storageInOutReducer.purchaseRefundData.start + (props.storageInOutReducer.purchaseRefundData.size - 1));
    };

    // 模态属性
    const [refundModalOpen, setRefundModalOpen] = React.useState(false);
    const closeRefundModal = () => {
        setRefundModalOpen(false);
    };

    // 退货明细：商品信息
    const [pageType, setPageType] = React.useState('');
    const [purchaseRefund, setPurchaseRefund] = React.useState({});
    // 库存商品
    const [storageProduct, setStorageProduct] = React.useState(null);
    // 备注
    const [refundRemark, setRefundRemark] = React.useState('');

    //初始添加模态框值
    const initRefundModal =(item,pageType) =>{
        // 清check内容
        setValidation({});
        setPageType(pageType);
        // 取得库存商品信息
        if (pageType === 'info') {
            props.getStorageProductRelDetail(item.storage_rel_id);
        } else {
            props.getStorageProductRel(item.purchase_item_id);
        }
        setPurchaseRefund(item);
        setStorageProduct(null);
        setRefundRemark('');
        // 设定模态打开
        setRefundModalOpen(true);
    };

    // const [validation,setValidation] = useState({});
    const validateRefundModal = ()=>{
        const validateObj ={};
        if (!storageProduct) {
            validateObj.storageProduct ='请选择库存商品';
        }else if (storageProduct.storage_count < purchaseRefund.refund_count) {
            validateObj.storageProduct ='库存商品数量小于退货数量，不能退货';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const submitRefundModal= ()=>{
        const errorCount = validateRefundModal();
        if(errorCount===0){
            props.refundStorage(purchaseRefund, storageProduct, refundRemark);
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
                        <Tab label="出入库" value="storage" />
                    </TabList>
                </AppBar>

                {/* 采购入库 */}
                <TabPanel value="purchase">
                    <Grid container spacing={3}>
                        <Grid container item xs={11} spacing={3}>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel id="check-status-select-outlined-label">仓储状态</InputLabel>
                                    <Select labelId="check-status-select-outlined-label"
                                            label="仓储状态"
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
                                <Autocomplete id="condition-storage" fullWidth
                                              options={commonReducer.storageList}
                                              getOptionLabel={(option) => option.storage_name}
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
                                <Autocomplete id="condition-storage-area" fullWidth
                                              options={commonReducer.storageAreaList}
                                              noOptionsText="无选项"
                                              getOptionLabel={(option) => option.storage_area_name}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setPurchaseParam({name: "storageArea", value: value}));
                                              }}
                                              value={storageInOutReducer.purchaseParams.storageArea}
                                              renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete id="condition-supplier" fullWidth
                                              options={commonReducer.supplierList}
                                              getOptionLabel={(option) => option.supplier_name}
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
                            <Fab color="primary" aria-label="add" size="small" onClick={queryPurchaseItemStorage}>
                                <i className="mdi mdi-magnify mdi-24px"/>
                            </Fab>
                        </Grid>
                    </Grid>

                    {/* 下部分：检索结果显示区域 */}
                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="default" className={classes.head} align="center">采购单号</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">供应商</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">商品</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">单价</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">仓库</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">仓库分区</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">库存</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storageInOutReducer.purchaseItemStorage.dataList.map((row) => (
                                    <TableRow className={classes.tableRow} key={'table-row-' + row.id} style={{paddingTop:15}}>
                                        <TableCell padding="" align="center">{row.purchase_id}</TableCell>
                                        <TableCell padding="" align="center">{row.supplier_name}</TableCell>
                                        <TableCell padding="" align="center">{row.product_name}</TableCell>
                                        <TableCell padding="" align="center">{row.unit_cost}</TableCell>
                                        <TableCell padding="" align="center">{row.storage_name}</TableCell>
                                        <TableCell padding="" align="center">{row.storage_area_name}</TableCell>
                                        <TableCell padding="" align="center">{row.storage_count}</TableCell>
                                        <TableCell padding="none" align="center">
                                            {row.storage_status === sysConst.STORAGE_STATUS[0].value &&
                                            <IconButton color="primary" edge="start" onClick={() => {initModal(row)}}>
                                                <i className="mdi mdi-login mdi-24px"/>
                                            </IconButton>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {storageInOutReducer.purchaseItemStorage.dataList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={8} style={{textAlign: 'center'}}>暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 上下页按钮 */}
                    <Box style={{textAlign: 'right', marginTop: 20}}>
                        {storageInOutReducer.purchaseItemStorage.start > 0 && storageInOutReducer.purchaseItemStorage.dataSize > 0 &&
                        <Button variant="contained" color="primary" style={{marginRight: 20}} onClick={getPrePage}>上一页</Button>}
                        {storageInOutReducer.purchaseItemStorage.dataSize >= storageInOutReducer.purchaseItemStorage.size &&
                        <Button variant="contained" color="primary" onClick={getNextPage}>下一页</Button>}
                    </Box>

                    <SimpleModal maxWidth={'sm'}
                        title="采购商品入库"
                        open={modalOpen}
                        onClose={closeModal}
                        showFooter={true}
                        footer={
                            <>
                                <Button variant="contained" color="primary" onClick={submitModal}>确定</Button>
                                <Button variant="contained" onClick={closeModal}>关闭</Button>
                            </>
                        }
                    >
                        <Grid container spacing={2}>
                            <Grid item sm={6}>采购单号：{purchaseItem.purchase_id}</Grid>
                            <Grid item sm={6}>供应商：{purchaseItem.supplier_name}</Grid>
                            <Grid item sm={6}>商品：{purchaseItem.product_name}</Grid>
                            <Grid item sm={6}>单价：{purchaseItem.unit_cost}</Grid>

                            <Grid item sm={6}>
                                <Autocomplete fullWidth
                                              options={commonReducer.storageList}
                                              getOptionLabel={(option) => option.storage_name}
                                              onChange={(event, value) => {
                                                  setStorage(value);
                                                  setStorageArea(null);
                                                  // 仓库有选择时，取得仓库分区， 否则清空
                                                  if (value != null) {
                                                      props.getStorageAreaList(value.id);
                                                  } else {
                                                      props.setStorageAreaList([]);
                                                  }
                                              }}
                                              value={storage}
                                              renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                                  error={validation.storage&&validation.storage!=''}
                                                                                  helperText={validation.storage}
                                              />}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Autocomplete fullWidth
                                              options={commonReducer.storageAreaList}
                                              noOptionsText="无选项"
                                              getOptionLabel={(option) => option.storage_area_name}
                                              onChange={(event, value) => {
                                                  setStorageArea(value);
                                              }}
                                              value={storageArea}
                                              renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"
                                                                                  error={validation.storageArea&&validation.storageArea!=''}
                                                                                  helperText={validation.storageArea}
                                              />}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField label="备注" fullWidth={true} margin="dense" variant="outlined" multiline rows={2} value={remark}
                                           onChange={(e) => {
                                               setRemark(e.target.value)
                                           }}
                                />
                            </Grid>
                        </Grid>
                    </SimpleModal>
                </TabPanel>

                {/* 退货出库 */}
                <TabPanel value="refund">
                    <Grid container spacing={3}>
                        <Grid container item xs={11} spacing={3}>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel id="status-select-outlined-label">退仓状态</InputLabel>
                                    <Select labelId="status-select-outlined-label"
                                            label="退仓状态"
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
                                    <InputLabel id="pay-status-select-outlined-label">退款状态</InputLabel>
                                    <Select labelId="pay-status-select-outlined-label"
                                            label="退款状态"
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
                                    <InputLabel id="refund-status-select-outlined-label">运费类型</InputLabel>
                                    <Select labelId="refund-status-select-outlined-label"
                                            label="运费类型"
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
                                <Autocomplete id="condition-supplier" fullWidth
                                              options={commonReducer.supplierList}
                                              getOptionLabel={(option) => option.supplier_name}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setRefundParam({name: "supplier", value: value}));
                                              }}
                                              value={storageInOutReducer.refundParams.supplier}
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
                            <Fab color="primary" aria-label="add" size="small" onClick={queryPurchaseRefund}>
                                <i className="mdi mdi-magnify mdi-24px"/>
                            </Fab>
                        </Grid>
                    </Grid>

                    {/* 下部分：检索结果显示区域 */}
                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="default" className={classes.head} align="center">采购单号</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">供应商</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">商品</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">退款日期</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">运费类型</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">运费</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">总成本</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">退货单价</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">退货数量</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">退款状态</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storageInOutReducer.purchaseRefundData.dataList.map((row) => (
                                    <TableRow className={classes.tableRow} key={'table-row-' + row.id} style={{paddingTop:15}}>
                                        <TableCell padding="none" align="center">{row.purchase_id}</TableCell>
                                        <TableCell padding="none" align="center">{row.supplier_name}</TableCell>
                                        <TableCell padding="none" align="center">{row.product_name}</TableCell>
                                        <TableCell padding="none" align="center">{row.date_id}</TableCell>
                                        <TableCell padding="none" align="center">{commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE, row.transfer_cost_type)}</TableCell>
                                        <TableCell padding="none" align="center">{row.transfer_cost}</TableCell>
                                        <TableCell padding="none" align="center">{row.total_cost}</TableCell>
                                        <TableCell padding="none" align="center">{row.refund_unit_cost}</TableCell>
                                        <TableCell padding="none" align="center">{row.refund_count}</TableCell>
                                        <TableCell padding="none" align="center">{commonUtil.getJsonValue(sysConst.REFUND_PAYMENT_STATUS, row.payment_status)}</TableCell>
                                        <TableCell padding="none" align="center">
                                            {/* storageProductRelDetail use storage_rel_id */}
                                            {row.storage_rel_id == null &&
                                            <IconButton color="primary" edge="start" onClick={() => {initRefundModal(row,'')}}>
                                                <i className="mdi mdi-logout mdi-24px"/>
                                            </IconButton>}
                                            {row.storage_rel_id != null &&
                                            <IconButton color="primary" edge="start" onClick={() => {initRefundModal(row,'info')}}>
                                                <i className="mdi mdi-table-of-contents mdi-24px"/>
                                            </IconButton>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {storageInOutReducer.purchaseRefundData.dataList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={11} style={{textAlign: 'center'}}>暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 上下页按钮 */}
                    <Box style={{textAlign: 'right', marginTop: 20}}>
                        {storageInOutReducer.purchaseRefundData.start > 0 && storageInOutReducer.purchaseRefundData.dataSize > 0 &&
                        <Button variant="contained" color="primary" style={{marginRight: 20}} onClick={getRefundPrePage}>上一页</Button>}
                        {storageInOutReducer.purchaseRefundData.dataSize >= storageInOutReducer.purchaseRefundData.size &&
                        <Button variant="contained" color="primary" onClick={getRefundNextPage}>下一页</Button>}
                    </Box>

                    <SimpleModal maxWidth={'md'}
                                 title="退货出库"
                                 open={refundModalOpen}
                                 onClose={closeRefundModal}
                                 showFooter={true}
                                 footer={
                                     <>
                                         {pageType !== 'info' && <Button variant="contained" color="primary" onClick={submitRefundModal}>确定</Button>}
                                         <Button variant="contained" onClick={closeRefundModal}>关闭</Button>
                                     </>
                                 }
                    >
                        <Grid container spacing={0}>
                            <Grid item sm={6} style={{paddingTop: 5}}>采购单号：{purchaseRefund.purchase_id}</Grid>
                            <Grid item sm={6} style={{paddingTop: 5}}>供应商：{purchaseRefund.supplier_name}</Grid>
                            <Grid item sm={6} style={{paddingTop: 20}}>商品：{purchaseRefund.product_name}</Grid>
                            <Grid item sm={6} style={{paddingTop: 20}}>退货数量：{purchaseRefund.refund_count}</Grid>

                            {pageType === 'info' &&
                                <>
                                    <Grid item container spacing={0} style={{paddingTop: 20}}>
                                        <Grid item sm={2} className={classes.tblHeader}>仓库</Grid>
                                        <Grid item sm={2} className={classes.tblHeader}>仓库分区</Grid>

                                        <Grid item sm={2} className={classes.tblHeader}>操作人员</Grid>
                                        <Grid item sm={2} className={classes.tblHeader}>操作日期</Grid>
                                        <Grid item sm={4} className={classes.tblLastHeader}>备注</Grid>
                                    </Grid>

                                    {storageInOutReducer.storageProductRelDetail.map((row, index) => (
                                        <Grid item container spacing={0}>
                                            <Grid item sm={2} className={classes.tblBody}>{row.storage_name}</Grid>
                                            <Grid item sm={2} className={classes.tblBody}>{row.storage_area_name}</Grid>
                                            <Grid item sm={2} className={classes.tblBody}>{row.real_name}</Grid>
                                            <Grid item sm={2} className={classes.tblBody}>{commonUtil.getDate(row.created_on)}</Grid>
                                            <Grid item sm={4} className={classes.tblLastBody}>{row.remark}</Grid>
                                        </Grid>
                                    ))}
                                </>}

                            {pageType !== 'info' &&
                            <>
                                <Grid item sm={12} style={{paddingTop: 20}}>
                                    <Autocomplete fullWidth
                                                  options={storageInOutReducer.storageProductRelList}
                                                  noOptionsText="无选项"
                                                  getOptionLabel={(option) => option.storage_name + '-' + option.storage_area_name + '-' + option.product_name + '-' + option.storage_count}
                                                  onChange={(event, value) => {
                                                      setStorageProduct(value);
                                                  }}
                                                  value={storageProduct}
                                                  renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                                      error={validation.storageProduct&&validation.storageProduct!=''}
                                                                                      helperText={validation.storageProduct}
                                                  />}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={refundRemark}
                                               onChange={(e) => {setRefundRemark(e.target.value)}}/>
                                </Grid>
                            </>}
                        </Grid>
                    </SimpleModal>
                </TabPanel>

                {/* 出入库 */}
                <TabPanel value="storage">
                    asdfasdfasdf
                </TabPanel>



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
        dispatch(commonAction.getCategoryList());
        dispatch(commonAction.getBrandList());
        dispatch(commonAction.getSupplierList());
        dispatch(commonAction.getProductList(null));
    },
    // select控件，联动检索
    getStorageAreaList: (storageId) => {
        dispatch(commonAction.getStorageAreaList(storageId));
    },
    setStorageAreaList: (value) => {
        dispatch(CommonActionType.setStorageAreaList(value));
    },
    getCategorySubList: (categoryId) => {
        dispatch(commonAction.getCategorySubList(categoryId));
    },
    setCategorySubList: (value) => {
        dispatch(CommonActionType.setCategorySubList(value));
    },
    getBrandModelList: (brandId) => {
        dispatch(commonAction.getBrandModelList(brandId));
    },
    setBrandModelList: (value) => {
        dispatch(CommonActionType.setBrandModelList(value));
    },


    // 采购入库 TAB
    getPurchaseItemStorage: (dataStart) => {
        dispatch(storageInOutAction.getPurchaseItemStorage({dataStart}))
    },
    putInStorage: (purchaseItem, storage, storageArea, remark) => {
        dispatch(storageInOutAction.putInStorage({purchaseItem, storage, storageArea, remark}));
    },

    // 退货出库 TAB
    getPurchaseRefund: (dataStart) => {
        dispatch(storageInOutAction.getPurchaseRefund({dataStart}))
    },
    getStorageProductRel: (purchaseItemId) => {
        dispatch(storageInOutAction.getStorageProductRel(purchaseItemId))
    },
    getStorageProductRelDetail: (storageProductRelDetailId) => {
        dispatch(storageInOutAction.getStorageProductRelDetail(storageProductRelDetailId))
    },
    refundStorage: (purchaseRefund, storageProduct, refundRemark) => {
        dispatch(storageInOutAction.refundStorage({purchaseRefund, storageProduct, refundRemark}))
    },

    // 出入库 TAB
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageInOut)
