import React, {useEffect} from 'react';
import {Link, useParams, useLocation} from "react-router-dom";
import {connect, useDispatch} from 'react-redux';
import Swal from "sweetalert2";
// 引入material-ui基础组件
import {Button, Divider, Grid, IconButton, makeStyles, TextField, Typography} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {SimpleModal} from "../index";
import {OrderDetailActionType} from "../../types";

const orderDetailAction = require('../../actions/main/OrderDetailAction');
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
    const {orderDetailReducer, commonReducer, changeOrderStatus, cancelOrder, deleteService, deleteProd} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();
    let location = useLocation();

    const [orderParams,setOrderParams] = React.useState({});

    // init
    // useEffect(() => {
    //     console.log('id------------------------',id);
    //     props.getBaseSelectList();
    //     dispatch(orderDetailAction.getOrderInfo(id));
    //     dispatch(orderDetailAction.getOrderItemService(id));
    //     dispatch(orderDetailAction.getOrderItemProd(id));
    // }, [id]);

    // init
    useEffect(() => {
        console.log('location------------------------',location);
        props.getBaseSelectList();
        dispatch(orderDetailAction.getOrderInfo(id));
        dispatch(orderDetailAction.getOrderItemService(id));
        dispatch(orderDetailAction.getOrderItemProd(id));

        setOrderParams(location.state.queryParams);
    }, []);

    // 新增服务数据
    const [newServiceData, setNewServiceData] = React.useState({
        serviceInfo: {},
        servicePriceType: '',
        fixedPrice: '',
        unitPrice: '',
        discountServicePrice:0,
        actualServicePrice:0,
        serviceCount: '',
        orderItemType: 1,
        saleServiceId: '',
        saleServiceName: '',
        remark:''
    });
    // 新增商品数据
    const [newProdData, setNewProdData] = React.useState({
        productInfo: {},
        prodPrice:'',
        prodCount: 1,
        actualProdPrice:0,
        orderItemType: 1,
        discountProdPrice:0,
        prodId: '',
        prodName: '',
        remark:''
    });
    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 模态数据
    const [modalData, setModalData] = React.useState({});
    // 校验
    const [validation,setValidation] = React.useState({});

    //初始添加模态框值
    const initModal = (orderItemService, orderStatus) => {
        // 清check内容
        setValidation({});
        // 初始化模态数据
        setModalData({
            orderItemService: orderItemService,
            orderStatus: orderStatus,
            deployUser: {id: orderItemService.deploy_user_id,real_name: orderItemService.deploy_user_name},
            checkUser: {id: orderItemService.check_user_id,real_name: orderItemService.check_user_name}
        });
        // 设定模态打开
        setModalOpen(true);
    };

    const submitModal = () => {
        const validateObj ={};
        if (modalData.orderStatus === sysConst.ORDER_STATUS[1].value) {
            if (!modalData.deployUser) {
                validateObj.deployUser ='请选择施工人';
            }
        }
        if (modalData.orderStatus === sysConst.ORDER_STATUS[2].value) {
            if (!modalData.checkUser) {
                validateObj.checkUser ='请选择验收人';
            }
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            dispatch(orderDetailAction.saveModalData(modalData));
            setModalOpen(false);
        }
    };

    const addService = () => {
        const validateObj ={};
        if (!newServiceData.serviceInfo || Object.keys(newServiceData.serviceInfo).length===0) {
            validateObj.serviceInfo ='请选择服务';
        }
        if (!newServiceData.discountServicePrice && newServiceData.discountServicePrice!== 0) {
            validateObj.discountServicePrice ='请输入折扣';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            dispatch(orderDetailAction.addOrderItemService(id, {...newServiceData, clientId:orderDetailReducer.orderInfo.client_id, clientAgentId:orderDetailReducer.orderInfo.client_agent_id}));
            // 清空数据
            setNewServiceData({
                serviceInfo: '',
                servicePriceType: '',
                fixedPrice: '',
                unitPrice: '',
                discountServicePrice:0,
                actualServicePrice:0,
                serviceCount: '',
                orderItemType: 1,
                saleServiceId: '',
                saleServiceName: '',
                remark:''
            });
        }
    };

    const addProduct = () => {
        const validateObj ={};
        if (!newProdData.productInfo || Object.keys(newProdData.productInfo).length===0) {
            validateObj.productInfo ='请选择商品';
        }
        if (!newProdData.prodCount && newProdData.prodCount!== 0) {
            validateObj.prodCount ='请输入数量';
        }
        if (!newProdData.discountProdPrice && newProdData.discountProdPrice!== 0) {
            validateObj.discountProdPrice ='请输入折扣';
        }
        setValidation(validateObj);
        if(Object.keys(validateObj).length===0){
            dispatch(orderDetailAction.addOrderItemProd(id, {...newProdData, clientId:orderDetailReducer.orderInfo.client_id, clientAgentId:orderDetailReducer.orderInfo.client_agent_id}));
            // 清空数据
            setNewProdData({
                productInfo: '',
                prodPrice:'',
                prodCount: 1,
                actualProdPrice:0,
                orderItemType: 1,
                discountProdPrice:0,
                prodId: '',
                prodName: '',
                remark:''
            });
        }
    };

    const calcNewServicePrice =(value, discountServicePrice) =>{
        let realPrice = 0;
        // 服务价格类型
        if (value.service_price_type === sysConst.SERVICE_PRICE_TYPE[0].value) {
            realPrice = parseFloat(value.fixed_price) - parseFloat(discountServicePrice || 0);
        } else {
            realPrice = ((value.unit_price * value.service_price_count) || 0) - parseFloat(discountServicePrice || 0);
        }
        setNewServiceData({
            serviceInfo: value,
            servicePriceType: value.service_price_type,
            fixedPrice: value.fixed_price,
            unitPrice: value.unit_price,
            serviceCount: value.service_price_count,
            discountServicePrice: discountServicePrice,
            actualServicePrice:realPrice.toFixed(2),
            orderItemType: 1,
            saleServiceId: value.id,
            saleServiceName: value.service_name,
        });
    };

    const calcNewProdPrice =(value, prodCnt, discountProdPrice) =>{
        let realPrice = ((value.price * prodCnt) || 0) - parseFloat(discountProdPrice || 0);
        setNewProdData({
            productInfo: value,
            orderItemType: 1,
            prodPrice: value.price,
            prodCount: prodCnt,
            discountProdPrice: discountProdPrice,
            actualProdPrice:realPrice.toFixed(2),
            prodId: value.id,
            prodName: value.product_name,
            remark: ''
        });
    };

    const calcListServicePrice =(index, item) =>{
        let realPrice = 0;
        // 服务价格类型
        if (item.fixed_price != 0) {
            realPrice = parseFloat(orderDetailReducer.orderSerVList[index].fixed_price) - parseFloat(orderDetailReducer.orderSerVList[index].discount_service_price || 0);
        } else {
            realPrice = (orderDetailReducer.orderSerVList[index].unit_price * orderDetailReducer.orderSerVList[index].service_count)
                - parseFloat(orderDetailReducer.orderSerVList[index].discount_service_price || 0);
        }
        orderDetailReducer.orderSerVList[index].actual_service_price = realPrice.toFixed(2);
    };

    const calcListProdPrice =(index) =>{
        let realPrice = (orderDetailReducer.orderProdList[index].unit_price * orderDetailReducer.orderProdList[index].prod_count)
            - parseFloat(orderDetailReducer.orderProdList[index].discount_prod_price || 0);
        orderDetailReducer.orderProdList[index].actual_prod_price = realPrice.toFixed(2);
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>
                <Link to={{pathname: '/order_refund', state: {fromDetail: true,params:orderParams}}}>
                    <IconButton color="primary" edge="start"><i className="mdi mdi-arrow-left-bold"/></IconButton>
                </Link>
                订单信息 - {id}
            </Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分 */}
            <Grid container spacing={1}>
                <Grid item sm={3}>
                    <TextField label="车牌" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={orderDetailReducer.orderInfo.client_serial}/>
                </Grid>
                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="客户姓名" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={orderDetailReducer.orderInfo.client_name}/>*/}
                {/*</Grid>*/}
                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="客户电话" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={orderDetailReducer.orderInfo.client_tel}/>*/}
                {/*</Grid>*/}
                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="客户集群" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={orderDetailReducer.orderInfo.client_agent_name}/>*/}
                {/*</Grid>*/}

                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="服务费" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={orderDetailReducer.orderInfo.actual_service_price}/>*/}
                {/*</Grid>*/}
                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="商品金额" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={orderDetailReducer.orderInfo.actual_prod_price}/>*/}
                {/*</Grid>*/}
                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="折扣" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={orderDetailReducer.orderInfo.total_discount_price}/>*/}
                {/*</Grid>*/}
                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="实际金额" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={orderDetailReducer.orderInfo.total_actual_price}/>*/}
                {/*</Grid>*/}

                {/*<Grid item sm={3}>*/}
                {/*    <Autocomplete fullWidth disableClearable*/}
                {/*                  disabled={orderDetailReducer.orderInfo.status === 7 || orderDetailReducer.orderInfo.status === 0}*/}
                {/*                  options={commonReducer.userList}*/}
                {/*                  getOptionLabel={(option) => option.real_name}*/}
                {/*                  value={orderDetailReducer.orderInfo.reUser}*/}
                {/*                  onChange={(event, value) => {*/}
                {/*                      dispatch(OrderDetailActionType.setOrderInfo({name: "reUser", value: value}))*/}
                {/*                  }}*/}
                {/*                  renderInput={(params) => <TextField {...params} label="接单人" margin="dense" variant="outlined"/>}*/}
                {/*    />*/}
                {/*</Grid>*/}
                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="订单类型" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={commonUtil.getJsonValue(sysConst.ORDER_TYPE, orderDetailReducer.orderInfo.order_type)}/>*/}
                {/*</Grid>*/}
                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="订单状态" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={commonUtil.getJsonValue(sysConst.ORDER_STATUS, orderDetailReducer.orderInfo.status)}/>*/}
                {/*</Grid>*/}
                {/*<Grid item sm={3}>*/}
                {/*    <TextField label="支付状态" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled*/}
                {/*               value={commonUtil.getJsonValue(sysConst.ORDER_PAYMENT_STATUS, orderDetailReducer.orderInfo.payment_status)}/>*/}
                {/*</Grid>*/}

                {/*<Grid item sm={12}>*/}
                {/*    <TextField label="订单备注" fullWidth margin="dense" variant="outlined" multiline rows="2" InputLabelProps={{ shrink: true }}*/}
                {/*               disabled={orderDetailReducer.orderInfo.status === 7 || orderDetailReducer.orderInfo.status === 0}*/}
                {/*               value={orderDetailReducer.orderInfo.client_remark}*/}
                {/*               onChange={(e) => {*/}
                {/*                   dispatch(OrderDetailActionType.setOrderInfo({name: "client_remark", value: e.target.value}))*/}
                {/*               }}*/}
                {/*    />*/}
                {/*</Grid>*/}
                {/*<Grid item sm={12}>*/}
                {/*    <TextField label="操作备注" fullWidth margin="dense" variant="outlined" multiline rows="2" InputLabelProps={{ shrink: true }}*/}
                {/*               disabled={orderDetailReducer.orderInfo.status === 7 || orderDetailReducer.orderInfo.status === 0}*/}
                {/*               value={orderDetailReducer.orderInfo.op_remark}*/}
                {/*               onChange={(e) => {*/}
                {/*                   dispatch(OrderDetailActionType.setOrderInfo({name: "op_remark", value: e.target.value}))*/}
                {/*               }}*/}
                {/*    />*/}
                {/*</Grid>*/}

                {/*<Grid item xs={12}>*/}
                {/*    {(orderDetailReducer.orderInfo.status === 1 || orderDetailReducer.orderInfo.status === 3) &&*/}
                {/*    <Button variant="contained" color="secondary" style={{float:'right', marginLeft: 20}} onClick={()=>{cancelOrder(orderDetailReducer.orderInfo)}}>取消</Button>}*/}

                {/*    {orderDetailReducer.orderInfo.status !== 7 && orderDetailReducer.orderInfo.status !== 0 &&*/}
                {/*    <Button variant="contained" color="secondary" style={{float:'right', marginLeft: 20}} onClick={()=>{changeOrderStatus(orderDetailReducer.orderInfo)}}>*/}
                {/*        {orderDetailReducer.orderInfo.status === sysConst.ORDER_STATUS[0].value ? '开始处理' : (orderDetailReducer.orderInfo.status === sysConst.ORDER_STATUS[1].value ? '结算' : '完成')}*/}
                {/*    </Button>}*/}
                {/*    {orderDetailReducer.orderInfo.status !== 7 && orderDetailReducer.orderInfo.status !== 0 &&*/}
                {/*    <Button variant="contained" color="primary" style={{float:'right',marginLeft: 20}} onClick={()=>{dispatch(orderDetailAction.saveOrder())}}>保存</Button>}*/}
                {/*    <IconButton color="primary" edge="start" style={{float:'right', marginLeft: 20}} onClick={()=>{dispatch(orderDetailAction.downLoadPDF(id))}}>*/}
                {/*        <i className="mdi mdi-file-pdf mdi-24px"/>*/}
                {/*    </IconButton>*/}
                {/*</Grid>*/}
            </Grid>

            {/* 下部分：服务 */}
            {/*<Grid container spacing={1}>*/}
            {/*    <Grid item container sm={1}><Typography gutterBottom className={classes.title}>服务</Typography></Grid>*/}
            {/*</Grid>*/}
            {/*{orderDetailReducer.orderInfo.status !== 7 && orderDetailReducer.orderInfo.status !== 0 &&*/}
            {/*<Grid  container spacing={1}>*/}
            {/*    <Grid item xs={2}>*/}
            {/*        <Autocomplete fullWidth disableClearable*/}
            {/*                      options={commonReducer.saleServiceList}*/}
            {/*                      getOptionLabel={(option) => option.service_name}*/}
            {/*                      value={newServiceData.serviceInfo}*/}
            {/*                      onChange={(event, value) => {*/}
            {/*                          calcNewServicePrice(value, newServiceData.discountServicePrice);*/}
            {/*                      }}*/}
            {/*                      renderInput={(params) => <TextField {...params} label="选择服务" margin="dense" variant="outlined"*/}
            {/*                              error={validation.serviceInfo&&validation.serviceInfo!=''} helperText={validation.serviceInfo}*/}
            {/*                      />}*/}
            {/*        />*/}
            {/*    </Grid>*/}

            {/*    {newServiceData.servicePriceType === sysConst.SERVICE_PRICE_TYPE[0].value &&*/}
            {/*    <Grid item xs={2}>*/}
            {/*        <TextField label="固定售价" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={newServiceData.fixedPrice}/>*/}
            {/*    </Grid>}*/}
            {/*    {newServiceData.servicePriceType !== sysConst.SERVICE_PRICE_TYPE[0].value &&*/}
            {/*    <>*/}
            {/*        <Grid item xs={1}>*/}
            {/*            <TextField label="销售单价" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={newServiceData.unitPrice}/>*/}
            {/*        </Grid>*/}
            {/*        <Grid item xs={1}>*/}
            {/*            <TextField label="销售数量" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={newServiceData.serviceCount}/>*/}
            {/*        </Grid>*/}
            {/*    </>}*/}

            {/*    <Grid item xs={1}>*/}
            {/*        <TextField label="折扣" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={newServiceData.discountServicePrice}*/}
            {/*                   onChange={(e)=>{*/}
            {/*                       calcNewServicePrice(newServiceData.serviceInfo, e.target.value);*/}
            {/*                   }}*/}
            {/*                   error={validation.discountServicePrice&&validation.discountServicePrice!=''} helperText={validation.discountServicePrice}*/}
            {/*        />*/}
            {/*    </Grid>*/}

            {/*    <Grid item xs={2}>*/}
            {/*        <TextField label="实际价格" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={newServiceData.actualServicePrice}/>*/}
            {/*    </Grid>*/}

            {/*    <Grid item container xs={5}>*/}
            {/*        <Grid item xs={10}>*/}
            {/*            <TextField label="备注" fullWidth margin="dense" variant="outlined" value={newServiceData.remark} onChange={(e)=>{*/}
            {/*                setNewServiceData({...newServiceData, remark: e.target.value});*/}
            {/*            }}/>*/}
            {/*        </Grid>*/}
            {/*        <Grid item xs={2} align='center'>*/}
            {/*            <IconButton color="primary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={addService}>*/}
            {/*                <i className="mdi mdi-plus-circle-outline"/>*/}
            {/*            </IconButton>*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/*</Grid>}*/}

            {/*/!* 下部分：订单服务列表 *!/*/}
            {/*{orderDetailReducer.orderSerVList.map((item, index) => (*/}
            {/*    <Grid  container spacing={1} key={index}>*/}
            {/*        <Grid item xs={2}>*/}
            {/*            <Autocomplete fullWidth disableClearable disabled*/}
            {/*                          options={commonReducer.saleServiceList}*/}
            {/*                          getOptionLabel={(option) => option.service_name}*/}
            {/*                          value={{id:item.sale_service_id, service_name: item.sale_service_name}}*/}
            {/*                          renderInput={(params) => <TextField {...params} label="服务名称" margin="dense" variant="outlined"/>}*/}
            {/*            />*/}
            {/*        </Grid>*/}

            {/*        {item.fixed_price != 0 &&*/}
            {/*        <Grid item xs={2}>*/}
            {/*            <TextField label="固定售价" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.fixed_price}/>*/}
            {/*        </Grid>}*/}
            {/*        {item.fixed_price == 0 &&*/}
            {/*        <>*/}
            {/*            <Grid item xs={1}>*/}
            {/*                <TextField label="销售单价" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.unit_price}/>*/}
            {/*            </Grid>*/}
            {/*            <Grid item xs={1}>*/}
            {/*                <TextField label="销售数量" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.service_count}/>*/}
            {/*            </Grid>*/}
            {/*        </>}*/}

            {/*        <Grid item xs={1}>*/}
            {/*            <TextField label="折扣" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.discount_service_price}*/}
            {/*                       onChange={(e)=>{*/}
            {/*                           orderDetailReducer.orderSerVList[index].discount_service_price = e.target.value || 0;*/}
            {/*                           dispatch(OrderDetailActionType.getOrderSerVList(orderDetailReducer.orderSerVList));*/}
            {/*                           calcListServicePrice(index, item);*/}
            {/*                       }}*/}
            {/*            />*/}
            {/*        </Grid>*/}

            {/*        <Grid item xs={2}>*/}
            {/*            <TextField label="实际价格" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.actual_service_price}/>*/}
            {/*        </Grid>*/}

            {/*        <Grid item container xs={5}>*/}
            {/*            <Grid item xs={10}>*/}
            {/*                <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={item.remark || ''} onChange={(e)=>{*/}
            {/*                    orderDetailReducer.orderSerVList[index].remark = e.target.value;*/}
            {/*                    dispatch(OrderDetailActionType.getOrderSerVList(orderDetailReducer.orderSerVList));*/}
            {/*                }}/>*/}
            {/*            </Grid>*/}
            {/*            {orderDetailReducer.orderInfo.status !== 7 && orderDetailReducer.orderInfo.status !== 0 &&*/}
            {/*            <Grid item container xs={2}>*/}
            {/*                <Grid item xs={4} align='center'>*/}
            {/*                    {orderDetailReducer.orderInfo.status == sysConst.ORDER_STATUS[1].value &&*/}
            {/*                    <IconButton color="primary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{initModal(item, orderDetailReducer.orderInfo.status)}}>*/}
            {/*                        <span style={{fontSize: 14}}>派</span>*/}
            {/*                    </IconButton>}*/}
            {/*                    {orderDetailReducer.orderInfo.status == sysConst.ORDER_STATUS[2].value &&*/}
            {/*                    <IconButton color="primary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{initModal(item, orderDetailReducer.orderInfo.status)}}>*/}
            {/*                        <span style={{fontSize: 14}}>验</span>*/}
            {/*                    </IconButton>}*/}
            {/*                </Grid>*/}
            {/*                <Grid item xs={4} align='center'>*/}
            {/*                    <IconButton color="secondary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{deleteService(item)}}>*/}
            {/*                        <i className="mdi mdi-delete"> </i>*/}
            {/*                    </IconButton>*/}
            {/*                </Grid>*/}
            {/*                <Grid item xs={4} align='center'>*/}
            {/*                    <IconButton color="primary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{dispatch(orderDetailAction.saveOrderItemService(item))}}>*/}
            {/*                        <i className="mdi mdi-check-circle-outline"> </i>*/}
            {/*                    </IconButton>*/}
            {/*                </Grid>*/}
            {/*            </Grid>}*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/*))}*/}

            {/*/!*  商品信息： 商品名称，价格，折扣，实际价格 *!/*/}
            {/*<Grid container spacing={1}>*/}
            {/*    <Grid item container sm={1}><Typography gutterBottom className={classes.title}>商品</Typography></Grid>*/}
            {/*</Grid>*/}
            {/*{orderDetailReducer.orderInfo.status !== 7 && orderDetailReducer.orderInfo.status !== 0 &&*/}
            {/*<Grid container spacing={1}>*/}
            {/*    <Grid item xs={2}>*/}
            {/*        <Autocomplete fullWidth disableClearable*/}
            {/*                      options={commonReducer.productList}*/}
            {/*                      getOptionLabel={(option) => option.product_name}*/}
            {/*                      value={newProdData.productInfo}*/}
            {/*                      onChange={(event, value) => {*/}
            {/*                          calcNewProdPrice(value, newProdData.prodCount, newProdData.discountProdPrice);*/}
            {/*                      }}*/}
            {/*                      renderInput={(params) => <TextField {...params} label="选择商品" margin="dense" variant="outlined"*/}
            {/*                          error={validation.productInfo&&validation.productInfo!=''} helperText={validation.productInfo}*/}
            {/*                      />}*/}
            {/*        />*/}
            {/*    </Grid>*/}

            {/*    <Grid item xs={1}>*/}
            {/*        <TextField label="价格" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={newProdData.prodPrice}/>*/}
            {/*    </Grid>*/}
            {/*    <Grid item xs={1}>*/}
            {/*        <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={newProdData.prodCount}*/}
            {/*                   onChange={(e)=>{*/}
            {/*                       calcNewProdPrice(newProdData.productInfo, e.target.value, newProdData.discountProdPrice);*/}
            {/*                   }}*/}
            {/*                   error={validation.prodCount&&validation.prodCount!=''} helperText={validation.prodCount}*/}
            {/*        />*/}
            {/*    </Grid>*/}

            {/*    <Grid item xs={1}>*/}
            {/*        <TextField label="折扣" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={newProdData.discountProdPrice}*/}
            {/*                   onChange={(e)=>{*/}
            {/*                       calcNewProdPrice(newProdData.productInfo, newProdData.prodCount, e.target.value);*/}
            {/*                   }}*/}
            {/*                   error={validation.discountProdPrice&&validation.discountProdPrice!=''} helperText={validation.discountProdPrice}*/}
            {/*        />*/}
            {/*    </Grid>*/}

            {/*    <Grid item xs={2}>*/}
            {/*        <TextField label="实际价格" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={newProdData.actualProdPrice}/>*/}
            {/*    </Grid>*/}

            {/*    <Grid item container xs={5}>*/}
            {/*        <Grid item xs={10}>*/}
            {/*            <TextField label="备注" fullWidth margin="dense" variant="outlined" value={newProdData.remark} onChange={(e)=>{*/}
            {/*                setNewProdData({...newProdData, remark: e.target.value});*/}
            {/*            }}/>*/}
            {/*        </Grid>*/}
            {/*        <Grid item xs={2} align='center'>*/}
            {/*            <IconButton color="primary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={addProduct}>*/}
            {/*                <i className="mdi mdi-plus-circle-outline"/>*/}
            {/*            </IconButton>*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/*</Grid>}*/}

            {/*{orderDetailReducer.orderProdList.map((item,index)=>(*/}
            {/*    <Grid container spacing={1} key={index}>*/}
            {/*        <Grid item xs={2}>*/}
            {/*            <Autocomplete fullWidth disableClearable disabled*/}
            {/*                          options={commonReducer.productList}*/}
            {/*                          getOptionLabel={(option) => option.product_name}*/}
            {/*                          value={{id:item.prod_id,product_name:item.prod_name}}*/}
            {/*                          renderInput={(params) => <TextField {...params} label="商品名称" margin="dense" variant="outlined"/>}*/}
            {/*            />*/}
            {/*        </Grid>*/}

            {/*        <Grid item xs={1}>*/}
            {/*            <TextField label="价格" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.unit_price}/>*/}
            {/*        </Grid>*/}

            {/*        <Grid item xs={1}>*/}
            {/*            <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.prod_count}*/}
            {/*                       onChange={(e)=>{*/}
            {/*                           orderDetailReducer.orderProdList[index].prod_count = e.target.value || 1;*/}
            {/*                           dispatch(OrderDetailActionType.getOrderProdList(orderDetailReducer.orderProdList));*/}
            {/*                           calcListProdPrice(index);*/}
            {/*                       }}*/}
            {/*            />*/}
            {/*        </Grid>*/}

            {/*        <Grid item xs={1}>*/}
            {/*            <TextField label="折扣" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.discount_prod_price}*/}
            {/*                       onChange={(e)=>{*/}
            {/*                           orderDetailReducer.orderProdList[index].discount_prod_price = e.target.value || 0;*/}
            {/*                           dispatch(OrderDetailActionType.getOrderProdList(orderDetailReducer.orderProdList));*/}
            {/*                           calcListProdPrice(index);*/}
            {/*                       }}*/}
            {/*            />*/}
            {/*        </Grid>*/}

            {/*        <Grid item xs={2}>*/}
            {/*            <TextField label="实际价格" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={item.actual_prod_price}/>*/}
            {/*        </Grid>*/}

            {/*        <Grid item container xs={5}>*/}
            {/*            <Grid item xs={10}>*/}
            {/*                <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={item.remark} onChange={(e)=>{*/}
            {/*                    orderDetailReducer.orderProdList[index].remark = e.target.value;*/}
            {/*                    dispatch(OrderDetailActionType.getOrderProdList(orderDetailReducer.orderProdList));*/}
            {/*                }}/>*/}
            {/*            </Grid>*/}
            {/*            {orderDetailReducer.orderInfo.status !== 7 && orderDetailReducer.orderInfo.status !== 0 &&*/}
            {/*            <Grid item container xs={2} align='center'>*/}
            {/*                <Grid item xs={4} align='center'>*/}
            {/*                    {item.status === sysConst.PROD_ITEM_STATUS[0].value ? <div style={{fontSize: 14, paddingTop: 18}}>未</div> : <div style={{fontSize: 14, paddingTop: 18}}>领</div>}*/}
            {/*                </Grid>*/}
            {/*                {item.status === sysConst.PROD_ITEM_STATUS[0].value &&*/}
            {/*                <>*/}
            {/*                    <Grid item xs={4} align='center'>*/}
            {/*                        <IconButton color="secondary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{deleteProd(item)}}>*/}
            {/*                            <i className="mdi mdi-delete"> </i>*/}
            {/*                        </IconButton>*/}
            {/*                    </Grid>*/}
            {/*                    <Grid item xs={4} align='center'>*/}
            {/*                        <IconButton color="primary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{dispatch(orderDetailAction.saveOrderItemProd(item))}}>*/}
            {/*                            <i className="mdi mdi-check-circle-outline"> </i>*/}
            {/*                        </IconButton>*/}
            {/*                    </Grid>*/}
            {/*                </>}*/}
            {/*            </Grid>}*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/*))}*/}

            {/* 提升高度：当盘点详情过多时，避免 最后一条会被footer挡住 */}
            <Grid style={{height: 50}}>&nbsp;</Grid>
            <SimpleModal
                maxWidth={'sm'}
                title={modalData.orderStatus===sysConst.ORDER_STATUS[1].value ? "新增施工人" : "新增验收人"}
                open={modalOpen}
                onClose={()=>{setModalOpen(false)}}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" color="primary" onClick={submitModal}>确定</Button>
                        <Button variant="contained" onClick={()=>{setModalOpen(false)}}>关闭</Button>
                    </>
                }
            >
                <Grid container spacing={2}>
                    {modalData.orderStatus===sysConst.ORDER_STATUS[1].value &&
                    <Grid item sm={12}>
                        <Autocomplete fullWidth disableClearable
                                      options={commonReducer.userList}
                                      getOptionLabel={(option) => option.real_name}
                                      value={modalData.deployUser}
                                      onChange={(event, value) => {
                                          setModalData({...modalData, deployUser : value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="施工人" margin="dense" variant="outlined"
                                              error={validation.deployUser&&validation.deployUser!=''} helperText={validation.deployUser}/>}
                        />
                    </Grid>}
                    {modalData.orderStatus===sysConst.ORDER_STATUS[2].value &&
                    <Grid item sm={12}>
                        <Autocomplete fullWidth disableClearable
                                      options={commonReducer.userList}
                                      getOptionLabel={(option) => option.real_name}
                                      value={modalData.checkUser}
                                      onChange={(event, value) => {
                                          setModalData({...modalData, checkUser : value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="验收人" margin="dense" variant="outlined"
                                              error={validation.checkUser&&validation.checkUser!=''} helperText={validation.checkUser}/>}
                        />
                    </Grid>}
                </Grid>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        orderDetailReducer: state.OrderDetailReducer,
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
    cancelOrder: (orderInfo) => {
        Swal.fire({
            title: "确定取消订单？",
            text: '订单取消后，将不能修改订单信息',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(orderDetailAction.changeOrderStatus(orderInfo.id, sysConst.ORDER_STATUS[4].value));
            }
        });
    },
    changeOrderStatus: (orderInfo) => {
        Swal.fire({
            title: "确定更改订单状态？",
            text: orderInfo.status == sysConst.ORDER_STATUS[2].value ? '订单完成后，将不能修改订单信息' : '',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                let status = orderInfo.status;
                switch (orderInfo.status) {
                    case sysConst.ORDER_STATUS[0].value:
                        status = sysConst.ORDER_STATUS[1].value;
                        break;
                    case sysConst.ORDER_STATUS[1].value:
                        status = sysConst.ORDER_STATUS[2].value;
                        break;
                    case sysConst.ORDER_STATUS[2].value:
                        status = sysConst.ORDER_STATUS[3].value;
                        break;
                    default:
                        break;
                }
                dispatch(orderDetailAction.changeOrderStatus(orderInfo.id, status));
            }
        });
    },
    deleteService: (data) => {
        Swal.fire({
            title: "确定删除该服务",
            text: "删除后，订单金额将重新计算",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(orderDetailAction.deleteOrderItemService(data));
            }
        });
    },
    deleteProd: (data) => {
        Swal.fire({
            title: "确定删除该商品",
            text: "删除后，订单金额将重新计算",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(orderDetailAction.deleteOrderItemProd(data));
            }
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderRefundDetail)