import React, {useEffect,useState}from 'react';
import {connect} from 'react-redux';
import {SupplierManagerActionType, SupplierManagerDetailActionType} from '../../types';
import {SimpleModal} from '../index';
import PropTypes from 'prop-types';
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
    TableBody, IconButton,
    AppBar,
    Tab,
    Tabs,
    Box,
} from "@material-ui/core";
import Fab from '@material-ui/core/Fab';
import {withStyles,makeStyles} from "@material-ui/core/styles";
import {Link, useParams} from "react-router-dom";
const SupplierManagerDetailAction = require('../../actions/main/SupplierManagerDetailAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
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
    }
}));

function TabPanel(props) {
    const {children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


//供应商---详情
function SupplierManagerDetail (props){
    const {supplierManagerDetailReducer} = props;
    const classes = useStyles();
    const [supplierName, setSupplierName] = useState('');
    const [supplierType, setSupplierType] = useState(1);
    const [contactName, setContactName] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [mobile, setMobile] = useState('');
    const [fax, setFax] = useState('');
    const [address, setAddress] = useState('');
    const [invoiceTitle, setInvoiceTitle] = useState('');
    const [invoiceBank, setInvoiceBank] = useState('');
    const [invoiceBankSer, setInvoiceBankSer] = useState('');
    const [invoiceAddress, setInvoiceAddress] = useState('');
    const [settleType, setSettleType] = useState(0);
    const [settleMonthDay, setSettleMonthDay] = useState('');
    const [remark, setRemark] = useState('');


    const  initData=() => {
        setSupplierName(supplierManagerDetailReducer.supplier_name);
        setSupplierType(supplierManagerDetailReducer.supplier_type);
        setContactName(supplierManagerDetailReducer.contact_name);
        setEmail(supplierManagerDetailReducer.email);
        setTel(supplierManagerDetailReducer.tel);
        setMobile(supplierManagerDetailReducer.mobile);
        setFax(supplierManagerDetailReducer.fax);
        setAddress(supplierManagerDetailReducer.address);
        setInvoiceTitle(supplierManagerDetailReducer.invoice_title);
        setInvoiceBank(supplierManagerDetailReducer.invoice_bank);
        setInvoiceBankSer(supplierManagerDetailReducer.invoice_bank_ser);
        setInvoiceAddress(supplierManagerDetailReducer.invoice_address);
        setSettleType(supplierManagerDetailReducer.settle_type);
        setSettleMonthDay(supplierManagerDetailReducer.settle_month_day);
        setRemark(supplierManagerDetailReducer.remark);
    }

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>
                <Link to={{pathname: '/supplier_manager', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"></i>
                    </IconButton>
                </Link>
                供应商 - 详情
            </Typography>
            <Divider light className={classes.pageDivider}/>

            {/*选项卡*/}
            <div>
                <AppBar position="static" color="default">
                    <Tabs value={value}
                          onChange={handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth">
                        <Tab label="供应商信息" {...a11yProps(0)} />
                        <Tab label="供应商简介" {...a11yProps(1)} />
                        <Tab label="供应商结算" {...a11yProps(2)} />
                        <Tab label="供应商打款" {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
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
                                           setSupplierName(e.target.value)
                                       }}
                                       value={supplierName}

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
                                           setSupplierType(e.target.value)
                                       }}
                                       value={supplierType}
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
                                           setContactName(e.target.value)
                                       }}
                                       value={contactName}
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
                                           setEmail(e.target.value)
                                       }}
                                       value={email}
                            />
                        </Grid>
                    </Grid>
                    <Grid  container spacing={3}>
                        <Grid item xs>
                            <TextField fullWidth
                                       size="small"
                                       name="tel"
                                       type="text"
                                       label="电话"
                                       variant="outlined"
                                       onChange={(e)=>{
                                           setTel(e.target.value)
                                       }}
                                       value={tel}
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
                                           setMobile(e.target.value)
                                       }}
                                       value={mobile}
                            />
                        </Grid>
                    </Grid>
                    <Grid  container spacing={3}>
                        <Grid item xs>
                            <TextField fullWidth
                                       size="small"
                                       name="fax"
                                       type="text"
                                       label="传真"
                                       variant="outlined"
                                       onChange={(e)=>{
                                           setFax(e.target.value)
                                       }}
                                       value={fax}
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
                                           setAddress(e.target.value)
                                       }}
                                       value={address}
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
                                           setInvoiceTitle(e.target.value)
                                       }}
                                       value={invoiceTitle}
                            />
                        </Grid>
                    </Grid>
                    <Grid  container spacing={3}>
                        <Grid item xs>
                            <TextField fullWidth
                                       size="small"
                                       name="invoiceBank"
                                       type="text"
                                       label="开户行"
                                       variant="outlined"
                                       onChange={(e)=>{
                                           setInvoiceBank(e.target.value)
                                       }}
                                       value={invoiceBank}
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
                                           setInvoiceBankSer(e.target.value)
                                       }}
                                       value={invoiceBankSer}
                            />
                        </Grid>
                    </Grid>
                    <Grid  container spacing={3}>
                        <Grid item xs>
                            <TextField fullWidth
                                       size="small"
                                       name="invoiceAddress"
                                       type="text"
                                       label="开户地址"
                                       variant="outlined"
                                       onChange={(e)=>{
                                           setInvoiceAddress(e.target.value)
                                       }}
                                       value={invoiceAddress}
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
                                           setSettleType(e.target.value)
                                       }}
                                       value={settleType}
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
                                           setSettleMonthDay(e.target.value)
                                       }}
                                       value={settleMonthDay}
                            />
                        </Grid>
                    </Grid>
                    <Grid  container spacing={3}>
                        <Grid item xs>
                            <TextField fullWidth
                                       size="small"
                                       name="remark"
                                       type="text"
                                       label="备注"
                                       variant="outlined"
                                       onChange={(e)=>{
                                           setRemark(e.target.value)
                                       }}
                                       value={remark}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
                <TabPanel value={value} index={3}>
                    Item four
                </TabPanel>
            </div>

        </div>
    )

}

const mapStateToProps = (state, ownProps) => {
    return {
        supplierManagerDetailReducer: state.SupplierManagerDetailReducer
    }
};

const mapDispatchToProps = (dispatch,ownProps) => ({
    getSupplierManagerInfo: () => {
        console.log(ownProps.match.params.id)
        dispatch(SupplierManagerDetailAction.getSupplierManagerInfo(ownProps.match.params.id));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SupplierManagerDetail)