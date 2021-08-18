import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import Swal from 'sweetalert2';
// 引入material-ui基础组件
import {Box, Button, Divider, Fab, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Checkbox, IconButton
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {OrderPayActionType} from "../../types";
import {SimpleModal} from "../index";
const orderPayAction = require('../../actions/main/OrderPayAction');
const commonAction = require('../../actions/layout/CommonAction');
const OrderDetailAction =require('../../actions/main/OrderDetailAction')
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

function OrderPay(props) {
    const {orderPayReducer, orderDetailReducer, commonReducer,getAllOrder} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [selected, setSelected] = React.useState([]);
    const [selectedId, setSelectedId] = React.useState([]);
    const [noSelectedId, setNoSelectedId] = React.useState([]);
    const [batchData, setBatchData] = React.useState({servicePrice:0,prodPrice:0,totalDiscountPrice:0,totalActualPrice:0});
    const [detailModalOpen, setDetailModalOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [orderPayData, setOrderPayData] = React.useState({});
    const [payType, setPayType] = React.useState(1);
    const [paymentType, setPaymentType] = React.useState(1);
    const [remarks, setRemarks] = React.useState('');
    const [flag, setFlag] = React.useState(true);
    const [clientAgent,setClientAgent] = React.useState({id:'',name:''});
    useEffect(() => {
            let queryParams = {
                // 订单编号
                orderId: '',
                // 订单状态
                status: '',
                // 订单类型
                orderType: '',
                // 接单人（用户信息）
                reUser: null,
                // 客户集群
                clientAgent: null,
                // 客户
                client: null,
                // 订单支付状态
                paymentStatus: '',
                // 车牌
                clientSerial: '',
                // 创建日期
                dateStart: '',
                dateEnd: '',
                // 完成日期
                finDateStart: '',
                finDateEnd: ''
            };
            dispatch(OrderPayActionType.setQueryPayParams(queryParams));
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        props.getOrderList(orderPayReducer.orderData.start);
    }, []);
    const getOrderPayList=()=>{
        props.getOrderList(0)
        dispatch(orderPayAction.getOrderStat())
    }
    const modelOpen = () => {
        setPayType(1);
        setPaymentType(1);
        setRemarks('');
        setClientAgent({id:'',name:''});
        if(selected.length==0){
            Swal.fire("请选择需要支付的订单", '', "warning");
        }else {
            selected.map((item)=>{
                    batchData.servicePrice +=Number(item.service_price) ;
                    batchData.prodPrice+= Number(item.prod_price);
                    batchData.totalDiscountPrice += Number(item.total_discount_price);
                    batchData.totalActualPrice += Number(item.total_actual_price);
                    selectedId.push(Number(item.id));
            })
            setClientAgent({id:selected[0].client_agent_id,name:selected[0].client_agent_name})
            setModalOpen(true);
        }
    }
    const handleSelectAllClick = (event) => {
        if (event) {
            const newSelecteds = orderPayReducer.orderData.dataList.map((n) =>n.payment_status==1?n:null);
            let arrSelected=newSelecteds.filter(d=>d)
            let arrNoSelected=newSelecteds.filter(d=>!d)
            setSelected(arrSelected);
            setNoSelectedId(arrNoSelected);
            let add=arrSelected.every(item=>arrSelected.every(ele=>ele.client_agent_name===item.client_agent_name))
            setFlag(!add)
            return;
        }
        setSelected([]);
        setFlag(true);
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
        let arrNoSelected=[];
        orderPayReducer.orderData.dataList.map(item=>item.payment_status!==1?arrNoSelected.push(item):'')
        setSelected(newSelected);
        setNoSelectedId(arrNoSelected);
        let add=newSelected.every(item=>newSelected.every(ele=>ele.client_agent_name===item.client_agent_name))
        setFlag(!add)
        if(newSelected.length===0){
            setFlag(true);
        }


    };
    const isSelected = (id) => selected.indexOf(id) !== -1;
    const getAllOrderData = () => {
        getAllOrder(remarks,paymentType,selectedId,batchData,clientAgent.id)
        setModalOpen(false);
    }
    //初始添加模态框值
    const initModal = (orderPayData) => {
        setOrderPayData(orderPayData);
        props.getOrderItemService(orderPayData.id);
        props.getOrderItemProd(orderPayData.id);
        setDetailModalOpen(true);
    };
    // 关闭模态
    const detailModalClose = () => {
        setDetailModalOpen(false);
    };
    const modalClose = () => {
        setBatchData({servicePrice:0,prodPrice:0,totalDiscountPrice:0,totalActualPrice:0})
        setClientAgent({id:'',name:''})
        setSelectedId([]);
        setModalOpen(false);
    }
    const getPreOrderList=()=>{
        dispatch(orderPayAction.getOrderList(orderPayReducer.orderData.start - (orderPayReducer.orderData.size - 1)))
        setSelected([]);
    }
    const getNextOrderList=()=>{
        dispatch(orderPayAction.getOrderList(orderPayReducer.orderData.start + (orderPayReducer.orderData.size - 1)))
        setSelected([]);
    }
    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>订单付款</Typography>
            <Divider light className={classes.divider}/>
            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={11} spacing={1}>
                    <Grid item xs={2}>
                        <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number"
                                   value={orderPayReducer.queryParams.orderId}
                                   onChange={(e) => {
                                       dispatch(OrderPayActionType.setQueryPayParam({
                                           name: "orderId",
                                           value: e.target.value
                                       }))
                                   }}/>
                    </Grid>



                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>订单状态</InputLabel>
                            <Select label="订单状态"
                                    value={orderPayReducer.queryParams.status}
                                    onChange={(e, value) => {
                                        dispatch(OrderPayActionType.setQueryPayParam({
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
                                    value={orderPayReducer.queryParams.paymentStatus}
                                    onChange={(e, value) => {
                                        dispatch(OrderPayActionType.setQueryPayParam({
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
                        <Autocomplete fullWidth
                                      options={commonReducer.clientAgentList}
                                      getOptionLabel={(option) => option.name}
                                      value={orderPayReducer.queryParams.clientAgent}
                                      onChange={(event, value) => {
                                          dispatch(OrderPayActionType.setQueryPayParam({
                                              name: "clientAgent",
                                              value: value
                                          }));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="客户集群" margin="dense"
                                                                          variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Autocomplete fullWidth
                                      options={commonReducer.clientList}
                                      getOptionLabel={(option) => option.name}
                                      value={orderPayReducer.queryParams.client}
                                      onChange={(event, value) => {
                                          dispatch(OrderPayActionType.setQueryPayParam({name: "client", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="客户" margin="dense"
                                                                          variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField label="车牌" fullWidth margin="dense" variant="outlined"
                                   value={orderPayReducer.queryParams.clientSerial}
                                   onChange={(e) => {
                                       dispatch(OrderPayActionType.setQueryPayParam({
                                           name: "clientSerial",
                                           value: e.target.value
                                       }))
                                   }}/>
                    </Grid>
                    <Grid item xs={2}>
                        <Autocomplete fullWidth
                                      options={commonReducer.userList}
                                      getOptionLabel={(option) => option.real_name}
                                      value={orderPayReducer.queryParams.reUser}
                                      onChange={(event, value) => {
                                          dispatch(OrderPayActionType.setQueryPayParam({name: "reUser", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="接单人" margin="dense"
                                                                          variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>订单类型</InputLabel>
                            <Select label="订单类型"
                                    value={orderPayReducer.queryParams.orderType}
                                    onChange={(e, value) => {
                                        dispatch(OrderPayActionType.setQueryPayParam({
                                            name: "orderType",
                                            value: e.target.value
                                        }));
                                    }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.ORDER_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                    format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建日期（始）"
                                    value={orderPayReducer.queryParams.dateStart == "" ? null : orderPayReducer.queryParams.dateStart}
                                    onChange={(date) => {
                                        dispatch(OrderPayActionType.setQueryPayParam({name: "dateStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                    format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建日期（终）"
                                    value={orderPayReducer.queryParams.dateEnd == "" ? null : orderPayReducer.queryParams.dateEnd}
                                    onChange={(date) => {
                                        dispatch(OrderPayActionType.setQueryPayParam({name: "dateEnd", value: date}))
                                    }}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                    format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（始）"
                                    value={orderPayReducer.queryParams.finDateStart == "" ? null : orderPayReducer.queryParams.finDateStart}
                                    onChange={(date) => {
                                        dispatch(OrderPayActionType.setQueryPayParam({
                                            name: "finDateStart",
                                            value: date
                                        }))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                    format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（终）"
                                    value={orderPayReducer.queryParams.finDateEnd == "" ? null : orderPayReducer.queryParams.finDateEnd}
                                    onChange={(date) => {
                                        dispatch(OrderPayActionType.setQueryPayParam({name: "finDateEnd", value: date}))
                                    }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={1} container style={{textAlign: 'center', marginTop: 30}}>
                    {/*查询按钮*/}
                    <Grid item xs={12}>
                        <Fab color="primary" size="small" onClick={() => {
                            getOrderPayList()
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
                                       style={{display: orderPayReducer.orderData.dataList.length == 0 ? 'none' : 'block'}}>
                                <Checkbox
                                    disabled={(orderPayReducer.orderData.dataList.every(item=>item.payment_status!==1))}
                                    checked={orderPayReducer.orderData.dataList.length > 0 && selected.length + noSelectedId.length == orderPayReducer.orderData.dataList.length}
                                    onChange={(e, value) => {
                                        handleSelectAllClick(e.target.checked);
                                    }}
                                    color='primary'
                                />全选
                            </TableCell>
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
                            <TableCell className={classes.tableHead} align="center">支付状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">创建日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">完成日期</TableCell>
                            <TableCell className={classes.tableHead} align="center" >
                                <Button  title='批量付款要求同一客户集群' variant="contained" color="primary" size='small' disabled={flag} onClick={() => {
                                    modelOpen()
                                }}>批量</Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderPayReducer.orderData.dataList.map((row, index) => {
                            const isItemSelected = isSelected(row);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <TableRow key={row.id}>
                                    <TableCell onClick={(event) => handleClick(event, row)}  style={{display:row.payment_status == 1 ?'block':'none'}}
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
                                    <TableCell  style={{display:row.payment_status!== 1?'block':'none'}}>
                                        <Checkbox  disabled inputProps={{'aria-labelledby': labelId}}/>
                                    </TableCell>
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
                                    <TableCell
                                        align="center">{commonUtil.getJsonValue(sysConst.ORDER_PAYMENT_STATUS, row.payment_status)}</TableCell>
                                    <TableCell align="center">{row.date_id}</TableCell>
                                    <TableCell align="center">{row.fin_date_id}</TableCell>
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
                        {Object.keys(orderPayReducer.orderStat).length !== 0 &&orderPayReducer.orderStat.service_price!=='0'&&orderPayReducer.orderStat.prod_price!=='0'&&
                        orderPayReducer.orderStat.total_discount_price!=='0'&&orderPayReducer.orderStat.total_actual_price!=='0'&&
                        <TableRow>
                            <TableCell rowSpan={4}/>
                            <TableCell rowSpan={4}/>
                            <TableCell rowSpan={4}/>
                            <TableCell rowSpan={4}/>
                            <TableCell rowSpan={4}/>
                            <TableCell rowSpan={4}/>
                            <TableCell colSpan={3}
                                       align="center">服务费总额：{orderPayReducer.orderStat.service_price}</TableCell>
                            <TableCell colSpan={3}
                                       align="center">商品总额：{orderPayReducer.orderStat.prod_price}</TableCell>
                            <TableCell colSpan={3}
                                       align="center">折扣总额：{orderPayReducer.orderStat.total_discount_price}</TableCell>
                            <TableCell colSpan={3} align="right"
                                       style={{paddingRight: 40}}>实际总额：{orderPayReducer.orderStat.total_actual_price}</TableCell>
                        </TableRow>}
                        {orderPayReducer.orderData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={16} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {orderPayReducer.orderData.start > 0 && orderPayReducer.orderData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={() => {
                            getPreOrderList()
                        }}>上一页</Button>}
                {orderPayReducer.orderData.dataSize >= orderPayReducer.orderData.size &&
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
                    <Grid item sm={12}><Typography color="primary">订单号：{orderPayData.id}</Typography></Grid>
                    <Grid item sm={3}>车牌：{orderPayData.client_serial}</Grid>
                    <Grid item sm={3}>客户姓名：{orderPayData.client_name}</Grid>
                    <Grid item sm={3}>客户电话：{orderPayData.client_tel}</Grid>
                    <Grid item sm={3}>客户集群：{orderPayData.client_agent_name}</Grid>
                    <Grid item sm={3}>服务费：{orderPayData.actual_service_price}</Grid>
                    <Grid item sm={3}>商品金额：{orderPayData.actual_prod_price}</Grid>
                    <Grid item sm={3}>折扣：{orderPayData.total_discount_price}</Grid>
                    <Grid item sm={3}>实际金额：{orderPayData.total_actual_price}</Grid>
                    <Grid item sm={3}>接单人：{orderPayData.re_user_name}</Grid>
                    <Grid item
                          sm={3}>订单类型：{commonUtil.getJsonValue(sysConst.ORDER_TYPE, orderPayData.order_type)}</Grid>
                    <Grid item sm={3}>订单状态：{commonUtil.getJsonValue(sysConst.ORDER_STATUS, orderPayData.status)}</Grid>
                    <Grid item sm={3}>完成时间：{orderPayData.fin_date_id}</Grid>
                    <Grid item sm={12}>订单备注：{orderPayData.client_remark}</Grid>
                    <Grid item sm={12}>操作备注：{orderPayData.op_remark}</Grid>
                </Grid>
                {orderDetailReducer.orderSerVList.length !== 0 &&<h4>服务:</h4>}
                {orderDetailReducer.orderSerVList.map((row, index) => (
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


                {orderDetailReducer.orderProdList.length !== 0 &&<h4>商品:</h4>}
                {orderDetailReducer.orderProdList.map((row, index) => (
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

                    <Grid item sm={4}>
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
                    <Grid item sm={4}>
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
                    <Grid item sm={4}>
                        <TextField className={classes.selectCondition} disabled={true}
                                   margin="dense"
                                   label="客户集群"
                                   value={clientAgent.name}
                                   variant="outlined"
                        >
                        </TextField>
                    </Grid>
                    <Grid item sm={3}>服务费：{batchData.servicePrice}</Grid>
                    <Grid item sm={3}>商品金额：{batchData.prodPrice}</Grid>
                    <Grid item sm={3}>折扣：{batchData.totalDiscountPrice}</Grid>
                    <Grid item sm={3}>实际金额：{batchData.totalActualPrice}</Grid>
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
        orderPayReducer: state.OrderPayReducer,
        appReducer: state.AppReducer,
        commonReducer: state.CommonReducer,
        orderDetailReducer: state.OrderDetailReducer,
    }
};
const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getUserList());
        dispatch(commonAction.getClientList());
        dispatch(commonAction.getClientAgentList());
    },
    getOrderItemService:(id)=>{
        dispatch(OrderDetailAction.getOrderItemService(id));
    },
    getOrderItemProd:(id)=>{
        dispatch(OrderDetailAction.getOrderItemProd(id));
    },
    getOrderList: (dataStart) => {
        dispatch(orderPayAction.getOrderList(dataStart))
    },
    getAllOrder:(remarks,paymentType,selectedId,batchData,id)=>{
        dispatch(orderPayAction.getAllOrder(remarks,paymentType,selectedId,batchData,id))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderPay)
