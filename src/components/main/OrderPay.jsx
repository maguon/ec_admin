import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {Box, Button, Divider, Fab, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,Checkbox
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {OrderPayActionType, PurchaseActionType} from "../../types";
const orderPayAction = require('../../actions/main/OrderPayAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
}));

function OrderPay(props) {
    const {orderPayReducer, commonReducer} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [selected, setSelected] = React.useState([]);
    useEffect(() => {
            let queryParams = {
                orderId: '',
                status: null,
                client: null,
                clientAgent: null,
                orderType: null,
                checkUserId: null,
                dateStart: '',
                dateEnd: '',
                finDateStart: '',
                finDateEnd: ''
            };
            dispatch(OrderPayActionType.setQueryPayParams(queryParams));
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        props.getOrderList(orderPayReducer.orderData.start);
    }, []);

    const getAllOrderData=()=>{

    }
    const handleSelectAllClick = (event) => {
        if (event) {
            const newSelecteds = orderPayReducer.orderData.dataList.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
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
    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>订单付款</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={11} spacing={1}>
                    <Grid item xs={2}>
                        <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number" value={orderPayReducer.queryParams.orderId}
                                   onChange={(e)=>{dispatch(OrderPayActionType.setQueryPayParam({name: "orderId", value: e.target.value}))}}/>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>订单类型</InputLabel>
                            <Select label="订单类型"
                                    value={orderPayReducer.queryParams.orderType}
                                    onChange={(e, value) => {
                                        dispatch(OrderPayActionType.setQueryPayParam({name: "orderType", value: e.target.value}));
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
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>订单状态</InputLabel>
                            <Select label="订单状态"
                                    value={orderPayReducer.queryParams.status}
                                    onChange={(e, value) => {
                                        dispatch(OrderPayActionType.setQueryPayParam({name: "status", value: e.target.value}));
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
                        <Autocomplete fullWidth
                                      options={commonReducer.userList}
                                      getOptionLabel={(option) => option.real_name}
                                      value={orderPayReducer.queryParams.reUser}
                                      onChange={(event, value) => {
                                          dispatch(OrderPayActionType.setQueryPayParam({name: "reUser", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="接单人" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Autocomplete fullWidth
                                      options={commonReducer.clientAgentList}
                                      getOptionLabel={(option) => option.name}
                                      value={orderPayReducer.queryParams.clientAgent}
                                      onChange={(event, value) => {
                                          dispatch(OrderPayActionType.setQueryPayParam({name: "clientAgent", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="客户集群" margin="dense" variant="outlined"/>}
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
                                      renderInput={(params) => <TextField {...params} label="客户" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField label="客户电话" fullWidth margin="dense" variant="outlined" value={orderPayReducer.queryParams.clientTel}
                                   onChange={(e)=>{dispatch(OrderPayActionType.setQueryPayParam({name: "clientTel", value: e.target.value}))}}/>
                    </Grid>

                    <Grid item xs={2}>
                        <TextField label="车牌" fullWidth margin="dense" variant="outlined" value={orderPayReducer.queryParams.clientSerial}
                                   onChange={(e)=>{dispatch(OrderPayActionType.setQueryPayParam({name: "clientSerial", value: e.target.value}))}}/>
                    </Grid>

                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建日期（始）"
                                    value={orderPayReducer.queryParams.dateStart=="" ? null : orderPayReducer.queryParams.dateStart}
                                    onChange={(date)=>{
                                        dispatch(OrderPayActionType.setQueryPayParam({name: "dateStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建日期（终）"
                                    value={orderPayReducer.queryParams.dateEnd=="" ? null : orderPayReducer.queryParams.dateEnd}
                                    onChange={(date)=>{
                                        dispatch(OrderPayActionType.setQueryPayParam({name: "dateEnd", value: date}))
                                    }}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（始）"
                                    value={orderPayReducer.queryParams.finDateStart=="" ? null : orderPayReducer.queryParams.finDateStart}
                                    onChange={(date)=>{
                                        dispatch(OrderPayActionType.setQueryPayParam({name: "finDateStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（终）"
                                    value={orderPayReducer.queryParams.finDateEnd=="" ? null : orderPayReducer.queryParams.finDateEnd}
                                    onChange={(date)=>{
                                        dispatch(OrderPayActionType.setQueryPayParam({name: "finDateEnd", value: date}))
                                    }}
                        />
                    </Grid>
                </Grid>

                <Grid item xs={1} container style={{textAlign:'center',marginTop:30}}>
                    {/*查询按钮*/}
                    <Grid item xs={12}>
                        <Fab color="primary" size="small" onClick={()=>{dispatch(orderPayAction.getOrderList(0))}}>
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
                            <TableCell className={classes.tableHead} align="center">
                                <Checkbox
                                    checked={orderPayReducer.orderData.dataList.length>0&&selected.length == orderPayReducer.orderData.dataList.length}
                                    onChange={(e,value) => {
                                        handleSelectAllClick(e.target.checked);
                                    }}
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
                            <TableCell className={classes.tableHead} align="center">创建日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">完成日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">
                                <Button variant="contained" color="primary" size='small' onClick={()=>{getAllOrderData()}}>批量</Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderPayReducer.orderData.dataList.
                        map((row,index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return(
                                <TableRow key={row.id}
                                          hover
                                          onClick={(event) => handleClick(event, row.id)}
                                          role="checkbox"
                                          aria-checked={isItemSelected}
                                          tabIndex={-1}
                                          selected={isItemSelected}>
                                    <TableCell>
                                        <Checkbox
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
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
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_TYPE, row.order_type)}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_STATUS, row.status)}</TableCell>
                                    <TableCell align="center">{row.date_id}</TableCell>
                                    <TableCell align="center">{row.fin_date_id}</TableCell>
                                    <TableCell align="center">
                                        {/* 编辑按钮 */}
                                        {/*<IconButton color="primary" edge="start" size="small">
                                        <Link to={{pathname: '/order/' + row.id}}><i className="mdi mdi-table-search"/></Link>
                                    </IconButton>*/}
                                    </TableCell>
                                </TableRow>
                                )
                        })}

                        {orderPayReducer.orderData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={15} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {orderPayReducer.orderData.start > 0 && orderPayReducer.orderData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={()=>{dispatch(orderPayAction.getOrderList(orderPayReducer.orderData.start-(orderPayReducer.orderData.size-1)))}}>上一页</Button>}
                {orderPayReducer.orderData.dataSize >= orderPayReducer.orderData.size &&
                <Button variant="contained" color="primary"
                        onClick={()=>{dispatch(orderPayAction.getOrderList(orderPayReducer.orderData.start+(orderPayReducer.orderData.size-1)))}}>下一页</Button>}
            </Box>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        orderPayReducer: state.OrderPayReducer,
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
        dispatch(orderPayAction.getOrderList(dataStart))
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderPay)
