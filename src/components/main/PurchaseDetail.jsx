import React, {useEffect, useState} from 'react';
import {connect,useDispatch} from 'react-redux';
import {PurchaseDetailActionType} from '../../types';
import {
    Button,
    Grid,
    Typography,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    Tab,
    Tabs,
    MenuItem,
    Fab,
    AppBar,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell, FormHelperText,
} from "@material-ui/core";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import {Link, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import {SimpleModal} from "../index";
const PurchaseDetailAction = require('../../actions/main/PurchaseDetailAction');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
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
//采购---详情
function PurchaseDetail (props){
    const {purchaseDetailReducer,getPurchaseDetailInfo,getPurchaseItemDetailInfo,updateStatus,updatePurchaseDetailInfo,updatePurchaseDetailItemInfo,getPurchaseRefundDetailInfo,getProductList,getStorageProductArray,addRefundDetailItem,downLoadPDF} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();
    const [transferCostTypeFlag, setTransferCostTypeFlag] = useState(true);
    const [addTransferCostTypeFlag, setAddTransferCostTypeFlag] = useState(true);
    const [purchaseCountTotal, setPurchaseCountTotal] = useState(0);
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [modalItemOpenFlag, setModalItemOpenFlag] = useState(false);
    const [value, setValue] = React.useState('1');
    const [addTransferCostType, setAddTransferCostType] = useState(1);
    const [addTransferCost, setAddTransferCost] = useState(0);
    const [addProduct, setAddProduct] = useState(-1);
    const [addUnitCost, setAddUnitCost] = useState(0);
    const [addPurchaseCount, setAddPurchaseCount] = useState(0);
    const [addTransferRemark, setAddTransferRemark] = useState('');
    const [addStorageType, setAddStorageType] = useState(0);
    const [addStorageTypeItem, setAddStorageTypeItem] = useState(0);
    const [validation,setValidation] = useState({});
    const [addValidation,setAddValidation] = useState({});
    useEffect(()=>{
        getPurchaseDetailInfo(id);
        getPurchaseItemDetailInfo(id);
        getProductList(id);
    },[]);
    useEffect(()=>{
        for(var value of purchaseDetailReducer.storageProductArray){
            if(value.product_name==addProduct.product_name){
                setAddStorageType(1)
            }else {
                setAddStorageType(0);
            }
            if(value.product_name==addProduct){
                setAddStorageTypeItem(1)
            }else {
                setAddStorageTypeItem(0);
            }
        }
    },[addProduct]);
    useEffect(()=>{
        if(purchaseDetailReducer.purchaseDetailInfo.transfer_cost_type==2){
            setTransferCostTypeFlag(false)
        }else {
            setTransferCostTypeFlag(true)
            purchaseDetailReducer.purchaseDetailInfo.transfer_cost=0;
        }
        if(addTransferCostType==2){
            setAddTransferCostTypeFlag(false)
        }else {
            setAddTransferCostTypeFlag(true)
            setAddTransferCost(0);
        }
    },[purchaseDetailReducer.purchaseDetailInfo.transfer_cost_type,addTransferCostType]);
    useEffect(()=> {
        let num=0;
        for (let i = 0; i < purchaseDetailReducer.purchaseDetailItemInfo.length; i++) {
            num += (purchaseDetailReducer.purchaseDetailItemInfo[i].unit_cost*purchaseDetailReducer.purchaseDetailItemInfo[i].purchase_count)
        }
        setPurchaseCountTotal(num+Number(purchaseDetailReducer.purchaseDetailInfo.transfer_cost));
    },[purchaseDetailReducer.purchaseDetailInfo,purchaseDetailReducer.purchaseDetailItemInfo]);
    //验证()
    const validate = ()=>{
        const validateObj ={};
        if (addProduct=='-1'||addProduct=='') {
            validateObj.addProduct ='请输入商品';
        }

        if(addStorageType==0){
            for(var value of purchaseDetailReducer.purchaseDetailItemInfo){
                if(value.id==addProduct.id){
                    if(addPurchaseCount>value.purchase_count) {
                        validateObj.addPurchaseCount='请输入小于采购的数量';
                    }
                }
            }

        }else {
            for(var value of purchaseDetailReducer.storageProductArray){
                if(value.product_id==addProduct.product_id||value.product_name==addProduct){
                    if(addPurchaseCount>value.storage_count) {
                        validateObj.addPurchaseCount='请输入小于库存的数量';
                    }
                }
            }
        }
        if(addStorageTypeItem==0){
            for(var value of purchaseDetailReducer.purchaseDetailItemInfo){
                if(value.id==addProduct.id){
                    if(addPurchaseCount>value.purchase_count) {
                        validateObj.addPurchaseCount='请输入小于采购的数量';
                    }
                }
            }

        }else {
            for(var value of purchaseDetailReducer.storageProductArray){
                if(value.product_id==addProduct.product_id||value.product_name==addProduct){
                    if(addPurchaseCount>value.storage_count) {
                        validateObj.addPurchaseCount='请输入小于库存的数量';
                    }
                }
            }
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    const addValidate = ()=>{
        const addValidateObj ={};
        if(addStorageTypeItem==0){
            for(var value of purchaseDetailReducer.purchaseDetailItemInfo){
                if(value.id==addProduct.id){
                    if(addPurchaseCount>value.purchase_count) {
                        addValidateObj.addPurchaseCount='请输入小于采购的数量';
                    }
                }
            }

        }else {
            for(var value of purchaseDetailReducer.storageProductArray){
                if(value.product_id==addProduct.product_id||value.product_name==addProduct){
                    if(addPurchaseCount>value.storage_count) {
                        addValidateObj.addPurchaseCount='请输入小于库存的数量';
                    }
                }
            }
        }
        setAddValidation(addValidateObj);
        return Object.keys(addValidateObj).length
    }
    //初始添加模态框值
    const handleAddOpen =() =>{
        setModalOpenFlag(true);
        setAddTransferCostType(1);
        setAddTransferCost(0);
        setAddProduct(-1);
        setAddUnitCost(0);
        setAddPurchaseCount(0);
        setAddTransferRemark('');
    }
    const handleAddItemOpen=(product_name) =>{
        setModalItemOpenFlag(true);
        setAddProduct(product_name)
        setAddStorageType(1)
        setAddTransferCostType(1);
        setAddTransferCost(0);
        setAddUnitCost(0);
        setAddPurchaseCount(0);
        setAddTransferRemark('');
    };
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
    };
    const modalItemClose = () => {
        setModalItemOpenFlag(false);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if(newValue=='2'){
            getStorageProductArray(id);
        }
        if(newValue=='3'){
            getPurchaseRefundDetailInfo(id)
        }
    };
    const addRefundDetailInfo =() => {
        const errorCount = validate();
        if(errorCount==0){
            addRefundDetailItem(id,addProduct,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addTransferRemark,addStorageType);
            setModalOpenFlag(false);
        }
    }
    const addRefundDetailItemInfo =()=>{
        const errorCount = addValidate();
        if(errorCount==0){
            for(var value of purchaseDetailReducer.storageProductArray){
                if(value.product_name==addProduct){
                    addRefundDetailItem(id,value,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addTransferRemark,addStorageTypeItem);
                    setModalItemOpenFlag(false);
                }
            }
        }
    }
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>
                <Link to={{pathname: '/purchase', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"></i>
                    </IconButton>
                </Link>
                采购 -({purchaseDetailReducer.purchaseDetailInfo.id})
            </Typography>
            <div className={classes.pageDivider}></div>
            <div>
                <TabContext value={value}>
                    <AppBar position="static" color="default">
                        <Tabs value={value}
                              onChange={handleChange}
                              indicatorColor="primary"
                              textColor="primary"
                              variant="fullWidth">
                            <Tab label="采购"   value="1" />
                            <Tab label="入库"   value="2" />
                            <Tab label="退货"   value="3" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value='1'>
                        {/*供应商选择*/}
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <FormControl variant="outlined"   disabled={true} fullWidth={true} margin="dense">
                                    <InputLabel id="standard-select-outlined-label" shrink>供应商名称</InputLabel>
                                    <TextField fullWidth
                                               disabled={true}
                                               size="small"
                                               name="supplierName"
                                               type="text"
                                               label="供应商名称"
                                               variant="outlined"
                                               value={purchaseDetailReducer.purchaseDetailInfo.supplier_name}

                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs>
                                <FormControl variant="outlined" fullWidth={true} margin="dense" disabled={true}>
                                    <InputLabel id="standard-select-outlined-label" shrink>仓储状态</InputLabel>
                                    <Select
                                        label="仓储状态"
                                        labelId="standard-select-outlined-label"
                                        id="standard-select-outlined"
                                        value={purchaseDetailReducer.purchaseDetailInfo.storage_status}
                                    >
                                        {sysConst.STORAGE_STATUS.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs>
                                <FormControl variant="outlined" fullWidth={true} margin="dense" disabled={true}>
                                    <InputLabel id="standard-select-outlined-label" shrink>支付状态</InputLabel>
                                    <Select
                                        label="支付状态"
                                        labelId="standard-select-outlined-label"
                                        id="standard-select-outlined"
                                        value={purchaseDetailReducer.purchaseDetailInfo.payment_status}
                                    >
                                        {sysConst.PAYMENT_STATUS.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid item xs>
                                <FormControl variant="outlined" fullWidth={true} margin="dense">
                                    <InputLabel id="standard-select-outlined-label" shrink>运费类型</InputLabel>
                                    <Select
                                        label="运费类型"
                                        labelId="standard-select-outlined-label"
                                        id="standard-select-outlined"
                                        value={purchaseDetailReducer.purchaseDetailInfo.transfer_cost_type}
                                        onChange={(e)=>{
                                            dispatch(PurchaseDetailActionType.setPurchaseDetailInfo({name:"transfer_cost_type",value:e.target.value}))
                                        }}
                                    >
                                        {sysConst.TRANSFER_COST_TYPE.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <TextField type="number" label="运费" disabled={transferCostTypeFlag} fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                           value={purchaseDetailReducer.purchaseDetailInfo.transfer_cost}
                                           onChange={(e) => {
                                               dispatch(PurchaseDetailActionType.setPurchaseDetailInfo({name: "transfer_cost",value: e.target.value}))
                                           }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField label="总价" fullWidth={true} disabled={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                           value={Number(purchaseCountTotal)}
                                />
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                        {/*商品选择*/}
                        {purchaseDetailReducer.purchaseDetailItemInfo.map((item,index)=>(
                            <Grid  container spacing={3} key={index}>
                                <Grid item xs>
                                    <FormControl variant="outlined"   disabled={true} fullWidth={true} margin="dense">
                                        <InputLabel id="standard-select-outlined-label" shrink>商品</InputLabel>
                                        <TextField fullWidth
                                                   disabled={true}
                                                   size="small"
                                                   name="supplierName"
                                                   type="text"
                                                   label="商品"
                                                   variant="outlined"
                                                   value={item.product_name}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs>
                                    <TextField type="number" label="商品单价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                               value={item.unit_cost}
                                               onChange={(e) => {
                                                   dispatch(PurchaseDetailActionType.setPurchaseDetailItemInfo({index,name: "unit_cost",value: e.target.value}))
                                               }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <TextField type="number" label="商品数量" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                               value={item.purchase_count}
                                               onChange={(e) => {
                                                   dispatch(PurchaseDetailActionType.setPurchaseDetailItemInfo({index,name: "purchase_count",value: e.target.value}))
                                               }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <TextField type="number" disabled={true} label="商品总价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                               value={Number(item.unit_cost)*Number(item.purchase_count)}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="备注" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                               value={item.remark}
                                               onChange={(e) => {
                                                   dispatch(PurchaseDetailActionType.setPurchaseDetailItemInfo({index,name: "remark",value: e.target.value}))
                                               }}
                                    />
                                </Grid>
                                <Grid item xs={1}  align="center"  style={{display:purchaseDetailReducer.purchaseDetailInfo.status==3?'block':'none',marginTop:'14px'}}>

                                        <i className="mdi mdi-check mdi-24px"  style={{color:'#3f51b5'}} onClick={() => {updatePurchaseDetailItemInfo(item.id,index)}}/>

                                </Grid>
                            </Grid>
                        ))}
                        {/*备注*/}
                        <Grid  container spacing={3}>
                            <Grid item xs>
                                <TextField label="备注" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                           value={purchaseDetailReducer.purchaseDetailInfo.remark}
                                           onChange={(e) => {
                                               dispatch(PurchaseDetailActionType.setPurchaseDetailInfo({name: "remark",value: e.target.value}))
                                           }}
                                />
                            </Grid>
                        </Grid>
                        {/*修改  状态*/}
                        <Grid  container spacing={3}>
                            <Grid item xs={4}></Grid>
                            <Grid item xs align='center' style={{marginTop:'15px'}}>
                                <IconButton color="primary" edge="start" onClick={()=>{downLoadPDF(purchaseDetailReducer.purchaseDetailInfo.supplier_name)}}>
                                    <i className="mdi mdi-file-pdf" style={{fontSize:40}}/>
                                </IconButton>
                            </Grid>
                            <Grid item xs  align="center" style={{display:purchaseDetailReducer.purchaseDetailInfo.status==3?'block':'none',marginTop:'30px'}}>
                                <Button variant="contained" color="primary" onClick={updatePurchaseDetailInfo}>保存</Button>
                            </Grid>

                            <Grid item xs  align="center"   style={{display:purchaseDetailReducer.purchaseDetailInfo.status==1?'block':'none',marginTop:'30px'}}>
                                <Button variant="contained" color="secondary"  onClick={() => {updateStatus(id,3)}}>开始处理</Button>
                            </Grid>
                            <Grid item xs  align="center"  style={{display:purchaseDetailReducer.purchaseDetailInfo.status==3?'block':'none',marginTop:'30px'}}>
                                <Button variant="contained" color="secondary"  onClick={() => {updateStatus(id,7)}}>处理</Button>
                            </Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>
                        {/* PDF 输出用 DIV */}
                        <div id="purchaseId" className={classes.pdfPage} style={{marginTop: -99999}}>
                            <Grid container spacing={0}>
                                <Grid item sm={12} className={classes.pdfTitle}>采购单</Grid>
                                <Grid item sm={2}><img style={{width: 120,paddingLeft:30,marginTop:15}} src="/logo120.png"  alt=""/></Grid>
                                <Grid item container sm={10} spacing={0}>
                                    <Grid item sm={6}><b>采购单号：</b>{purchaseDetailReducer.purchaseDetailInfo.id}</Grid>
                                    <Grid item sm={6}><b>操作人员：</b>{purchaseDetailReducer.purchaseDetailInfo.op_user}</Grid>
                                    <Grid item sm={6}><b>供应商名称：</b>{purchaseDetailReducer.purchaseDetailInfo.supplier_name}</Grid>
                                    <Grid item sm={6}><b>联系人姓名：</b>{purchaseDetailReducer.supplierDetailArray.contact_name}</Grid>
                                    <Grid item sm={6}><b>手机：</b>{purchaseDetailReducer.supplierDetailArray.mobile}</Grid>
                                    <Grid item sm={6}><b>邮箱：</b>{purchaseDetailReducer.supplierDetailArray.email}</Grid>
                                    <Grid item sm={6}><b>电话：</b>{purchaseDetailReducer.supplierDetailArray.tel}</Grid>
                                    <Grid item sm={6}><b>传真：</b>{purchaseDetailReducer.supplierDetailArray.fax}</Grid>
                                    <Grid item sm={12}><b>地址：</b>{purchaseDetailReducer.supplierDetailArray.address}</Grid>
                                    <Grid item sm={6}><b>公司抬头：</b>{purchaseDetailReducer.supplierDetailArray.invoice_title}</Grid>
                                    <Grid item sm={6}><b>开户行：</b>{purchaseDetailReducer.supplierDetailArray.invoice_bank}</Grid>
                                    <Grid item sm={6}><b>开户行账号：</b>{purchaseDetailReducer.supplierDetailArray.invoice_bank_ser}</Grid>
                                    <Grid item sm={6}><b>开户地址：</b>{purchaseDetailReducer.supplierDetailArray.invoice_address}</Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={0} style={{paddingTop: 25}}>
                                <Grid item sm={2} className={classes.tblHeader}>商品名称</Grid>
                                <Grid item sm={2} className={classes.tblHeader}>单价</Grid>
                                <Grid item sm={2} className={classes.tblHeader}>数量</Grid>
                                <Grid item sm={2} className={classes.tblHeader}>总价</Grid>
                                <Grid item sm={4} className={classes.tblLastHeader}>备注</Grid>
                            </Grid>
                            {purchaseDetailReducer.purchaseDetailItemInfo.map((row, index) => (
                                <Grid container spacing={0}>
                                    <Grid item sm={2} className={classes.tblBody}>{row.product_name}</Grid>
                                    <Grid item sm={2} className={classes.tblBody}>{row.unit_cost}</Grid>
                                    <Grid item sm={2} className={classes.tblBody}>{row.purchase_count}</Grid>
                                    <Grid item sm={2} className={classes.tblBody}>{Number(row.unit_cost*row.purchase_count)}</Grid>
                                    <Grid item sm={4} className={classes.tblLastBody}>{row.remark}</Grid>
                                </Grid>
                            ))}
                            <Grid container spacing={0} style={{paddingTop: 35}}  align='right'>
                                <Grid item sm={4}>{commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE,purchaseDetailReducer.purchaseDetailInfo.transfer_cost_type)}运费:{purchaseDetailReducer.purchaseDetailInfo.transfer_cost}</Grid>
                                <Grid item sm={4}>总价:{purchaseDetailReducer.purchaseDetailInfo.total_cost}</Grid>
                                <Grid item sm={4}>备注:{purchaseDetailReducer.purchaseDetailInfo.remark}</Grid>
                            </Grid>
                        </div>

                    </TabPanel>
                    <TabPanel value='2'>
                        <Grid item xs align="right">
                            <Fab color="primary" aria-label="add" size="small" onClick={()=>{handleAddOpen()}}>
                                <i className="mdi mdi-plus mdi-24px"/>
                            </Fab>
                        </Grid>
                        <Grid container spacing={2}>
                            <TableContainer component={Paper} style={{marginTop:40}}>
                                <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.head} align="center">仓库</TableCell>
                                            <TableCell className={classes.head} align="center">仓库分区</TableCell>
                                            <TableCell className={classes.head} align="center">供应商</TableCell>
                                            <TableCell className={classes.head} align="center">商品名称</TableCell>
                                            <TableCell className={classes.head} align="center">单价</TableCell>
                                            <TableCell className={classes.head} align="center">库存</TableCell>
                                            <TableCell className={classes.head} align="center">仓储日期</TableCell>
                                            <TableCell className={classes.head} align="center">操作</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {purchaseDetailReducer.storageProductArray.map((row) => (
                                            <TableRow className={classes.tableRow} key={'table-row-' + row.id} style={{paddingTop:15}}>
                                                <TableCell align="center">{row.storage_name}</TableCell>
                                                <TableCell align="center">{row.storage_area_name}</TableCell>
                                                <TableCell align="center">{row.supplier_name}</TableCell>
                                                <TableCell align="center">{row.product_name}</TableCell>
                                                <TableCell align="center">{row.unit_cost}</TableCell>
                                                <TableCell align="center">{row.storage_count}</TableCell>
                                                <TableCell align="center">{row.date_id}</TableCell>
                                                <TableCell align="center">
                                                    <Fab color="primary" aria-label="add" size="small"   onClick={() => {handleAddItemOpen(row.product_name)}}>退</Fab>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {purchaseDetailReducer.storageProductArray.length === 0 &&
                                        <TableRow>
                                            <TableCell colSpan={9} style={{textAlign: 'center'}}>暂无数据</TableCell>
                                        </TableRow>}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </TabPanel>
                    <TabPanel value='3'>
                        <Grid container spacing={2}>
                            <TableContainer component={Paper} style={{marginTop:40}}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow style={{height:60}}>
                                            <StyledTableCell align="center">ID</StyledTableCell>
                                            <StyledTableCell align="center">商品名称</StyledTableCell>
                                            <StyledTableCell align="center">退款状态</StyledTableCell>
                                            <StyledTableCell align="center">退货单价</StyledTableCell>
                                            <StyledTableCell align="center">退货数量</StyledTableCell>
                                            <StyledTableCell align="center">运费支付方式</StyledTableCell>
                                            <StyledTableCell align="center">运费</StyledTableCell>
                                            <StyledTableCell align="center">退款总价</StyledTableCell>
                                            <StyledTableCell align="center">退货盈亏</StyledTableCell>
                                            <StyledTableCell align="center">状态</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {purchaseDetailReducer.purchaseRefundDetailInfo.length > 0 &&purchaseDetailReducer.purchaseRefundDetailInfo.map((row) => (
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
                                        {purchaseDetailReducer.purchaseRefundDetailInfo.length === 0 &&
                                        <TableRow style={{height:60}}><TableCell align="center" colSpan="11">暂无数据</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </TabPanel>
                </TabContext>
            </div>

            {/* 新增退货信息*/}
            <SimpleModal
                title= "新增退货信息"
                open={modalOpenFlag}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained"  color="primary"  onClick={() => {addRefundDetailInfo()}}>
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
                        <FormControl variant="outlined"   disabled={true} fullWidth={true} margin="dense">
                            <InputLabel id="standard-select-outlined-label" shrink>供应商名称</InputLabel>
                            <TextField fullWidth
                                       disabled={true}
                                       size="small"
                                       name="supplierName"
                                       type="text"
                                       label="供应商名称"
                                       variant="outlined"
                                       value={purchaseDetailReducer.purchaseDetailInfo.supplier_name}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="standard-select-outlined-label" shrink>运费类型</InputLabel>
                            <Select
                                label="运费类型"
                                labelId="standard-select-outlined-label"
                                id="standard-select-outlined"
                                value={addTransferCostType}
                                onChange={(e)=>{
                                    setAddTransferCostType(e.target.value)
                                }}
                            >
                                {sysConst.TRANSFER_COST_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="运费" disabled={addTransferCostTypeFlag} fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={addTransferCost}
                                   onChange={(e) => {
                                       setAddTransferCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField label="总价" fullWidth={true} disabled={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(addUnitCost*addPurchaseCount)-Number(addTransferCost)}
                        />
                    </Grid>
                </Grid>
                {/*商品选择*/}
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="standard-select-outlined-label" shrink>商品</InputLabel>
                            <Select
                                label="商品"
                                labelId="standard-select-outlined-label"
                                id="standard-select-outlined"
                                value={addProduct}
                                onChange={(e)=>{
                                    setAddProduct(e.target.value)
                                }}
                                error={validation.addProduct&&validation.addProduct!=''&&validation.addProduct!='-1' }
                            >  <MenuItem key={-1} value={-1}>请选择</MenuItem>
                                {purchaseDetailReducer.productDetailArray.map((item, index) => (
                                    <MenuItem key={item.id} value={item}>{item.product_name}</MenuItem>
                                ))}
                            </Select>
                            {(validation.addProduct&&validation.addProduct!=''&&validation.addProduct!='-1' && <FormHelperText style={{color: 'red'}}>{validation.addProduct}</FormHelperText>)}
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="退货单价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={addUnitCost}
                                   onChange={(e) => {
                                       setAddUnitCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="退货数量" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={addPurchaseCount}
                                   onChange={(e) => {
                                       setAddPurchaseCount(e.target.value)
                                   }}
                                   error={validation.addPurchaseCount && validation.addPurchaseCount!=''}
                                   helperText={validation.addPurchaseCount}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" disabled={true} label="退货总价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(addPurchaseCount)*Number(addUnitCost)}
                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth={true} margin="dense" disabled={true}>
                            <InputLabel id="standard-select-outlined-label" shrink>是否出库</InputLabel>
                            <Select
                                label="是否出库"
                                labelId="standard-select-outlined-label"
                                id="standard-select-outlined"
                                value={addStorageType}
                                onChange={(e)=>{
                                    setAddStorageType(e.target.value)
                                }}
                            >
                                {sysConst.STORAGE_TYPE.map((item, index) => (
                                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="备注"
                            value={addTransferRemark}
                            onChange={(e)=>setAddTransferRemark(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>

            <SimpleModal
                title= "新增退货信息"
                open={modalItemOpenFlag}
                onClose={modalItemClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained"  color="primary"  onClick={() => {addRefundDetailItemInfo()}}>
                            确定
                        </Button>
                        <Button onClick={modalItemClose} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <FormControl variant="outlined"   disabled={true} fullWidth={true} margin="dense">
                            <InputLabel id="standard-select-outlined-label" shrink>供应商名称</InputLabel>
                            <TextField fullWidth
                                       disabled={true}
                                       size="small"
                                       name="supplierName"
                                       type="text"
                                       label="供应商名称"
                                       variant="outlined"
                                       value={purchaseDetailReducer.purchaseDetailInfo.supplier_name}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="standard-select-outlined-label" shrink>运费类型</InputLabel>
                            <Select
                                label="运费类型"
                                labelId="standard-select-outlined-label"
                                id="standard-select-outlined"
                                value={addTransferCostType}
                                onChange={(e)=>{
                                    setAddTransferCostType(e.target.value)
                                }}
                            >
                                {sysConst.TRANSFER_COST_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="运费" disabled={addTransferCostTypeFlag} fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={addTransferCost}
                                   onChange={(e) => {
                                       setAddTransferCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField label="总价" fullWidth={true} disabled={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(addUnitCost*addPurchaseCount)-Number(addTransferCost)}
                        />
                    </Grid>
                </Grid>
                {/*商品选择*/}
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth={true} margin="dense" disabled={true}>
                            <InputLabel id="standard-select-outlined-label" shrink>商品</InputLabel>
                            <Select
                                label="商品"
                                labelId="standard-select-outlined-label"
                                id="standard-select-outlined"
                                value={addProduct}
                                onChange={(e)=>{
                                setAddProduct(e.target.value)
                            }}>
                                {purchaseDetailReducer.productDetailArray.map((item, index) => (
                                    <MenuItem key={item.id} value={item.product_name}>{item.product_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="退货单价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={addUnitCost}
                                   onChange={(e) => {
                                       setAddUnitCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="退货数量" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={addPurchaseCount}
                                   onChange={(e) => {
                                       setAddPurchaseCount(e.target.value)
                                   }}
                                   error={addValidation.addPurchaseCount && addValidation.addPurchaseCount!=''}
                                   helperText={addValidation.addPurchaseCount}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" disabled={true} label="退货总价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(addPurchaseCount)*Number(addUnitCost)}
                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth={true} margin="dense" disabled={true}>
                            <InputLabel id="standard-select-outlined-label" shrink>是否出库</InputLabel>
                            <Select
                                label="是否出库"
                                labelId="standard-select-outlined-label"
                                id="standard-select-outlined"
                                value={addStorageTypeItem}
                                onChange={(e)=>{
                                    setAddStorageTypeItem(e.target.value)
                                }}
                            >
                                {sysConst.STORAGE_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="备注"
                            value={addTransferRemark}
                            onChange={(e)=>setAddTransferRemark(e.target.value)}
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
        purchaseDetailReducer: state.PurchaseDetailReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch,ownProps) => ({
    getPurchaseDetailInfo:(id)=>{
        dispatch(PurchaseDetailAction.getPurchaseDetailInfo(id))
    },
    getPurchaseItemDetailInfo:(id)=>{
        dispatch(PurchaseDetailAction.getPurchaseItemDetailInfo(id))
    },
    updatePurchaseDetailInfo:()=>{
        dispatch(PurchaseDetailAction.updatePurchaseDetailInfo())
    },
    updatePurchaseDetailItemInfo:(itemId,index)=>{
        dispatch(PurchaseDetailAction.updatePurchaseDetailItemInfo(itemId,index))
    },
    updateStatus: (id, status) => {
        Swal.fire({
            title: status === 3 ? "确定开始处理该条采购？" : "确定完成该采购数据？",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(PurchaseDetailAction.updatePurchaseDetailInfoStatus(id,status))
            }
        });
    },
    getPurchaseRefundDetailInfo:(id)=>{
        dispatch(PurchaseDetailAction.getPurchaseRefundDetailInfo(id))
    },
    getProductList:(id)=>{
        dispatch(PurchaseDetailAction.getProductList(id))
    },
    getStorageProductArray:(id)=>{
        dispatch(PurchaseDetailAction.getStorageProductArray(id))
    },
    addRefundDetailItem:(id,item,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addTransferRemark,addStorageType)=>{
        dispatch(PurchaseDetailAction.addRefundDetailItem(id,item,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addTransferRemark,addStorageType))
    },
    downLoadPDF: (name) => {
        dispatch(PurchaseDetailAction.downLoadPDF(name))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDetail)