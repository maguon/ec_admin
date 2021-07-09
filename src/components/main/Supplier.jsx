import React, {useEffect,useState}from 'react';
import {connect, useDispatch} from 'react-redux';
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
    IconButton,
    Box
} from "@material-ui/core";
import Fab from '@material-ui/core/Fab';
import {withStyles,makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {SupplierActionType} from '../../types';
import {SimpleModal} from '../index';
const SupplierAction = require('../../actions/main/SupplierAction');
const CommonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
    // 标题样式
    pageTitle: customTheme.pageTitle,
    pageDivider:customTheme.pageDivider,
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
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'
    }
}))(TableCell);
//供应商
function Supplier (props){
    const {commonReducer,supplierReducer,fromDetail} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    //添加供应商
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
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
    const [validation,setValidation] = useState({});
    const [settleTypeFlag,setSettleTypeFlag] = useState(true);
    useEffect(()=>{
       if(settleType==1){
           setSettleTypeFlag(false);
       }else {
           setSettleTypeFlag(true);
           setSettleMonthDay('');
       }
    },[settleType])
    useEffect(()=>{
        if (!fromDetail) {
            let params={
                supplierId:null,
                supplierType:null
            }
            dispatch(SupplierActionType.setSupplierQueryObjs(params));
        }
        props.getSupplierList(supplierReducer.start);
        props.getBaseSelectList()
    },[])
    //初始添加模态框值
    const modalOpen =() =>{
        setModalOpenFlag(true);
        setSupplierName('');
        setSupplierType(1);
        setContactName('');
        setEmail('');
        setTel('');
        setMobile('');
        setFax('');
        setAddress('');
        setInvoiceTitle('');
        setInvoiceBank('');
        setInvoiceBankSer('');
        setInvoiceAddress('');
        setSettleType(0);
        setSettleMonthDay('');
        setRemark('');
    }
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
    };
    //验证()
    const validate = ()=>{
        const validateObj ={}
        if (!supplierName) {
            validateObj.supplierName ='请输入供销商名称';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    //添加供应商
    const addSupplier= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            props.addSupplier(supplierName, supplierType,contactName,email,tel,mobile,fax,address,invoiceTitle,invoiceBank,invoiceBankSer,invoiceAddress,settleType,settleMonthDay,remark);
            setModalOpenFlag(false);
        }
    }
    //查询供应商列表
    const getSupplierArray =() =>{
        props.getSupplierList(0);
    }
    //上一页
    const getPreSupplierList = () => {
        props.getSupplierList(props.supplierReducer.start-(props.supplierReducer.size-1));
    };
    //下一页
    const getNextSupplierList = () => {
        props.getSupplierList(props.supplierReducer.start+(props.supplierReducer.size-1));
    };
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>供应商</Typography>
            <Divider light className={classes.pageDivider}/>
            {/*查询条件*/}
            <Grid container  spacing={1}>
                <Grid container item xs={10} spacing={1}>
                    {/*供应商名称*/}

                    <Grid item xs={3}>
                        <Autocomplete fullWidth={true} id="paramSupplierId"
                                      options={commonReducer.supplierList}
                                      getOptionLabel={(option) => option.supplier_name}
                                      value={supplierReducer.queryObj.supplierId}
                                      onChange={(e,value) => {
                                          dispatch(SupplierActionType.setSupplierQueryObjs({name: "supplierId", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="供应商名称" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    {/*供应商类型*/}
                    <Grid item  xs={6} sm={3}>
                        <Autocomplete fullWidth={true} id="paramSupplierType"
                                      options={sysConst.SUPPLIER_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={supplierReducer.queryObj.supplierType}
                                      onChange={(e,value) => {
                                          dispatch(SupplierActionType.setSupplierQueryObjs({name: "supplierType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="供应商类型" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1}>
                   <Fab size="small" color="primary" aria-label="add" onClick={() => {getSupplierArray()}}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
                {/*添加按钮*/}
                <Grid item xs={1}>
                    <Fab size="small" color="primary" aria-label="add" onClick={()=>{modalOpen()}}>
                        <i className="mdi mdi-plus mdi-24px" />
                    </Fab>
                </Grid>

            </Grid>
            {/*主体*/}
            <Grid container spacing={1}>
                <TableContainer component={Paper} style={{marginTop:20}}>
                    <Table  size='small' aria-label="a dense table">
                        <TableHead >
                            <TableRow style={{height:50}}>
                                <StyledTableCell align="center">ID</StyledTableCell>
                                <StyledTableCell align="center">名称</StyledTableCell>
                                <StyledTableCell align="center">类型</StyledTableCell>
                                <StyledTableCell align="center">联系人</StyledTableCell>
                                <StyledTableCell align="center">电话</StyledTableCell>
                                <StyledTableCell align="center">手机</StyledTableCell>
                                <StyledTableCell align="center">传真</StyledTableCell>
                                <StyledTableCell align="center">结算类型</StyledTableCell>
                                <StyledTableCell align="center">操作</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {supplierReducer.supplierArray.length > 0 &&supplierReducer.supplierArray.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center" >{row.id}</TableCell>
                                    <TableCell align="center" >{row.supplier_name}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SUPPLIER_TYPE,row.supplier_type)}</TableCell>
                                    <TableCell align="center" >{row.contact_name}</TableCell>
                                    <TableCell align="center" >{row.tel}</TableCell>
                                    <TableCell align="center" >{row.mobile}</TableCell>
                                    <TableCell align="center" >{row.fax}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SETTLE_TYPE,row.settle_type)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" edge="start" size="small">
                                            <Link to={{pathname: '/supplier/' + row.id}}>
                                                <i className="mdi mdi-table-search purple-font margin-left10"> </i>
                                            </Link>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>))}
                            {supplierReducer.supplierArray.length === 0 &&
                            <TableRow style={{height:60}}><TableCell align="center" colSpan="10">暂无数据</TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {supplierReducer.dataSize >=supplierReducer.size &&
                <Button className={classes.button} variant="contained" color="primary"  size="small" onClick={getNextSupplierList}>
                    下一页
                </Button>}
                {supplierReducer.start > 0 &&supplierReducer.dataSize > 0 &&
                <Button className={classes.button} variant="contained" color="primary"  size="small" onClick={getPreSupplierList}>
                    上一页
                </Button>}
            </Box>

            {/* 添加供应商信息*/}
            <SimpleModal
                title= "新增供应商信息"
                open={modalOpenFlag}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" onClick={addSupplier} color="primary">
                            确定
                        </Button>
                        <Button onClick={modalClose} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth
                                   size="small"
                                   name="supplierName"
                                   type="text"
                                   label="供应商名称"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setSupplierName(e.target.value)
                                   }}
                                   error={validation.supplierName && validation.supplierName!=''}
                                   helperText={validation.supplierName}
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
                        <TextField fullWidth disabled={settleTypeFlag}
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
        supplierReducer: state.SupplierReducer,
        commonReducer:state.CommonReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    setSupplierQueryObj:(queryObj) =>{
        dispatch(SupplierActionType.setSupplierQueryObj(queryObj))
    },
    //获取列表
    getBaseSelectList: () => {
        dispatch(CommonAction.getSupplierList());
    },
    getSupplierList: (start) => {
        dispatch(SupplierAction.getSupplierList(start));
    },
    //添加供应商
    addSupplier: (supplierName, supplierType,contactName,email,tel,mobile,fax,address,invoiceTitle,invoiceBank,invoiceBankSer,invoiceAddress,settleType,settleMonthDay,remark) => {
        if (supplierName.length > 0) {
            if(settleType==-1){
                settleType=''
            }
            dispatch(SupplierAction.addSupplier({supplierName, supplierType,contactName,email,tel,mobile,fax,address,invoiceTitle,invoiceBank,invoiceBankSer,invoiceAddress,settleType,settleMonthDay,remark}));
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Supplier)