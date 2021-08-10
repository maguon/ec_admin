import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
// 引入material-ui基础组件
import {
    Box,
    Button,
    Divider,
    Fab,
    Checkbox,
    FormControl,
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
import {OrderReturnActionType} from "../../types";

const orderRefundAction = require('../../actions/main/OrderRefundAction');
const orderDetailAction = require('../../actions/main/OrderDetailAction');
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
    const {orderRefundReducer, appReducer, commonReducer, fromDetail, detailParams} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const [queryParams, setQueryParams] = useState({orderId:'', orderType:''});

    useEffect(() => {
        console.log('detailParams---------------------------111111111111',detailParams);
        setQueryParams(detailParams);

        console.log('queryParams',queryParams);
        // // 详情页面 返回 保留reducer，否则，清空
        // if (!fromDetail) {
        //     let queryParams = {
        //         orderId: '',
        //         status: null,
        //         client: null,
        //         clientAgent: null,
        //         orderType: null,
        //         checkUserId: null,
        //         dateStart: '',
        //         dateEnd: '',
        //         finDateStart: '',
        //         finDateEnd: ''
        //     };
        //     dispatch(OrderReturnActionType.setQueryParams(queryParams));
        // }
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        // props.getOrderList(props.orderRefundReducer.orderData.start);
        dispatch(orderRefundAction.getOrderList(props.orderRefundReducer.orderData.start, detailParams));
    }, []);

    // useEffect(() => {
    //     console.log('detailParams--------------------------222222222222222222222-',detailParams);
    //     setQueryParams(detailParams);
    //     // 取得画面 select控件，基础数据
    //     dispatch(orderRefundAction.getOrderList(props.orderRefundReducer.orderData.start, queryParams));
    // }, [fromDetail]);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 模态数据
    const [modalData, setModalData] = React.useState({serviceList: [], productList: [], steps: ['选择订单编号', '填写退单详情']});
    // 模态校验
    const [validation, setValidation] = useState({priceList: [], nodata: ''});

    const initModal = () => {
        setValidation({});
        setModalData({
            ...modalData,
            inputId: '',
            orderInfo: null,
            activeStep: 0,
            serviceList: [],
            productList: [],
            remark: ''
        });
        setModalOpen(true);
    };

    const submitModal = async (step) => {
        const validateObj = {};
        if (step === 0) {
            if (!modalData.inputId) {
                validateObj.inputId = '请输入订单编号';
            }
            setValidation(validateObj);
            if (Object.keys(validateObj).length === 0) {
                let ret = await dispatch(orderRefundAction.getOrderInfo(modalData.inputId));
                if (ret.length > 0) {
                    let serviceList = await dispatch(orderRefundAction.getOrderItemService(modalData.inputId));
                    let productList = await dispatch(orderRefundAction.getOrderItemProd(modalData.inputId));
                    setModalData({
                        ...modalData,
                        orderInfo: ret[0],
                        serviceList: serviceList,
                        productList: productList,
                        activeStep: modalData.activeStep + 1
                    });
                } else {
                    setValidation({inputId: '没有该订单记录,请重新输入'});
                }
            }
        }

        if (step === 1) {
            let checkedService = [];
            modalData.serviceList.forEach((item) => {
                if (item.checked) {
                    checkedService.push(item);
                }
            });

            let checkedProduct = [];
            modalData.productList.forEach((item) => {
                if (item.checked) {
                    checkedProduct.push(item);
                }
            });

            console.log('checkedService', checkedService);


            console.log('checkedProduct', checkedProduct);

            // if (!modalData.reUser) {
            //     validateObj.reUser ='请选择领用人';
            // }
            // if (!modalData.prodCnt && modalData.prodCnt!==0) {
            //     validateObj.prodCnt ='请输入数量';
            // }else if (modalData.storageProdRelDetail.storage_count < modalData.prodCnt) {
            //     validateObj.prodCnt ='入库数量不能大于库存商品数量';
            // }
            // setValidation(validateObj);
            // if(Object.keys(validateObj).length===0){
            //     // dispatch(storageInOutAction.inOutStorageProduct(modalData));
            //     setModalOpen(false);
            // }
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
                        <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number"
                                   value={queryParams.orderId}
                                   onChange={(e) => {
                            setQueryParams({...queryParams, orderId: e.target.value});
                            // dispatch(OrderReturnActionType.setQueryParam({
                            //     name: "orderId",
                            //     value: e.target.value
                            // }))
                        }}/>
                    </Grid>

                    <Grid item xs={2}>
                        <TextField label="订单类型" fullWidth margin="dense" variant="outlined" select
                                   value={queryParams.orderType}
                                   onChange={(e) => {
                                       setQueryParams({...queryParams, orderType: e.target.value});
                                       // dispatch(OrderReturnActionType.setQueryParam({
                                       //     name: "orderId",
                                       //     value: e.target.value
                                       // }))
                                   }}>
                            <MenuItem value="">请选择</MenuItem>
                            {sysConst.ORDER_TYPE.map((item, index) => (
                                <MenuItem key={item.value} value={item.value.toString()}>{item.label}</MenuItem>
                            ))}
                        </TextField>


                        {/*<FormControl variant="outlined" fullWidth margin="dense">*/}
                        {/*    <InputLabel>订单类型</InputLabel>*/}
                        {/*    <Select label="订单类型"*/}
                        {/*            value={queryParams.orderType}*/}
                        {/*            onChange={(e, value) => {*/}
                        {/*                setQueryParams({...queryParams, orderType: e.target.value});*/}
                        {/*                // dispatch(OrderReturnActionType.setQueryParam({*/}
                        {/*                //     name: "orderType",*/}
                        {/*                //     value: e.target.value*/}
                        {/*                // }));*/}
                        {/*            }}*/}
                        {/*    >*/}
                        {/*        <MenuItem value="">请选择</MenuItem>*/}
                        {/*        {sysConst.ORDER_TYPE.map((item, index) => (*/}
                        {/*            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>*/}
                        {/*        ))}*/}
                        {/*    </Select>*/}
                        {/*</FormControl>*/}
                    </Grid>

                    {/*<Grid item xs={2}>*/}
                    {/*    <FormControl variant="outlined" fullWidth margin="dense">*/}
                    {/*        <InputLabel>订单状态</InputLabel>*/}
                    {/*        <Select label="订单状态"*/}
                    {/*                value={orderRefundReducer.queryParams.status}*/}
                    {/*                onChange={(e, value) => {*/}
                    {/*                    dispatch(OrderReturnActionType.setQueryParam({*/}
                    {/*                        name: "status",*/}
                    {/*                        value: e.target.value*/}
                    {/*                    }));*/}
                    {/*                }}*/}
                    {/*        >*/}
                    {/*            <MenuItem value="">请选择</MenuItem>*/}
                    {/*            {sysConst.ORDER_STATUS.map((item, index) => (*/}
                    {/*                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>*/}
                    {/*            ))}*/}
                    {/*        </Select>*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={2}>*/}
                    {/*    <Autocomplete fullWidth*/}
                    {/*                  options={commonReducer.userList}*/}
                    {/*                  getOptionLabel={(option) => option.real_name}*/}
                    {/*                  value={modalData.reUser}*/}
                    {/*                  onChange={(event, value) => {*/}
                    {/*                      dispatch(OrderReturnActionType.setQueryParam({name: "reUser", value: value}));*/}
                    {/*                  }}*/}
                    {/*                  renderInput={(params) => <TextField {...params} label="接单人" margin="dense"*/}
                    {/*                                                      variant="outlined"/>}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={2}>*/}
                    {/*    <Autocomplete fullWidth*/}
                    {/*                  options={commonReducer.clientAgentList}*/}
                    {/*                  getOptionLabel={(option) => option.name}*/}
                    {/*                  value={modalData.clientAgent}*/}
                    {/*                  onChange={(event, value) => {*/}
                    {/*                      dispatch(OrderReturnActionType.setQueryParam({*/}
                    {/*                          name: "clientAgent",*/}
                    {/*                          value: value*/}
                    {/*                      }));*/}
                    {/*                  }}*/}
                    {/*                  renderInput={(params) => <TextField {...params} label="客户集群" margin="dense"*/}
                    {/*                                                      variant="outlined"/>}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={2}>*/}
                    {/*    <Autocomplete fullWidth*/}
                    {/*                  options={commonReducer.clientList}*/}
                    {/*                  getOptionLabel={(option) => option.name}*/}
                    {/*                  value={modalData.client}*/}
                    {/*                  onChange={(event, value) => {*/}
                    {/*                      dispatch(OrderReturnActionType.setQueryParam({name: "client", value: value}));*/}
                    {/*                  }}*/}
                    {/*                  renderInput={(params) => <TextField {...params} label="客户" margin="dense"*/}
                    {/*                                                      variant="outlined"/>}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={2}>*/}
                    {/*    <TextField label="客户电话" fullWidth margin="dense" variant="outlined"*/}
                    {/*               value={orderRefundReducer.queryParams.clientTel}*/}
                    {/*               onChange={(e) => {*/}
                    {/*                   dispatch(OrderReturnActionType.setQueryParam({*/}
                    {/*                       name: "clientTel",*/}
                    {/*                       value: e.target.value*/}
                    {/*                   }))*/}
                    {/*               }}/>*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={2}>*/}
                    {/*    <TextField label="车牌" fullWidth margin="dense" variant="outlined"*/}
                    {/*               value={orderRefundReducer.queryParams.clientSerial}*/}
                    {/*               onChange={(e) => {*/}
                    {/*                   dispatch(OrderReturnActionType.setQueryParam({*/}
                    {/*                       name: "clientSerial",*/}
                    {/*                       value: e.target.value*/}
                    {/*                   }))*/}
                    {/*               }}/>*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={2}>*/}
                    {/*    <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"*/}
                    {/*                format="yyyy/MM/dd"*/}
                    {/*                okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"*/}
                    {/*                label="创建日期（始）"*/}
                    {/*                value={orderRefundReducer.queryParams.dateStart == "" ? null : orderRefundReducer.queryParams.dateStart}*/}
                    {/*                onChange={(date) => {*/}
                    {/*                    dispatch(OrderReturnActionType.setQueryParam({name: "dateStart", value: date}))*/}
                    {/*                }}*/}
                    {/*    />*/}
                    {/*</Grid>*/}
                    {/*<Grid item xs={2}>*/}
                    {/*    <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"*/}
                    {/*                format="yyyy/MM/dd"*/}
                    {/*                okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"*/}
                    {/*                label="创建日期（终）"*/}
                    {/*                value={orderRefundReducer.queryParams.dateEnd == "" ? null : orderRefundReducer.queryParams.dateEnd}*/}
                    {/*                onChange={(date) => {*/}
                    {/*                    dispatch(OrderReturnActionType.setQueryParam({name: "dateEnd", value: date}))*/}
                    {/*                }}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                    format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（始）"
                                    value={queryParams.finDateStart == "" ? null : queryParams.finDateStart}
                                    onChange={(date) => {setQueryParams({...queryParams, finDateStart: date});
                                        // dispatch(OrderReturnActionType.setQueryParam({
                                        //     name: "finDateStart",
                                        //     value: date
                                        // }))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                    format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（终）"
                                    value={queryParams.finDateEnd == "" ? null : queryParams.finDateEnd}
                                    onChange={(date) => {setQueryParams({...queryParams, finDateEnd: date});
                                        // dispatch(OrderReturnActionType.setQueryParam({name: "finDateEnd", value: date}))
                                    }}
                        />
                    </Grid>
                </Grid>

                <Grid item xs={2} container style={{textAlign: 'right', marginTop: 30}}>
                    {/*查询按钮*/}
                    <Grid item xs={4}>
                        <Fab color="primary" size="small" onClick={() => {
                            dispatch(orderRefundAction.getOrderList(0, queryParams))
                        }}>
                            <i className="mdi mdi-magnify mdi-24px"/>
                        </Fab>
                    </Grid>

                    {/*追加按钮*/}
                    <Grid item xs={4}>
                        <Fab color="primary" size="small" onClick={initModal}>
                            <i className="mdi mdi-plus mdi-24px"/>
                        </Fab>
                    </Grid>

                    <Grid item xs={4}>
                        <Fab color="primary" size="small" onClick={() => {
                            dispatch(orderRefundAction.downLoadCsv())
                        }}>
                            <i className="mdi mdi-cloud-download mdi-24px"/>
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">订单号</TableCell>
                            <TableCell className={classes.tableHead} align="center">接单人</TableCell>
                            <TableCell className={classes.tableHead} align="center">客户集群</TableCell>
                            <TableCell className={classes.tableHead} align="center">客户姓名</TableCell>
                            <TableCell className={classes.tableHead} align="center">客户电话</TableCell>
                            <TableCell className={classes.tableHead} align="center">车牌</TableCell>
                            <TableCell className={classes.tableHead} align="center">服务费</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品金额</TableCell>
                            <TableCell className={classes.tableHead} align="center">折扣</TableCell>
                            <TableCell className={classes.tableHead} align="center">实际金额</TableCell>
                            <TableCell className={classes.tableHead} align="center">订单类型</TableCell>
                            <TableCell className={classes.tableHead} align="center">订单状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">创建日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">完成日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderRefundReducer.orderData.dataList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="center">{row.re_user_name}</TableCell>
                                <TableCell align="center">{row.client_agent_name}</TableCell>
                                <TableCell align="center">{row.client_name}</TableCell>
                                <TableCell align="center">{row.client_tel}</TableCell>
                                <TableCell align="center">{row.client_serial}</TableCell>
                                <TableCell align="center">{row.service_price}</TableCell>
                                <TableCell align="center">{row.prod_price}</TableCell>
                                <TableCell align="center">{row.total_discount_price}</TableCell>
                                <TableCell align="center">{row.total_actual_price}</TableCell>
                                <TableCell
                                    align="center">{commonUtil.getJsonValue(sysConst.ORDER_TYPE, row.order_type)}</TableCell>
                                <TableCell
                                    align="center">{commonUtil.getJsonValue(sysConst.ORDER_STATUS, row.status)}</TableCell>
                                <TableCell align="center">{row.date_id}</TableCell>
                                <TableCell align="center">{row.fin_date_id}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" edge="start" size="small" onClick={() => {
                                        dispatch(orderDetailAction.downLoadPDF(row.id))
                                    }}>
                                        <i className="mdi mdi-file-pdf"/>
                                    </IconButton>
                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" size="small">
                                        <Link to={{pathname: '/order_refund/' + row.id, state: {queryParams: queryParams}}}><i className="mdi mdi-table-search"/></Link>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {orderRefundReducer.orderData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={15} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {orderRefundReducer.orderData.start > 0 && orderRefundReducer.orderData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={() => {
                            dispatch(orderRefundAction.getOrderList(orderRefundReducer.orderData.start - (orderRefundReducer.orderData.size - 1)))
                        }}>上一页</Button>}
                {orderRefundReducer.orderData.dataSize >= orderRefundReducer.orderData.size &&
                <Button variant="contained" color="primary"
                        onClick={() => {
                            dispatch(orderRefundAction.getOrderList(orderRefundReducer.orderData.start + (orderRefundReducer.orderData.size - 1)))
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
                        </Grid>

                        {modalData.serviceList.map((item, index) => (
                            <Grid container spacing={1} key={index}>
                                <Grid item container xs={2}>
                                    <Grid item xs={3} style={{paddingTop: 5}}>
                                        <Checkbox checked={item.checked} onChange={(e) => {modalData.serviceList[index].checked = e.target.checked}}/>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Autocomplete fullWidth disableClearable disabled options={commonReducer.saleServiceList}
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
                                        <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.discount_service_price}/>
                                    </Grid>

                                    <Grid item xs={9}>
                                        <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={item.remark}/>
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
                                        <Checkbox checked={item.checked} onChange={(e) => {modalData.productList[index].checked = e.target.checked}}/>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Autocomplete fullWidth disableClearable disabled options={commonReducer.productList}
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
                                        <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.discount_service_price}/>
                                    </Grid>

                                    <Grid item xs={2}>
                                        <TextField label="退货数量" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.discount_service_price}/>
                                    </Grid>

                                    <Grid item xs={7}>
                                        <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={item.remark}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}


                    </div>
                </div>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    let params = {
        age: 20,
        orderId: '',
        status: null,
        client: null,
        clientAgent: null,
        orderType: '',
        checkUserId: null,
        dateStart: '',
        dateEnd: '',
        finDateStart: '',
        finDateEnd: ''
    };
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        console.log('fromDetail true.........................')
        fromDetail = true;
        params = ownProps.location.state.params
    }
    return {
        orderRefundReducer: state.OrderRefundReducer,
        appReducer: state.AppReducer,
        commonReducer: state.CommonReducer,
        fromDetail: fromDetail,
        detailParams : params
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getUserList());
        dispatch(commonAction.getClientList());
        dispatch(commonAction.getClientAgentList());
    },
    getModalSelectList: () => {
        // 取得客户信息列表
        dispatch(commonAction.getClientList());
        // 取得用户信息列表
        dispatch(commonAction.getUserList());
        // 取得服务列表
        dispatch(commonAction.getSaleServiceList());
        // 取得商品列表
        dispatch(commonAction.getProductList(null));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderRefund)
