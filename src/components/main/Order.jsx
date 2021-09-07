import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
// 引入material-ui基础组件
import {
    Box,
    Button,
    Divider,
    Fab,
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
import {OrderActionType, CommonActionType} from "../../types";

const orderAction = require('../../actions/main/OrderAction');
const orderDetailAction = require('../../actions/main/OrderDetailAction');
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

function Order(props) {
    const {orderReducer, appReducer, commonReducer, fromDetail} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 模态数据
    const [modalData, setModalData] = React.useState({clientSerial: null, user: null ,serviceList: [], productList: []});
    // 步骤索引
    const [activeStep, setActiveStep] = React.useState(0);
    // 模态步骤说明
    const steps = ['选择车牌号', '填写服务·商品'];
    // 模态校验
    const [validation,setValidation] = useState({serviceList:[], productList:[], nodata: ''});

    useEffect(() => {
        // 详情页面 返回 保留reducer，否则，清空
        if (!fromDetail) {
            let queryParams = {
                // 订单编号
                orderId: '',
                // 订单类型
                orderType: '',
                // 订单状态
                status: '',
                // 订单支付状态
                paymentStatus: '',
                // 接单人（用户信息）
                reUser: null,
                // 客户集群
                clientAgent: null,
                // 客户
                client: null,
                // // 客户电话
                // clientTel: '',
                // 车牌
                clientSerial: '',
                // 创建日期
                dateStart: '',
                dateEnd: '',
                // 完成日期
                finDateStart: '',
                finDateEnd: ''
            };
            dispatch(OrderActionType.setQueryParams(queryParams));
        }
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        props.getOrderList(props.orderReducer.orderData.start);
    }, []);

    // 初始化模态框值
    const initModal = () => {
        // 清check内容
        setValidation({serviceList: [], productList: [], nodata: ''});
        // 取得select列表
        props.getModalSelectList();
        // 默认第一步
        setActiveStep(0);
        // 初始化数据
        setModalData({
            clientSerial: null,
            user: appReducer.currentUser,
            serviceList: [],
            productList: [],
            clientRemark: ''
        });
        // 设定模态打开
        setModalOpen(true);
    };

    const addService = () => {
        modalData.serviceList.push({
            // 服务信息
            serviceInfo: null,
            // 服务价格类型
            service_price_type: '',
            // 固定售价
            fixed_price: '',
            // 销售单价
            unit_price: '',
            // 销售数量
            service_price_count: '',
            // 实际价格
            realPrice: '',
            // 接口用数据
            // 折扣
            discountServicePrice: 0,
            // 暂时固定值
            orderItemType: 1,
            // 服务ID
            saleServiceId: '',
            // 服务名称
            saleServiceName: '',
            // 备注
            remark: ''
        });
        setModalData({...modalData});
        validation.serviceList.push({serviceInfo: '', discountServicePrice: ''});
        setValidation({...validation});
    };

    const addProduct = async (saleServiceId) => {
        let defaultProduct = {
            // 商品信息
            productInfo: null,
            // 实际价格
            realPrice: '',
            // 接口用数据
            // 商品名称
            prodId: '',
            prodName: '',
            // 数量
            prodCount: 1,
            // 折扣
            discountProdPrice: 0,
            // 暂时固定值
            orderItemType: 1,
            // 销售人员
            saleUserId: 0,
            saleUserName: '',
            // 备注
            remark: ''
        };
        if (saleServiceId == null) {
            modalData.productList.push(defaultProduct);
            setModalData({...modalData});
            validation.productList.push({productInfo: '', discountProdPrice: ''});
            setValidation({...validation});
        } else {
            let ret = await dispatch(orderAction.getSaleServiceProdRel(saleServiceId));
            for (let i =0; i < ret.length; i++) {
                validation.productList.push({productInfo: '', discountProdPrice: ''});
                setValidation({...validation});
                modalData.productList.push({...defaultProduct,price:ret[i].price,prodId:ret[i].product_id,prodName:ret[i].product_name,prodCount:ret[i].product_count,productInfo:{id:ret[i].product_id,product_name: ret[i].product_name}});
                setModalData({...modalData});
                // 计算实际价格
                calcProdPrice(i);
            }
        }
    };

    // 关闭模态
    const closeModal = () => {
        setModalOpen(false);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleNext = (step) => {
        // 第一步：选择车牌号
        if (step === 0) {
            const validateObj = {};
            if (!modalData.clientSerial) {
                validateObj.clientSerial = '请选择车牌号';
            }
            if (!modalData.user) {
                validateObj.user = '请选择接单人';
            }
            setValidation(validateObj);
            let errorCount = Object.keys(validateObj).length;
            if (errorCount === 0) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                // 清check内容
                setValidation({serviceList: [], productList: []});
            }
        }
        // 第二步：填写服务·商品
        if (step === 1) {
            validation.nodata = '';
            // 存在服务或者商品时
            if (modalData.serviceList.length > 0 || modalData.productList.length) {
                let errors = 0;
                // 服务列表 校验
                for (let i = 0; i < modalData.serviceList.length; i++) {
                    validation.serviceList[i].serviceInfo = '';
                    validation.serviceList[i].discountServicePrice = '';
                    if (!modalData.serviceList[i].serviceInfo) {
                        validation.serviceList[i].serviceInfo = '请选择服务';
                        errors++;
                    }
                    if (!modalData.serviceList[i].discountServicePrice && modalData.serviceList[i].discountServicePrice !== 0) {
                        validation.serviceList[i].discountServicePrice = '请输入折扣';
                        errors++;
                    }
                }

                // 商品列表 校验
                for (let i = 0; i < modalData.productList.length; i++) {
                    validation.productList[i].productInfo = '';
                    validation.productList[i].discountProdPrice = '';
                    if (!modalData.productList[i].productInfo) {
                        validation.productList[i].productInfo = '请选择商品';
                        errors++;
                    }
                    if (!modalData.productList[i].discountProdPrice && modalData.productList[i].discountProdPrice !== 0) {
                        validation.productList[i].discountProdPrice = '请输入折扣';
                        errors++;
                    }
                }
                setValidation({...validation});

                if (errors === 0) {
                    dispatch(orderAction.saveModalData(modalData));
                    setModalOpen(false);
                }
            } else {
                setValidation({...validation, nodata: '必须添加服务或商品'});
            }
        }
    };

    const deleteService = (index) => {
        modalData.serviceList.splice(index, 1);
        setModalData({...modalData});
        validation.serviceList.splice(index, 1);
        setValidation({...validation});
    };

    const deleteProduct = (index) => {
        modalData.productList.splice(index, 1);
        setModalData({...modalData});
        validation.productList.splice(index, 1);
        setValidation({...validation});
    };

    const calcRealPrice =(index, item) =>{
        // 服务价格类型
        if (item.service_price_type) {
            let realPrice = 0;
            if (item.service_price_type  === sysConst.SERVICE_PRICE_TYPE[0].value) {
                realPrice = parseFloat(modalData.serviceList[index].fixed_price) - parseFloat(modalData.serviceList[index].discountServicePrice || 0);
            } else {
                realPrice = (modalData.serviceList[index].unit_price * modalData.serviceList[index].service_price_count)
                    - parseFloat(modalData.serviceList[index].discountServicePrice || 0);
            }
            modalData.serviceList[index].realPrice = realPrice.toFixed(2);
        }
        setModalData({...modalData});
    };

    // 计算
    const calcProdPrice =(index) =>{
        if (modalData.productList[index].productInfo) {
            let realPrice = (modalData.productList[index].price * modalData.productList[index].prodCount)
                - parseFloat(modalData.productList[index].discountProdPrice || 0);
            modalData.productList[index].realPrice = realPrice.toFixed(2);
        }
        setModalData({...modalData});
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>订单信息</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={1}>
                    <Grid item xs={2}>
                        <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number" value={orderReducer.queryParams.orderId}
                                   onChange={(e)=>{dispatch(OrderActionType.setQueryParam({name: "orderId", value: e.target.value}))}}/>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>订单类型</InputLabel>
                            <Select label="订单类型"
                                    value={orderReducer.queryParams.orderType}
                                    onChange={(e, value) => {
                                        dispatch(OrderActionType.setQueryParam({name: "orderType", value: e.target.value}));
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
                                value={orderReducer.queryParams.status}
                                onChange={(e, value) => {
                                    dispatch(OrderActionType.setQueryParam({name: "status", value: e.target.value}));
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
                                    value={orderReducer.queryParams.paymentStatus}
                                    onChange={(e, value) => {
                                        dispatch(OrderActionType.setQueryParam({name: "paymentStatus", value: e.target.value}));
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
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.userList}
                                      getOptionLabel={(option) => option.real_name}
                                      value={modalData.reUser}
                                      onChange={(event, value) => {
                                          dispatch(OrderActionType.setQueryParam({name: "reUser", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="接单人" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.clientAgentList}
                                      getOptionLabel={(option) => option.name}
                                      value={modalData.clientAgent}
                                      onChange={(event, value) => {
                                          dispatch(OrderActionType.setQueryParam({name: "clientAgent", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="客户集群" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.clientList}
                                      getOptionLabel={(option) => option.name}
                                      value={modalData.client}
                                      onChange={(event, value) => {
                                          dispatch(OrderActionType.setQueryParam({name: "client", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="客户" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    {/*<Grid item xs={2}>*/}
                    {/*    <TextField label="客户电话" fullWidth margin="dense" variant="outlined" value={orderReducer.queryParams.clientTel}*/}
                    {/*               onChange={(e)=>{dispatch(OrderActionType.setQueryParam({name: "clientTel", value: e.target.value}))}}/>*/}
                    {/*</Grid>*/}

                    <Grid item xs={2}>
                        <TextField label="车牌" fullWidth margin="dense" variant="outlined" value={orderReducer.queryParams.clientSerial}
                                   onChange={(e)=>{dispatch(OrderActionType.setQueryParam({name: "clientSerial", value: e.target.value}))}}/>
                    </Grid>

                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建日期（始）"
                                    value={orderReducer.queryParams.dateStart=="" ? null : orderReducer.queryParams.dateStart}
                                    onChange={(date)=>{
                                        dispatch(OrderActionType.setQueryParam({name: "dateStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建日期（终）"
                                    value={orderReducer.queryParams.dateEnd=="" ? null : orderReducer.queryParams.dateEnd}
                                    onChange={(date)=>{
                                        dispatch(OrderActionType.setQueryParam({name: "dateEnd", value: date}))
                                    }}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（始）"
                                    value={orderReducer.queryParams.finDateStart=="" ? null : orderReducer.queryParams.finDateStart}
                                    onChange={(date)=>{
                                        dispatch(OrderActionType.setQueryParam({name: "finDateStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（终）"
                                    value={orderReducer.queryParams.finDateEnd=="" ? null : orderReducer.queryParams.finDateEnd}
                                    onChange={(date)=>{
                                        dispatch(OrderActionType.setQueryParam({name: "finDateEnd", value: date}))
                                    }}
                        />
                    </Grid>
                </Grid>

                <Grid item xs={2} container style={{textAlign:'right',marginTop:30}}>
                    {/*查询按钮*/}
                    <Grid item xs={4}>
                        <Fab color="primary" size="small" onClick={()=>{dispatch(orderAction.getOrderList(0))}}>
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
                        <Fab color="primary" size="small" onClick={()=>{dispatch(orderAction.downLoadCsv())}}>
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
                            <TableCell className={classes.tableHead} align="center">支付状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">创建日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">完成日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderReducer.orderData.dataList.map((row) => (
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
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_TYPE, row.order_type)}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_STATUS, row.status)}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.ORDER_PAYMENT_STATUS, row.payment_status)}</TableCell>
                                <TableCell align="center">{row.date_id}</TableCell>
                                <TableCell align="center">{row.fin_date_id}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" edge="start" size="small" onClick={()=>{dispatch(orderDetailAction.downLoadPDF(row.id))}}>
                                        <i className="mdi mdi-file-pdf"/>
                                    </IconButton>
                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" size="small">
                                        <Link to={{pathname: '/order/' + row.id}}><i className="mdi mdi-table-search"/></Link>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {orderReducer.orderData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={15} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {orderReducer.orderData.start > 0 && orderReducer.orderData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={()=>{dispatch(orderAction.getOrderList(orderReducer.orderData.start-(orderReducer.orderData.size-1)))}}>上一页</Button>}
                {orderReducer.orderData.dataSize >= orderReducer.orderData.size &&
                <Button variant="contained" color="primary"
                        onClick={()=>{dispatch(orderAction.getOrderList(orderReducer.orderData.start+(orderReducer.orderData.size-1)))}}>下一页</Button>}
            </Box>

            <SimpleModal
                maxWidth={'lg'}
                title= "新增订单"
                open={modalOpen}
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
                            <Grid item sm={6}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}} noOptionsText="无选项"
                                              options={commonReducer.clientList}
                                              getOptionLabel={(option) => option.client_serial + ' ' + option.name}
                                              value={modalData.clientSerial}
                                              onChange={(event, value) => {
                                                  setModalData({...modalData, clientSerial: value});
                                              }}
                                              onInputChange={(event, value) => {
                                                if(value && value.length === 3){
                                                  // 取得客户信息列表
                                                  dispatch(commonAction.getClientByClientSerial(value)); 
                                                }
                                            }}
                                              renderInput={(params) => <TextField {...params} label="车牌号" margin="dense" variant="outlined"
                                                placeholder="输入3位，检索列表"  InputLabelProps={{ shrink: true }}
                                                error={validation.clientSerial&&validation.clientSerial!=''}
                                                helperText={validation.clientSerial}
                                              />}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={commonReducer.userList}
                                              getOptionLabel={(option) => option.real_name}
                                              value={modalData.user}
                                              onChange={(event, value) => {
                                                  setModalData({...modalData, user: value});
                                              }}
                                              renderInput={(params) => <TextField {...params} label="接单人" margin="dense" variant="outlined"
                                                                                  error={validation.user&&validation.user!=''}
                                                                                  helperText={validation.user}
                                              />}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    {/* 第二步添加商品详情 */}
                    <div style={{display:activeStep==!0?'block':'none',margin:'20px 0',textAlign:'left'}}>
                        <Typography gutterBottom className={classes.title}>客户信息</Typography>
                        {modalData.clientSerial != null &&
                        <Grid container spacing={2} style={{marginBottom:10}}>
                            <Grid item sm={4}>用户：{modalData.clientSerial.name}</Grid>
                            <Grid item sm={4}>车牌号：{modalData.clientSerial.client_serial}</Grid>
                            <Grid item sm={4}>VIN：{modalData.clientSerial.client_serial_detail}</Grid>
                            <Grid item sm={4}>电话：{modalData.clientSerial.tel}</Grid>
                            <Grid item sm={4}>推荐人：{modalData.clientSerial.refer_real_name}</Grid>
                            <Grid item sm={12}>地址：{modalData.clientSerial.address}</Grid>
                        </Grid>}

                        {/*  服务 */}
                        <Grid container spacing={1}>
                            <Grid item container sm={1}>
                                <Grid item sm={6}><Typography gutterBottom className={classes.title}>服务</Typography></Grid>
                                <Grid item sm={6}>
                                    <IconButton onClick={addService} size="small">
                                        <i className="mdi mdi-plus-circle-outline" style={{marginTop: 2,color:'black'}} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Grid item container sm={11}>
                                <Typography gutterBottom style={{color: 'red',fontSize: 13, paddingTop: 5}}>{validation.nodata}</Typography>
                            </Grid>
                        </Grid>

                        {modalData.serviceList.map((item,index)=>(
                            <Grid  container spacing={1} key={index}>
                                <Grid item xs={3}>
                                    <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                                  options={commonReducer.saleServiceList}
                                                  disableClearable
                                                  getOptionLabel={(option) => option.service_name}
                                                  value={item.serviceInfo}
                                                  onChange={(event, value) => {
                                                      // setModalData({...modalData.serviceList[index], serviceInfo: value});
                                                      modalData.serviceList[index].serviceInfo = value;
                                                      // 固定售价
                                                      modalData.serviceList[index].fixed_price = value.fixed_price;
                                                      // 销售单价
                                                      modalData.serviceList[index].unit_price = value.unit_price;
                                                      // 销售数量
                                                      modalData.serviceList[index].service_price_count = value.service_price_count;
                                                      modalData.serviceList[index].service_price_type = value.service_price_type;

                                                      modalData.serviceList[index].orderItemType = 1;
                                                      modalData.serviceList[index].saleServiceId = value.id;
                                                      modalData.serviceList[index].saleServiceName = value.service_name;

                                                      calcRealPrice(index, item);
                                                      addProduct(value.id);
                                                  }}
                                                  renderInput={(params) => <TextField {...params} label="服务名称" margin="dense" variant="outlined"
                                                                                      error={validation.serviceList[index].serviceInfo!=''}
                                                                                      helperText={validation.serviceList[index].serviceInfo}
                                                  />}
                                    />
                                </Grid>

                                {item.service_price_type === sysConst.SERVICE_PRICE_TYPE[0].value &&
                                <Grid item xs={2}>
                                    <TextField label="固定售价" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} value={item.fixed_price}/>
                                </Grid>}
                                {item.service_price_type !== sysConst.SERVICE_PRICE_TYPE[0].value &&
                                    <>
                                        <Grid item xs={1}>
                                            <TextField label="销售单价" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={item.unit_price}/>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <TextField label="销售数量" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={item.service_price_count}/>
                                        </Grid>
                                    </>}

                                {/*<Grid item xs={2}>*/}
                                {/*    <TextField label="折扣" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.discountServicePrice}*/}
                                {/*               onChange={(e)=>{*/}
                                {/*                   modalData.serviceList[index].discountServicePrice = e.target.value;*/}
                                {/*                   calcRealPrice(index, item);*/}
                                {/*               }}*/}
                                {/*               error={validation.serviceList[index].discountServicePrice!=''}*/}
                                {/*               helperText={validation.serviceList[index].discountServicePrice}*/}
                                {/*    />*/}
                                {/*</Grid>*/}

                                <Grid item xs={2}>
                                    <TextField label="实际价格" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={item.realPrice}/>
                                </Grid>

                                <Grid item container xs={5}>
                                    <Grid item xs={11}>
                                        <TextField label="备注" fullWidth margin="dense" variant="outlined" value={item.remark} onChange={(e)=>{
                                            modalData.serviceList[index].remark = e.target.value;
                                            setModalData({...modalData});
                                        }}/>
                                    </Grid>
                                    <Grid item xs={1} align='center'>
                                        <IconButton color="secondary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{deleteService(index)}}>
                                            <i className="mdi mdi-delete purple-font"> </i>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}

                        {/*  商品 */}
                        <Grid container spacing={1}>
                            <Grid item container sm={1}>
                                <Grid item sm={6}><Typography gutterBottom className={classes.title}>商品</Typography></Grid>
                                <Grid item sm={6}>
                                    <IconButton onClick={()=>{addProduct(null)}} size="small">
                                        <i className="mdi mdi-plus-circle-outline" style={{marginTop: 2,color:'black'}} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>

                        {modalData.productList.map((item,index)=>(
                            <Grid container spacing={1} key={index}>
                                <Grid item xs={3}>
                                    <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                                  options={commonReducer.productList}
                                                  disableClearable
                                                  getOptionLabel={(option) => option.product_name}
                                                  value={item.productInfo}
                                                  onChange={(event, value) => {
                                                      modalData.productList[index].productInfo = value;
                                                      modalData.productList[index].price = value.price;
                                                      modalData.productList[index].prodId = value.id;
                                                      modalData.productList[index].prodName = value.product_name;
                                                      calcProdPrice(index);
                                                  }}
                                                  renderInput={(params) => <TextField {...params} label="商品名称" margin="dense" variant="outlined"
                                                    error={validation.productList[index].productInfo!=''} helperText={validation.productList[index].productInfo}
                                                  />}
                                    />
                                </Grid>

                                <Grid item xs={1}>
                                    <TextField label="价格" fullWidth margin="dense" variant="outlined" disabled InputLabelProps={{shrink: true}} value={item.price}/>
                                </Grid>

                                <Grid item xs={1}>
                                    <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.prodCount}
                                               onChange={(e)=>{
                                                   modalData.productList[index].prodCount = e.target.value || 1;
                                                   calcProdPrice(index);
                                               }}
                                    />
                                </Grid>

                                {/*<Grid item xs={2}>*/}
                                {/*    <TextField label="折扣" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}} value={item.discountProdPrice}*/}
                                {/*               onChange={(e)=>{*/}
                                {/*                   modalData.productList[index].discountProdPrice = e.target.value;*/}
                                {/*                   calcProdPrice(index);*/}
                                {/*               }}*/}
                                {/*               error={validation.productList.length>0 && validation.productList[index].discountProdPrice && validation.productList[index].discountProdPrice!=''}*/}
                                {/*               helperText={validation.productList[index].discountProdPrice}*/}
                                {/*    />*/}
                                {/*</Grid>*/}

                                <Grid item xs={2}>
                                    <TextField label="实际价格" fullWidth margin="dense" variant="outlined" InputLabelProps={{shrink: true}} disabled value={item.realPrice}/>
                                </Grid>

                                <Grid item container xs={5}>
                                    <Grid item xs={11}>
                                        <TextField label="备注" fullWidth margin="dense" variant="outlined" value={item.remark} onChange={(e)=>{
                                            modalData.productList[index].remark = e.target.value;
                                            setModalData({...modalData});
                                        }}/>
                                    </Grid>
                                    <Grid item xs={1} align='center'>
                                        <IconButton color="secondary" edge="start" size="small" style={{paddingTop:'18px'}} onClick={()=>{deleteProduct(index)}}>
                                            <i className="mdi mdi-delete purple-font"> </i>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid container spacing={1}>
                            <Grid item sm={12}>
                                <TextField label="备注" fullWidth margin="dense" variant="outlined" value={modalData.clientRemark} 
                                           onChange={(e)=>{setModalData({...modalData,clientRemark:e.target.value})}}/>
                            </Grid>
                        </Grid>
                    </div>
            </div>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        fromDetail = true;
    }
    return {
        orderReducer: state.OrderReducer,
        appReducer: state.AppReducer,
        commonReducer: state.CommonReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        // 接单人
        dispatch(commonAction.getUserList());
        // 客户
        dispatch(commonAction.getClientList());
        // 客户集群
        dispatch(commonAction.getClientAgentList());
    },
    getModalSelectList: () => {
        // 清空客户信息列表
        dispatch(CommonActionType.setClientList([]));
        // 取得用户信息列表
        dispatch(commonAction.getUserList());
        // 取得服务列表
        dispatch(commonAction.getSaleServiceList());
        // 取得商品列表
        dispatch(commonAction.getProductList(null));
    },
    getOrderList: (dataStart) => {
        dispatch(orderAction.getOrderList(dataStart))
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Order)
