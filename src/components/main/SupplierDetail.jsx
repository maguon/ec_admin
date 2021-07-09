import React, {useEffect}from 'react';
import {connect,useDispatch} from 'react-redux';
import {SupplierDetailActionType} from '../../types';
import {
    Button,
    Divider,
    Grid,
    Typography,
    TextField,
    IconButton,
    AppBar,
    Tab,
    Tabs, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell,
} from "@material-ui/core";
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import {makeStyles, withStyles} from "@material-ui/core/styles";
import {Link, useParams} from "react-router-dom";
const commonUtil = require('../../utils/CommonUtil');
const SupplierDetailAction = require('../../actions/main/SupplierDetailAction');
const sysConst = require('../../utils/SysConst');
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        width: `calc(100% - 50px)`,
        paddingLeft: 30
    },
    // 标题样式
    pageTitle: {
        color: '#3C3CC4',
        fontSize: 20,
        fontWeight: 'bold'
    },
    pageDivider: {
        height: 1,
        marginBottom: 15,
        background: '#7179e6'
    },
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
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}))(TableCell);
//供应商---详情
function SupplierDetail (props){
    const {supplierDetailReducer,getSupplierInfo,updateSupplier,getPurchaseInfo,getPurchaseRefundInfo} = props;
    const dispatch = useDispatch();
    const classes = useStyles();
    const [value, setValue] = React.useState('1');
    const {id} = useParams();
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if(newValue=='2'){
            getPurchaseInfo(supplierDetailReducer.supplierInfo.id);
        }
        if(newValue=='3'){
            getPurchaseRefundInfo();
        }
    };
    useEffect(()=>{
        getSupplierInfo(id);
    },[]);

    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>
                <Link to={{pathname: '/supplier', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"></i>
                    </IconButton>
                </Link>
                供应商 - {supplierDetailReducer.supplierInfo.supplier_name}({supplierDetailReducer.supplierInfo.id})
            </Typography>
            <div className={classes.pageDivider}></div>

            {/*选项卡*/}
            <div>
                <TabContext value={value}>
                    <AppBar position="static" color="default">
                        <Tabs value={value}
                              onChange={handleChange}
                              indicatorColor="primary"
                              textColor="primary"
                              variant="fullWidth">
                            <Tab label="供应商" value="1" />
                            <Tab label="采购"   value="2" />
                            <Tab label="退货"   value="3" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value='1'>
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <TextField fullWidth
                                           disabled={true}
                                           size="small"
                                           name="supplierName"
                                           type="text"
                                           label="供应商名称"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:"supplier_name",value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.supplier_name}

                                />
                            </Grid>
                            <Grid item xs>
                                <TextField className={classes.select}
                                           size="small"
                                           select
                                           label="供应商类型"
                                           name="supplierType"
                                           type="text"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:"supplier_type",value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.supplier_type}
                                           SelectProps={{
                                               native: true,
                                           }}
                                           variant="outlined"
                                >
                                    {sysConst.SUPPLIER_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Divider className={classes.divider} variant="middle" />
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="contactName"
                                           type="text"
                                           label="联系人姓名"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:"contact_name",value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.contact_name}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="email"
                                           type="text"
                                           label="邮箱"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:"email",value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.email}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="tel"
                                           type="text"
                                           label="电话"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'tel',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.tel}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="mobile"
                                           type="text"
                                           label="手机"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'mobile',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.mobile}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="fax"
                                           type="text"
                                           label="传真"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'fax',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.fax}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="address"
                                           type="text"
                                           label="地址"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'address',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.address}
                                />
                            </Grid>
                        </Grid>
                        <Divider className={classes.divider} variant="middle" />
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="invoiceTitle"
                                           type="text"
                                           label="公司抬头"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'invoice_title',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.invoice_title}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="invoiceBank"
                                           type="text"
                                           label="开户行"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'invoice_bank',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.invoice_bank}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="invoiceBankSer"
                                           type="text"
                                           label="开户账号"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'invoice_bank_ser',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.invoice_bank_ser}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="invoiceAddress"
                                           type="text"
                                           label="开户地址"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'invoice_address',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.invoice_address}
                                />
                            </Grid>
                        </Grid>
                        <Divider className={classes.divider} variant="middle" />
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <TextField className={classes.select}
                                           size="small"
                                           select
                                           label="结算类型"
                                           name="settleType"
                                           type="text"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'settle_type',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.settle_type}
                                           SelectProps={{
                                               native: true,
                                           }}
                                           variant="outlined"
                                >
                                    <option key={1} value={0}>请选择 </option>
                                    {sysConst.SETTLE_TYPE.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="settleMonthDay"
                                           type="number"
                                           label="月结日期"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'settle_month_day',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.settle_month_day}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField fullWidth
                                           size="small"
                                           name="remark"
                                           type="text"
                                           label="备注"
                                           variant="outlined"
                                           onChange={(e)=>{
                                               dispatch(SupplierDetailActionType.setSupplierInfo({name:'remark',value:e.target.value}))
                                           }}
                                           value={supplierDetailReducer.supplierInfo.remark}
                                />
                            </Grid>
                        </Grid>
                        <Button className={classes.updateButton} variant="contained" color="primary" onClick={updateSupplier}>
                            修改
                        </Button>
                    </TabPanel>
                    <TabPanel value='2'>
                        <Grid container spacing={2}>
                            <TableContainer component={Paper} style={{marginTop:40}}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:60}}>
                                            <StyledTableCell align="center">商品名称</StyledTableCell>
                                            <StyledTableCell align="center">商品单价</StyledTableCell>
                                            <StyledTableCell align="center">商品数量</StyledTableCell>
                                            <StyledTableCell align="center">商品总价</StyledTableCell>
                                            <StyledTableCell align="center">仓储状态</StyledTableCell>
                                            <StyledTableCell align="center">支付状态</StyledTableCell>
                                            <StyledTableCell align="center">下单时间</StyledTableCell>
                                            <StyledTableCell align="center">状态</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {supplierDetailReducer.purchaseInfo.length > 0 &&supplierDetailReducer.purchaseInfo.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center" >{row.product_name}</TableCell>
                                                <TableCell align="center" >{row.unit_cost}</TableCell>
                                                <TableCell align="center" >{row.purchase_count}</TableCell>
                                                <TableCell align="center" >{row.total_cost}</TableCell>
                                                <TableCell align="center" >{commonUtil.getJsonValue(sysConst.STORAGE_STATUS, row.storage_status)}</TableCell>
                                                <TableCell align="center" >{commonUtil.getJsonValue(sysConst.PAYMENT_STATUS, row.payment_status)}</TableCell>
                                                <TableCell align="center" >{commonUtil.getDateTime(row.created_on)}</TableCell>
                                                <TableCell align="center" >{commonUtil.getJsonValue(sysConst.PURCHASE_STATUS, row.status)}</TableCell>
                                            </TableRow>))}
                                        {supplierDetailReducer.purchaseInfo.length === 0 &&
                                        <TableRow style={{height:60}}><TableCell align="center" colSpan="8">暂无数据</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </TabPanel>
                    <TabPanel value='3'>
                        <Grid container spacing={2}>
                            <TableContainer component={Paper} style={{marginTop:20}}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:50}}>
                                            <StyledTableCell align="center">ID</StyledTableCell>
                                            <StyledTableCell align="center">商品名称</StyledTableCell>
                                            <StyledTableCell align="center">退款状态</StyledTableCell>
                                            <StyledTableCell align="center">退货单价</StyledTableCell>
                                            <StyledTableCell align="center">退货数量</StyledTableCell>
                                            <StyledTableCell align="center">运费支付</StyledTableCell>
                                            <StyledTableCell align="center">运费</StyledTableCell>
                                            <StyledTableCell align="center">退款总价</StyledTableCell>
                                            <StyledTableCell align="center">退货盈亏</StyledTableCell>
                                            <StyledTableCell align="center">状态</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {supplierDetailReducer.purchaseRefundInfo.length > 0 &&supplierDetailReducer.purchaseRefundInfo.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center" >{row.id}</TableCell>
                                                <TableCell align="center" >{row.product_name}</TableCell>
                                                <TableCell align="center" >{commonUtil.getJsonValue(sysConst.REFUND_PAYMENT_STATUS, row.payment_status)}</TableCell>
                                                <TableCell align="center" >{row.refund_unit_cost}</TableCell>
                                                <TableCell align="center" >{row.refund_count}</TableCell>
                                                <TableCell align="center" >{commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE,row.transfer_cost_type)}</TableCell>
                                                <TableCell align="center" >{row.transfer_cost}</TableCell>
                                                <TableCell align="center" >{row.total_cost}</TableCell>
                                                <TableCell align="center" >{row.refund_profile}</TableCell>
                                                <TableCell align="center" >{commonUtil.getJsonValue(sysConst.REFUND_STATUS,row.status)}</TableCell>
                                            </TableRow>))}
                                        {supplierDetailReducer.purchaseRefundInfo.length === 0 &&
                                        <TableRow style={{height:60}}><TableCell align="center" colSpan="11">暂无数据</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </TabPanel>
                </TabContext>
            </div>
        </div>
    )

}

const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        fromDetail = true;
    }
    return {
        supplierDetailReducer: state.SupplierDetailReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch,ownProps) => ({
    getSupplierInfo: (id) => {
        dispatch(SupplierDetailAction.getSupplierInfo(id));
    },
    updateSupplier:()=>{
        dispatch(SupplierDetailAction.updateSupplier());
    },
    getPurchaseInfo: (id) => {
        dispatch(SupplierDetailAction.getPurchaseInfo(id));
    },
    getPurchaseRefundInfo: (id) => {
        dispatch(SupplierDetailAction.getPurchaseRefundInfo(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SupplierDetail)