import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import Swal from "sweetalert2";
import {
    Button,
    Divider,
    Grid,
    Typography,
    Paper,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Switch,
    Fab,
    AppBar, Tabs, Tab, IconButton
} from "@material-ui/core";
import {withStyles,makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {SimpleModal} from "../../index";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import {CreateClientAgentModelActionType, SupplierDetailActionType} from "../../../types";
const CreateClientAgentModelAction =require('../../../actions/main/model/CreateClientAgentModelAction')
const commonUtil = require('../../../utils/CommonUtil');
const sysConst = require('../../../utils/SysConst');
const customTheme = require('../../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
    button:{
        margin:'15px',
        float:'right'
    },
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    pdfPage:customTheme.pdfPage,
    pdfTitle:customTheme.pdfTitle,
    tblHeader:customTheme.tblHeader,
    tblLastHeader:customTheme.tblLastHeader,
    tblBody:customTheme.tblBody,
    tblLastBody:customTheme.tblLastBody
}));
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}))(TableCell);
function CreateClientModel (props) {
    const {createClientModelReducer,getCurrentUser} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [value, setValue] = React.useState('1');
    const [validation,setValidation] = useState({});
    useEffect(()=>{
        getCurrentUser()
    },[])
    //验证()
    const validate = ()=>{
        const validateObj ={};
        if (!createClientModelReducer.name) {
            validateObj.name ='请输入客户名称';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    // 关闭模态
    const modalClose = () => {
        dispatch(CreateClientAgentModelActionType.setFlag(false))
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const addClientAgentArray =()=>{
        const errorCount = validate();
        if(errorCount===0){}
    }
    return(
        <SimpleModal
            title= "添加客户中心信息"
            open={createClientModelReducer.flag}
            onClose={modalClose}
            showFooter={true}
            footer={
                <>
                    <Button variant="contained" onClick={() => {addClientAgentArray()}}  color="primary">
                        确定
                    </Button>
                    <Button onClick={modalClose} color="primary" autoFocus>
                        关闭
                    </Button>
                </>
            }
        >
            <TabContext value={value} >
                <AppBar position="static" color="default">
                    <Tabs value={value}
                          onChange={handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth">
                        <Tab label="客户信息"   value="1" />
                        <Tab label="发票信息"   value="2" />
                    </Tabs>
                </AppBar>
                <TabPanel value='1' style={{height:'410px'}}>
                    <Grid  container spacing={3}>
                        <Grid item xs>
                            <TextField fullWidth
                                       size="small"
                                       name="serviceName"
                                       type="text"
                                       label="客户名称"
                                       variant="outlined"
                                       onChange={(e)=>{
                                           dispatch(CreateClientAgentModelActionType.setName({name: "name", value:value}));
                                       }}
                                       error={validation.name && validation.name!=''}
                                       helperText={validation.name}
                                       value={createClientModelReducer.name}

                            />
                        </Grid>
                        <Grid item xs>
                            <TextField fullWidth
                                       size="small"
                                       select
                                       label="客户类型"
                                       name="modifyServiceType"
                                       type="number"
                                       onChange={(e)=>{
                                           dispatch(CreateClientAgentModelActionType.setClientType({name: "clientType", value:e.target.value}));
                                       }}
                                       value={createClientModelReducer.clientType}
                                       SelectProps={{
                                           native: true,
                                       }}
                                       variant="outlined"
                            >
                                {sysConst.CLIENT_TYPE.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs>
                            <TextField fullWidth
                                       size="small"
                                       select
                                       label="客户来源"
                                       name="sourceType"
                                       type="number"
                                       onChange={(e)=>{
                                           dispatch(CreateClientAgentModelActionType.setSourceType({name: "sourceType", value:e.target.value}));
                                       }}
                                       value={createClientModelReducer.sourceType}
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
                        <Grid item xs>
                            <TextField type='number' label="电话" fullWidth margin="dense" variant="outlined"
                                       value={createClientModelReducer.tel}
                                       onChange={(e) => {
                                           dispatch(CreateClientAgentModelActionType.setTel({name: "tel", value:e.target.value}));
                                       }}

                            />
                        </Grid>
                        <Grid item xs>
                            <TextField label="身份证号" fullWidth margin="dense" variant="outlined" value={createClientModelReducer.idSerial}
                                       onChange={(e) => {
                                           dispatch(CreateClientAgentModelActionType.setIdSerial({name: "idSerial", value:e.target.value}));
                                       }}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField label="地址" fullWidth margin="dense" variant="outlined"
                                       value={createClientModelReducer.address}
                                       onChange={(e) => {
                                           dispatch(CreateClientAgentModelActionType.setAddress({name: "address", value:e.target.value}));
                                       }}
                            />
                        </Grid>
                    </Grid>
                    <Grid  container spacing={3}>
                        <Grid item xs>
                            <Autocomplete fullWidth={true} id="salesUserId"
                                          options={createClientModelReducer.currentUserArray}
                                          getOptionLabel={(option) => option.real_name}
                                          value={createClientModelReducer.salesUserId}
                                          onChange={(e,value) => {
                                              dispatch(CreateClientAgentModelActionType.setSalesUserId({name: "salesUserId", value:e.target.value}));
                                          }}
                                          renderInput={(params) => <TextField {...params} label="联系人" margin="dense" variant="outlined"/>}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField fullWidth margin="dense" variant="outlined" label="备注" multiline value={createClientModelReducer.remark}
                                       onChange={(e) => {
                                           dispatch(CreateClientAgentModelActionType.setRemark({name: "remark", value:e.target.value}));
                                       }}/>
                        </Grid>
                    </Grid>

                </TabPanel>
                <TabPanel value='2' style={{height:'410px'}}>
                 {/*   <Grid  container spacing={3}>
                        <Grid item xs>
                            <Autocomplete fullWidth
                                          options={purchaseReducer.productArray}
                                          getOptionLabel={(option) => option.product_name}
                                          value={productArray}
                                          onChange={(event, value)=>setProductArray(value)}
                                          renderInput={(params) => <TextField {...params} label="商品" margin="dense" variant="outlined"
                                                                              error={validationProduct.productArray && validationProduct.productArray!=''}
                                                                              helperText={validationProduct.productArray}/>}

                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth={true}
                                type='number'
                                margin="dense"
                                variant="outlined"
                                label="数量"
                                value={productCount}
                                onChange={(e)=>setProductCount(e.target.value)}
                                error={validationProduct.productCount && validationProduct.productCount!=''}
                                helperText={validationProduct.productCount}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="primary" edge="start"  size="medium" style={{marginTop:5}}
                                        onClick={() => {addProductItem()}}>
                                <i className="mdi mdi-plus mdi-24px"/>
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <TableContainer component={Paper} style={{marginTop:20}}>
                            <Table  size='small' aria-label="a dense table">
                                <TableHead >
                                    <TableRow style={{height:50}}>
                                        <StyledTableCell align="center">产品ID</StyledTableCell>
                                        <StyledTableCell align="center">产品名称</StyledTableCell>
                                        <StyledTableCell align="center">数量</StyledTableCell>
                                        <StyledTableCell align="center">操作</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {serviceSettingReducer.serviceSettingRelArray.length > 0 &&serviceSettingReducer.serviceSettingRelArray.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="center" >{row.product_id}</TableCell>
                                            <TableCell align="center" >{row.product_name}</TableCell>
                                            <TableCell align="center" >{row.product_count}</TableCell>
                                            <TableCell align="center">
                                                <IconButton color="secondary" edge="start" size="small"onClick={() => {deleteRel(row)}}>
                                                    <i className="mdi mdi-delete purple-font margin-left10"> </i>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>))}
                                    {serviceSettingReducer.serviceSettingRelArray.length === 0 &&
                                    <TableRow style={{height:60}}><TableCell align="center" colSpan="4">暂无数据</TableCell></TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>*/}
                </TabPanel>
            </TabContext>
        </SimpleModal>

    )
}
const mapStateToProps = (state, ownProps) => {
    return {
        createClientModelReducer: state.CreateClientAgentModelReducer,
    }
};
const mapDispatchToProps = (dispatch) => ({
    getCurrentUser: () => {
        dispatch(CreateClientAgentModelAction.getCurrentUser());
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateClientModel)