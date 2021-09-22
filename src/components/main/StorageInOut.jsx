import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {
    AppBar,
    Box,
    Button, Checkbox,
    Divider,
    Fab,
    FormControl, FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Step,
    StepLabel,
    Stepper,
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
import {CommonActionType, StorageInOutActionType} from "../../types";

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
        // 退单入库
        let orderInParams = {
            status: '',
            orderId: '',
            orderRefundId: '',
            productId: '',
            dateStart: '',
            dateEnd: '',
        };
        dispatch(StorageInOutActionType.setOrderInParams(orderInParams));
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
            prodUniqueId:'',
        };
        dispatch(StorageInOutActionType.setStorageProductDetailParams(storageParams));

        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        dispatch(storageInOutAction.getPurchaseItemStorage(0))
    }, []);

    // TAB 页面
    const [tabValue, setTabValue] = React.useState('purchase');
    const changeTab = (event, newValue) => {
        setTabValue(newValue);
        switch (newValue) {
            case "purchase":
                // 采购入库
                if (storageInOutReducer.purchaseParams.storage != null) {
                    dispatch(commonAction.getStorageAreaList(storageInOutReducer.purchaseParams.storage.id));
                } else {
                    dispatch(CommonActionType.setStorageAreaList([]));
                }
                dispatch(storageInOutAction.getPurchaseItemStorage(0));
                break;
            case "refund":
                // 退货出库
                dispatch(storageInOutAction.getPurchaseRefund(0));
                break;
            case "orderIn":
                // 退单入库
                dispatch(storageInOutAction.getOrderInTabList(0));
                break;
            case "orderOut":
                // 订单出库
                dispatch(storageInOutAction.getOrderItemProdStorage(0));
                break;
            case "storage":
                // 出入库
                if (storageInOutReducer.storageProductDetailParams.storage != null) {
                    dispatch(commonAction.getStorageAreaList(storageInOutReducer.storageProductDetailParams.storage.id));
                } else {
                    dispatch(CommonActionType.setStorageAreaList([]));
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
            dispatch(commonAction.getStorageAreaList(storageInOutReducer.purchaseParams.storage.id));
        } else {
            dispatch(CommonActionType.setStorageAreaList([]));
        }
        setPurchaseModalOpen(false);
    };

    // 采购入库 TAB: 采购商品入库
    const initPurchaseModal = async (item) =>{
        // 清空仓库分区
        dispatch(CommonActionType.setStorageAreaList([]));
        // 根据purchase_item_id 取得退货信息
        dispatch(storageInOutAction.getPurchaseItemRefund(item.purchase_item_id));
        // 根据purchase_item_id 取得唯一标识码 列表
        let ret = await dispatch(commonAction.getPurchaseItemUnique(item.purchase_item_id));
        // 清check内容
        setValidation({});
        // 页面属性
        setPurchaseModalData({selectAll: false, purchaseItemUnique: ret, purchaseItem:item,storage:null,storageArea:null,productCnt:'',remark:''});
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
        if (!purchaseModalData.productCnt && purchaseModalData.productCnt !== 0) {
            validateObj.productCnt ='入库数不能为空';
        } else if (purchaseModalData.productCnt <= 0) {
            validateObj.productCnt ='入库数必须大于0';
        } else if (purchaseModalData.productCnt > purchaseModalData.purchaseItem.purchase_count) {
            validateObj.productCnt ='入库数不能比采购数量大';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            if (purchaseModalData.purchaseItem.unique_flag === sysConst.UNIQUE_FLAG[1].value) {
                let uniqueRelIdArray = [];
                purchaseModalData.purchaseItemUnique.forEach((item) => {
                    if (item.checked === true) {
                        uniqueRelIdArray.push(item.id)
                    }
                });
                dispatch(storageInOutAction.changeUniqueRelStatus({...purchaseModalData, uniqueRelIdArray: uniqueRelIdArray}));
            } else {
                dispatch(storageInOutAction.putInStorage(purchaseModalData));
            }

            // 关闭模态
            setPurchaseModalOpen(false);
            //清空外层检索条件部分 仓库分区下拉列表
            if (storageInOutReducer.purchaseParams.storage != null) {
                dispatch(commonAction.getStorageAreaList(storageInOutReducer.purchaseParams.storage.id));
            } else {
                dispatch(CommonActionType.setStorageAreaList([]));
            }
        }
    };

    /** 退单入库 TAB */
    const [orderInModalOpen, setOrderInModalOpen] = React.useState(false);
    const [orderInModalData, setOrderInModalData] = React.useState({orderInStorageInfo:{}});
    const initOrderInModal = async (item, pageType) => {
        // 清check内容
        setValidation({});
        // 取得库存商品信息
        if (pageType === 'info') {
            let ret = await dispatch(storageInOutAction.getOrderInStorageInfo(item.id, null,null));
            setOrderInModalData({
                orderInStorageInfo: ret,
                pageType: pageType,
                refundOrderItem: item,
                prodCnt: null,
                oldFlag: sysConst.OLD_FLAG[0].value,
                reUser: null,
                remark: ''
            });
        } else {
            let ret = await dispatch(storageInOutAction.getOrderInStorageInfo(null, item.order_id, item.item_prod_id));
            let purchaseItemUnique = [];
            if (ret.unique_flag == sysConst.UNIQUE_FLAG[1].value && ret.prod_unique_arr != null && ret.prod_unique_arr.length > 0) {
                ret.prod_unique_arr.forEach((item) => {
                    purchaseItemUnique.push({unique_id : item, checked : false});
                });
            }
            setOrderInModalData({
                pageType: pageType,
                refundOrderItem: item,
                prodCnt: ret.unique_flag == sysConst.OLD_FLAG[0].value ? ret.storage_count : 0,
                oldFlag: sysConst.OLD_FLAG[0].value,
                reUser: null,
                remark: '',
                orderInStorageInfo: ret,
                selectAll: false, uniqueFlag: ret.unique_flag, purchaseItemUnique : purchaseItemUnique
            });
        }
        // 设定模态打开
        setOrderInModalOpen(true);
    };

    const submitOrderInModal= ()=>{
        const validateObj ={};
        if (!orderInModalData.reUser) {
            validateObj.reUser ='请选择领用人';
        }
        if (orderInModalData.prodCnt != orderInModalData.orderInStorageInfo.storage_count) {
            validateObj.prodCnt ='数量和库存数不一致';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            let prodUniqueArr = [];
            if (orderInModalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value) {
                orderInModalData.purchaseItemUnique.forEach((item) => {
                    if (item.checked == true) {
                        prodUniqueArr.push(item.unique_id)
                    }
                });
            }
            dispatch(storageInOutAction.importOrderProduct({
                ...orderInModalData,
                prodUniqueArr:prodUniqueArr,
                storageProductRelId: orderInModalData.orderInStorageInfo.storage_product_rel_id
            }));
            setOrderInModalOpen(false);
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
        if (orderOutModalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value) {
            if (!orderOutModalData.prodCnt && orderOutModalData.prodCnt<=0) {
                validateObj.prodCnt ='请选择出库商品唯一编码';
            } else if (orderOutModalData.prodCnt != orderOutModalData.orderItem.prod_count) {
                validateObj.prodCnt ='出库数量与订单数量不符';
            }
        }

        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            let prodUniqueArr = [];
            if (orderOutModalData.uniqueFlag === sysConst.UNIQUE_FLAG[1].value) {
                orderOutModalData.purchaseItemUnique.forEach((item) => {
                    if (item.checked == true) {
                        prodUniqueArr.push(item.unique_id)
                    }
                });
            }
            dispatch(storageInOutAction.exportOrderProduct({...orderOutModalData,prodUniqueArr:prodUniqueArr}));
            setOrderOutModalOpen(false);
        }
    };

    /** 退货出库 TAB */
    const [refundModalOpen, setRefundModalOpen] = React.useState(false);
    const [refundModalData, setRefundModalData] = React.useState({purchaseRefund:{}});
    const initRefundModal = (item, pageType) => {
        // 清check内容
        setValidation({});
        setRefundModalData({
            ...refundModalData,
            pageType: pageType,
            purchaseRefund: item,
            uniqueFlag: sysConst.UNIQUE_FLAG[0].value,
            purchaseItemUnique: [],
            storageProduct: null,
            prodCnt: item.refund_count,
            remark: ''
        });
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
            validateObj.storageProduct ='请选择仓库';
        }
        if (!refundModalData.prodCnt) {
            validateObj.prodCnt ='请选择库存商品';
        } else if (refundModalData.prodCnt != refundModalData.purchaseRefund.refund_count) {
            validateObj.prodCnt ='出库数与退货数不一致';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            let prodUniqueArr = [];
            if (refundModalData.uniqueFlag === sysConst.UNIQUE_FLAG[1].value) {
                refundModalData.purchaseItemUnique.forEach((item) => {
                    if (item.checked == true) {
                        prodUniqueArr.push(item.unique_id)
                    }
                });
            }
            dispatch(storageInOutAction.refundStorage({...refundModalData,prodUniqueArr:prodUniqueArr}));
            setRefundModalOpen(false);
        }
    };

    /** 出入库 TAB */
    const [modalOpen, setModalOpen] = React.useState(false);
    const [uniqueModalOpen, setUniqueModalOpen] = React.useState(false);
    const [modalData, setModalData] = React.useState({dataItem:{}, prodCnt:0, steps:['选择出库编号', '填写数量·领用人']});
    const initModal = (type) => {
        setValidation({});
        if (type === 'out') {
            setModalData({
                ...modalData,
                type: type,
                selectAll: false,
                uniqueFlag: sysConst.UNIQUE_FLAG[0].value,
                product: null,
                storageProduct: null,
                prodCnt: 0,
                reUser: null,
                remark: ''
            });
            dispatch(StorageInOutActionType.setStorageProductList([]));
        } else {
            setModalData({...modalData,type:type,inOutNo:'',storageProdRelDetail:null, activeStep:0,prodCnt:0,oldFlag:0,reUser:null,remark:''});
        }
        setModalOpen(true);
    };

    const submitModal = async (step) => {
        const validateObj ={};
        if (modalData.type === 'out') {
            if (!modalData.product) {
                validateObj.product ='请选择商品';
            }
            if (!modalData.storageProduct) {
                validateObj.storageProduct ='请选择库存仓库';
            }else if (modalData.storageProduct.storage_count < modalData.prodCnt) {
                validateObj.prodCnt ='出库数量不能大于库存数量';
            }
            if (!modalData.reUser) {
                validateObj.reUser ='请选择领用人';
            }
            if (!modalData.prodCnt && modalData.prodCnt!==0) {
                validateObj.prodCnt ='请输入数量';
            } else if (modalData.prodCnt <= 0) {
                validateObj.prodCnt ='数量应大于0';
            }
            setValidation(validateObj);
            if(Object.keys(validateObj).length===0){
                let prodUniqueArr = [];
                if (modalData.uniqueFlag === sysConst.UNIQUE_FLAG[1].value) {
                    modalData.purchaseItemUnique.forEach((item) => {
                        if (item.checked == true) {
                            prodUniqueArr.push(item.unique_id)
                        }
                    });
                }
                dispatch(storageInOutAction.inOutStorageProduct({...modalData,prodUniqueArr:prodUniqueArr}));
                setModalOpen(false);
            }
        } else {
            if (step === 0) {
                if (!modalData.inOutNo) {
                    validateObj.inOutNo ='请输入出库编号';
                }
                setValidation(validateObj);
                if(Object.keys(validateObj).length===0){
                    let ret = await dispatch(storageInOutAction.getStorageProductRelDetailInfo(modalData.inOutNo));
                    if (ret.length > 0) {
                        // 取得仓库存放的商品uniqueId
                        let storageProductRel = await dispatch(storageInOutAction.getStorageProductRelInfo(ret[0].storage_product_rel_id));
                        let storageUniqueArray = storageProductRel.prod_unique_arr != null ? storageProductRel.prod_unique_arr : [];
                        let uniqueMap = new Map();
                        // 将商品uniqueId 放入map
                        storageUniqueArray.forEach((item) => {
                            uniqueMap.set(item,'');
                        });

                        let purchaseItemUnique = [];
                        if (ret[0].unique_flag === sysConst.UNIQUE_FLAG[1].value && ret[0].prod_unique_arr != null && ret[0].prod_unique_arr.length > 0) {
                            ret[0].prod_unique_arr.forEach((item) => {
                                // 如果该商品 在原来位置没有的话，则可以进行入库
                                if (!uniqueMap.has(item)) {
                                    purchaseItemUnique.push({unique_id : item, checked : false});
                                }
                            });
                        }
                        setModalData({
                            ...modalData,
                            selectAll: false,
                            uniqueFlag: ret[0].unique_flag,
                            purchaseItemUnique: purchaseItemUnique,
                            storageProdRelDetail: ret[0],
                            oldFlag: ret[0].old_flag,
                            activeStep: modalData.activeStep + 1
                        });
                    } else {
                        setValidation({inOutNo:'没有该出库记录,请重新输入'});
                    }
                }
            }

            if (step === 1) {
                if (!modalData.reUser) {
                    validateObj.reUser ='请选择领用人';
                }
                if (!modalData.prodCnt && modalData.prodCnt!==0) {
                    validateObj.prodCnt ='请输入数量';
                }else if (modalData.storageProdRelDetail.storage_count < modalData.prodCnt) {
                    validateObj.prodCnt ='入库数量不能大于库存商品数量';
                } else if (modalData.prodCnt <= 0) {
                    validateObj.prodCnt ='数量应大于0';
                }

                setValidation(validateObj);
                if(Object.keys(validateObj).length===0){
                    let prodUniqueArr = [];
                    if (modalData.uniqueFlag === sysConst.UNIQUE_FLAG[1].value) {
                        modalData.purchaseItemUnique.forEach((item) => {
                            if (item.checked == true) {
                                prodUniqueArr.push(item.unique_id)
                             }
                        });
                    }
                    dispatch(storageInOutAction.inOutStorageProduct({...modalData,prodUniqueArr:prodUniqueArr}));
                    setModalOpen(false);
                }
            }
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
                        <Tab label="退单入库" value="orderIn" />
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
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.storageList} getOptionLabel={(option) => option.storage_name}
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
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.storageAreaList} getOptionLabel={(option) => option.storage_area_name}
                                              noOptionsText="无选项"
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setPurchaseParam({name: "storageArea", value: value}));
                                              }}
                                              value={storageInOutReducer.purchaseParams.storageArea}
                                              renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.supplierList} getOptionLabel={(option) => option.supplier_name}
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

                    <SimpleModal maxWidth={'lg'}
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
                            <Grid item sm={5}>采购单号：{purchaseModalData.purchaseItem.purchase_id}</Grid>
                            <Grid item sm={5}>供应商：{purchaseModalData.purchaseItem.supplier_name}</Grid>
                            <Grid item sm={2}>操作人：{purchaseModalData.purchaseItem.real_name}</Grid>
                            <Grid item sm={5}>商品：{purchaseModalData.purchaseItem.product_name}</Grid>
                            <Grid item sm={5}>单价：{purchaseModalData.purchaseItem.unit_cost}</Grid>
                            <Grid item sm={2}>数量：{purchaseModalData.purchaseItem.purchase_count}</Grid>

                            {/* 需要校验 唯一标识码 */}
                            {purchaseModalData.purchaseItem.unique_flag == sysConst.UNIQUE_FLAG[1].value &&
                            <Grid item sm={12} container>
                                <Grid item sm={12}>
                                    <FormControlLabel key="select-all" label="全选"
                                        control={
                                            <Checkbox color="primary" key={'select-all-chk'}
                                                checked={purchaseModalData.selectAll}
                                                onChange={(e) => {
                                                    purchaseModalData.purchaseItemUnique.forEach((item) => {
                                                        item.checked = e.target.checked;
                                                    });
                                                    setPurchaseModalData({
                                                        ...purchaseModalData,
                                                        selectAll: e.target.checked,
                                                        purchaseItemUnique: purchaseModalData.purchaseItemUnique,
                                                        productCnt: e.target.checked ? purchaseModalData.purchaseItemUnique.length : 0
                                                    });
                                                }}
                                            />
                                        }
                                    />
                                </Grid>
                                {purchaseModalData.purchaseItemUnique.map((row, index) => (
                                    <Grid item sm={4}>
                                        <FormControlLabel key={'checkbox_child_' + index} label={row.unique_id}
                                            control={
                                                <Checkbox color="primary" key={'checkbox_child_chk_' + index}
                                                    checked={row.checked == true}
                                                    onChange={(e) => {
                                                        purchaseModalData.purchaseItemUnique[index].checked = e.target.checked;
                                                        let selectedSize = 0;
                                                        purchaseModalData.purchaseItemUnique.forEach((item) => {
                                                            if (item.checked === true) {
                                                                selectedSize++;
                                                            }
                                                        });
                                                        setPurchaseModalData({
                                                            ...purchaseModalData,
                                                            selectAll: selectedSize === purchaseModalData.purchaseItemUnique.length,
                                                            purchaseItemUnique: purchaseModalData.purchaseItemUnique,
                                                            productCnt: selectedSize
                                                        });
                                                    }}
                                                />
                                            }
                                        />
                                    </Grid>))}
                            </Grid>}

                            {/* 有退货的情况 显示下面提示内容 */}
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
                            </Grid>))}

                            <Grid item sm={5}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.storageList} getOptionLabel={(option) => option.storage_name}
                                              value={purchaseModalData.storage}
                                              onChange={(event, value) => {
                                                  setPurchaseModalData({...purchaseModalData, storage: value, storageArea: null});
                                                  // 仓库有选择时，取得仓库分区， 否则清空
                                                  if (value != null) {
                                                      dispatch(commonAction.getStorageAreaList(value.id));
                                                  } else {
                                                      dispatch(CommonActionType.setStorageAreaList([]));
                                                  }
                                              }}
                                              renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                                  error={validation.storage&&validation.storage!=''}
                                                                                  helperText={validation.storage}
                                              />}
                                />
                            </Grid>
                            <Grid item sm={5}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.storageAreaList} getOptionLabel={(option) => option.storage_area_name}
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
                                           disabled={purchaseModalData.purchaseItem.unique_flag == sysConst.UNIQUE_FLAG[1].value}
                                           onChange={(e)=>{setPurchaseModalData({...purchaseModalData, productCnt: e.target.value})}}
                                           error={validation.productCnt&&validation.productCnt!=''}
                                           helperText={validation.productCnt}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={1} value={purchaseModalData.remark}
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
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.supplierList} getOptionLabel={(option) => option.supplier_name}
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

                    <SimpleModal maxWidth={'lg'}
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
                            <Grid item sm={3}>采购单号：{refundModalData.purchaseRefund.purchase_id}</Grid>
                            <Grid item sm={4}>供应商：{refundModalData.purchaseRefund.supplier_name}</Grid>
                            <Grid item sm={4}>商品：{refundModalData.purchaseRefund.product_name}</Grid>
                            <Grid item sm={1}>退货数：{refundModalData.purchaseRefund.refund_count}</Grid>

                            {refundModalData.pageType === 'info' &&
                            <>
                                {storageInOutReducer.storageProductRelDetail.map((row) => (
                                    <>
                                        <Grid item sm={2}><TextField fullWidth  margin="dense" variant="outlined" label="仓库" value={row.storage_name}/></Grid>
                                        <Grid item sm={2}><TextField fullWidth  margin="dense" variant="outlined" label="仓库分区" value={row.storage_area_name}/></Grid>
                                        <Grid item sm={1}><TextField fullWidth  margin="dense" variant="outlined" label="操作人员" value={row.real_name}/></Grid>
                                        <Grid item sm={7} container spacing={1}>
                                            <Grid item sm={2}><TextField fullWidth  margin="dense" variant="outlined" label="操作日期" value={commonUtil.getDate(row.created_on)}/></Grid>
                                            <Grid item sm={10}><TextField fullWidth  margin="dense" variant="outlined" label="备注" value={row.remark}/></Grid>
                                        </Grid>

                                        {row.unique_flag == sysConst.UNIQUE_FLAG[1].value && row.prod_unique_arr.length > 0 &&
                                        <>
                                            <Grid item sm={12}>唯一编码：</Grid>
                                            {row.prod_unique_arr.map((item) => (
                                                <Grid item sm={4}>{item}</Grid>
                                            ))}
                                        </>}
                                    </>
                                ))}
                            </>}

                            {refundModalData.pageType !== 'info' &&
                            <>
                                <Grid item sm={10}>
                                    <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                                  options={storageInOutReducer.storageProductRelList}
                                                  noOptionsText="无选项"
                                                  getOptionLabel={(option) => option.storage_name + '-' + option.storage_area_name + '-' + option.product_name + '-' + option.storage_count}
                                                  value={refundModalData.storageProduct}
                                                  onChange={(event, value) => {
                                                      if (value != null) {
                                                          let purchaseItemUnique = [];
                                                          if (value.unique_flag === sysConst.UNIQUE_FLAG[1].value && value.prod_unique_arr != null && value.prod_unique_arr.length > 0) {
                                                              value.prod_unique_arr.forEach((item) => {
                                                                  purchaseItemUnique.push({unique_id : item, checked : false});
                                                              });
                                                          }
                                                          setRefundModalData({
                                                              ...refundModalData,
                                                              storageProduct: value,
                                                              selectAll: false,
                                                              prodCnt: value.unique_flag === sysConst.UNIQUE_FLAG[1].value ? 0 : refundModalData.purchaseRefund.refund_count,
                                                              uniqueFlag: value.unique_flag,
                                                              purchaseItemUnique: purchaseItemUnique
                                                          });
                                                      } else {
                                                          setRefundModalData({
                                                              ...refundModalData,
                                                              storageProduct: value,
                                                              selectAll: false,
                                                              prodCnt: refundModalData.purchaseRefund.refund_count,
                                                              uniqueFlag: sysConst.UNIQUE_FLAG[0].value,
                                                              purchaseItemUnique: []
                                                          });
                                                      }
                                                  }}
                                                  renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                                      error={validation.storageProduct&&validation.storageProduct!=''}
                                                                                      helperText={validation.storageProduct}
                                                  />}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" disabled value={refundModalData.prodCnt}
                                               error={validation.prodCnt&&validation.prodCnt!=''} helperText={validation.prodCnt}/>
                                </Grid>

                                {refundModalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value && refundModalData.purchaseItemUnique.length > 0 &&
                                <Grid item sm={12} container>
                                    <Grid item sm={12}>
                                        <FormControlLabel key="select-all" label="全选"
                                                          control={
                                                              <Checkbox color="primary" key={'select-all-chk'}
                                                                        checked={refundModalData.selectAll}
                                                                        onChange={(e) => {
                                                                            refundModalData.purchaseItemUnique.forEach((item) => {
                                                                                item.checked = e.target.checked;
                                                                            });
                                                                            setRefundModalData({
                                                                                ...refundModalData,
                                                                                selectAll: e.target.checked,
                                                                                purchaseItemUnique: refundModalData.purchaseItemUnique,
                                                                                prodCnt: e.target.checked ? refundModalData.purchaseItemUnique.length : 0
                                                                            });
                                                                        }}
                                                              />
                                                          }
                                        />
                                    </Grid>
                                    {refundModalData.purchaseItemUnique.map((row, index) => (
                                        <Grid item sm={4}>
                                            <FormControlLabel key={'checkbox_child_' + index} label={row.unique_id}
                                                              control={
                                                                  <Checkbox color="primary" key={'checkbox_child_chk_' + index}
                                                                            checked={row.checked == true}
                                                                            onChange={(e) => {
                                                                                refundModalData.purchaseItemUnique[index].checked = e.target.checked;
                                                                                let selectedSize = 0;
                                                                                refundModalData.purchaseItemUnique.forEach((item) => {
                                                                                    if (item.checked === true) {
                                                                                        selectedSize++;
                                                                                    }
                                                                                });
                                                                                setRefundModalData({
                                                                                    ...refundModalData,
                                                                                    selectAll: selectedSize === refundModalData.purchaseItemUnique.length,
                                                                                    purchaseItemUnique: refundModalData.purchaseItemUnique,
                                                                                    prodCnt: selectedSize
                                                                                });
                                                                            }}
                                                                  />
                                                              }
                                            />
                                        </Grid>))}
                                </Grid>}

                                <Grid item xs={12}>
                                    <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={1} value={refundModalData.remark}
                                               onChange={(e) => {setRefundModalData({...refundModalData,remark:e.target.value})}}/>
                                </Grid>
                            </>}
                        </Grid>
                    </SimpleModal>
                </TabPanel>

                {/* 退单入库 */}
                <TabPanel value="orderIn">
                    <Grid container spacing={3}>
                        <Grid container item xs={11} spacing={1}>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>状态</InputLabel>
                                    <Select label="状态"
                                            value={storageInOutReducer.orderInParams.status}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setOrderInParam({name: "status", value: e.target.value}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {sysConst.ORDER_REFUND_STORAGE_STATUS.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.orderInParams.orderId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setOrderInParam({name: "orderId", value: e.target.value}))}}/>
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="退单编号" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.orderInParams.orderRefundId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setOrderInParam({name: "orderRefundId", value: e.target.value}))}}/>
                            </Grid>

                            <Grid item xs={2}>
                                <TextField label="商品编号" fullWidth margin="dense" variant="outlined" type="number" value={storageInOutReducer.orderInParams.productId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setOrderInParam({name: "productId", value: e.target.value}))}}/>
                            </Grid>

                            <Grid item xs={2}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="退单日期（始）"
                                            value={storageInOutReducer.orderInParams.dateStart=="" ? null : storageInOutReducer.orderInParams.dateStart}
                                            onChange={(date)=>{
                                                dispatch(StorageInOutActionType.setOrderInParam({name: "dateStart", value: date}))
                                            }}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="退单日期（终）"
                                            value={storageInOutReducer.orderInParams.dateEnd=="" ? null : storageInOutReducer.orderInParams.dateEnd}
                                            onChange={(date)=>{
                                                dispatch(StorageInOutActionType.setOrderInParam({name: "dateEnd", value: date}))
                                            }}
                                />
                            </Grid>
                        </Grid>

                        {/*查询按钮*/}
                        <Grid item xs={1} style={{textAlign:'right'}}>
                            <Fab color="primary" size="small" onClick={()=>{dispatch(storageInOutAction.getOrderInTabList(0))}}>
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
                                    <TableCell className={classes.tableHead} align="center">退单号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">商品号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">商品</TableCell>
                                    {/*<TableCell className={classes.tableHead} align="center">单价</TableCell>*/}
                                    {/*<TableCell className={classes.tableHead} align="center">数量</TableCell>*/}
                                    {/*<TableCell className={classes.tableHead} align="center">折扣</TableCell>*/}
                                    {/*<TableCell className={classes.tableHead} align="center">实际金额</TableCell>*/}

                                    <TableCell className={classes.tableHead} align="center">退货金额</TableCell>
                                    <TableCell className={classes.tableHead} align="center">退货数量</TableCell>
                                    <TableCell className={classes.tableHead} align="center">退货总额</TableCell>
                                    <TableCell className={classes.tableHead} align="center">退单日期</TableCell>

                                    <TableCell className={classes.tableHead} align="center">状态</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storageInOutReducer.orderInData.dataList.map((row,index) => (
                                    <TableRow key={'order-out-data-' + index}>
                                        <TableCell align="center">{row.order_id}</TableCell>
                                        <TableCell align="center">{row.order_refund_id}</TableCell>
                                        <TableCell align="center">{row.prod_id}</TableCell>
                                        <TableCell align="center">{row.prod_name}</TableCell>
                                        {/*<TableCell align="center">{row.unit_price}</TableCell>*/}
                                        {/*<TableCell align="center">{row.prod_count}</TableCell>*/}
                                        {/*<TableCell align="center">{row.discount_prod_price}</TableCell>*/}
                                        {/*<TableCell align="center">{row.actual_prod_price}</TableCell>*/}

                                        <TableCell align="center">{row.prod_refund_price}</TableCell>
                                        <TableCell align="center">{row.prod_refund_count}</TableCell>
                                        <TableCell align="center">{row.total_refund_price}</TableCell>
                                        <TableCell align="center">{row.date_id}</TableCell>


                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_REFUND_STORAGE_STATUS, row.status)}</TableCell>
                                        <TableCell align="center">
                                            {row.status === sysConst.PROD_ITEM_STATUS[0].value &&
                                            <IconButton color="primary" edge="start" size="small" onClick={() => {initOrderInModal(row,'')}}>
                                                <i className="mdi mdi-login"/>
                                            </IconButton>}
                                            {row.status === sysConst.PROD_ITEM_STATUS[1].value &&
                                            <IconButton color="primary" edge="start" size="small" onClick={() => {initOrderInModal(row,'info')}}>
                                                <i className="mdi mdi-table-of-contents"/>
                                            </IconButton>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {storageInOutReducer.orderInData.dataList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={9} align="center">暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 上下页按钮 */}
                    <Box style={{textAlign: 'right', marginTop: 20}}>
                        {storageInOutReducer.orderInData.start > 0 && storageInOutReducer.orderInData.dataSize > 0 &&
                        <Button variant="contained" color="primary" style={{marginRight: 20}}
                                onClick={()=>{dispatch(storageInOutAction.getOrderInTabList(storageInOutReducer.orderInData.start-(storageInOutReducer.orderInData.size-1)))}}>上一页</Button>}
                        {storageInOutReducer.orderInData.dataSize >= storageInOutReducer.orderInData.size &&
                        <Button variant="contained" color="primary" onClick={()=>{dispatch(storageInOutAction.getOrderInTabList(storageInOutReducer.orderInData.start+(storageInOutReducer.orderInData.size-1)))}}>下一页</Button>}
                    </Box>

                    <SimpleModal maxWidth={'lg'}
                                 title="退单入库"
                                 open={orderInModalOpen}
                                 onClose={()=>{setOrderInModalOpen(false)}}
                                 showFooter={true}
                                 footer={
                                     <>
                                         {orderInModalData.pageType !== 'info' && Object.keys(orderInModalData.orderInStorageInfo).length > 0 &&
                                         <Button variant="contained" color="primary" onClick={submitOrderInModal}>确定</Button>}
                                         <Button variant="contained" onClick={()=>{setOrderInModalOpen(false)}}>关闭</Button>
                                     </>
                                 }
                    >
                        <Grid container spacing={2}>
                            {orderInModalData.pageType === 'info' &&
                            <>
                                <Typography gutterBottom className={classes.title}>库存信息</Typography>
                                <Grid container spacing={2} style={{marginBottom:10}}>
                                    <Grid item sm={3}>商品：{orderInModalData.orderInStorageInfo.product_name}</Grid>
                                    <Grid item sm={4}>仓库：{orderInModalData.orderInStorageInfo.storage_name}</Grid>
                                    <Grid item sm={4}>仓库分区：{orderInModalData.orderInStorageInfo.storage_area_name}</Grid>
                                    <Grid item sm={1}>数量：{orderInModalData.orderInStorageInfo.storage_count}</Grid>
                                    {orderInModalData.orderInStorageInfo.unique_flag == sysConst.UNIQUE_FLAG[1].value && orderInModalData.orderInStorageInfo.prod_unique_arr.length > 0 &&
                                    <>
                                        <Grid item sm={12}>唯一编码：</Grid>
                                        {orderInModalData.orderInStorageInfo.prod_unique_arr.map((item) => (
                                            <Grid item sm={4}>{item}</Grid>
                                        ))}
                                    </>}
                                </Grid>
                            </>}

                            {orderInModalData.pageType !== 'info' &&
                            <>
                                <Typography gutterBottom className={classes.title}>库存信息</Typography>
                                <Grid container spacing={2} style={{marginBottom:10}}>
                                    <Grid item sm={3}>商品：{orderInModalData.orderInStorageInfo.product_name || ''}</Grid>
                                    <Grid item sm={4}>仓库：{orderInModalData.orderInStorageInfo.storage_name || ''}</Grid>
                                    <Grid item sm={4}>仓库分区：{orderInModalData.orderInStorageInfo.storage_area_name || ''}</Grid>
                                    <Grid item sm={1}>数量：{orderInModalData.orderInStorageInfo.storage_count || ''}</Grid>
                                    <Grid item sm={12} style={{color:'red'}}>
                                        {Object.keys(orderInModalData.orderInStorageInfo).length > 0 ? '返库商品将重新放在原来的仓储位置' : '该退单暂未出库，不能入库'}
                                    </Grid>
                                </Grid>

                                {orderInModalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value &&
                                <Grid container spacing={1}>
                                    <Grid item sm={12}>
                                        <FormControlLabel key="select-all" label="全选"
                                                          control={
                                                              <Checkbox color="primary" key={'select-all-chk'}
                                                                        checked={orderInModalData.selectAll}
                                                                        onChange={(e) => {
                                                                            orderInModalData.purchaseItemUnique.forEach((item) => {
                                                                                item.checked = e.target.checked;
                                                                            });
                                                                            setOrderInModalData({
                                                                                ...orderInModalData,
                                                                                selectAll: e.target.checked,
                                                                                purchaseItemUnique: orderInModalData.purchaseItemUnique,
                                                                                prodCnt: e.target.checked ? orderInModalData.purchaseItemUnique.length : 0
                                                                            });
                                                                        }}
                                                              />
                                                          }
                                        />
                                    </Grid>
                                    {orderInModalData.purchaseItemUnique.map((row, index) => (
                                        <Grid item sm={4}>
                                            <FormControlLabel key={'checkbox_child_' + index} label={row.unique_id}
                                                              control={
                                                                  <Checkbox color="primary" key={'checkbox_child_chk_' + index}
                                                                            checked={row.checked == true}
                                                                            onChange={(e) => {
                                                                                orderInModalData.purchaseItemUnique[index].checked = e.target.checked;
                                                                                let selectedSize = 0;
                                                                                orderInModalData.purchaseItemUnique.forEach((item) => {
                                                                                    if (item.checked === true) {
                                                                                        selectedSize++;
                                                                                    }
                                                                                });
                                                                                setOrderInModalData({
                                                                                    ...orderInModalData,
                                                                                    selectAll: selectedSize === orderInModalData.purchaseItemUnique.length,
                                                                                    purchaseItemUnique: orderInModalData.purchaseItemUnique,
                                                                                    prodCnt: selectedSize
                                                                                });
                                                                            }}
                                                                  />
                                                              }
                                            />
                                        </Grid>))}
                                </Grid>}

                                <Grid container spacing={1} style={{marginBottom: 20}}>
                                    <Grid item xs={1}>
                                        <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" disabled value={orderInModalData.prodCnt}
                                                   error={validation.prodCnt&&validation.prodCnt!=''} helperText={validation.prodCnt}/>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormControl variant="outlined" fullWidth margin="dense">
                                            <InputLabel>是否全新</InputLabel>
                                            <Select label="是否全新"
                                                    value={orderInModalData.oldFlag}
                                                    onChange={(e, value) => {
                                                        setOrderInModalData({...orderInModalData, oldFlag:e.target.value});
                                                    }}
                                            >
                                                {sysConst.OLD_FLAG.map((item, index) => (
                                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                                      options={commonReducer.userList} getOptionLabel={(option) => option.real_name}
                                                      value={orderInModalData.reUser}
                                                      onChange={(event, value) => {
                                                          setOrderInModalData({...orderInModalData,reUser:value});
                                                      }}
                                                      renderInput={(params) => <TextField {...params} label="领用人" margin="dense" variant="outlined"
                                                                                          error={validation.reUser&&validation.reUser!=''} helperText={validation.reUser}/>}
                                        />
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={1} value={modalData.remark}
                                                   onChange={(e) => {setOrderInModalData({...orderInModalData,remark:e.target.value})}}/>
                                    </Grid>
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
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.userList} getOptionLabel={(option) => option.real_name}
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
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.supplierList} getOptionLabel={(option) => option.supplier_name}
                                              value={storageInOutReducer.orderOutParams.supplier}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setOrderOutParam({name: "supplier", value: value}));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.storageList} getOptionLabel={(option) => option.storage_name}
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
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.storageAreaList} getOptionLabel={(option) => option.storage_area_name}
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
                                        <TableCell align="center">{row.st_apply_user_name}</TableCell>
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
                                    <TableCell colSpan={10} align="center">暂无数据</TableCell>
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

                    <SimpleModal maxWidth={'lg'}
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
                        <Grid container spacing={1}>
                            <Grid item sm={4}>订单号：{orderOutModalData.orderItem.order_id}</Grid>
                            <Grid item sm={6}>商品：{orderOutModalData.orderItem.prod_name}</Grid>
                            <Grid item sm={2}>数量：{orderOutModalData.orderItem.prod_count}</Grid>

                            {orderOutModalData.pageType === 'info' &&
                            <>
                                {storageInOutReducer.storageProductList.map((row) => (
                                    <>
                                        <Grid item sm={2}><TextField fullWidth  margin="dense" variant="outlined" label="仓库" value={row.storage_name}/></Grid>
                                        <Grid item sm={2}><TextField fullWidth  margin="dense" variant="outlined" label="仓库分区" value={row.storage_area_name}/></Grid>
                                        <Grid item sm={1}><TextField fullWidth  margin="dense" variant="outlined" label="操作人员" value={row.real_name}/></Grid>
                                        <Grid item sm={7} container spacing={1}>
                                            <Grid item sm={2}><TextField fullWidth  margin="dense" variant="outlined" label="操作日期" value={commonUtil.getDate(row.created_on)}/></Grid>
                                            <Grid item sm={10}><TextField fullWidth  margin="dense" variant="outlined" label="备注" value={row.remark}/></Grid>
                                        </Grid>

                                        {row.unique_flag == sysConst.UNIQUE_FLAG[1].value && row.prod_unique_arr.length > 0 &&
                                        <>
                                            <Grid item sm={12}>唯一编码：</Grid>
                                            {row.prod_unique_arr.map((item) => (
                                                <Grid item sm={4}>{item}</Grid>
                                            ))}
                                        </>}
                                    </>
                                ))}
                            </>}

                            {orderOutModalData.pageType !== 'info' &&
                            <>
                                <Grid item sm={6}>
                                    <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                                  options={storageInOutReducer.storageProductList}
                                                  noOptionsText="无选项"
                                                  getOptionLabel={(option) => option.storage_name + '-' + option.storage_area_name + '-' + option.product_name + '-' + option.storage_count}
                                                  value={orderOutModalData.storageProduct}
                                                  onChange={(event, value) => {
                                                      if (value != null) {
                                                          let purchaseItemUnique = [];
                                                          if (value.unique_flag === sysConst.UNIQUE_FLAG[1].value && value.prod_unique_arr != null && value.prod_unique_arr.length > 0) {
                                                              value.prod_unique_arr.forEach((item) => {
                                                                  purchaseItemUnique.push({unique_id : item, checked : false});
                                                              });
                                                          }
                                                          setOrderOutModalData({...orderOutModalData,storageProduct:value, selectAll: false, prodCnt:0,uniqueFlag: value.unique_flag, purchaseItemUnique: purchaseItemUnique});
                                                      } else {
                                                          setOrderOutModalData({...orderOutModalData,storageProduct:value, selectAll: false, prodCnt:0,uniqueFlag: sysConst.UNIQUE_FLAG[0].value, purchaseItemUnique: []});
                                                      }
                                                  }}

                                                  renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                              error={validation.storageProduct&&validation.storageProduct!=''} helperText={validation.storageProduct}
                                                  />}
                                    />
                                </Grid>

                                <Grid item sm={4}>
                                    <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                                  options={commonReducer.userList} getOptionLabel={(option) => option.real_name}
                                                  value={orderOutModalData.reUser}
                                                  onChange={(event, value) => {
                                                      setOrderOutModalData({...orderOutModalData,reUser:value});
                                                  }}
                                                  renderInput={(params) => <TextField {...params} label="领用人" margin="dense" variant="outlined"
                                                              error={validation.reUser&&validation.reUser!=''} helperText={validation.reUser}/>}
                                    />
                                </Grid>

                                {orderOutModalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value &&
                                <Grid item xs={2}>
                                    <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" disabled value={orderOutModalData.prodCnt}
                                               error={validation.prodCnt&&validation.prodCnt!=''} helperText={validation.prodCnt}/>
                                </Grid>}
                                {orderOutModalData.uniqueFlag != sysConst.UNIQUE_FLAG[1].value &&
                                <Grid item xs={2}>
                                    <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" disabled value={orderOutModalData.orderItem.prod_count}/>
                                </Grid>}

                                {orderOutModalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value &&
                                <Grid item sm={12} container>
                                    <Grid item sm={12}>
                                        <FormControlLabel key="select-all" label="全选"
                                                          control={
                                                              <Checkbox color="primary" key={'select-all-chk'}
                                                                        checked={orderOutModalData.selectAll}
                                                                        onChange={(e) => {
                                                                            orderOutModalData.purchaseItemUnique.forEach((item) => {
                                                                                item.checked = e.target.checked;
                                                                            });
                                                                            setOrderOutModalData({
                                                                                ...orderOutModalData,
                                                                                selectAll: e.target.checked,
                                                                                purchaseItemUnique: orderOutModalData.purchaseItemUnique,
                                                                                prodCnt: e.target.checked ? orderOutModalData.purchaseItemUnique.length : 0
                                                                            });
                                                                        }}
                                                              />
                                                          }
                                        />
                                    </Grid>
                                    {orderOutModalData.purchaseItemUnique.map((row, index) => (
                                        <Grid item sm={4}>
                                            <FormControlLabel key={'checkbox_child_' + index} label={row.unique_id}
                                                              control={
                                                                  <Checkbox color="primary" key={'checkbox_child_chk_' + index}
                                                                            checked={row.checked == true}
                                                                            onChange={(e) => {
                                                                                orderOutModalData.purchaseItemUnique[index].checked = e.target.checked;
                                                                                let selectedSize = 0;
                                                                                orderOutModalData.purchaseItemUnique.forEach((item) => {
                                                                                    if (item.checked === true) {
                                                                                        selectedSize++;
                                                                                    }
                                                                                });
                                                                                setOrderOutModalData({
                                                                                    ...orderOutModalData,
                                                                                    selectAll: selectedSize === orderOutModalData.purchaseItemUnique.length,
                                                                                    purchaseItemUnique: orderOutModalData.purchaseItemUnique,
                                                                                    prodCnt: selectedSize
                                                                                });
                                                                            }}
                                                                  />
                                                              }
                                            />
                                        </Grid>))}
                                </Grid>}

                                <Grid item xs={12}>
                                    <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={1} value={orderOutModalData.remark}
                                               onChange={(e) => {setOrderOutModalData({...orderOutModalData,remark:e.target.value})}}/>
                                </Grid>
                            </>}
                        </Grid>
                    </SimpleModal>
                </TabPanel>

                {/* 出入库 */}
                <TabPanel value="storage">
                    <Grid container spacing={3}>
                        <Grid container item xs={9} spacing={1}>
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
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.storageList} getOptionLabel={(option) => option.storage_name}
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
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.storageAreaList} getOptionLabel={(option) => option.storage_area_name}
                                              noOptionsText="无选项"
                                              value={storageInOutReducer.storageProductDetailParams.storageArea}
                                              onChange={(event, value) => {
                                                  dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "storageArea", value: value}));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.supplierList} getOptionLabel={(option) => option.supplier_name}
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
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>是否全新</InputLabel>
                                    <Select label="是否全新"
                                            value={storageInOutReducer.storageProductDetailParams.oldFlag}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "oldFlag", value: e.target.value}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {sysConst.OLD_FLAG.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>是否唯一编码</InputLabel>
                                    <Select label="是否唯一编码"
                                            value={storageInOutReducer.storageProductDetailParams.uniqueFlag}
                                            onChange={(e, value) => {
                                                dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "uniqueFlag", value: e.target.value}));
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {sysConst.UNIQUE_FLAG.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {storageInOutReducer.storageProductDetailParams.uniqueFlag == 1 &&
                            <Grid item xs={2}>
                                <TextField label="唯一编码" fullWidth margin="dense" variant="outlined" value={storageInOutReducer.storageProductDetailParams.prodUniqueId}
                                           onChange={(e)=>{dispatch(StorageInOutActionType.setStorageProductDetailParam({name: "prodUniqueId", value: e.target.value}))}}/>
                            </Grid>}

                        </Grid>
                        <Grid container item xs={3} spacing={1} style={{textAlign:'right',marginTop: 30}}>
                            {/*查询按钮*/}
                            <Grid item xs={3}>
                                <Fab color="primary" size="small" onClick={()=>{dispatch(storageInOutAction.getStorageProductRelDetailList(0))}}>
                                    <i className="mdi mdi-magnify mdi-24px"/>
                                </Fab>
                            </Grid>

                            <Grid item xs={3}>
                                <Fab color="primary" size="small" onClick={downLoadCsv}>
                                    <i className="mdi mdi-cloud-download mdi-24px"/>
                                </Fab>
                            </Grid>

                            <Grid item xs={3}><Fab color="primary" size="small" onClick={()=>{initModal('in')}}>入</Fab></Grid>
                            <Grid item xs={3}><Fab color="primary" size="small" onClick={()=>{initModal('out')}}>出</Fab></Grid>
                        </Grid>
                    </Grid>

                    {/* 下部分：检索结果显示区域 */}
                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="center">编号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                                    <TableCell className={classes.tableHead} align="center">商品</TableCell>
                                    <TableCell className={classes.tableHead} align="center">全新</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库分区</TableCell>
                                    <TableCell className={classes.tableHead} align="center">出/入库</TableCell>
                                    <TableCell className={classes.tableHead} align="center">出/入库子分类</TableCell>
                                    <TableCell className={classes.tableHead} align="center">数量</TableCell>
                                    <TableCell className={classes.tableHead} align="center">领用人</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作人员</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作日期</TableCell>
                                    <TableCell className={classes.tableHead} align="center">操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {storageInOutReducer.storageProductDetail.dataList.map((row) => (
                                    <TableRow key={'storage-product-detail-' + row.id}>
                                        <TableCell align="center">{row.id}</TableCell>
                                        <TableCell align="center">{row.purchase_id == 0 ? '' : row.purchase_id}</TableCell>
                                        <TableCell align="center">{row.supplier_name}</TableCell>
                                        <TableCell align="center">{row.product_name}</TableCell>
                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.OLD_FLAG, row.old_flag)}</TableCell>
                                        <TableCell align="center">{row.storage_name}</TableCell>
                                        <TableCell align="center">{row.storage_area_name}</TableCell>
                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.STORAGE_OP_TYPE, row.storage_type)}</TableCell>
                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.STORAGE_OP_SUB_TYPE, row.storage_sub_type)}</TableCell>
                                        <TableCell align="center">{row.storage_count}</TableCell>
                                        <TableCell align="center">{row.apply_real_name}</TableCell>
                                        <TableCell align="center">{row.real_name}</TableCell>
                                        <TableCell align="center">{commonUtil.getDateTime(row.created_on)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="primary" edge="start" size="small"
                                                        onClick={() => {
                                                            setModalData({...modalData,dataItem: row});
                                                            setUniqueModalOpen(true);
                                                        }}
                                                        disabled={row.unique_flag === sysConst.UNIQUE_FLAG[0].value}
                                            >
                                                <i className="mdi mdi-barcode-scan"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {storageInOutReducer.storageProductDetail.dataList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={14} align="center">暂无数据</TableCell>
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

                    <SimpleModal maxWidth='lg'
                                 title={modalData.type === 'out' ? '内部领料出库' : '内部退料入库'}
                                 open={modalOpen}
                                 onClose={()=>{setModalOpen(false)}}
                                 showFooter={true}
                                 footer={
                                     modalData.type === 'out' ?
                                     <>
                                         <Button variant="contained" color="primary" onClick={()=>{submitModal(null)}}>确定</Button>
                                         <Button variant="contained" onClick={()=>{setModalOpen(false)}}>关闭</Button>
                                     </>
                                         :
                                     <>
                                         <Button variant="contained" onClick={modalData.activeStep===0 ? (()=>{setModalOpen(false)}) : (()=>{setModalData({...modalData, activeStep: modalData.activeStep-1})})}>
                                             {modalData.activeStep===0 ? '关闭' : '返回'}
                                         </Button>
                                         <Button variant="contained" color="primary" onClick={() => {submitModal(modalData.activeStep)}}> {modalData.activeStep === modalData.steps.length - 1 ? '完成' : '下一步'}</Button>
                                     </>
                                 }
                    >
                        {modalData.type === 'out' &&
                        <Grid container spacing={1}>
                            <Grid item sm={6}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.productList} getOptionLabel={(option) => option.product_name}
                                              value={modalData.product}
                                              onChange={(event, value) => {
                                                  setModalData({
                                                      ...modalData,
                                                      product: value,
                                                      storageProduct: null,
                                                      selectAll: false,
                                                      prodCnt: 0,
                                                      uniqueFlag: sysConst.UNIQUE_FLAG[0].value,
                                                      purchaseItemUnique: []
                                                  });
                                                  if (value != null) {
                                                      dispatch(storageInOutAction.getStorageProduct(value.id));
                                                  } else {
                                                      dispatch(StorageInOutActionType.setStorageProductList([]));
                                                  }

                                              }}
                                              renderInput={(params) => <TextField {...params} label="商品" margin="dense" variant="outlined"
                                                                                  error={validation.product&&validation.product!=''} helperText={validation.product}
                                              />}
                                />
                            </Grid>

                            <Grid item sm={6}>
                                <Autocomplete ListboxProps={{style: {maxHeight: '175px'}}} fullWidth noOptionsText="无选项"
                                              options={storageInOutReducer.storageProductList}
                                              getOptionLabel={(option) => option.storage_name + '-' + option.storage_area_name + '-' + option.product_name + '-' + option.storage_count}
                                              value={modalData.storageProduct}
                                              onChange={(event, value) => {
                                                  if (value != null) {
                                                      let purchaseItemUnique = [];
                                                      if (value.unique_flag === sysConst.UNIQUE_FLAG[1].value && value.prod_unique_arr != null && value.prod_unique_arr.length > 0) {
                                                          value.prod_unique_arr.forEach((item) => {
                                                              purchaseItemUnique.push({unique_id : item, checked : false});
                                                          });
                                                      }
                                                      setModalData({...modalData,storageProduct:value, selectAll: false, prodCnt:0,uniqueFlag: value.unique_flag, purchaseItemUnique: purchaseItemUnique});
                                                  } else {
                                                      setModalData({...modalData,storageProduct:value, selectAll: false, prodCnt:0,uniqueFlag: sysConst.UNIQUE_FLAG[0].value, purchaseItemUnique: []});
                                                  }
                                              }}
                                              renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                                  error={validation.storageProduct&&validation.storageProduct!=''} helperText={validation.storageProduct}
                                              />}
                                />
                            </Grid>

                            {modalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value && modalData.purchaseItemUnique.length > 0 &&
                            <Grid item sm={12} container>
                                <Grid item sm={12}>
                                    <FormControlLabel key="select-all" label="全选"
                                                      control={
                                                          <Checkbox color="primary" key={'select-all-chk'}
                                                                    checked={modalData.selectAll}
                                                                    onChange={(e) => {
                                                                        modalData.purchaseItemUnique.forEach((item) => {
                                                                            item.checked = e.target.checked;
                                                                        });
                                                                        setModalData({
                                                                            ...modalData,
                                                                            selectAll: e.target.checked,
                                                                            purchaseItemUnique: modalData.purchaseItemUnique,
                                                                            prodCnt: e.target.checked ? modalData.purchaseItemUnique.length : 0
                                                                        });
                                                                    }}
                                                          />
                                                      }
                                    />
                                </Grid>
                                {modalData.purchaseItemUnique.map((row, index) => (
                                    <Grid item sm={4}>
                                        <FormControlLabel key={'checkbox_child_' + index} label={row.unique_id}
                                                          control={
                                                              <Checkbox color="primary" key={'checkbox_child_chk_' + index}
                                                                        checked={row.checked == true}
                                                                        onChange={(e) => {
                                                                            modalData.purchaseItemUnique[index].checked = e.target.checked;
                                                                            let selectedSize = 0;
                                                                            modalData.purchaseItemUnique.forEach((item) => {
                                                                                if (item.checked === true) {
                                                                                    selectedSize++;
                                                                                }
                                                                            });
                                                                            setModalData({
                                                                                ...modalData,
                                                                                selectAll: selectedSize === modalData.purchaseItemUnique.length,
                                                                                purchaseItemUnique: modalData.purchaseItemUnique,
                                                                                prodCnt: selectedSize
                                                                            });
                                                                        }}
                                                              />
                                                          }
                                        />
                                    </Grid>))}
                            </Grid>}

                            <Grid item xs={12} container spacing={1}>
                                <Grid item xs={2}>
                                    <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" value={modalData.prodCnt}
                                               disabled={modalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value}
                                               onChange={(e) => {setModalData({...modalData,prodCnt:e.target.value})}}
                                               error={validation.prodCnt&&validation.prodCnt!=''} helperText={validation.prodCnt}/>
                                </Grid>

                                <Grid item sm={2}>
                                    <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                                  options={commonReducer.userList} getOptionLabel={(option) => option.real_name}
                                                  value={modalData.reUser}
                                                  onChange={(event, value) => {
                                                      setModalData({...modalData,reUser:value});
                                                  }}
                                                  renderInput={(params) => <TextField {...params} label="领用人" margin="dense" variant="outlined"
                                                                                      error={validation.reUser&&validation.reUser!=''} helperText={validation.reUser}/>}
                                    />
                                </Grid>

                                <Grid item xs={8}>
                                    <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={1} value={modalData.remark}
                                               onChange={(e) => {setModalData({...modalData,remark:e.target.value})}}/>
                                </Grid>
                            </Grid>
                        </Grid>}

                        {modalData.type === 'in' &&
                        <>
                            {/* 步骤标题 */}
                            <Stepper activeStep={modalData.activeStep} alternativeLabel>
                                {modalData.steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
                            </Stepper>

                            {/* 步骤内容 */}
                            <div align="center">
                                {/*第一步添加ID*/}
                                <div style={{display:modalData.activeStep==0?'block':'none', overflow: 'hidden'}}>
                                    <TextField label="出库编号" margin="dense" variant="outlined" value={modalData.inOutNo}
                                               onChange={(e)=>{setModalData({...modalData,inOutNo:e.target.value})}}
                                               error={validation.inOutNo&&validation.inOutNo!=''} helperText={validation.inOutNo}/>
                                </div>
                                {/* 第二步添加商品详情 */}
                                <div style={{display:modalData.activeStep==!0?'block':'none',margin:'20px 0',textAlign:'left'}}>
                                    <Typography gutterBottom className={classes.title}>出入库信息</Typography>
                                    {modalData.storageProdRelDetail != null &&
                                    <Grid container spacing={2} style={{marginBottom:10}}>
                                        <Grid item sm={6}>出库编号：{modalData.storageProdRelDetail.id}</Grid>
                                        <Grid item sm={6}>商品：{modalData.storageProdRelDetail.product_name}</Grid>
                                        <Grid item sm={6}>仓库：{modalData.storageProdRelDetail.storage_name}</Grid>
                                        <Grid item sm={6}>仓库分区：{modalData.storageProdRelDetail.storage_area_name}</Grid>
                                        <Grid item sm={6}>数量：{modalData.storageProdRelDetail.storage_count}</Grid>
                                        <Grid item sm={12} style={{color:'red'}}>返库商品将重新放在原来的仓储位置</Grid>
                                    </Grid>}

                                    {modalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value && modalData.purchaseItemUnique.length > 0 &&
                                    <Grid item sm={12} container>
                                        <Grid item sm={12}>
                                            <FormControlLabel key="select-all" label="全选"
                                                              control={
                                                                  <Checkbox color="primary" key={'select-all-chk'}
                                                                            checked={modalData.selectAll}
                                                                            onChange={(e) => {
                                                                                modalData.purchaseItemUnique.forEach((item) => {
                                                                                    item.checked = e.target.checked;
                                                                                });
                                                                                setModalData({
                                                                                    ...modalData,
                                                                                    selectAll: e.target.checked,
                                                                                    purchaseItemUnique: modalData.purchaseItemUnique,
                                                                                    prodCnt: e.target.checked ? modalData.purchaseItemUnique.length : 0
                                                                                });
                                                                            }}
                                                                  />
                                                              }
                                            />
                                        </Grid>
                                        {modalData.purchaseItemUnique.map((row, index) => (
                                            <Grid item sm={4}>
                                                <FormControlLabel key={'checkbox_child_' + index} label={row.unique_id}
                                                                  control={
                                                                      <Checkbox color="primary" key={'checkbox_child_chk_' + index}
                                                                                checked={row.checked == true}
                                                                                onChange={(e) => {
                                                                                    modalData.purchaseItemUnique[index].checked = e.target.checked;
                                                                                    let selectedSize = 0;
                                                                                    modalData.purchaseItemUnique.forEach((item) => {
                                                                                        if (item.checked === true) {
                                                                                            selectedSize++;
                                                                                        }
                                                                                    });
                                                                                    setModalData({
                                                                                        ...modalData,
                                                                                        selectAll: selectedSize === modalData.purchaseItemUnique.length,
                                                                                        purchaseItemUnique: modalData.purchaseItemUnique,
                                                                                        prodCnt: selectedSize
                                                                                    });
                                                                                }}
                                                                      />
                                                                  }
                                                />
                                            </Grid>))}
                                    </Grid>}
                                    <Grid container spacing={1}>
                                    <Grid item xs={1}>
                                        <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" value={modalData.prodCnt}
                                                   disabled={modalData.uniqueFlag == sysConst.UNIQUE_FLAG[1].value}
                                                   onChange={(e) => {setModalData({...modalData,prodCnt:e.target.value})}}
                                                   error={validation.prodCnt&&validation.prodCnt!=''} helperText={validation.prodCnt}/>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <FormControl variant="outlined" fullWidth margin="dense">
                                            <InputLabel>是否全新</InputLabel>
                                            <Select label="是否全新"
                                                    disabled={modalData.storageProdRelDetail && modalData.storageProdRelDetail.old_flag === sysConst.OLD_FLAG[1].value}
                                                    value={modalData.oldFlag}
                                                    onChange={(e, value) => {
                                                        setModalData({...modalData,oldFlag:e.target.value});
                                                    }}
                                            >
                                                {sysConst.OLD_FLAG.map((item, index) => (
                                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                                      options={commonReducer.userList} getOptionLabel={(option) => option.real_name}
                                                      value={modalData.reUser}
                                                      onChange={(event, value) => {
                                                          setModalData({...modalData,reUser:value});
                                                      }}
                                                      renderInput={(params) => <TextField {...params} label="领用人" margin="dense" variant="outlined"
                                                                                          error={validation.reUser&&validation.reUser!=''} helperText={validation.reUser}/>}
                                        />
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={1} value={modalData.remark}
                                                   onChange={(e) => {setModalData({...modalData,remark:e.target.value})}}/>
                                    </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </>}
                    </SimpleModal>

                    <SimpleModal maxWidth='md' showFooter={true} title="唯一编码" open={uniqueModalOpen}
                                 onClose={()=>{setUniqueModalOpen(false)}}
                                 footer={<Button variant="contained" onClick={()=>{setUniqueModalOpen(false)}}>关闭</Button>}
                    >
                        <Grid container spacing={2}>
                            {modalData.dataItem.unique_flag === sysConst.UNIQUE_FLAG[1].value &&
                            <Grid item sm={12} container spacing={2}>
                                {modalData.dataItem.prod_unique_arr.map((item) => (
                                    <Grid item sm={6}>{item}</Grid>
                                ))}
                            </Grid>}
                        </Grid>
                    </SimpleModal>
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
        dispatch(commonAction.getSupplierList());
        dispatch(commonAction.getUserList());
        dispatch(commonAction.getProductList(null));
    },
    // 出入库 TAB
    downLoadCsv: () => {
        dispatch(storageInOutAction.downLoadCsv())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageInOut)