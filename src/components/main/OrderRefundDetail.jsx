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
    const {orderRefundDetailReducer, commonReducer, changeOrderRefundStatus,deleteService, deleteProduct} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();

    // init
    useEffect(() => {
        dispatch(orderRefundDetailAction.getOrderRefundInfo(id));
    }, []);

    useEffect(() => {
        dispatch(orderRefundDetailAction.getOrderRefundService(id, orderRefundDetailReducer.orderRefundInfo.order_id));
        dispatch(orderRefundDetailAction.getOrderRefundProd(id, orderRefundDetailReducer.orderRefundInfo.order_id));
    }, [orderRefundDetailReducer.orderRefundInfo.order_id]);

    // 新增服务数据
    const [newServiceData, setNewServiceData] = React.useState({serviceInfo: {},serviceRefundPrice: '',remark:''});
    // 新增商品数据
    const [newProdData, setNewProdData] = React.useState({productInfo: {},prodRefundPrice:'',prodRefundCount: '',remark:''});
    // 校验
    const [validation,setValidation] = React.useState({});

    const addService = () => {
        const validateObj ={};
        if (!newServiceData.serviceInfo || Object.keys(newServiceData.serviceInfo).length===0) {
            validateObj.serviceInfo ='请选择商品';
        }
        if (!newServiceData.serviceRefundPrice && newServiceData.serviceRefundPrice!== 0) {
            validateObj.serviceRefundPrice ='请输入退款金额';
        } else if (newServiceData.serviceRefundPrice > 0){
            validateObj.serviceRefundPrice ='退款金额不能大于0';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            dispatch(orderRefundDetailAction.addOrderRefundService(id, newServiceData));
            // 清空数据
            setNewServiceData({serviceInfo: {},serviceRefundPrice: '',remark:''});
        }
    };

    const addProduct = () => {
        const validateObj ={};
        if (!newProdData.productInfo || Object.keys(newProdData.productInfo).length===0) {
            validateObj.productInfo ='请选择商品';
        }
        if (!newProdData.prodRefundPrice && newProdData.prodRefundPrice!== 0) {
            validateObj.prodRefundPrice ='请输入退款金额';
        } else if (newProdData.prodRefundPrice > 0){
            validateObj.prodRefundPrice ='退款金额不能大于0';
        }
        if (!newProdData.prodRefundCount && newProdData.prodRefundCount!== 0) {
            validateObj.prodRefundCount ='请输入退货数量';
        } else if (newProdData.prodRefundCount > newProdData.productInfo.prod_count) {
            validateObj.prodRefundCount ='退货数不能大于商品数';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            dispatch(orderRefundDetailAction.addOrderRefundProd(id, newProdData));
            // 清空数据
            setNewProdData({productInfo: {},prodRefundPrice:'',prodRefundCount: '',remark:''});
        }
    };

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
                    <TextField label="退款合计" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={orderRefundDetailReducer.orderRefundInfo.total_refund_price}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="退货运费" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={orderRefundDetailReducer.orderRefundInfo.transfer_refund_price}/>
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
                    <IconButton color="primary" edge="start" style={{float:'right', marginLeft: 20}} onClick={()=>{dispatch(orderRefundDetailAction.downLoadPDF(id))}}><i className="mdi mdi-file-pdf mdi-24px"/></IconButton>
                </Grid>}
            </Grid>

            {/* 下部分：服务 */}
            <Grid container spacing={1}>
                <Grid item container sm={1}><Typography gutterBottom className={classes.title}>服务</Typography></Grid>
            </Grid>
            {orderRefundDetailReducer.orderRefundInfo.status !== 7 &&
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <Autocomplete fullWidth disableClearable
                                  options={orderRefundDetailReducer.orderAvailableSerVList}
                                  getOptionLabel={(option) => option.sale_service_name}
                                  value={newServiceData.serviceInfo}
                                  onChange={(event, value) => {
                                      setNewServiceData({...newServiceData, serviceInfo: value});
                                  }}
                                  renderInput={(params) => <TextField {...params} label="选择服务" margin="dense" variant="outlined"
                                      error={validation.serviceInfo&&validation.serviceInfo!=''} helperText={validation.serviceInfo}
                                  />}
                    />
                </Grid>

                <Grid item container xs={4} spacing={1}>
                    {newServiceData.serviceInfo.fixed_price != 0 &&
                    <Grid item xs={5}>
                        <TextField label="固定售价" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={newServiceData.serviceInfo.fixed_price || 0}/>
                    </Grid>}
                    {newServiceData.serviceInfo.fixed_price == 0 &&
                    <>
                        <Grid item xs={3}>
                            <TextField label="单价" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={newServiceData.serviceInfo.unit_price || 0}/>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField label="数量" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={newServiceData.serviceInfo.service_count || 0}/>
                        </Grid>
                    </>}
                    <Grid item xs={3}>
                        <TextField label="折扣" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={newServiceData.serviceInfo.discount_service_price || 0}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="实际价格" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={newServiceData.serviceInfo.actual_service_price || 0}/>
                    </Grid>
                </Grid>

                <Grid item container xs={6} spacing={1}>
                    <Grid item xs={3}>
                        <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={newServiceData.serviceRefundPrice}
                                   onChange={(e)=>{
                                       setNewServiceData({...newServiceData, serviceRefundPrice: e.target.value});
                                   }}
                                   error={validation.serviceRefundPrice&&validation.serviceRefundPrice!=''} helperText={validation.serviceRefundPrice}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={newServiceData.remark}
                                   onChange={(e)=>{
                                       setNewServiceData({...newServiceData, remark: e.target.value});
                                   }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton color="primary" edge="start" size="small" style={{paddingTop: '18px', marginLeft: '10px'}} onClick={addService}>
                            <i className="mdi mdi-plus-circle-outline"/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>}

            {orderRefundDetailReducer.orderRefundSerVList.map((item,index)=>(
                <Grid container spacing={1} key={index}>
                    <Grid item xs={2}>
                        <TextField label="服务名称" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.sale_service_name}/>
                        {/*<Autocomplete fullWidth disableClearable disabled options={commonReducer.saleServiceList}*/}
                        {/*              getOptionLabel={(option) => option.service_name}*/}
                        {/*              value={{id: item.sale_service_id,service_name: item.sale_service_name}}*/}
                        {/*              renderInput={(params) => <TextField {...params} label="服务名称" margin="dense" variant="outlined"/>}*/}
                        {/*/>*/}
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
                            <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.service_refund_price}
                                       onChange={(e)=>{
                                           orderRefundDetailReducer.orderRefundSerVList[index].service_refund_price = e.target.value;
                                           dispatch(OrderRefundDetailActionType.getOrderRefundSerVList(orderRefundDetailReducer.orderRefundSerVList));
                                       }}
                                       error={orderRefundDetailReducer.orderRefundSerVList[index].validate && orderRefundDetailReducer.orderRefundSerVList[index].validate.service_refund_price
                                       && orderRefundDetailReducer.orderRefundSerVList[index].validate.service_refund_price != ''}
                                       helperText={orderRefundDetailReducer.orderRefundSerVList[index].validate && orderRefundDetailReducer.orderRefundSerVList[index].validate.service_refund_price}
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
                        <Grid container item xs={1}>
                            <Grid item xs={6}>
                                <IconButton color="secondary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{deleteService(item)}}>
                                    <i className="mdi mdi-delete"/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={6}>
                                <IconButton color="primary" edge="start" size="small" style={{paddingTop: '18px'}} onClick={() => {
                                    let errCnt = 0;
                                    if (item.service_refund_price == '') {
                                        errCnt++;
                                        orderRefundDetailReducer.orderRefundSerVList[index].validate = {service_refund_price : '退款金额不能空'};
                                    } else if (item.service_refund_price > 0) {
                                        errCnt++;
                                        orderRefundDetailReducer.orderRefundSerVList[index].validate = {service_refund_price : '退款金额不能大于0'};
                                    }

                                    if (errCnt === 0) {
                                        dispatch(orderRefundDetailAction.saveOrderRefundService(item))
                                    } else {
                                        dispatch(OrderRefundDetailActionType.getOrderRefundSerVList(orderRefundDetailReducer.orderRefundSerVList));
                                    }
                                }}>
                                    <i className="mdi mdi-check-circle-outline"> </i>
                                </IconButton>
                            </Grid>
                        </Grid>}
                    </Grid>
                </Grid>
            ))}

            {/* 下部分：商品 */}
            <Grid container spacing={1}>
                <Grid item container sm={1}><Typography gutterBottom className={classes.title}>商品</Typography></Grid>
            </Grid>
            {orderRefundDetailReducer.orderRefundInfo.status !== 7 &&
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <Autocomplete fullWidth disableClearable
                                  options={orderRefundDetailReducer.orderAvailableProdList}
                                  getOptionLabel={(option) => option.prod_name}
                                  value={newProdData.productInfo}
                                  onChange={(event, value) => {
                                      setNewProdData({...newProdData, productInfo: value});
                                  }}
                                  renderInput={(params) => <TextField {...params} label="选择商品" margin="dense" variant="outlined"
                                      error={validation.productInfo&&validation.productInfo!=''} helperText={validation.productInfo}
                                  />}
                    />
                </Grid>

                <Grid item container xs={4} spacing={1}>
                    <Grid item xs={3}>
                        <TextField label="价格" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={newProdData.productInfo.unit_price || 0}/>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField label="数量" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={newProdData.productInfo.prod_count || 0}/>
                    </Grid>

                    <Grid item xs={3}>
                        <TextField label="折扣" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={newProdData.productInfo.discount_prod_price || 0}/>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField label="实际价格" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={newProdData.productInfo.actual_prod_price || 0}/>
                    </Grid>
                </Grid>

                <Grid item container xs={6} spacing={1}>
                    <Grid item xs={3}>
                        <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={newProdData.prodRefundPrice}
                                   onChange={(e) => {
                                       setNewProdData({...newProdData, prodRefundPrice: e.target.value});
                                   }}
                                   error={validation.prodRefundPrice&&validation.prodRefundPrice!=''} helperText={validation.prodRefundPrice}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField label="退货数量" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={newProdData.prodRefundCount}
                                   onChange={(e)=>{
                                       setNewProdData({...newProdData, prodRefundCount: e.target.value});
                                   }}
                                   error={validation.prodRefundCount&&validation.prodRefundCount!=''} helperText={validation.prodRefundCount}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" value={newProdData.remark}
                                   onChange={(e) => {
                                       setNewProdData({...newProdData, remark: e.target.value});
                                   }}/>
                    </Grid>

                    {orderRefundDetailReducer.orderRefundInfo.status !== 7 &&
                    <Grid item xs={1}>
                        <IconButton color="primary" edge="start" size="small" style={{paddingTop: '18px', marginLeft: '10px'}} onClick={addProduct}>
                            <i className="mdi mdi-plus-circle-outline"/>
                        </IconButton>
                    </Grid>}
                </Grid>
            </Grid>}

            {orderRefundDetailReducer.orderRefundProdList.map((item,index)=>(
                <Grid container spacing={1} key={index}>
                    <Grid item xs={2}>
                        <TextField label="商品名称" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.prod_name}/>
                        {/*<Autocomplete fullWidth disableClearable disabled options={commonReducer.productList}*/}
                        {/*              getOptionLabel={(option) => option.product_name}*/}
                        {/*              value={{id: item.prod_id, product_name: item.prod_name}}*/}
                        {/*              renderInput={(params) => <TextField {...params} label="商品名称" margin="dense" variant="outlined"/>}*/}
                        {/*/>*/}
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
                            <TextField label="退款金额" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.prod_refund_price}
                                       onChange={(e)=>{
                                           orderRefundDetailReducer.orderRefundProdList[index].prod_refund_price = e.target.value;
                                           dispatch(OrderRefundDetailActionType.getOrderRefundProdList(orderRefundDetailReducer.orderRefundProdList));
                                       }}
                                       error={orderRefundDetailReducer.orderRefundProdList[index].validate && orderRefundDetailReducer.orderRefundProdList[index].validate.prod_refund_price
                                       && orderRefundDetailReducer.orderRefundProdList[index].validate.prod_refund_price != ''}
                                       helperText={orderRefundDetailReducer.orderRefundProdList[index].validate && orderRefundDetailReducer.orderRefundProdList[index].validate.prod_refund_price}
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <TextField label="退货数量" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.prod_refund_count}
                                       onChange={(e)=>{
                                           orderRefundDetailReducer.orderRefundProdList[index].prod_refund_count = e.target.value;
                                           dispatch(OrderRefundDetailActionType.getOrderRefundProdList(orderRefundDetailReducer.orderRefundProdList));
                                       }}
                                       error={orderRefundDetailReducer.orderRefundProdList[index].validate && orderRefundDetailReducer.orderRefundProdList[index].validate.prod_refund_count
                                       && orderRefundDetailReducer.orderRefundProdList[index].validate.prod_refund_count != ''}
                                       helperText={orderRefundDetailReducer.orderRefundProdList[index].validate && orderRefundDetailReducer.orderRefundProdList[index].validate.prod_refund_count}
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
                        <Grid container item xs={1}>
                            <Grid item xs={6}>
                                <IconButton color="secondary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{deleteProduct(item)}}>
                                    <i className="mdi mdi-delete"/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={6}>
                                <IconButton color="primary" edge="start" size="small" style={{paddingTop: '18px'}}
                                            onClick={() => {
                                                let errCnt = 0;
                                                if (item.prod_refund_price == '') {
                                                    errCnt++;
                                                    orderRefundDetailReducer.orderRefundProdList[index].validate = {...orderRefundDetailReducer.orderRefundProdList[index].validate, prod_refund_price : '退款金额不能空'};
                                                } else if (item.prod_refund_price > 0) {
                                                    errCnt++;
                                                    orderRefundDetailReducer.orderRefundProdList[index].validate = {...orderRefundDetailReducer.orderRefundProdList[index].validate, prod_refund_price : '退款金额不能大于0'};
                                                }

                                                if (item.prod_refund_count == '') {
                                                    errCnt++;
                                                    orderRefundDetailReducer.orderRefundProdList[index].validate = {...orderRefundDetailReducer.orderRefundProdList[index].validate, prod_refund_count : '退货数量不能空'};
                                                } else if (item.prod_refund_count < 0) {
                                                    errCnt++;
                                                    orderRefundDetailReducer.orderRefundProdList[index].validate = {...orderRefundDetailReducer.orderRefundProdList[index].validate, prod_refund_count : '退货数不能小于0'};
                                                } else if (item.prod_refund_count > item.prod_count) {
                                                    errCnt++;
                                                    orderRefundDetailReducer.orderRefundProdList[index].validate = {...orderRefundDetailReducer.orderRefundProdList[index].validate, prod_refund_count : '退货数不能大于商品数'};
                                                }

                                                if (errCnt === 0) {
                                                    dispatch(orderRefundDetailAction.saveOrderRefundProd(item))
                                                } else {
                                                    dispatch(OrderRefundDetailActionType.getOrderRefundProdList(orderRefundDetailReducer.orderRefundProdList));
                                                }
                                            }}>
                                    <i className="mdi mdi-check-circle-outline"/>
                                </IconButton>
                            </Grid>
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
    deleteService: (data) => {
        Swal.fire({
            title: "确定删除该服务",
            text: "删除后，退单金额将重新计算",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(orderRefundDetailAction.deleteOrderRefundService(data));
            }
        });
    },
    deleteProduct: (data) => {
        Swal.fire({
            title: "确定删除该商品",
            text: "删除后，退单金额将重新计算",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(orderRefundDetailAction.deleteOrderRefundProd(data));
            }
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderRefundDetail)