import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
// 引入material-ui基础组件
import {Box, Button, Divider, Fab, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, Typography, IconButton, Stepper, Step, StepLabel} from "@material-ui/core";
import {DatePicker} from '@material-ui/pickers';
import {makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Swal from "sweetalert2";
import {SimpleModal} from "../index";
import {CollectionRefundActionType} from "../../types";
const CollectionRefundAction = require('../../actions/main/CollectionRefundAction');
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

function CollectionRefund(props) {
    const {collectionRefundReducer,commonReducer,fromDetail,getCollectionRefundList,deletePaymentItem,getClientAgentList} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    // 模态数据
    const [modalData, setModalData] = React.useState({clientAgent: null, remark: '' ,type: '', paymentType: null,finDateStart:null,finDateEnd:null,actualPrice:''});
    // 模态步骤说明
    const steps = ['选择客户集群', '填写详请信息'];
    // 模态校验
    const [validation,setValidation] = useState({});
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
    //初始添加模态框值
    const handleAddOpen =() =>{
        getClientAgentList();
        setModalOpenFlag(true);
        setModalData({clientAgent: null, remark: '' ,type: '', paymentType: null,finDateStart:null,finDateEnd:null,actualPrice:''});
    }
    // 关闭模态
    const closeModal = () => {
        setModalOpenFlag(false);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleNext = (step) => {
        // 第一步：选择客户集群
        if (step === 0) {
            const validateObj = {};
            if (!modalData.clientAgent) {
                validateObj.clientAgent = '请选择客户集群';
            }
            if (!modalData.finDateStart) {
                validateObj.finDateStart = '请选择完成时间(始)';
            }
            if (!modalData.finDateEnd) {
                validateObj.finDateEnd = '请选择完成时间(终)';
            }
            setValidation(validateObj);
            let errorCount = Object.keys(validateObj).length;
            if (errorCount === 0) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                // 清check内容
                setValidation({});
                props.getOrderStat(modalData);
                props.getOrderRefundStat(modalData);

            }
        }
        // 第二步：填写详情
        if (step === 1) {
            const validateObjStep = {};
            if (!modalData.paymentType) {
                validateObjStep.paymentType = '请选择支付方式';
            }
            setValidation(validateObjStep);
            let errorCount = Object.keys(validateObjStep).length;
            if (errorCount === 0) {
                if(collectionRefundReducer.orderStatInfo.order_count=='0'&&collectionRefundReducer.orderRefundInfo.order_refund_count =='0'){
                    setActiveStep(0);
                    setModalOpenFlag(false);
                    Swal.fire("无符合条件的订单!",'','warning');
                }else {
                    modalData.actualPrice=Number(collectionRefundReducer.orderStatInfo.total_actual_price)-Number(collectionRefundReducer.orderRefundInfo.total_refund_price);
                    modalData.actualPrice>0?modalData.type=sysConst.PAY_TYPE[0].value:modalData.type=sysConst.PAY_TYPE[1].value;
                    props.addPaymentItem(modalData);
                    setModalOpenFlag(false);
                }

            }
        }
    };
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
                    <Grid item xs={6}>
                        <Fab color="primary" size="small" onClick={() => {
                            dispatch(CollectionRefundAction.getCollectionRefundList(0))
                        }}>
                            <i className="mdi mdi-magnify mdi-24px"/>
                        </Fab>
                    </Grid>
                    <Grid item xs={6}>
                        <Fab size="small" color="primary" aria-label="add" onClick={()=>{handleAddOpen(null)}}>
                            <i className="mdi mdi-plus mdi-24px" />
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

            {/*模态框*/}
            <SimpleModal
                maxWidth="md"
                maxHeight="md"
                title="新增收款退款"
                open={modalOpenFlag}
                onClose={closeModal}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" onClick={activeStep===0 ? closeModal : handleBack}>{activeStep===0 ? '关闭' : '返回'}</Button>
                        <Button variant="contained" color="primary" onClick={() => {handleNext(activeStep)}}> {activeStep === steps.length - 1 ? '完成' : '下一步'}</Button>
                    </>
                }
            >
                {/* 步骤标题 */}
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
                </Stepper>
                {/* 步骤内容 */}
                <div align="center">
                    {/*第一步添加ID*/}
                    <div style={{display:activeStep==0?'block':'none'}}>
                        <Grid container spacing={1} style={{marginBottom:10}}>
                            <Grid item sm={4}>
                                <Autocomplete fullWidth
                                              options={commonReducer.clientAgentList}
                                              getOptionLabel={(option) =>option.name}
                                              value={modalData.clientAgent}
                                              onChange={(event, value) => {
                                                  setModalData({...modalData, clientAgent: value});
                                              }}
                                              renderInput={(params) => <TextField {...params} label="客户集群" margin="dense" variant="outlined"
                                                                                  error={validation.clientAgent&&validation.clientAgent!=''}
                                                                                  helperText={validation.clientAgent}
                                              />}
                                />
                            </Grid>
                            <Grid item sm={4}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                            format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="完成日期（始）"
                                            value={modalData.finDateStart}
                                            onChange={(date) => {
                                                setModalData({...modalData, finDateStart: date});
                                            }}
                                            error={validation.finDateStart&&validation.finDateStart!=null}
                                            helperText={validation.finDateStart}
                                />
                            </Grid>
                            <Grid item sm={4}>
                                <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                            format="yyyy/MM/dd"
                                            okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                            label="完成日期（终）"
                                            value={modalData.finDateEnd}
                                            onChange={(date) => {
                                                setModalData({...modalData, finDateEnd: date});
                                            }}
                                            error={validation.finDateEnd&&validation.finDateEnd!=null}
                                            helperText={validation.finDateEnd}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    {/* 第二步添加商品详情 */}
                    <div style={{display:activeStep==!0?'block':'none',margin:'20px 0',textAlign:'left'}}>
                        <Grid  container spacing={3}>
                            <Grid item sm={3}>订单笔数：{collectionRefundReducer.orderStatInfo.order_count}</Grid>
                            <Grid item sm={3}>服务费总额：{collectionRefundReducer.orderStatInfo.service_price}</Grid>
                            <Grid item sm={3}>商品总额：{collectionRefundReducer.orderStatInfo.prod_price}</Grid>
                            <Grid item sm={3}>实际总额：{collectionRefundReducer.orderStatInfo.total_actual_price}</Grid>
                            <Grid item sm={3}>退单笔数：{collectionRefundReducer.orderRefundInfo.order_refund_count}</Grid>
                            <Grid item sm={3}>服务退款总额：{collectionRefundReducer.orderRefundInfo.service_refund_price}</Grid>
                            <Grid item sm={3}>商品退款总额：{collectionRefundReducer.orderRefundInfo.prod_refund_price}</Grid>
                            <Grid item sm={3}>退款总额：{collectionRefundReducer.orderRefundInfo.total_refund_price}</Grid>
                            <Grid item xs={4}>
                                <Autocomplete fullWidth
                                              options={sysConst.PAYMENT_TYPE}
                                              getOptionLabel={(option) =>option.label}
                                              value={modalData.paymentType}
                                              onChange={(event, value) => {
                                                  setModalData({...modalData, paymentType: value});
                                              }}
                                              renderInput={(params) => <TextField {...params} label="支付方式" margin="dense" variant="outlined"
                                                                                  error={validation.paymentType&&validation.paymentType!=''}
                                                                                  helperText={validation.paymentType}
                                              />}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth={true}
                                    margin="dense"
                                    variant="outlined"
                                    label="备注"
                                    value={modalData.remark}
                                    onChange={(event, value) => {
                                        setModalData({...modalData, remark: event.target.value});
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>

                    </div>
                </div>
            </SimpleModal>

        </div>
    )
};

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
    getClientAgentList:() => {
        dispatch(commonAction.getClientAgentList())
    },
    getOrderStat:(data) => {
        dispatch(CollectionRefundAction.getCollectionStat(data))
    },
    getOrderRefundStat:(data) => {
        dispatch(CollectionRefundAction.getCollectionRefundStat(data))
    },
    addPaymentItem:(data)=>{
        dispatch(CollectionRefundAction.addPaymentItem(data))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionRefund)
