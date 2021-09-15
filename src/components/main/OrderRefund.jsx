import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
// 引入material-ui基础组件
import {
    Box,
    Button,
    Checkbox,
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
import {DatePicker} from '@material-ui/pickers';
// 引入Dialog
import {SimpleModal} from "../index";
import {OrderRefundActionType} from "../../types";

const orderRefundAction = require('../../actions/main/OrderRefundAction');
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

function OrderRefund(props) {
    const {orderRefundReducer, commonReducer, fromDetail} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        // 详情页面 返回 保留reducer，否则，清空
        if (!fromDetail) {
            let queryParams = {
                orderId: '',
                status: '',
                paymentStatus: '',
                paymentType: '',
                dateStart: '',
                dateEnd: ''
            };
            dispatch(OrderRefundActionType.setQueryParams(queryParams));
        }
        dispatch(orderRefundAction.getOrderRefundList(props.orderRefundReducer.orderRefundData.start));
    }, []);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 模态数据
    const [modalData, setModalData] = React.useState({serviceList: [], productList: [], steps: ['选择订单编号', '填写退单详情']});
    // 模态校验
    const [validation, setValidation] = useState({productList: [], serviceList: []});

    const initModal = () => {
        setValidation({inputId: '', productList: [], serviceList: [], nodata: ''});
        setModalData({
            ...modalData,
            inputId: '',
            orderInfo: null,
            activeStep: 0,
            serviceList: [],
            productList: [],
            transferRefundPrice: '0',
            remark: ''
        });
        setModalOpen(true);
    };

    const submitModal = async (step) => {
        const validateObj = {};
        // 选择订单编号
        if (step === 0) {
            if (!modalData.inputId) {
                setValidation({...validation, inputId: '请输入订单编号'});
            }
            if (Object.keys(validateObj).length === 0) {
                let ret = await dispatch(orderRefundAction.getOrderInfo(modalData.inputId));
                if (ret.length > 0) {
                    let serviceList = await dispatch(orderRefundAction.getOrderItemService(modalData.inputId));
                    let refundServiceList = await dispatch(orderRefundAction.getOrderRefundService(modalData.inputId));
                    let productList = await dispatch(orderRefundAction.getOrderItemProd(modalData.inputId));
                    let refundProductList = await dispatch(orderRefundAction.getOrderRefundProd(modalData.inputId));
                    let newServiceList = [];
                    let newProductList = [];
                    let has = false;
                    for (let i = 0; i < serviceList.length; i++) {
                        has = false;
                        for (let j = 0; j < refundServiceList.length; j++) {
                            if (serviceList[i].id == refundServiceList[j].item_service_id) {
                                has = true;
                                break;
                            }
                        }
                        // 没有退的情况下，可以继续申请退
                        serviceList[i].disabled = has;
                        serviceList[i].remark = '';
                        serviceList[i].itemServiceId = serviceList[i].id;
                        serviceList[i].serviceRefundPrice = '0';
                        newServiceList.push(serviceList[i]);
                    }
                    for (let i = 0; i < productList.length; i++) {
                        has = false;
                        for (let j = 0; j < refundProductList.length; j++) {
                            if (productList[i].id == refundProductList[j].item_prod_id) {
                                has = true;
                                break;
                            }
                        }
                        // 没有退的情况下，可以继续申请退
                        productList[i].disabled = has;
                        productList[i].remark = '';
                        productList[i].itemProdId = productList[i].id;
                        productList[i].prodRefundCount = productList[i].prod_count;
                        // productList[i].prodRefundCount = productList[i].unique_flag == sysConst.UNIQUE_FLAG[1].value ? '0' : productList[i].prod_count;
                        productList[i].prodRefundPrice = '0';
                        newProductList.push(productList[i]);
                    }
                    setModalData({
                        ...modalData,
                        orderInfo: ret[0],
                        serviceList: newServiceList,
                        productList: newProductList,
                        activeStep: modalData.activeStep + 1
                    });
                } else {
                    setValidation({...validation, inputId: '没有该订单记录,请重新输入'});
                }
            }
        }

        // 填写退单详情
        if (step === 1) {
            let errCnt = 0;
            let checkedService = [];
            let validateService = [];
            for (let i = 0; i < modalData.serviceList.length; i++) {
                validateService.push({serviceRefundPrice:''});
                if (modalData.serviceList[i].checked) {
                    if (modalData.serviceList[i].serviceRefundPrice == '') {
                        validateService[i].serviceRefundPrice = "退款金额不能空";
                        errCnt++;
                    } else if (modalData.serviceList[i].serviceRefundPrice > 0) {
                        validateService[i].serviceRefundPrice = "退款金额不能大于0";
                        errCnt++;
                    }
                    checkedService.push(modalData.serviceList[i]);
                }
            }

            let checkedProduct = [];
            let validateProduct = [];
            for (let i =0;i<modalData.productList.length;i++) {
                validateProduct.push({prodRefundCount:'', prodRefundPrice:''});
                if (modalData.productList[i].checked) {
                    if (modalData.productList[i].prodRefundPrice == '') {
                        validateProduct[i].prodRefundPrice = "退款金额不能空";
                        errCnt++;
                    } else if (modalData.productList[i].prodRefundPrice > 0) {
                        validateProduct[i].prodRefundPrice = "退款金额不能大于0";
                        errCnt++;
                    }
                    if (modalData.productList[i].prodRefundCount == '') {
                        validateProduct[i].prodRefundCount = "退货数不能空";
                        errCnt++;
                    } else if (modalData.productList[i].prodRefundCount < 0) {
                        validateProduct[i].prodRefundCount = "退款金额不能小于0";
                        errCnt++;
                    } else if (modalData.productList[i].prodRefundCount > modalData.productList[i].prod_count) {
                        validateProduct[i].prodRefundCount = "退货数不能大于商品数";
                        errCnt++;
                    }
                    checkedProduct.push(modalData.productList[i]);
                }
            }
            setValidation({...validation, serviceList: validateService, productList: validateProduct, transferRefundPrice: '', nodata: ''});

            if (checkedService.length === 0 && checkedProduct.length === 0) {
                setValidation({...validation, transferRefundPrice:'', nodata: '必须添加服务或商品'});
            } else {
                if (errCnt === 0) {
                    if (!modalData.transferRefundPrice) {
                        setValidation({...validation, serviceList: [], productList: [], transferRefundPrice: '请输入退单运费', nodata: ''});
                    } else {
                        dispatch(orderRefundAction.saveModalData({...modalData,checkedService: checkedService, checkedProduct: checkedProduct}));
                        setModalOpen(false);
                    }
                }
            }
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>退单信息</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={1}>
                    <Grid item xs={2}>
                        <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number" value={orderRefundReducer.queryParams.orderId}
                                   onChange={(e, value) => {
                                       dispatch(OrderRefundActionType.setQueryParam({name: "orderId", value: e.target.value}));
                                   }}
                       />
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>退单状态</InputLabel>
                            <Select label="退单状态" value={orderRefundReducer.queryParams.status}
                                    onChange={(e, value) => {
                                        dispatch(OrderRefundActionType.setQueryParam({name: "status", value: e.target.value}));
                                    }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.ORDER_REFUND_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>支付状态</InputLabel>
                            <Select label="支付状态" value={orderRefundReducer.queryParams.paymentStatus}
                                    onChange={(e, value) => {
                                        dispatch(OrderRefundActionType.setQueryParam({name: "paymentStatus", value: e.target.value}));
                                    }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.ORDER_PAYMENT_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/*<Grid item xs={2}>*/}
                    {/*    <FormControl variant="outlined" fullWidth margin="dense">*/}
                    {/*        <InputLabel>支付方式</InputLabel>*/}
                    {/*        <Select label="支付方式" value={orderRefundReducer.queryParams.paymentType}*/}
                    {/*                onChange={(e, value) => {*/}
                    {/*                    dispatch(OrderRefundActionType.setQueryParam({name: "paymentType", value: e.target.value}));*/}
                    {/*                }}*/}
                    {/*        >*/}
                    {/*            <MenuItem value="">请选择</MenuItem>*/}
                    {/*            {sysConst.PAYMENT_TYPE.map((item, index) => (*/}
                    {/*                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>*/}
                    {/*            ))}*/}
                    {/*        </Select>*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}

                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（始）"
                                    value={orderRefundReducer.queryParams.dateStart == "" ? null : orderRefundReducer.queryParams.dateStart}
                                    onChange={(date)=>{
                                        dispatch(OrderRefundActionType.setQueryParam({name: "dateStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（终）"
                                    value={orderRefundReducer.queryParams.dateEnd == "" ? null : orderRefundReducer.queryParams.dateEnd}
                                    onChange={(date)=>{
                                        dispatch(OrderRefundActionType.setQueryParam({name: "dateEnd", value: date}))
                                    }}
                        />
                    </Grid>
                </Grid>

                <Grid item xs={2} container>
                    {/*查询按钮*/}
                    <Grid item xs={6}>
                        <Fab color="primary" size="small" onClick={() => {dispatch(orderRefundAction.getOrderRefundList(0))}}>
                            <i className="mdi mdi-magnify mdi-24px"/>
                        </Fab>
                    </Grid>

                    {/*追加按钮*/}
                    <Grid item xs={6}>
                        <Fab color="primary" size="small" onClick={initModal}>
                            <i className="mdi mdi-plus mdi-24px"/>
                        </Fab>
                    </Grid>

                    {/*<Grid item xs={4}>*/}
                    {/*    <Fab color="primary" size="small" onClick={() => {*/}
                    {/*        dispatch(orderRefundAction.downLoadCsv())*/}
                    {/*    }}>*/}
                    {/*        <i className="mdi mdi-cloud-download mdi-24px"/>*/}
                    {/*    </Fab>*/}
                    {/*</Grid>*/}
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">退单号</TableCell>
                            <TableCell className={classes.tableHead} align="center">订单号</TableCell>
                            <TableCell className={classes.tableHead} align="center">退单状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">支付状态</TableCell>
                            {/*<TableCell className={classes.tableHead} align="center">支付方式</TableCell>*/}
                            <TableCell className={classes.tableHead} align="center">服务退款</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品退款</TableCell>
                            <TableCell className={classes.tableHead} align="center">退货运费</TableCell>
                            <TableCell className={classes.tableHead} align="center">退货数量</TableCell>
                            <TableCell className={classes.tableHead} align="center">完成日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderRefundReducer.orderRefundData.dataList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="center">{row.order_id}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_REFUND_STATUS, row.status)}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_PAYMENT_STATUS, row.payment_status)}</TableCell>
                                {/*<TableCell align="center">{commonUtil.getJsonValue(sysConst.PAYMENT_TYPE, row.payment_type)}</TableCell>*/}
                                <TableCell align="center">{row.service_refund_price}</TableCell>
                                <TableCell align="center">{row.prod_refund_price}</TableCell>
                                <TableCell align="center">{row.transfer_refund_price}</TableCell>
                                <TableCell align="center">{row.prod_refund_count}</TableCell>
                                <TableCell align="center">{row.date_id}</TableCell>
                                <TableCell align="center">
                                    {/* 详细按钮 */}
                                    <IconButton color="primary" edge="start" size="small">
                                        <Link to={{pathname: '/order_refund/' + row.id}}><i className="mdi mdi-table-search"/></Link>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {orderRefundReducer.orderRefundData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={10} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {orderRefundReducer.orderRefundData.start > 0 && orderRefundReducer.orderRefundData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={() => {
                            dispatch(orderRefundAction.getOrderRefundList(orderRefundReducer.orderRefundData.start - (orderRefundReducer.orderRefundData.size - 1)))
                        }}>上一页</Button>}
                {orderRefundReducer.orderRefundData.dataSize >= orderRefundReducer.orderRefundData.size &&
                <Button variant="contained" color="primary"
                        onClick={() => {
                            dispatch(orderRefundAction.getOrderRefundList(orderRefundReducer.orderRefundData.start + (orderRefundReducer.orderRefundData.size - 1)))
                        }}>下一页</Button>}
            </Box>

            <SimpleModal maxWidth='lg'
                         title='新增退单'
                         open={modalOpen}
                         onClose={() => {setModalOpen(false)}}
                         showFooter={true}
                         footer={
                             <>
                                 <Button variant="contained" onClick={modalData.activeStep===0 ? (() => {setModalOpen(false)}) : (() => {setModalData({...modalData, activeStep: modalData.activeStep - 1})})}>
                                     {modalData.activeStep === 0 ? '关闭' : '返回'}
                                 </Button>
                                 <Button variant="contained" color="primary" onClick={() => {submitModal(modalData.activeStep)}}> {modalData.activeStep === modalData.steps.length - 1 ? '完成' : '下一步'}</Button>
                             </>
                         }
            >

                {/* 步骤标题 */}
                <Stepper activeStep={modalData.activeStep} alternativeLabel>
                    {modalData.steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
                </Stepper>

                {/* 步骤内容 */}
                <div align="center">
                    {/*第一步添加ID*/}
                    <div style={{display: modalData.activeStep === 0 ? 'block' : 'none', overflow: 'hidden'}}>
                        <TextField label="订单编号" margin="dense" variant="outlined" value={modalData.inputId}
                                   onChange={(e) => {
                                       setModalData({...modalData, inputId: e.target.value})
                                   }}
                                   error={validation.inputId && validation.inputId != ''}
                                   helperText={validation.inputId}/>
                    </div>
                    {/* 第二步添加商品详情 */}
                    <div style={{
                        display: modalData.activeStep !== 0 ? 'block' : 'none',
                        margin: '20px 0',
                        textAlign: 'left'
                    }}>
                        <Typography gutterBottom className={classes.title}>订单信息</Typography>
                        {modalData.orderInfo != null &&
                        <Grid container spacing={2} style={{marginBottom: 10}}>
                            <Grid item sm={4}>车牌：{modalData.orderInfo.client_serial}</Grid>
                            <Grid item sm={4}>客户姓名：{modalData.orderInfo.client_name}</Grid>
                            <Grid item sm={4}>客户电话：{modalData.orderInfo.client_tel}</Grid>
                            <Grid item sm={4}>服务费：{modalData.orderInfo.actual_service_price}</Grid>
                            <Grid item sm={4}>商品金额：{modalData.orderInfo.actual_prod_price}</Grid>
                            <Grid item sm={4}>实际金额：{modalData.orderInfo.total_actual_price}</Grid>
                        </Grid>}

                        {/* 下部分：订单服务列表 */}
                        <Grid container spacing={1}>
                            <Grid item container sm={1}><Typography gutterBottom className={classes.title}>服务</Typography></Grid>
                            <Grid item container sm={11}>
                                <Typography gutterBottom style={{color: 'red',fontSize: 13, paddingTop: 5}}>{validation.nodata}</Typography>
                            </Grid>
                        </Grid>

                        {modalData.serviceList.map((item, index) => (
                            <Grid container spacing={1} key={index}>
                                <Grid item container xs={2}>
                                    <Grid item xs={3} style={{paddingTop: 5}}>
                                        <Checkbox checked={item.checked} disabled={item.disabled}
                                                  onChange={(e) => {
                                                      modalData.serviceList[index].checked = e.target.checked;
                                                  }}/>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Autocomplete fullWidth disableClearable disabled ListboxProps={{style: {maxHeight: '175px'}}} options={commonReducer.saleServiceList}
                                                      getOptionLabel={(option) => option.service_name}
                                                      value={{id: item.sale_service_id,service_name: item.sale_service_name}}
                                                      renderInput={(params) => <TextField {...params} label="服务名称" margin="dense" variant="outlined"/>}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid item container xs={4} spacing={1}>
                                    {item.fixed_price != 0 &&
                                    <Grid item xs={5}>
                                        <TextField label="固定售价" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.fixed_price}/>
                                    </Grid>}
                                    {item.fixed_price == 0 &&
                                    <>
                                        <Grid item xs={3}>
                                            <TextField label="单价" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.unit_price}/>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField label="数量" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.service_count}/>
                                        </Grid>
                                    </>}

                                    <Grid item xs={3}>
                                        <TextField label="折扣" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.discount_service_price}/>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <TextField label="实际价格" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.actual_service_price}/>
                                    </Grid>
                                </Grid>

                                <Grid item container xs={6} spacing={1}>
                                    <Grid item xs={3}>
                                        <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.serviceRefundPrice}
                                                   onChange={(e)=>{
                                                       modalData.serviceList[index].serviceRefundPrice = e.target.value;
                                                       setModalData({...modalData, serviceList:modalData.serviceList});
                                                   }}
                                                   error={validation.serviceList.length>0 && validation.serviceList[index].serviceRefundPrice && validation.productList[index].serviceRefundPrice!=''}
                                                   helperText={validation.serviceList.length>0 && validation.serviceList[index].serviceRefundPrice}
                                        />
                                    </Grid>

                                    <Grid item xs={9}>
                                        <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={item.remark}
                                                   onChange={(e)=>{
                                                       modalData.serviceList[index].remark = e.target.value;
                                                       setModalData({...modalData, serviceList:modalData.serviceList});
                                                   }}
                                        />
                                    </Grid>
                                </Grid>

                            </Grid>
                        ))}

                        {/*/!*  商品信息： 商品名称，价格，折扣，实际价格 *!/*/}
                        <Grid container spacing={1}>
                            <Grid item container sm={1}><Typography gutterBottom className={classes.title}>商品</Typography></Grid>
                        </Grid>

                        {modalData.productList.map((item, index) => (
                            <Grid container spacing={1} key={index}>
                                <Grid item container xs={2}>
                                    <Grid item xs={3} style={{paddingTop: 5}}>
                                        <Checkbox checked={item.checked} disabled={item.disabled}
                                                  onChange={(e) => {
                                                      modalData.productList[index].checked = e.target.checked;
                                                      // if (e.target.checked == true) {
                                                      //     let purchaseItemUnique = [];
                                                      //     if (modalData.productList[index].unique_flag === sysConst.UNIQUE_FLAG[1].value && modalData.productList[index].prod_unique_arr.length > 0) {
                                                      //         modalData.productList[index].prod_unique_arr.forEach((item) => {
                                                      //             purchaseItemUnique.push({unique_id : item, checked : false});
                                                      //         });
                                                      //     }
                                                      //     modalData.productList[index].purchaseItemUnique = purchaseItemUnique;
                                                      // } else {
                                                      //     modalData.productList[index].checked = e.target.checked;
                                                      //     modalData.productList[index].purchaseItemUnique = [];
                                                      // }
                                                      // setModalData({...modalData});
                                                  }}/>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Autocomplete fullWidth disableClearable disabled ListboxProps={{style: {maxHeight: '175px'}}} options={commonReducer.productList}
                                                      getOptionLabel={(option) => option.product_name}
                                                      value={{id: item.prod_id, product_name: item.prod_name}}
                                                      renderInput={(params) => <TextField {...params} label="商品名称" margin="dense" variant="outlined"/>}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid item container xs={4} spacing={1}>
                                    <Grid item xs={3}>
                                        <TextField label="价格" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.unit_price}/>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField label="数量" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.prod_count}/>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <TextField label="折扣" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.discount_prod_price}/>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <TextField label="实际价格" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={item.actual_prod_price}/>
                                    </Grid>
                                </Grid>

                                <Grid item container xs={6} spacing={1}>
                                    <Grid item xs={3}>
                                        <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.prodRefundPrice}
                                                   onChange={(e)=>{
                                                       modalData.productList[index].prodRefundPrice = e.target.value;
                                                       setModalData({...modalData, productList:modalData.productList});
                                                   }}
                                                   error={validation.productList.length>0 && validation.productList[index].prodRefundPrice && validation.productList[index].prodRefundPrice!=''}
                                                   helperText={validation.productList.length>0 && validation.productList[index].prodRefundPrice}
                                        />
                                    </Grid>

                                    <Grid item xs={2}>
                                        <TextField label="退货数量" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.prodRefundCount}
                                                   // disabled={modalData.productList[index].unique_flag == sysConst.UNIQUE_FLAG[1].value}
                                                   onChange={(e)=>{
                                                       modalData.productList[index].prodRefundCount = e.target.value;
                                                       setModalData({...modalData, productList:modalData.productList});
                                                   }}
                                                   error={validation.productList.length>0 && validation.productList[index].prodRefundCount && validation.productList[index].prodRefundCount!=''}
                                                   helperText={validation.productList.length>0 && validation.productList[index].prodRefundCount}
                                        />
                                    </Grid>

                                    <Grid item xs={7}>
                                        <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={item.remark}
                                                   onChange={(e)=>{
                                                       modalData.productList[index].remark = e.target.value;
                                                       setModalData({...modalData, productList:modalData.productList});
                                                   }}
                                        />
                                    </Grid>
                                </Grid>

                                {/*{modalData.productList[index].unique_flag == sysConst.UNIQUE_FLAG[1].value && modalData.productList[index].purchaseItemUnique != undefined*/}
                                {/*&& modalData.productList[index].purchaseItemUnique.length > 0 &&*/}
                                {/*<>*/}
                                {/*<Grid item sm={12} container style={{marginLeft: 20}}>*/}
                                {/*    <Grid item sm={12}>*/}
                                {/*        <FormControlLabel key="select-all" label="全选"*/}
                                {/*                          control={*/}
                                {/*                              <Checkbox color="primary" key={'select-all-chk'}*/}
                                {/*                                        checked={modalData.productList[index].selectAll == true}*/}
                                {/*                                        onChange={(e) => {*/}
                                {/*                                            modalData.productList[index].purchaseItemUnique.forEach((item) => {*/}
                                {/*                                                item.checked = e.target.checked;*/}
                                {/*                                            });*/}
                                {/*                                            modalData.productList[index].selectAll = e.target.checked;*/}
                                {/*                                            modalData.productList[index].prodRefundCount = e.target.checked ? modalData.productList[index].prod_unique_arr.length : 0;*/}
                                {/*                                            setModalData({...modalData});*/}
                                {/*                                        }}*/}
                                {/*                              />*/}
                                {/*                          }*/}
                                {/*        />*/}
                                {/*    </Grid>*/}
                                {/*    {modalData.productList[index].purchaseItemUnique.map((row, i) => (*/}
                                {/*        <Grid item sm={4}>*/}
                                {/*            <FormControlLabel key={'checkbox_child_' + i} label={row.unique_id}*/}
                                {/*                              control={*/}
                                {/*                                  <Checkbox color="primary" key={'checkbox_child_chk_' + i}*/}
                                {/*                                            checked={row.checked == true}*/}
                                {/*                                            onChange={(e) => {*/}
                                {/*                                                modalData.productList[index].purchaseItemUnique[i].checked = e.target.checked;*/}
                                {/*                                                let selectedSize = 0;*/}
                                {/*                                                modalData.productList[index].purchaseItemUnique.forEach((item) => {*/}
                                {/*                                                    if (item.checked === true) {*/}
                                {/*                                                        selectedSize++;*/}
                                {/*                                                    }*/}
                                {/*                                                });*/}
                                {/*                                                modalData.productList[index].selectAll = (selectedSize === modalData.productList[index].purchaseItemUnique.length);*/}
                                {/*                                                modalData.productList[index].prodRefundCount = selectedSize;*/}
                                {/*                                                setModalData({...modalData});*/}
                                {/*                                            }}*/}
                                {/*                                  />*/}
                                {/*                              }*/}
                                {/*            />*/}
                                {/*        </Grid>))}*/}
                                {/*</Grid></>}*/}
                            </Grid>
                        ))}

                        <Grid item xs={12} style={{marginTop: 10}}>
                            <TextField label="退单运费" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} type="number" value={modalData.transferRefundPrice}
                                       onChange={(e)=>{
                                           setModalData({...modalData, transferRefundPrice: e.target.value});
                                       }}
                                       error={validation.transferRefundPrice && validation.transferRefundPrice != ''}
                                       helperText={validation.transferRefundPrice}
                            />
                        </Grid>

                        <Grid item xs={12} style={{marginTop: 10}}>
                            <TextField label="退单备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={modalData.remark}
                                       onChange={(e)=>{
                                           setModalData({...modalData, remark: e.target.value});
                                       }}
                            />
                        </Grid>
                    </div>
                </div>
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
        orderRefundReducer: state.OrderRefundReducer,
        commonReducer: state.CommonReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    getModalSelectList: () => {
        // 取得服务列表
        dispatch(commonAction.getSaleServiceList());
        // 取得商品列表
        dispatch(commonAction.getProductList(null));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderRefund)
