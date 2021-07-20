import React, {useEffect,useState}from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
import {Button, Divider, Grid, Typography, Paper, TextField, TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, IconButton, FormControl, InputLabel, Select, MenuItem, Box,Fab} from "@material-ui/core";
import {withStyles,makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {SimpleModal} from '../index';
import {PurchaseActionType} from '../../types';
const PurchaseAction = require('../../actions/main/PurchaseAction');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
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
    addCategory:{
        marginTop:'8px'
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

//采购
function Purchase (props){
    const {purchaseReducer,getSupplierList,getProductList,getPurchaseList,downLoadPDF,fromDetail} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [transferCostTypeFlag, setTransferCostTypeFlag] = useState(true);
    const [supplier, setSupplier] = useState("");
    const [transferCost, setTransferCost] = useState("");
    const [transferCostType, setTransferCostType] = useState("");
    const [transferRemark, setTransferRemark] = useState("");
    const [purchaseCountTotal, setPurchaseCountTotal] = useState(0);
    const [validation,setValidation] = useState({});
    const [purchaseItem,setPurchaseItem]  = useState([{product:-1,unitCost:0,unitNumber:0,purchaseCount:0,remark:""}])
    useEffect(()=>{
        getSupplierList();
        getProductList();
        if(transferCostType==2){
            setTransferCostTypeFlag(false)
        }else {
            setTransferCostTypeFlag(true)
            setTransferCost(0);
        }
    },[transferCostType]);
    useEffect(()=>{
        if (!fromDetail) {
            let queryPurchaseObj={
                supplierId:null,
                storageStatus:'-1',
                paymentStatus:'-1',
                status:'-1',
                planDateStart :'',
                planDateEnd:'',
                finishDateStart:'',
                finishDateEnd:''
            }
            dispatch(PurchaseActionType.setPurchaseQueryObj(queryPurchaseObj));
        }
        getSupplierList();
        getPurchaseList(purchaseReducer.start);

    },[])
    const setPurchaseItemParams = (index,name,value)=>{
        if(name=='product'){
            dispatch(PurchaseActionType.setPurchaseAddObj({index,name:value}))
            purchaseItem[index].product=value;
        }else if(name=='unitCost'){
            dispatch(PurchaseActionType.setPurchaseAddObj({index,name:value}))
            purchaseItem[index].unitCost=value;
            purchaseItem[index].purchaseCount= value*purchaseItem[index].unitNumber;
            let num=0;
            for(let i=0;i<purchaseItem.length;i++){
                num+=purchaseItem[i].purchaseCount
            }
            setPurchaseCountTotal(num);
        }else if(name=='unitNumber'){
            dispatch(PurchaseActionType.setPurchaseAddObj({index,name:value}))
            purchaseItem[index].unitNumber=value;
            purchaseItem[index].purchaseCount=value*purchaseItem[index].unitCost;
            let num=0;
            for(let i=0;i<purchaseItem.length;i++){
                num+=purchaseItem[i].purchaseCount
            }
            setPurchaseCountTotal(num);
        }else if(name=='remark'){
            dispatch(PurchaseActionType.setPurchaseAddObj({index,name:value}))
            purchaseItem[index].remark=value;
        }
    }
    //查询采购列表
    const getPurchaseArray =() =>{
        getPurchaseList(0);
    }
    //初始添加模态框值
    const modalOpenPurchase =() =>{
        setModalOpenFlag(true);
        setSupplier('-1');
        setTransferCostType('1');
        setPurchaseCountTotal(0);
        setTransferRemark('');
        setPurchaseItem([{product:-1,unitCost:0,unitNumber:0,purchaseCount:0,remark:""}]);
    }
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
    };
    //验证()
    const validate = (index)=>{
        const validateObj ={};
        if (supplier=='-1'||supplier=='') {
            validateObj.supplier ='请输入供应商';
        }
        for(let i=0;i<index;i++){
            if(purchaseItem[i].product=='-1'||purchaseItem[i].product==''){
                validateObj.product='请输入供应商';
            }
            if(!purchaseItem[i].unitCost){
                validateObj.unitCost='请输入商品单价';
            }
            if (!purchaseItem[i].unitNumber) {
               validateObj.unitNumber ='请输入商品数量';
            }
        }

        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    //添加采购
    const addPurchase= ()=>{
        const errorCount = validate(purchaseItem.length);
        if(errorCount==0){
            props.addPurchaseInfo(supplier,purchaseItem,transferCostType,transferCost,transferRemark);
            setModalOpenFlag(false);
        }
    }
    const addCategoryItem = () =>{
        let tmpArray =[...purchaseItem,{product:-1,unitCost:0,unitNumber:0,purchaseCount:0,remark:""}];
        const errorCount = validate(tmpArray.length-1);
        if(errorCount==0){
            setPurchaseItem(tmpArray);
        }
    }
    const deleteItem =(index,item) =>{
      let tep=purchaseItem.filter(e=>e!=item)
      setPurchaseItem(tep);
    }
    //上一页
    const getPreSupplierList = () => {
            getPurchaseList(purchaseReducer.start-(purchaseReducer.size-1));
    };
    //下一页
    const getNextSupplierList = () => {
        getPurchaseList(purchaseReducer.start+(purchaseReducer.size-1));
    };
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>采购</Typography>
            <Divider light className={classes.pageDivider}/>
            {/*查询条件*/}
            <Grid container  spacing={1}>
                <Grid container item xs={10} spacing={1}>
                    {/*供应商名称*/}
                    <Grid item xs={3}>
                        <Autocomplete fullWidth
                                      id="condition-category"
                                      options={purchaseReducer.supplierArray}
                                      getOptionLabel={(option) => option.supplier_name}
                                      value={purchaseReducer.queryPurchaseObj.supplierId}
                                      onChange={(e,value) => {
                                          dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "supplierId", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="供应商名称" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="status-select-outlined-label">仓储状态</InputLabel>
                            <Select
                                label="仓储状态"
                                labelId="status-select-outlined-label"
                                id="status-select-outlined"
                                value={purchaseReducer.queryPurchaseObj.storageStatus}
                                onChange={(e, value) => {
                                    dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "storageStatus", value: e.target.value}));
                                }}
                            >
                                <MenuItem  key={-1} value='-1'>请选择</MenuItem>
                                {sysConst.STORAGE_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="status-select-outlined-label">支付状态</InputLabel>
                            <Select
                                label="支付状态"
                                labelId="status-select-outlined-label"
                                id="status-select-outlined"
                                value={purchaseReducer.queryPurchaseObj.paymentStatus}
                                onChange={(e, value) => {
                                    dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "paymentStatus", value: e.target.value}));
                                }}
                            >
                                <MenuItem key={-1} value='-1'>请选择</MenuItem>
                                {sysConst.PAYMENT_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="status-select-outlined-label">采购状态</InputLabel>
                            <Select
                                label="采购状态"
                                labelId="status-select-outlined-label"
                                id="status-select-outlined"
                                value={purchaseReducer.queryPurchaseObj.status}
                                onChange={(e, value) => {
                                    dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "status", value: e.target.value}));
                                }}
                            >
                                <MenuItem key={-1} value='-1'>请选择</MenuItem>
                                {sysConst.PURCHASE_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* 计划开始时间*/}
                    <Grid item  xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="开始日期（始）"
                                    value={purchaseReducer.queryPurchaseObj.planDateStart=="" ? null :purchaseReducer.queryPurchaseObj.planDateStart}
                                    onChange={(date) => {
                                        dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "planDateStart", value:date}));
                                    }}
                        />
                    </Grid>
                    <Grid item  xs={3}>

                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="开始日期(终)"
                                    value={purchaseReducer.queryPurchaseObj.planDateEnd=="" ? null :purchaseReducer.queryPurchaseObj.planDateEnd}
                                    onChange={(date) => {
                                        dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "planDateEnd", value: date}));
                                    }}
                        />
                    </Grid>
                    {/*完成时间*/}
                    <Grid item  xs={3}>

                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期(始)"
                                    value={purchaseReducer.queryPurchaseObj.finishDateStart=="" ? null :purchaseReducer.queryPurchaseObj.finishDateStart}
                                    onChange={(date) => {
                                        dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "finishDateStart", value: date}));
                                    }}
                        />
                    </Grid>
                    <Grid item  xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期(终)"
                                    value={purchaseReducer.queryPurchaseObj.finishDateEnd=="" ? null :purchaseReducer.queryPurchaseObj.finishDateEnd}
                                    onChange={(date) => {
                                        dispatch(PurchaseActionType.setPurchaseQueryObjs({name: "finishDateEnd", value: date}));
                                    }}
                        />
                    </Grid>
                </Grid>
                {/*查询按钮*/}
                <Grid item xs={1} align="center">
                    <Fab size="small" color="primary" aria-label="add"  onClick={() => {getPurchaseArray()}} style={{marginTop: 40}}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
                {/*添加按钮*/}
                <Grid item xs={1} align="center">
                    <Fab size="small" color="primary" aria-label="add" onClick={()=>{modalOpenPurchase()}} style={{marginTop: 40}}>
                        <i className="mdi mdi-plus mdi-24px" />
                    </Fab>
                </Grid>
                {/*主体*/}
                <Grid container spacing={2}>
                    <TableContainer component={Paper} style={{marginTop:20}}>
                        <Table  size={'small'} aria-label="a dense table">
                            <TableHead >
                                <TableRow style={{height:50}}>
                                    <StyledTableCell align="center">ID</StyledTableCell>
                                    <StyledTableCell align="center">供应商</StyledTableCell>
                                    <StyledTableCell align="center">开始时间</StyledTableCell>
                                    <StyledTableCell align="center">结束时间</StyledTableCell>
                                    <StyledTableCell align="center">仓储状态</StyledTableCell>
                                    <StyledTableCell align="center">支付状态</StyledTableCell>
                                    <StyledTableCell align="center">支付时间</StyledTableCell>
                                    <StyledTableCell align="center">运费</StyledTableCell>
                                    <StyledTableCell align="center">商品金额</StyledTableCell>
                                    <StyledTableCell align="center">总价</StyledTableCell>
                                    <StyledTableCell align="center">状态</StyledTableCell>
                                    <StyledTableCell align="center">操作</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchaseReducer.purchaseArray.length > 0 &&purchaseReducer.purchaseArray.map((row) => (
                                    <TableRow key={'purchase-'+row.id}>
                                        <TableCell align="center" >{row.id}</TableCell>
                                        <TableCell align="center" >{row.supplier_name}</TableCell>
                                        <TableCell align="center" >{row.plan_date_id}</TableCell>
                                        <TableCell align="center" >{row.finish_date_id}</TableCell>
                                        <TableCell align="center" >{commonUtil.getJsonValue(sysConst.STORAGE_STATUS, row.storage_status)}</TableCell>
                                        <TableCell align="center" >{commonUtil.getJsonValue(sysConst.PAYMENT_STATUS, row.payment_status)}</TableCell>
                                        <TableCell align="center" >{row.payment_date_id}</TableCell>
                                        <TableCell align="center" >{row.transfer_cost}</TableCell>
                                        <TableCell align="center" >{row.product_cost}</TableCell>
                                        <TableCell align="center" >{row.total_cost}</TableCell>
                                        <TableCell align="center" >{commonUtil.getJsonValue(sysConst.PURCHASE_STATUS, row.status)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="primary" edge="start"  size="small" onClick={()=>{downLoadPDF(row)}}>
                                                <i className="mdi mdi-file-pdf"/>
                                            </IconButton>
                                            {/* 详情按钮*/}
                                            <IconButton color="primary" edge="start"  size="small">
                                                <Link to={{pathname: '/purchase/' + row.id}}>
                                                    <i className="mdi mdi-table-search purple-font margin-left10"> </i>
                                                </Link>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>))}
                                {purchaseReducer.purchaseArray.length === 0 &&
                                <TableRow style={{height:60}}><TableCell align="center" colSpan="12">暂无数据</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {purchaseReducer.dataSize >=purchaseReducer.size &&
                <Button className={classes.button} variant="contained" color="primary"  onClick={getNextSupplierList}>
                    下一页
                </Button>}
                {purchaseReducer.start > 0 &&purchaseReducer.dataSize > 0 &&
                <Button className={classes.button} variant="contained" color="primary" onClick={getPreSupplierList}>
                    上一页
                </Button>}
            </Box>

            {/*模态框*/}
            <SimpleModal
                maxWidth="md"
                maxHeight="md"
                title="新增采购信息"
                open={modalOpenFlag}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" onClick={addPurchase} color="primary">
                            确定
                        </Button>
                        <Button onClick={modalClose} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                {/*供应商选择*/}
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField className={classes.selectCondition}
                                   select
                                   margin="dense"
                                   label="供应商"
                                   value={supplier}
                                   onChange={(e)=>setSupplier(e.target.value)}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                                   error={validation.supplier&&validation.supplier!=''}
                                   helperText={validation.supplier}
                        >
                            <option key={-1} value={-1}>请选择</option>
                            {purchaseReducer.supplierArray.map((option) => (
                                <option key={option.id} value={option.id+'&'+option.supplier_name}>
                                    {option.supplier_name}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs>
                        <TextField className={classes.selectCondition}
                                   select
                                   margin="dense"
                                   label="运费类型"
                                   value={transferCostType}
                                   onChange={(e)=>setTransferCostType(e.target.value)}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {sysConst.TRANSFER_COST_TYPE.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            step="0.01"
                            fullWidth={true}
                            disabled={transferCostTypeFlag}
                            text='number'
                            margin="dense"
                            variant="outlined"
                            label="运费"
                            value={transferCost>9999999.99?0:transferCost<0?0:transferCost}
                            onChange={(e)=>setTransferCost(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            disabled={true}
                            fullWidth={true}
                            text='number'
                            margin="dense"
                            variant="outlined"
                            label="总价"
                            value={Number(transferCost>9999999.99?0:transferCost<0?0:transferCost)+Number(purchaseCountTotal)}
                        />
                    </Grid>
                    <Grid item xs  align="center" className={classes.addCategory}>
                        <Fab size="small" color="primary" aria-label="add" onClick={addCategoryItem}>
                            <i className="mdi mdi-plus mdi-24px" />
                        </Fab>
                    </Grid>
                </Grid>
                {/*商品选择*/}
                {purchaseItem.map((item,index)=>(
                    <Grid  container spacing={3} key={'purchaseItem-'+index}>
                        <Grid item xs>
                            <TextField className={classes.selectCondition}
                                       select
                                       margin="dense"
                                       label="商品"
                                       value={item.product}
                                       onChange={(e)=>setPurchaseItemParams(index,'product',e.target.value)}
                                       SelectProps={{
                                           native: true,
                                       }}
                                       variant="outlined"
                                       error={validation.product&&validation.product!=''}
                                       helperText={validation.product}
                            >
                                <option key={-1} value={-1}>请选择</option>
                                {purchaseReducer.productArray.map((option) => (
                                    <option key={option.id} value={option.id+'&'+option.product_name}>
                                        {option.product_name}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth={true}
                                text='number'
                                margin="dense"
                                variant="outlined"
                                label="商品单价"
                                value={item.unitCost}
                                onChange={(e)=>setPurchaseItemParams(index,'unitCost',e.target.value)}
                                error={validation.unitCost&&validation.unitCost!=''}
                                helperText={validation.unitCost}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth={true}
                                text='number'
                                margin="dense"
                                variant="outlined"
                                label="商品数量"
                                value={item.unitNumber}
                                onChange={(e)=>setPurchaseItemParams(index,'unitNumber',e.target.value)}
                                error={validation.unitNumber&&validation.unitNumber!=''}
                                helperText={validation.unitNumber}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                disabled={true}
                                text='number'
                                fullWidth={true}
                                margin="dense"
                                variant="outlined"
                                label="商品总价"
                                value={item.purchaseCount}
                                onChange={(e)=>setPurchaseItemParams(index,'purchaseCount',e.target.value)}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth={true}
                                margin="dense"
                                variant="outlined"
                                label="备注"
                                value={item.remark}
                                onChange={(e)=>setPurchaseItemParams(index,'remark',e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={1} align='center'>
                            <IconButton color="secondary" edge="start" size="small"  style={{paddingTop:'18px'}} onClick={()=>{deleteItem(index,item)}}>
                                <i className="mdi mdi-delete purple-font"> </i>
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                {/*运费*/}
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="备注"
                            value={transferRemark}
                            onChange={(e)=>setTransferRemark(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>

            {/* PDF 输出用 DIV */}
            <div id="purchaseItemId" className={classes.pdfPage} style={{marginTop: -99999}}>
                <Grid container spacing={0}>
                    <Grid item sm={12} className={classes.pdfTitle}>采购单</Grid>
                    <Grid item sm={2}><img style={{width: 120,paddingLeft:30,marginTop:15}} src="/logo120.png"  alt=""/></Grid>
                    <Grid item container sm={10} spacing={0}>
                        <Grid item sm={6}><b>采购单号：</b>{purchaseReducer.purchasePdfData.id}</Grid>
                        <Grid item sm={6}><b>操作人员：</b>{purchaseReducer.purchasePdfData.op_user}</Grid>
                        <Grid item sm={6}><b>供应商名称：</b>{purchaseReducer.purchasePdfData.supplier_name}</Grid>
                        <Grid item sm={6}><b>联系人姓名：</b>{purchaseReducer.supplierPdfArray.contact_name}</Grid>
                        <Grid item sm={6}><b>手机：</b>{purchaseReducer.supplierPdfArray.mobile}</Grid>
                        <Grid item sm={6}><b>邮箱：</b>{purchaseReducer.supplierPdfArray.email}</Grid>
                        <Grid item sm={6}><b>电话：</b>{purchaseReducer.supplierPdfArray.tel}</Grid>
                        <Grid item sm={6}><b>传真：</b>{purchaseReducer.supplierPdfArray.fax}</Grid>
                        <Grid item sm={12}><b>地址：</b>{purchaseReducer.supplierPdfArray.address}</Grid>
                        <Grid item sm={6}><b>公司抬头：</b>{purchaseReducer.supplierPdfArray.invoice_title}</Grid>
                        <Grid item sm={6}><b>开户行：</b>{purchaseReducer.supplierPdfArray.invoice_bank}</Grid>
                        <Grid item sm={6}><b>开户行账号：</b>{purchaseReducer.supplierPdfArray.invoice_bank_ser}</Grid>
                        <Grid item sm={6}><b>开户地址：</b>{purchaseReducer.supplierPdfArray.invoice_address}</Grid>
                    </Grid>
                </Grid>

                <Grid container spacing={0} style={{paddingTop: 25}}>
                    <Grid item sm={2} className={classes.tblHeader}>商品名称</Grid>
                    <Grid item sm={2} className={classes.tblHeader}>单价</Grid>
                    <Grid item sm={2} className={classes.tblHeader}>数量</Grid>
                    <Grid item sm={2} className={classes.tblHeader}>总价</Grid>
                    <Grid item sm={4} className={classes.tblLastHeader}>备注</Grid>
                </Grid>
                {purchaseReducer.purchaseItemArray.map((row, index) => (
                    <Grid container spacing={0}>
                        <Grid item sm={2} className={classes.tblBody}>{row.product_name}</Grid>
                        <Grid item sm={2} className={classes.tblBody}>{row.unit_cost}</Grid>
                        <Grid item sm={2} className={classes.tblBody}>{row.purchase_count}</Grid>
                        <Grid item sm={2} className={classes.tblBody}>{Number(row.unit_cost*row.purchase_count)}</Grid>
                        <Grid item sm={4} className={classes.tblLastBody}>{row.remark}</Grid>
                    </Grid>
                ))}

                <Grid container spacing={0} style={{paddingTop: 35}}  align='right'>
                    <Grid item sm={8}>{commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE,purchaseReducer.purchasePdfData.transfer_cost_type)}运费:{purchaseReducer.purchasePdfData.transfer_cost}</Grid>
                    <Grid item sm={4}>总价:{purchaseReducer.purchasePdfData.total_cost}</Grid>
                </Grid>
                <Grid container spacing={0} style={{paddingTop: 35}}  align='left'>
                     <Grid item sm={12}>备注:{purchaseReducer.purchasePdfData.remark}</Grid>
                </Grid>
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
        purchaseReducer: state.PurchaseReducer,
        fromDetail: fromDetail
    }
};
const mapDispatchToProps = (dispatch) => ({
    //获取列表
    getPurchaseList: (start) => {
        dispatch(PurchaseAction.getPurchaseList(start))
    },
    //获取供应商
    getSupplierList:() =>{
        dispatch(PurchaseAction.getSupplierList())
    },
    //获取商品
    getProductList:(id) =>{
        dispatch(PurchaseAction.getProductList(id))
    },
    //添加商品
    addPurchaseInfo:(supplier,purchaseItem,transferCostType,transferCost,transferRemark) =>{
        dispatch(PurchaseAction.addPurchaseInfo(supplier,purchaseItem,transferCostType,transferCost,transferRemark))
    },
    downLoadPDF: (purchaseInfo) => {
        dispatch(PurchaseActionType.setPurchasePdfData(purchaseInfo));
        dispatch(PurchaseAction.downLoadPDF(purchaseInfo.id,purchaseInfo.supplier_name));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Purchase)