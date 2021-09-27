import React, {useEffect, useState} from 'react';
import {connect,useDispatch} from 'react-redux';
import {Link, useParams} from "react-router-dom";
import {
    Button,
    Grid,
    Typography,
    TextField,
    IconButton,
    AppBar,
    Tab,
    Tabs,
    Accordion,
    AccordionSummary,
    Divider, FormControl, InputLabel, MenuItem, Select, Box
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
    ClientInformationActionType,
    ClientInformationDetailActionType,
    ProductManagerDetailActionType
} from '../../types';
const ClientInformationDetailAction = require('../../actions/main/ClientInformationDetailAction');
const ClientInformationAction = require('../../actions/main/ClientInformationAction');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
    // 标题样式
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    },
    select: {
        width: '100%',
    },
    selectCondition: {
        width: '100%',
    },
    button:{
        margin:'15px',
        float:'right'
    },
    divider:{
        margin:'20px 0'
    },
    updateButton:{
        marginTop:'20px',
        float:'right'
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

function ClientInformationDetail (props){
    const {clientInformationDetailReducer,clientInformationReducer,getClientInfo,updateClient,getUserArray,getClientAgent,getOrderList,getOrderItemProd,getOrderItemService} = props;
    const dispatch = useDispatch();
    const {id} = useParams();
    const classes = useStyles();
    const [value, setValue] = useState('1');
    const [validation,setValidation] = useState({});
    const [expanded, setExpanded] = useState(false);
    useEffect(()=>{
        getClientInfo(id);
        getUserArray();
        getClientAgent();
    },[]);
    const changeTab = (event, newValue) => {
        setValue(newValue);
        if(newValue=='2'){
            clientInformationDetailReducer.orderInfo=[];
            clientInformationDetailReducer.orderItemProdInfo=[];
            clientInformationDetailReducer.orderItemServiceInfo=[];
            getOrderList(id,0);
            getOrderItemProd(id);
            getOrderItemService(id);
        }
    };
    //验证()
    const validate = () => {
        const validateObj ={}
        if (!clientInformationDetailReducer.clientInfo.client_agent_id||clientInformationDetailReducer.clientInfo.client_agent_id==null) {
            validateObj.clientAgentId ='请选择客户集群';
        }
        if (!clientInformationDetailReducer.clientInfo.client_serial||clientInformationDetailReducer.clientInfo.client_serial==null) {
            validateObj.client_serial ='请选择车牌号';
        }

        setValidation(validateObj);
        return Object.keys(validateObj).length
    };
    const updateClientInfo= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            updateClient();
        }
    }

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>
                <Link to={{pathname: '/client_information', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"></i>
                    </IconButton>
                </Link>
                客户中心 - {clientInformationDetailReducer.clientInfo.id}
            </Typography>
            <div className={classes.pageDivider}></div>
            {/*选项卡*/}
            <div>
                <TabContext value={value}>
                    <AppBar position="static" color="default">
                        <Tabs value={value}
                              onChange={changeTab}
                              indicatorColor="primary"
                              textColor="primary"
                              variant="fullWidth">
                            <Tab label="客户信息" value="1" />
                            <Tab label="订单"   value="2" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value='1'>
                        <Grid  container spacing={3}>
                            {/*客户集群clientAgentId*/}
                            <Grid item xs>
                                <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth
                                              options={clientInformationDetailReducer.clientAgentInfo}
                                              getOptionLabel={(option) => option.name}
                                              value={clientInformationDetailReducer.clientInfo.client_agent_id}
                                              onChange={(e,value)=>{
                                                  dispatch(ClientInformationDetailActionType.setClientInfo({name:"client_agent_id",value:value}))
                                              }}
                                              renderInput={(params) => <TextField {...params} label="客户集群" margin="dense" variant="outlined"
                                                                                  error={validation.clientAgentId&&validation.clientAgentId!=''}
                                                                                  helperText={validation.clientAgentId}
                                              />}
                                />
                            </Grid>
                            {/*车牌号 clientSerial*/}
                            <Grid item xs>
                                <TextField
                                    fullWidth={true}
                                    margin="dense"
                                    variant="outlined"
                                    label="车牌号"
                                    onChange={(e)=>{
                                        dispatch(ClientInformationDetailActionType.setClientInfo({name:"client_serial",value:e.target.value}))
                                    }}
                                    value={clientInformationDetailReducer.clientInfo.client_serial}
                                    error={validation.client_serial&&validation.client_serial!=''}
                                    helperText={validation.client_serial}
                                />
                            </Grid>
                            {/*VIN clientSerialDetail*/}
                            <Grid item xs>
                                <TextField
                                    fullWidth={true}
                                    margin="dense"
                                    variant="outlined"
                                    label="VIN"
                                    onChange={(e)=>{
                                        dispatch(ClientInformationDetailActionType.setClientInfo({name:"client_serial_detail",value:e.target.value}))
                                    }}
                                    value={clientInformationDetailReducer.clientInfo.client_serial_detail}
                                />
                            </Grid>
                            {/*类型名称 modelId,modelName*/}
                            {/* <Grid item xs></Grid>*/}
                            {/*客户来源 sourceType*/}
                            <Grid item xs>
                                <TextField style={{marginTop:'7px'}} fullWidth disabled={true}
                                           size="small"
                                           select
                                           label="客户来源"
                                           name="sourceType"
                                           type="number"
                                           onChange={(e)=>{
                                               dispatch(ClientInformationDetailActionType.setClientInfo({name:"source_type",value:e.target.value}))
                                           }}
                                           value={clientInformationDetailReducer.clientInfo.source_type}
                                           SelectProps={{
                                               native: true,
                                           }}
                                           variant="outlined"
                                >
                                    {sysConst.SOURCE_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            {/*用户 name*/}
                            <Grid item xs>
                                <Grid item xs>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        variant="outlined"
                                        label="用户"
                                        onChange={(e)=>{
                                            dispatch(ClientInformationDetailActionType.setClientInfo({name:"name",value:e.target.value}))
                                        }}
                                        value={clientInformationDetailReducer.clientInfo.name}
                                    />
                                </Grid>
                            </Grid>
                            {/*电话 tel*/}
                            <Grid item xs>
                                <Grid item xs>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        variant="outlined"
                                        type='number'
                                        label="电话"
                                        onChange={(e)=>{
                                            dispatch(ClientInformationDetailActionType.setClientInfo({name:"tel",value:e.target.value}))
                                        }}
                                        value={clientInformationDetailReducer.clientInfo.tel}
                                    />
                                </Grid>
                            </Grid>
                            {/*地址 address*/}
                            <Grid item xs>
                                <Grid item xs>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        variant="outlined"
                                        label="地址"
                                        onChange={(e)=>{
                                            dispatch(ClientInformationDetailActionType.setClientInfo({name:"address",value:e.target.value}))
                                        }}
                                        value={clientInformationDetailReducer.clientInfo.address}
                                    />
                                </Grid>
                            </Grid>
                            {/*推荐人 referUser*/}
                            <Grid item xs>
                               {/* <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth disabled={true}
                                              options={clientInformationDetailReducer.referUserInfo}
                                              getOptionLabel={(option) => option.real_name}
                                              value={clientInformationDetailReducer.clientInfo.refer_user}
                                              onChange={(e,value)=>{
                                                  dispatch(ClientInformationDetailActionType.setClientInfo({name:"refer_user",value:value}))
                                              }}
                                              renderInput={(params) => <TextField {...params} label="推荐人" margin="dense" variant="outlined"/>}
                                />*/}
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel>推荐人</InputLabel>
                                    <Select label="推荐人"
                                            disabled={true}
                                            value={clientInformationDetailReducer.clientInfo.refer_user}
                                            onChange={(e,value)=>{
                                                dispatch(ClientInformationDetailActionType.setClientInfo({name:"refer_user",value:value}))
                                            }}
                                    >
                                        <MenuItem value="">请选择</MenuItem>
                                        {clientInformationDetailReducer.referUserInfo.map((item, index) => (
                                            <MenuItem key={item.id} value={item.id}>{item.real_name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs={3}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={clientInformationReducer.prodMatchBrandArray}
                                              getOptionLabel={(option) => option.brand_name}
                                              value={clientInformationDetailReducer.clientInfo.match_brand_id}
                                              onChange={(event, value) => {
                                                  // 将当前选中值 赋值 reducer
                                                  dispatch(ClientInformationDetailActionType.setClientInfo({name: "match_brand_id", value: value}));
                                                  dispatch(ClientInformationDetailActionType.setClientInfo({name: "match_model_id", value: null}));
                                                  dispatch(ClientInformationDetailAction.getMatchModelList(value?value.id:0));
                                              }}
                                              renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                              options={clientInformationDetailReducer.prodMatchModelArray}
                                              noOptionsText="无选项"
                                              getOptionLabel={(option) => option.match_model_name}
                                              value={clientInformationDetailReducer.clientInfo.match_model_id}
                                              onChange={(event, value) => {
                                                  dispatch(ClientInformationDetailActionType.setClientInfo({name:"match_model_id",value:value}))
                                              }}
                                              renderInput={(params) => <TextField {...params} label="车型" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            {/*备注remark*/}
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth={true}
                                    margin="dense"
                                    variant="outlined"
                                    label="备注"
                                    onChange={(e)=>{
                                        dispatch(ClientInformationDetailActionType.setClientInfo({name:"remark",value:e.target.value}))
                                    }}
                                    value={clientInformationDetailReducer.clientInfo.remark}
                                />
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            <Grid item xs={12} align='center' style={{marginTop:'30px'}}><Button variant="contained" color="primary"  onClick={updateClientInfo}>修改</Button></Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value='2'>
                        {/*订单编号  价格      接单人 备注  商品    服务     价格*/}
                        {clientInformationDetailReducer.orderData.orderInfo.map((row,index) => (
                            <Accordion key={'order'+index} className={classes.accordion} square expanded={expanded === 'panel'+index} onChange={handleChange('panel'+index)}>
                                <AccordionSummary className={classes.accordionSummary} aria-controls="panel1d-content" id="panel1d-header">
                                    <Grid container  spacing={3}>
                                        <Grid item xs align='left'>订单编号:{row.id}</Grid>
                                        <Grid item xs align='right'>价格:{row.prod_price}</Grid>
                                    </Grid>
                                </AccordionSummary>
                                <div style={{padding:'30px'}}>
                                    <Grid container  spacing={3}>
                                        <Grid item xs align='left'>接单人:{row.re_user_name}</Grid>
                                        <Grid item xs align='right'>时间:{row.date_id}</Grid>
                                    </Grid>
                                    <Grid container  spacing={3}>
                                        <Grid item xs align='left'>订单备注:{row.client_remark}</Grid>
                                    </Grid>
                                    <Grid container  spacing={3}>
                                        <Grid item xs align='left'>操作备注:{row.op_remark}</Grid>
                                    </Grid>
                                    {clientInformationDetailReducer.orderItemServiceInfo.length !== 0 &&<h4>服务:</h4>}
                                    {clientInformationDetailReducer.orderItemServiceInfo.map((service,index) => (
                                        service.order_id==row.id?
                                            <Grid key={'service'+index}>

                                                {service.fixed_price=='0.00'?
                                                <Grid container  spacing={3}>
                                                    <Grid item xs={2} align='left'>名称:{service.sale_service_name}</Grid>
                                                    <Grid item xs={2} align='left'>售价:{service.unit_price}*{service.service_count}</Grid>
                                                    <Grid item xs={2} align='left'>总价:{service.service_price}</Grid>
                                                    <Grid item xs={2} align='left'>折扣:{service.discount_service_price}</Grid>
                                                    <Grid item xs={2} align='left'>实际价格:{service.actual_service_price}</Grid>
                                                </Grid>:

                                                <Grid container  spacing={3}>
                                                    <Grid item xs={2} align='left'>名称:{service.sale_service_name}</Grid>
                                                    <Grid item xs={2} align='left'>售价:{service.fixed_price}</Grid>
                                                    <Grid item xs={2} align='left'>总价:{service.service_price}</Grid>
                                                    <Grid item xs={2} align='left'>折扣:{service.discount_service_price}</Grid>
                                                    <Grid item xs={2} align='left'>实际价格:{service.actual_service_price}</Grid>
                                                </Grid>}

                                                <Grid container  spacing={3}>
                                                    <Grid item xs={2} align='left'>销售:{service.sale_user_name}</Grid>
                                                    <Grid item xs={2} align='left'>施工:{service.deploy_user_name}</Grid>
                                                    <Grid item xs={2} align='left'>验收:{service.check_user_name}</Grid>
                                                </Grid>
                                                <Divider className={classes.divider} variant="middle" />
                                            </Grid>
                                            :''

                                    ))}
                                    {clientInformationDetailReducer.orderItemProdInfo.length !== 0 &&<h4>商品:</h4>}
                                    {clientInformationDetailReducer.orderItemProdInfo.map((item,index) => (
                                        item.order_id==row.id?
                                        <Grid key={'pro'+index}>
                                            <Grid container  spacing={3}>
                                                <Grid item xs={2} align='left'>名称:{item.prod_name}</Grid>
                                                <Grid item xs={2} align='left'>单价:{item.unit_price}</Grid>
                                                <Grid item xs={2} align='left'>数量:{item.prod_count}</Grid>
                                                <Grid item xs={2} align='left'>折扣:{item.discount_prod_price}</Grid>
                                                <Grid item xs={2} align='left'>实际价格:{item.actual_prod_price}</Grid>
                                                <Grid item xs={2} align='left'>销售:{item.sale_user_name}</Grid>
                                            </Grid>
                                            <Divider className={classes.divider} variant="middle" />
                                        </Grid>
                                            :''
                                    ))}

                                </div>

                            </Accordion>
                        ))}
                        {clientInformationDetailReducer.orderData.orderInfo.length==0&&
                        <Accordion>
                            <AccordionSummary> <Grid container  spacing={3}> <Grid item xs align='center'>暂无数据</Grid></Grid></AccordionSummary>
                        </Accordion>}

                        <Box style={{textAlign: 'right', marginTop: 20}}>
                            {clientInformationDetailReducer.orderData.dataSize >=clientInformationDetailReducer.orderData.size &&
                            <Button className={classes.button} variant="contained" color="primary"  size="small"
                                    onClick={()=>{dispatch(ClientInformationDetailAction.getOrderList(id,clientInformationDetailReducer.orderData.start+(clientInformationDetailReducer.orderData.size-1)))}}>
                                下一页
                            </Button>}
                            {clientInformationDetailReducer.orderData.start > 0 &&clientInformationDetailReducer.orderData.dataSize > 0 &&
                            <Button className={classes.button} variant="contained" color="primary"  size="small" style={{marginRight: 20}}
                                    onClick={()=>{dispatch(ClientInformationDetailAction.getOrderList(id,clientInformationDetailReducer.orderData.start-(clientInformationDetailReducer.orderData.size-1)))}}>
                                上一页
                            </Button>}
                        </Box>
                        
                    </TabPanel>
                </TabContext>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        clientInformationDetailReducer: state.ClientInformationDetailReducer,
        clientInformationReducer:state.ClientInformationReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getUserArray: () => {
        dispatch(ClientInformationDetailAction.getUserArray());
    },
    getClientAgent: () => {
        dispatch(ClientInformationDetailAction.getClientAgent());
        dispatch(ClientInformationAction.getProdMatchBrandList());
    },
    getClientInfo: (id) => {
        dispatch(ClientInformationDetailAction.getClientInfo(id));
    },
    updateClient:() => {
        dispatch(ClientInformationDetailAction.updateClient());
    },
    getOrderList:(id,start)=>{
        dispatch(ClientInformationDetailAction.getOrderList(id,start));
    },
    getOrderItemProd:(id)=>{
        dispatch(ClientInformationDetailAction.getOrderItemProd(id));
    },
    getOrderItemService:(id)=>{
        dispatch(ClientInformationDetailAction.getOrderItemService(id));
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(ClientInformationDetail)