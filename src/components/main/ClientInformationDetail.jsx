import React, {useEffect, useState} from 'react';
import {connect,useDispatch} from 'react-redux';
import {Link, useParams} from "react-router-dom";
import {Button, Grid, Typography, TextField, IconButton, AppBar, Tab, Tabs} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import Autocomplete from "@material-ui/lab/Autocomplete";

import {ClientInformationDetailActionType} from '../../types';
const ClientInformationDetailAction = require('../../actions/main/ClientInformationDetailAction');
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
    }
}));

function ClientInformationDetail (props){
    const {clientInformationDetailReducer,getClientInfo,updateClient,getUserArray,getClientAgent} = props;
    const dispatch = useDispatch();
    const {id} = useParams();
    const classes = useStyles();
    const [value, setValue] = React.useState('1');
    const [validation,setValidation] = useState({});
    useEffect(()=>{
        getClientInfo(id);
        getUserArray();
        getClientAgent();
    },[]);
    const changeTab = (event, newValue) => {
        setValue(newValue);
    };
    //验证()
    const validate = () => {
        const validateObj ={}
        if (!clientInformationDetailReducer.clientInfo.client_agent_id||clientInformationDetailReducer.clientInfo.client_agent_id==null) {
            validateObj.clientAgentId ='请选择客户集群';
        }
        if (!clientInformationDetailReducer.clientInfo.refer_user||clientInformationDetailReducer.clientInfo.refer_user==null) {
            validateObj.referUser ='请选择推荐人';
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
                            <Tab label=""   value="2" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value='1'>
                        <Grid  container spacing={3}>
                            {/*客户集群clientAgentId*/}
                            <Grid item xs>
                                <Autocomplete fullWidth
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
                                <TextField style={{marginTop:'7px'}} fullWidth disabled='true'
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
                                <Autocomplete fullWidth disabled='true'
                                              options={clientInformationDetailReducer.referUserInfo}
                                              getOptionLabel={(option) => option.real_name}
                                              value={clientInformationDetailReducer.clientInfo.refer_user}
                                              onChange={(e,value)=>{
                                                  dispatch(ClientInformationDetailActionType.setClientInfo({name:"refer_user",value:value}))
                                              }}
                                              renderInput={(params) => <TextField {...params} label="推荐人" margin="dense" variant="outlined"
                                                                                  error={validation.referUser&&validation.referUser!=''}
                                                                                  helperText={validation.referUser}/>}
                                />
                            </Grid>
                        </Grid>
                        <Grid  container spacing={3}>
                            {/*备注remark*/}
                            <Grid item xs>
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
                    </TabPanel>
                </TabContext>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        clientInformationDetailReducer: state.ClientInformationDetailReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    getUserArray: () => {
        dispatch(ClientInformationDetailAction.getUserArray());
    },
    getClientAgent: () => {
        dispatch(ClientInformationDetailAction.getClientAgent());
    },
    getClientInfo: (id) => {
        dispatch(ClientInformationDetailAction.getClientInfo(id));
    },
    updateClient:() => {
        dispatch(ClientInformationDetailAction.updateClient());
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(ClientInformationDetail)