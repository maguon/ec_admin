import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
// 引入material-ui基础组件
import {Box, Button, Divider, Fab, FormControl, Grid, InputLabel,MenuItem, Paper, Select, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, Typography, IconButton
} from "@material-ui/core";
import {DatePicker} from '@material-ui/pickers';
import {makeStyles} from "@material-ui/core/styles";
import {CollectionRefundActionType} from "../../types";
import Swal from "sweetalert2";
const CollectionRefundAction = require('../../actions/main/CollectionRefundAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
}));

function CollectionRefund(props) {
    const {collectionRefundReducer,fromDetail,getCollectionRefundList,deletePaymentItem} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!fromDetail) {
            let obj = {
                paymentId: '',
                status: '',
                type: '',
                paymentType: '',
                dateStart: '',
                dateEnd: '',
            };
            dispatch(CollectionRefundActionType.setCollectionRefundParams(obj));
        }
        getCollectionRefundList(collectionRefundReducer.collectionRefundData.start);
    }, []);

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>收款退款</Typography>
            <Divider light className={classes.divider}/>
            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={11} spacing={1}>
                    <Grid item xs={2}>
                        <TextField label="订单支付编号" fullWidth margin="dense" variant="outlined" type="number"
                                   value={collectionRefundReducer.collectionRefundParam.paymentId}
                                   onChange={(e,value) => {
                                       dispatch(CollectionRefundActionType.setCollectionRefundParam({name: "paymentId", value: e.target.value}));
                                   }}/>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>支付状态</InputLabel>
                            <Select label="支付状态"
                                    value={collectionRefundReducer.collectionRefundParam.status}
                                    onChange={(e, value) => {
                                        dispatch(CollectionRefundActionType.setCollectionRefundParam({ name: "status",value: e.target.value}));
                                    }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.ORDER_PAY_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>付款类型</InputLabel>
                            <Select label="付款类型"
                                    value={collectionRefundReducer.collectionRefundParam.type}
                                    onChange={(e, value) => {
                                        dispatch(CollectionRefundActionType.setCollectionRefundParam({
                                            name: "type",
                                            value: e.target.value
                                        }));
                                    }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.PAY_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>支付方式</InputLabel>
                            <Select label="支付方式"
                                    value={collectionRefundReducer.collectionRefundParam.paymentType}
                                    onChange={(e, value) => {
                                        dispatch(CollectionRefundActionType.setCollectionRefundParam({
                                            name: "paymentType",
                                            value: e.target.value
                                        }));
                                    }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.PAYMENT_TYPE.map((item, index) => (
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
                                    value={collectionRefundReducer.collectionRefundParam.dateStart == "" ? null : collectionRefundReducer.collectionRefundParam.dateStart}
                                    onChange={(date) => {
                                        dispatch(CollectionRefundActionType.setCollectionRefundParam({name: "dateStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                    format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（终）"
                                    value={collectionRefundReducer.collectionRefundParam.dateEnd == "" ? null : collectionRefundReducer.collectionRefundParam.dateEnd}
                                    onChange={(date) => {
                                        dispatch(CollectionRefundActionType.setCollectionRefundParam({name: "dateEnd", value: date}))
                                    }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={1} container style={{textAlign: 'center',marginTop:10}}>
                    <Grid item xs={12}>
                        <Fab color="primary" size="small" onClick={() => {
                            dispatch(CollectionRefundAction.getCollectionRefundList(0))
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
                            <TableCell className={classes.tableHead} align="center">订单支付ID</TableCell>
                            <TableCell className={classes.tableHead} align="center">订单笔数</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品金额</TableCell>
                            <TableCell className={classes.tableHead} align="center">服务费</TableCell>
                            <TableCell className={classes.tableHead} align="center">订单金额</TableCell>
                            <TableCell className={classes.tableHead} align="center">退款订单笔数</TableCell>
                            <TableCell className={classes.tableHead} align="center">退款商品金额</TableCell>
                            <TableCell className={classes.tableHead} align="center">退款服务费</TableCell>
                            <TableCell className={classes.tableHead} align="center">退款订单金额</TableCell>
                            <TableCell className={classes.tableHead} align="center">计划付款金额</TableCell>
                            <TableCell className={classes.tableHead} align="center">实际金额</TableCell>
                            <TableCell className={classes.tableHead} align="center">支付状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">付款类型</TableCell>
                            <TableCell className={classes.tableHead} align="center">支付方式</TableCell>
                            <TableCell className={classes.tableHead} align="center">完成日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {collectionRefundReducer.collectionRefundData.dataList.map((row, index) => {
                            return (
                                <TableRow key={row.id}>
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell align="center">{Number(row.order_count)}</TableCell>
                                    <TableCell align="center">{row.prod_price}</TableCell>
                                    <TableCell align="center">{row.service_price}</TableCell>
                                    <TableCell align="center">{row.total_order_price}</TableCell>
                                    <TableCell align="center">{Number(row.order_refund_count)}</TableCell>
                                    <TableCell align="center">{row.refund_prod_price}</TableCell>
                                    <TableCell align="center">{row.refund_service_price}</TableCell>
                                    <TableCell align="center">{row.total_refund_price}</TableCell>
                                    <TableCell align="center">{row.plan_price}</TableCell>
                                    <TableCell align="center">{row.actual_price}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_PAY_TYPE, row.status)}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.PAY_TYPE, row.type)}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.PAYMENT_TYPE, row.payment_type)}</TableCell>
                                    <TableCell align="center">{row.date_id}</TableCell>
                                    <TableCell align="center">
                                        <IconButton disabled={row.status==1} color="secondary" edge="start" size="small" onClick={()=>{deletePaymentItem(row.id,collectionRefundReducer.collectionRefundData.start)}}>
                                            <i className="mdi mdi-delete purple-font"> </i>
                                        </IconButton>
                                        <IconButton color="primary" edge="start" size="small">
                                            <Link to={{pathname: '/collection_refund/' + row.id}}>
                                                <i className="mdi mdi-table-search"/>
                                            </Link>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {collectionRefundReducer.collectionRefundData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={16} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {collectionRefundReducer.collectionRefundData.start > 0 && collectionRefundReducer.collectionRefundData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={() => {
                            dispatch(CollectionRefundAction.getCollectionRefundList(collectionRefundReducer.collectionRefundData.start - (collectionRefundReducer.collectionRefundData.size - 1)))
                        }}>上一页</Button>}
                {collectionRefundReducer.collectionRefundData.dataSize >= collectionRefundReducer.collectionRefundData.size &&
                <Button variant="contained" color="primary"
                        onClick={() => {
                            dispatch(CollectionRefundAction.getCollectionRefundList(collectionRefundReducer.collectionRefundData.start + (collectionRefundReducer.collectionRefundData.size - 1)))
                        }}>下一页</Button>}
            </Box>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        fromDetail = true;
    }
    return {
        collectionRefundReducer: state.CollectionRefundReducer,
        commonReducer: state.CommonReducer,
        fromDetail: fromDetail
    }
};
const mapDispatchToProps = (dispatch) => ({
    getCollectionRefundList: (dataStart) => {
        dispatch(CollectionRefundAction.getCollectionRefundList(dataStart))
    },
    deletePaymentItem: (id,start) => {
        Swal.fire({
            title: "确定删除该支付订单吗?",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(CollectionRefundAction.deletePaymentItem(id,start))
            }
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionRefund)
