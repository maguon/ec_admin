import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import Swal from 'sweetalert2';
// 引入material-ui基础组件
import {Box, Button, Divider, Fab, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Checkbox, IconButton
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {OrderRefundPayActionType} from "../../types";
import {SimpleModal} from "../index";
import {setOrderInfo} from "../../types/main/OrderDetailActionType";
const OrderRefundPayAction = require('../../actions/main/OrderRefundPayAction');
const commonAction = require('../../actions/layout/CommonAction');
const OrderRefundDetailAction =require('../../actions/main/OrderRefundDetailAction')
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
    selectCondition: {width: '100%'},
}));

function OrderRefundPay(props) {
    const {orderRefundPayReducer,orderRefundDetailReducer,getAllOrder,getOrderRefundBasic} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [selected, setSelected] = React.useState([]);
    const [selectedId, setSelectedId] = React.useState([]);
    const [batchData, setBatchData] = React.useState({serviceRefundPrice:0,prodRefundPrice:0,transferRefundPrice:0,prodRefundCount:0,totalRefundPrice:0});
    const [detailModalOpen, setDetailModalOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [orderRefundPayData, setOrderRefundPayData] = React.useState({});
    const [payType, setPayType] = React.useState(2);
    const [paymentType, setPaymentType] = React.useState(1);
    const [remarks, setRemarks] = React.useState('');
    const [orderList,setOrderList]=React.useState([]);
    useEffect(() => {
        let queryParams = {
            // 订单编号
            orderId: '',
            // 订单状态
            status: '',
            paymentStatus: '',
            dateStart: '',
            dateEnd: '',
        };
        dispatch(OrderRefundPayActionType.setQueryPayParams(queryParams));
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        props.getOrderList(orderRefundPayReducer.orderData.start);
    }, []);
    const modelOpen = () => {
        setPayType(2);
        setPaymentType(1);
        setRemarks('');
        if(selected.length==0){
            Swal.fire("请选择需要支付的订单", '', "warning");
        }else {
            selected.map((item)=>{
                if(item==null){
                    return;
                }else {
                    batchData.serviceRefundPrice +=Number(item.service_refund_price) ;
                    batchData.prodRefundPrice+= Number(item.prod_refund_price);
                    batchData.transferRefundPrice += Number(item.transfer_refund_price);
                    batchData.prodRefundCount += Number(item.prod_refund_count);
                    batchData.totalRefundPrice+= Number(item.total_refund_price);
                    selectedId.push(Number(item.order_id));
                }
            })
            setModalOpen(true);
        }
    }
    const handleSelectAllClick = (event) => {
        if (event) {
            const newSelecteds = orderRefundPayReducer.orderData.dataList.map((n) =>n.payment_status==1?n:null);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const handleClick = (event, item) => {
        const selectedIndex = selected.indexOf(item);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, item);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    const isSelected = (id) => selected.indexOf(id) !== -1;
    const getAllOrderData = () => {
        getAllOrder(remarks,paymentType,selectedId,batchData)
        setModalOpen(false);
    }
    //初始添加模态框值
    const initModal =async (orderRefundPayData) => {
        let orderInfo =await dispatch(OrderRefundPayAction.getOrderInfo(orderRefundPayData.order_id));
        setOrderList(orderInfo);
        getOrderRefundBasic(orderRefundPayData.id);
        setOrderRefundPayData(orderRefundPayData);
        setDetailModalOpen(true);
    };
    // 关闭模态
    const detailModalClose = () => {
        setDetailModalOpen(false);
    };
    const modalClose = () => {
        setBatchData({serviceRefundPrice:0,prodRefundPrice:0,transferRefundPrice:0,prodRefundCount:0,totalRefundPrice:0})
        setSelectedId([]);
        setModalOpen(false);
    }
    const getPreOrderList=()=>{
        dispatch(OrderRefundPayAction.getOrderList(orderRefundPayReducer.orderData.start - (orderRefundPayReducer.orderData.size - 1)))
        setSelected([]);
    }
    const getNextOrderList=()=>{
        dispatch(OrderRefundPayAction.getOrderList(orderRefundPayReducer.orderData.start + (orderRefundPayReducer.orderData.size - 1)))
        setSelected([]);
    }
    const getOrderRefundList=()=>{
        props.getOrderList(0)
        dispatch(OrderRefundPayAction.getOrderRefundStat())
    }
    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>订单退款</Typography>
            <Divider light className={classes.divider}/>
            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={11} spacing={1}>
                    <Grid item xs={2}>
                        <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number"
                                   value={orderRefundPayReducer.queryParams.orderId}
                                   onChange={(e) => {
                                       dispatch(OrderRefundPayActionType.setQueryPayParam({
                                           name: "orderId",
                                           value: e.target.value
                                       }))
                                   }}/>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>退单状态</InputLabel>
                            <Select label="退单状态"
                                    value={orderRefundPayReducer.queryParams.status}
                                    onChange={(e, value) => {
                                        dispatch(OrderRefundPayActionType.setQueryPayParam({
                                            name: "status",
                                            value: e.target.value
                                        }));
                                    }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.ORDER_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>支付状态</InputLabel>
                            <Select label="支付状态"
                                    value={orderRefundPayReducer.queryParams.paymentStatus}
                                    onChange={(e, value) => {
                                        dispatch(OrderRefundPayActionType.setQueryPayParam({
                                            name: "paymentStatus",
                                            value: e.target.value
                                        }));
                                    }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.ORDER_PAYMENT_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                    format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（始）"
                                    value={orderRefundPayReducer.queryParams.dateStart == "" ? null : orderRefundPayReducer.queryParams.dateStart}
                                    onChange={(date) => {
                                        dispatch(OrderRefundPayActionType.setQueryPayParam({name: "dateStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                    format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（终）"
                                    value={orderRefundPayReducer.queryParams.dateEnd == "" ? null : orderRefundPayReducer.queryParams.dateEnd}
                                    onChange={(date) => {
                                        dispatch(OrderRefundPayActionType.setQueryPayParam({name: "dateEnd", value: date}))
                                    }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={1} container style={{textAlign: 'center', marginTop: 10}}>
                    {/*查询按钮*/}
                    <Grid item xs={12}>
                        <Fab color="primary" size="small" onClick={() => {
                            getOrderRefundList()
                        }}>
                            <i className="mdi mdi-magnify mdi-24px"/>
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>
            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center"
                                       style={{display: orderRefundPayReducer.orderData.dataList.length == 0 ? 'none' : 'block'}}>
                                <Checkbox
                                    checked={orderRefundPayReducer.orderData.dataList.length > 0 && selected.length == orderRefundPayReducer.orderData.dataList.length}
                                    onChange={(e, value) => {
                                        handleSelectAllClick(e.target.checked);
                                    }}
                                    color='primary'
                                />全选
                            </TableCell>
                            <TableCell className={classes.tableHead} align="center">退单号</TableCell>
                            <TableCell className={classes.tableHead} align="center">订单号</TableCell>
                            <TableCell className={classes.tableHead} align="center">退单状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">支付状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">服务退款</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品退款</TableCell>
                            <TableCell className={classes.tableHead} align="center">退货运费</TableCell>
                            <TableCell className={classes.tableHead} align="center">退货数量</TableCell>
                            <TableCell className={classes.tableHead} align="center">退款金额</TableCell>
                            <TableCell className={classes.tableHead} align="center">完成日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">
                                <Button variant="contained" color="primary" size='small' onClick={() => {
                                    modelOpen()
                                }}>批量</Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderRefundPayReducer.orderData.dataList.map((row, index) => {
                            const isItemSelected = isSelected(row);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <TableRow key={row.id}>
                                    <TableCell onClick={(event) => handleClick(event, row)}  style={{display:row.payment_status == 1?'block':'none'}}
                                               role="checkbox"
                                               aria-checked={isItemSelected}
                                               tabIndex={-1}
                                               selected={isItemSelected}>
                                        <Checkbox
                                            checked={isItemSelected}
                                            inputProps={{'aria-labelledby': labelId}}
                                            color='primary'
                                        />
                                    </TableCell>
                                    <TableCell disabled  style={{display:row.payment_status !== 1?'block':'none'}}>
                                        <Checkbox  disabled inputProps={{'aria-labelledby': labelId}}/>
                                    </TableCell>
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell align="center">{row.order_id}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_REFUND_STATUS, row.status)}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_PAYMENT_STATUS, row.payment_status)}</TableCell>
                                    <TableCell align="center">{row.service_refund_price}</TableCell>
                                    <TableCell align="center">{row.prod_refund_price}</TableCell>
                                    <TableCell align="center">{row.transfer_refund_price}</TableCell>
                                    <TableCell align="center">{Number(row.prod_refund_count)}</TableCell>
                                    <TableCell align="center">{row.total_refund_price}</TableCell>
                                    <TableCell align="center">{row.date_id}</TableCell>
                                    <TableCell align="center">
                                        {/* 编辑按钮 */}
                                        <IconButton color="primary" edge="start" size="small" onClick={() => {
                                            initModal(row)
                                        }}>
                                            <i className="mdi mdi-table-search"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {Object.keys(orderRefundPayReducer.orderRefundStat).length !== 0&&
                            <TableRow>
                                <TableCell colSpan={2} align="center">服务退款总额：{orderRefundPayReducer.orderRefundStat.service_refund_price}</TableCell>
                                <TableCell colSpan={2} align="center">商品退款总额：{orderRefundPayReducer.orderRefundStat.prod_refund_price}</TableCell>
                                <TableCell colSpan={2} align="center">退货运费总额：{orderRefundPayReducer.orderRefundStat.transfer_refund_price}</TableCell>
                                <TableCell colSpan={2} align="center">退货数量总额：{orderRefundPayReducer.orderRefundStat.prod_refund_count}</TableCell>
                                <TableCell colSpan={2} align="center">退款金额总额：{orderRefundPayReducer.orderRefundStat.service_refund_count}</TableCell>
                                <TableCell colSpan={2} align="right" style={{paddingRight:40}}>总额：{orderRefundPayReducer.orderRefundStat.total_refund_price}</TableCell>
                            </TableRow>}
                        {orderRefundPayReducer.orderData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={11} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {orderRefundPayReducer.orderData.start > 0 && orderRefundPayReducer.orderData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={() => {
                            getPreOrderList()
                        }}>上一页</Button>}
                {orderRefundPayReducer.orderData.dataSize >= orderRefundPayReducer.orderData.size &&
                <Button variant="contained" color="primary"
                        onClick={() => {
                            getNextOrderList()
                        }}>下一页</Button>}
            </Box>

            <SimpleModal
                maxWidth={'lg'}
                title="订单支付详情"
                open={detailModalOpen}
                onClose={detailModalClose}
                showFooter={true}
                footer={<Button variant="contained" onClick={detailModalClose}>关闭</Button>}
            >
                <Grid container spacing={2} style={{marginBottom: 10}}>
                    <Grid item sm={3}><Typography color="primary">退单号：{orderRefundPayData.id}</Typography></Grid>
                    <Grid item sm={9} align='left'><Typography color="primary">订单号：{orderRefundPayData.order_id}</Typography></Grid>
                    <Grid item sm={3}>车牌：{orderList.client_serial}</Grid>
                    <Grid item sm={3}>客户姓名：{orderList.client_name}</Grid>
                    <Grid item sm={3}>客户电话：{orderList.client_tel}</Grid>
                    <Grid item sm={3}>客户集群：{orderList.client_agent_name}</Grid>
                    <Grid item sm={3}>服务费：{orderList.actual_service_price}</Grid>
                    <Grid item sm={3}>商品金额：{orderList.actual_prod_price}</Grid>
                    <Grid item sm={3}>折扣：{orderList.total_discount_price}</Grid>
                    <Grid item sm={3}>实际金额：{orderList.total_actual_price}</Grid>
                    <Grid item sm={3}>接单人：{orderList.reUser}</Grid>
                    <Grid item
                          sm={3}>订单类型：{commonUtil.getJsonValue(sysConst.ORDER_TYPE, orderList.order_type)}</Grid>
                    <Grid item sm={3}>订单状态：{commonUtil.getJsonValue(sysConst.ORDER_STATUS, orderList.status)}</Grid>
                    <Grid item sm={12}>订单备注：{orderList.client_remark}</Grid>
                    <Grid item sm={12}>操作备注：{orderList.op_remark}</Grid>
                </Grid>
                <h4>服务:</h4>
                {orderRefundDetailReducer.orderRefundSerVList.map((row, index) => (
                    <Grid container spacing={1} key={index}>
                        <Grid item xs={2}><TextField label="服务名称" fullWidth margin="dense" variant="outlined" disabled
                                                     value={row.sale_service_name}/></Grid>
                        {row.fixed_price !== '0.00' &&
                        <Grid item xs={2}>
                            <TextField label="固定售价" fullWidth margin="dense" variant="outlined"
                                       InputLabelProps={{shrink: true}} disabled value={row.fixed_price}/>
                        </Grid>}
                        {row.fixed_price == '0.00' &&
                        <>
                            <Grid item xs={1}>
                                <TextField label="销售单价" fullWidth margin="dense" variant="outlined"
                                           InputLabelProps={{shrink: true}} disabled value={row.unit_price}/>
                            </Grid>
                            <Grid item xs={1}>
                                <TextField label="销售数量" fullWidth margin="dense" variant="outlined"
                                           InputLabelProps={{shrink: true}} disabled value={row.service_count}/>
                            </Grid>
                        </>}
                        <Grid item xs={1}><TextField label="折扣" fullWidth margin="dense" variant="outlined" disabled
                                                     value={row.discount_service_price}/></Grid>
                        <Grid item xs={1}><TextField label="实际价格" fullWidth margin="dense" variant="outlined" disabled
                                                     value={row.actual_service_price}/></Grid>
                        <Grid item xs={6}><TextField label="备注" fullWidth margin="dense" variant="outlined" disabled
                                                     value={row.remark}/></Grid>
                    </Grid>
                ))}
                {orderRefundDetailReducer.orderRefundSerVList.length === 0 &&
                <Grid item xs={12} style={{textAlign: 'center'}}>暂无数据</Grid>}

                <h4>商品:</h4>
                {orderRefundDetailReducer.orderRefundProdList.map((row, index) => (
                    <Grid container spacing={1} key={index}>
                        <Grid item xs={2}><TextField label="商品名称" fullWidth margin="dense" variant="outlined" disabled
                                                     value={row.prod_name}/></Grid>
                        <Grid item xs={1}>
                            <TextField label="价格" fullWidth margin="dense" variant="outlined"
                                       InputLabelProps={{shrink: true}} disabled value={row.unit_price}/>
                        </Grid>
                        <Grid item xs={1}>
                            <TextField label="数量" fullWidth margin="dense" variant="outlined"
                                       InputLabelProps={{shrink: true}} disabled value={row.prod_count}/>
                        </Grid>
                        <Grid item xs={1}><TextField label="折扣" fullWidth margin="dense" variant="outlined" disabled
                                                     value={row.discount_prod_price}/></Grid>
                        <Grid item xs={1}><TextField label="实际价格" fullWidth margin="dense" variant="outlined" disabled
                                                     value={row.actual_prod_price}/></Grid>
                        <Grid item xs={6}><TextField label="备注" fullWidth margin="dense" variant="outlined" disabled
                                                     value={row.remark}/></Grid>
                    </Grid>
                ))}
                {orderRefundDetailReducer.orderRefundProdList.length === 0 &&
                <Grid item xs={12} style={{textAlign: 'center'}}>暂无数据</Grid>}
            </SimpleModal>

            <SimpleModal
                maxWidth={'md'}
                title='批量订单支付'
                open={modalOpen}
                onClose={modalClose}
                showFooter={true}
                footer={<>
                    <Button variant="contained" color="primary" onClick={getAllOrderData}>确定</Button>
                    <Button variant="contained" onClick={modalClose}>关闭</Button>
                </>}
            >
                <Grid container spacing={2}>

                    <Grid item sm={6}>
                        <TextField className={classes.selectCondition} disabled={true}
                                   select
                                   margin="dense"
                                   label="付款类型"
                                   value={payType}
                                   onChange={(e)=>setPayType(e.target.value)}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {sysConst.PAY_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item sm={6}>
                        <TextField className={classes.selectCondition}
                                   select
                                   margin="dense"
                                   label="支付方式"
                                   value={paymentType}
                                   onChange={(e)=>setPaymentType(e.target.value)}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {sysConst.PAYMENT_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item sm>服务退款：{batchData.serviceRefundPrice}</Grid>
                    <Grid item sm>商品退款：{batchData.prodRefundPrice}</Grid>
                    <Grid item sm>退货运费：{batchData.transferRefundPrice}</Grid>
                    <Grid item sm>退货数量：{batchData.prodRefundCount}</Grid>
                    <Grid item sm>退款金额：{batchData.totalRefundPrice}</Grid>
                    <Grid item sm={12}>
                        <TextField fullWidth margin="dense" variant="outlined" label="备注" multiline rows={4} value={remarks}
                                   onChange={(e) => {
                                       setRemarks(e.target.value)
                                   }}/>
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        orderRefundPayReducer: state.OrderRefundPayReducer,
        orderRefundDetailReducer:state.OrderRefundDetailReducer,
        appReducer: state.AppReducer,
        commonReducer: state.CommonReducer,
    }
};
const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getUserList());
        dispatch(commonAction.getClientList());
        dispatch(commonAction.getClientAgentList());
    },
    getOrderList: (dataStart) => {
        dispatch(OrderRefundPayAction.getOrderList(dataStart))
    },
    getAllOrder:(remarks,paymentType,selectedId,batchData)=>{
        dispatch(OrderRefundPayAction.getAllOrder(remarks,paymentType,selectedId,batchData))
    },
    getOrderRefundBasic:(id)=>{
        dispatch(OrderRefundDetailAction.getOrderRefundService(id));
        dispatch(OrderRefundDetailAction.getOrderRefundProd(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderRefundPay)
