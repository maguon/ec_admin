import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {connect, useDispatch} from 'react-redux';
import Swal from "sweetalert2";
// 引入material-ui基础组件
import {Button, Divider, Grid, IconButton, makeStyles, TextField, Typography} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {OrderRefundDetailActionType} from "../../types";

const orderRefundDetailAction = require('../../actions/main/OrderRefundDetailAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const commonAction = require('../../actions/layout/CommonAction');
const customTheme = require('../layout/Theme').customTheme;

const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider
}));

function OrderRefundDetail(props) {
    const {orderRefundDetailReducer, commonReducer, changeOrderRefundStatus} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();

    // init
    useEffect(() => {
        // props.getBaseSelectList();
        dispatch(orderRefundDetailAction.getOrderRefundInfo(id));
        dispatch(orderRefundDetailAction.getOrderRefundService(id));
        dispatch(orderRefundDetailAction.getOrderRefundProd(id));
    }, []);

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>
                <Link to={{pathname: '/order_refund', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start"><i className="mdi mdi-arrow-left-bold"/></IconButton>
                </Link>
                退单信息 - {id}
            </Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分 */}
            <Grid container spacing={1}>
                <Grid item sm={3}>
                    <TextField label="订单号" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={orderRefundDetailReducer.orderRefundInfo.order_id}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="服务退款" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={orderRefundDetailReducer.orderRefundInfo.service_refund_price}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="商品退款" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={orderRefundDetailReducer.orderRefundInfo.prod_refund_price}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="退货数量" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={orderRefundDetailReducer.orderRefundInfo.prod_refund_count}/>
                </Grid>

                <Grid item sm={3}>
                    <TextField label="退单状态" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={commonUtil.getJsonValue(sysConst.ORDER_REFUND_STATUS, orderRefundDetailReducer.orderRefundInfo.status)}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="支付状态" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={commonUtil.getJsonValue(sysConst.ORDER_PAYMENT_STATUS, orderRefundDetailReducer.orderRefundInfo.payment_status)}/>
                </Grid>

                <Grid item sm={12}>
                    <TextField label="退单备注" fullWidth margin="dense" variant="outlined" multiline rows="2" InputLabelProps={{ shrink: true }}
                               disabled={orderRefundDetailReducer.orderRefundInfo.status === 7}
                               value={orderRefundDetailReducer.orderRefundInfo.remark}
                               onChange={(e) => {
                                   dispatch(OrderRefundDetailActionType.setOrderRefundInfo({name: "remark", value: e.target.value}))
                               }}
                    />
                </Grid>

                {orderRefundDetailReducer.orderRefundInfo.status !== 7 &&
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" style={{float:'right', marginLeft: 20}} onClick={()=>{changeOrderRefundStatus(orderRefundDetailReducer.orderRefundInfo)}}>完成</Button>
                    <Button variant="contained" color="primary" style={{float:'right',marginLeft: 20}} onClick={()=>{dispatch(orderRefundDetailAction.saveOrderRefund())}}>保存</Button>
                </Grid>}
            </Grid>

            {/* 下部分：订单服务列表 */}
            {orderRefundDetailReducer.orderRefundSerVList.length > 0 &&
            <Grid container spacing={1}>
                <Grid item container sm={1}><Typography gutterBottom className={classes.title}>服务</Typography></Grid>
            </Grid>}

            {orderRefundDetailReducer.orderRefundSerVList.map((item,index)=>(
                <Grid container spacing={1} key={index}>
                    <Grid item xs={2}>
                        <Autocomplete fullWidth disableClearable disabled options={commonReducer.saleServiceList}
                                      getOptionLabel={(option) => option.service_name}
                                      value={{id: item.sale_service_id,service_name: item.sale_service_name}}
                                      renderInput={(params) => <TextField {...params} label="服务名称" margin="dense" variant="outlined"/>}
                        />
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
                            <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.service_refund_price || 0}
                                       onChange={(e)=>{
                                           orderRefundDetailReducer.orderRefundSerVList[index].service_refund_price = e.target.value;
                                           dispatch(OrderRefundDetailActionType.getOrderRefundSerVList(orderRefundDetailReducer.orderRefundSerVList));
                                       }}
                            />
                        </Grid>

                        <Grid item xs={8}>
                            <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={item.remark}
                                       onChange={(e)=>{
                                           orderRefundDetailReducer.orderRefundSerVList[index].remark = e.target.value;
                                           dispatch(OrderRefundDetailActionType.getOrderRefundSerVList(orderRefundDetailReducer.orderRefundSerVList));
                                       }}
                            />
                        </Grid>

                        {orderRefundDetailReducer.orderRefundInfo.status !== 7 &&
                        <Grid item xs={1}>
                            <IconButton color="primary" edge="start" size="small" style={{paddingTop:'18px',marginLeft: '10px'}} onClick={()=>{dispatch(orderRefundDetailAction.saveOrderRefundService(item))}}>
                                <i className="mdi mdi-check-circle-outline"> </i>
                            </IconButton>
                        </Grid>}
                    </Grid>

                </Grid>
            ))}

            {/*  商品信息： 商品名称，价格，折扣，实际价格 */}
            {orderRefundDetailReducer.orderRefundProdList.length > 0 &&
            <Grid container spacing={1}>
                <Grid item container sm={1}><Typography gutterBottom className={classes.title}>商品</Typography></Grid>
            </Grid>}

            {orderRefundDetailReducer.orderRefundProdList.map((item,index)=>(
                <Grid container spacing={1} key={index}>
                    <Grid item xs={2}>
                        <Autocomplete fullWidth disableClearable disabled options={commonReducer.productList}
                                      getOptionLabel={(option) => option.product_name}
                                      value={{id: item.prod_id, product_name: item.prod_name}}
                                      renderInput={(params) => <TextField {...params} label="商品名称" margin="dense" variant="outlined"/>}
                        />
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
                            <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.prod_refund_price || 0}
                                       onChange={(e)=>{
                                           orderRefundDetailReducer.orderRefundProdList[index].prod_refund_price = e.target.value;
                                           dispatch(OrderRefundDetailActionType.getOrderRefundProdList(orderRefundDetailReducer.orderRefundProdList));
                                       }}
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <TextField label="退货数量" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.prod_refund_count || item.prod_count}
                                       onChange={(e)=>{
                                           orderRefundDetailReducer.orderRefundProdList[index].prod_refund_count = e.target.value || item.prod_count;
                                           dispatch(OrderRefundDetailActionType.getOrderRefundProdList(orderRefundDetailReducer.orderRefundProdList));
                                       }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={item.remark}
                                       onChange={(e) => {
                                           orderRefundDetailReducer.orderRefundProdList[index].remark = e.target.value;
                                           dispatch(OrderRefundDetailActionType.getOrderRefundProdList(orderRefundDetailReducer.orderRefundProdList));
                                       }}
                            />
                        </Grid>

                        {orderRefundDetailReducer.orderRefundInfo.status !== 7 &&
                        <Grid item xs={1}>
                            <IconButton color="primary" edge="start" size="small" style={{paddingTop:'18px',marginLeft: '10px'}} onClick={()=>{dispatch(orderRefundDetailAction.saveOrderRefundProd(item))}}>
                                <i className="mdi mdi-check-circle-outline"> </i>
                            </IconButton>
                        </Grid>}



                    </Grid>
                </Grid>
            ))}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        orderRefundDetailReducer: state.OrderRefundDetailReducer,
        commonReducer: state.CommonReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        // 取得用户信息列表
        dispatch(commonAction.getUserList());
        // 取得服务列表
        dispatch(commonAction.getSaleServiceList());
        // 取得商品列表
        dispatch(commonAction.getProductList(null));
    },
    changeOrderRefundStatus: (orderRefundInfo) => {
        Swal.fire({
            title: "确定完成退单？",
            text: '退单后，将不能修改退单信息',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(orderRefundDetailAction.changeOrderRefundStatus(orderRefundInfo.id, 7));
            }
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderRefundDetail)