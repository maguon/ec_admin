import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link, useParams} from "react-router-dom";
// 引入material-ui基础组件
import {Button, Divider,Grid, TextField, Typography,IconButton, Accordion, AccordionSummary} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CollectionRefundDetailActionType} from "../../types";
import Swal from "sweetalert2";
const CollectionRefundDetailAction = require('../../actions/main/CollectionRefundDetailAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
    divider:{
        margin:'20px 0'
    },
    accordion:{
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    accordionSummary:{
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
}));

function CollectionRefundDetail(props) {
    const {collectionRefundDetailReducer, getPaymentList,getOrderInfo,getOrderBasic,getOrderRefundBasic,putPayment,updatePaymentStatus} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();
    const [expanded, setExpanded] = useState(false);
    useEffect(()=>{
        getPaymentList(id);
        getOrderInfo(id);
    },[]);
    const handleChange = (panel,id,orderRefundId) => async(event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        if(newExpanded&&orderRefundId==0){
            getOrderBasic(id);
        }else if(newExpanded&&orderRefundId!==0){
            getOrderRefundBasic(orderRefundId);
        }else {
            return;
        }

    };
    const putPaymentInfo=(id)=>{
        putPayment(id);
    }
    const updateStatus=(id,status)=>{
        updatePaymentStatus(id,status)
    }
    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>
                <Link to={{pathname: '/collection_refund', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start"><i className="mdi mdi-arrow-left-bold"/></IconButton>
                </Link>
                收款退款 - {id}
            </Typography>
            <Divider light className={classes.pageDivider}/>
            <h4>基本信息</h4>
            <div>



                <Grid container spacing={3}>
                    <Grid item xs={3} align='left'>订单笔数:{Number(collectionRefundDetailReducer.paymentInfo.order_count)}</Grid>
                    <Grid item xs={3} align='left'>商品金额:{collectionRefundDetailReducer.paymentInfo.prod_price}</Grid>
                    <Grid item xs={3} align='left'>服务费:{collectionRefundDetailReducer.paymentInfo.service_price}</Grid>
                    <Grid item xs={3} align='left'>付款金额:{collectionRefundDetailReducer.paymentInfo.total_order_price}</Grid>
                </Grid>
              <Grid container spacing={3}>
                    <Grid item xs={3} align='left'>退款订单笔数:{Number(collectionRefundDetailReducer.paymentInfo.order_refund_count)}</Grid>
                    <Grid item xs={3} align='left'>退款商品金额:{collectionRefundDetailReducer.paymentInfo.refund_prod_price}</Grid>
                    <Grid item xs={3} align='left'>退款服务费:{collectionRefundDetailReducer.paymentInfo.refund_service_price}</Grid>
                    <Grid item xs={3} align='left'>退款订单金额:{collectionRefundDetailReducer.paymentInfo.total_refund_price}</Grid>
               </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={3} align='left'>支付状态:{commonUtil.getJsonValue(sysConst.ORDER_PAY_TYPE, collectionRefundDetailReducer.paymentInfo.status)}</Grid>
                    <Grid item xs={3} align='left'>付款类型:{commonUtil.getJsonValue(sysConst.PAY_TYPE, collectionRefundDetailReducer.paymentInfo.type)}</Grid>
                    <Grid item xs={3} align='left'>完成日期:{collectionRefundDetailReducer.paymentInfo.date_id}</Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                        <TextField fullWidth  select variant="outlined"  margin="dense"  label="支付方式" InputLabelProps={{ shrink: true }}
                                   value={collectionRefundDetailReducer.paymentInfo.payment_type}
                                   onChange={(e)=>{
                                       dispatch(CollectionRefundDetailActionType.setPaymentInfo({
                                           name: "payment_type",
                                           value: e.target.value
                                       }));
                                   }}
                                   SelectProps={{
                                       native: true,
                                   }}
                        >
                            {sysConst.PAYMENT_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField fullWidth margin="dense" variant="outlined" label="实际金额" InputLabelProps={{ shrink: true }}
                                   value={collectionRefundDetailReducer.paymentInfo.actual_price}
                                   onChange={(e)=>{
                                       dispatch(CollectionRefundDetailActionType.setPaymentInfo({
                                           name: "actual_price",
                                           value: e.target.value
                                       }));
                                   }}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField fullWidth margin="dense" variant="outlined" label="备注" InputLabelProps={{ shrink: true }}
                                   value={collectionRefundDetailReducer.paymentInfo.remark}
                                   onChange={(e)=>{
                                       dispatch(CollectionRefundDetailActionType.setPaymentInfo({
                                           name: "remark",
                                           value: e.target.value
                                       }));
                                   }}
                        />
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Button variant="contained" color="primary"   style={{display:collectionRefundDetailReducer.paymentInfo.status==0?'inline':'none',marginRight:'20px'}}  onClick={()=>{putPaymentInfo(id)}}>保存</Button>
                        <Button variant="contained" color="secondary"  style={{display:collectionRefundDetailReducer.paymentInfo.status==0?'inline':'none'}}  onClick={() => {updateStatus(id,sysConst.ORDER_PAY_TYPE[1].value)}}>完成</Button>
                    </Grid>
                </Grid>
            </div>
            <h4>收款</h4>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                {/*订单编号  价格      接单人 备注  商品    服务     价格*/}
                {collectionRefundDetailReducer.orderInfo.map((row,index) => (
                    row.order_refund_id==0?
                        <Accordion key={'orderDetail'+index} className={classes.accordion} square expanded={expanded === 'panel'+index} onChange={handleChange('panel'+index,row.order_id,row.order_refund_id)}>
                            <AccordionSummary className={classes.accordionSummary} aria-controls="panel1d-content" id="panel1d-header" >
                                <Grid container  spacing={3}>
                                    <Grid item xs align='left'>订单编号:{row.order_id}</Grid>
                                    <Grid item xs align='right'>金额:{row.o_prod_price}</Grid>
                                </Grid>
                            </AccordionSummary>
                            <div style={{padding:'30px'}}>
                                {collectionRefundDetailReducer.orderServiceInfo.length!==0&&<h4>服务:</h4>}
                                {collectionRefundDetailReducer.orderServiceInfo.length!==0?
                                    collectionRefundDetailReducer.orderServiceInfo.map((service,index) => (
                                        <Grid key={service.id}>
                                                <Grid container  spacing={3}>
                                                    <Grid item xs={2} align='left'>名称:{service.sale_service_name}</Grid>
                                                    <Grid item xs={2} align='left'>售价:{service.fixed_price=='0.00'?service.unit_price+'*'+Number(service.service_count):service.fixed_price}</Grid>
                                                    <Grid item xs={2} align='left'>总价:{service.service_price}</Grid>
                                                    <Grid item xs={2} align='left'>折扣:{service.discount_service_price}</Grid>
                                                    <Grid item xs={2} align='left'>实际价格:{service.actual_service_price}</Grid>
                                                </Grid>
                                          {/*  <Grid container  spacing={3}>
                                                <Grid item xs={2} align='left'>销售:{service.sale_user_name}</Grid>
                                                <Grid item xs={2} align='left'>施工:{service.deploy_user_name}</Grid>
                                                <Grid item xs={2} align='left'>验收:{service.check_user_name}</Grid>
                                            </Grid>*/}
                                            <Divider className={classes.divider} variant="middle" />
                                        </Grid>
                                    ))
                                    :''}
                                {collectionRefundDetailReducer.orderProdInfo.length!==0&&<h4>商品:</h4>}
                                {collectionRefundDetailReducer.orderProdInfo.length!==0?
                                    collectionRefundDetailReducer.orderProdInfo.map((item,index) => (
                                        <Grid key={item.id}>
                                            <Grid container  spacing={3}>
                                                <Grid item xs={2} align='left'>名称:{item.prod_name}</Grid>
                                                <Grid item xs={2} align='left'>单价:{item.unit_price}</Grid>
                                                <Grid item xs={2} align='left'>数量:{Number(item.prod_count)}</Grid>
                                                <Grid item xs={2} align='left'>折扣:{item.discount_prod_price}</Grid>
                                                <Grid item xs={2} align='left'>实际价格:{item.actual_prod_price}</Grid>
                                               {/* <Grid item xs={2} align='left'>销售:{item.sale_user_name}</Grid>*/}
                                            </Grid>
                                            <Divider className={classes.divider} variant="middle" />
                                        </Grid>
                                    ))
                                    :''}
                            </div>
                        </Accordion>
                        :''
                ))}
            </Grid>
            </Grid>
            <h4>退款</h4>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {/*订单编号  价格      接单人 备注  商品    服务     价格*/}
                    {collectionRefundDetailReducer.orderInfo.map((row,index) => (
                        row.order_refund_id!==0?
                            <Accordion key={'orderDetail'+index} className={classes.accordion} square expanded={expanded === 'panel'+index} onChange={handleChange('panel'+index,row.order_id,row.order_refund_id)}>
                                <AccordionSummary className={classes.accordionSummary} aria-controls="panel1d-content" id="panel1d-header" >
                                    <Grid container  spacing={3}>
                                        <Grid item xs={3} align='left'>订单编号:{row.order_id}</Grid>
                                        <Grid item xs={3} align='left'>退单编号:{row.order_refund_id}</Grid>
                                        <Grid item xs align='right'>退款金额:{row.orf_total_refund_price}</Grid>
                                    </Grid>
                                </AccordionSummary>
                                <div style={{padding:'30px'}}>
                                    {collectionRefundDetailReducer.orderRefundSerVList.length!==0&&<h4>服务:</h4>}
                                    {collectionRefundDetailReducer.orderRefundSerVList.length!==0?
                                        collectionRefundDetailReducer.orderRefundSerVList.map((service,index) => (
                                            <Grid key={service.id}>
                                                <Grid container  spacing={3}>
                                                    <Grid item xs={2} align='left'>名称:{service.sale_service_name}</Grid>
                                                    <Grid item xs={2} align='left'>售价:{service.fixed_price=='0.00'?service.unit_price+'*'+Number(service.service_count):service.fixed_price}</Grid>
                                                    <Grid item xs={2} align='left'>总价:{service.service_price}</Grid>
                                                    <Grid item xs={2} align='left'>折扣:{service.discount_service_price}</Grid>
                                                    <Grid item xs={2} align='left'>实际价格:{service.actual_service_price}</Grid>
                                                    <Grid item xs={2} align='left'>服务退款:{service.service_refund_price}</Grid>
                                                </Grid>


                                              {/*  <Grid container  spacing={3}>
                                                    <Grid item xs={2} align='left'>销售:{service.sale_user_name}</Grid>
                                                    <Grid item xs={2} align='left'>施工:{service.deploy_user_name}</Grid>
                                                    <Grid item xs={2} align='left'>验收:{service.check_user_name}</Grid>
                                                </Grid>*/}
                                                <Divider className={classes.divider} variant="middle" />
                                            </Grid>
                                        ))
                                        :''}
                                    {collectionRefundDetailReducer.orderRefundProdList.length!==0&&<h4>商品:</h4>}
                                    {collectionRefundDetailReducer.orderRefundProdList.length!==0?
                                        collectionRefundDetailReducer.orderRefundProdList.map((item,index) => (
                                            <Grid key={item.id}>
                                                <Grid container  spacing={3}>
                                                    <Grid item xs={2} align='left'>名称:{item.prod_name}</Grid>
                                                  {/*  <Grid item xs={2} align='left'>单价:{item.unit_price}</Grid>
                                                    <Grid item xs={2} align='left'>数量:{item.prod_count}</Grid>
                                                    <Grid item xs={2} align='left'>折扣:{item.discount_prod_price}</Grid>
                                                    <Grid item xs={2} align='left'>实际价格:{item.actual_prod_price}</Grid>
                                                    <Grid item xs={2} align='left'>销售:{item.sale_user_name}</Grid>*/}
                                                    <Grid item xs={2} align='left'>商品退款:{item.prod_refund_price}</Grid>
                                                    <Grid item xs={2} align='left'>退款数量:{Number(item.prod_refund_count)}</Grid>
                                                    <Grid item xs={2} align='left'>退款总价:{item.total_refund_price}</Grid>
                                                </Grid>
                                                <Divider className={classes.divider} variant="middle" />
                                            </Grid>
                                        ))
                                        :''}
                                </div>
                            </Accordion>
                            :''
                    ))}
                </Grid>
            </Grid>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        collectionRefundDetailReducer: state.CollectionRefundDetailReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    getPaymentList: (id) => {
        dispatch(CollectionRefundDetailAction.getPaymentList(id));
    },
    getOrderInfo: (id) => {
        dispatch(CollectionRefundDetailAction.getOrderInfo(id));
    },
    getOrderBasic:(orderId)=>{
        dispatch(CollectionRefundDetailAction.getOrderProdList(orderId));
        dispatch(CollectionRefundDetailAction.getOrderServiceList(orderId));
    },
    putPayment:(id)=>{
        dispatch(CollectionRefundDetailAction.putPayment(id));
    },
    updatePaymentStatus: (id,status) => {
        Swal.fire({
            title: '确定支付此订单?',
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(CollectionRefundDetailAction.updatePaymentStatus(id,status))
            }
        });
    },
    getOrderRefundBasic:(id)=>{
        dispatch(CollectionRefundDetailAction.getCollectionRefundService(id));
        dispatch(CollectionRefundDetailAction.getCollectionRefundProd(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionRefundDetail)
