import React, {useEffect, useRef, useState} from 'react';
import {connect,useDispatch} from 'react-redux';
import {Link, useParams} from "react-router-dom";
import Swal from "sweetalert2";
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
    TableCell,
    FormHelperText, Divider,
} from "@material-ui/core";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import {SimpleModal} from "../index";
import {PurchaseDetailActionType} from '../../types';
import {CSVReader} from "react-papaparse";
const PurchaseDetailAction = require('../../actions/main/PurchaseDetailAction');
const PurchaseAction =require('../../actions/main/PurchaseAction');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        width: `calc(100% - 50px)`,
        paddingLeft: 30
    },
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
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
    const {purchaseDetailReducer,getPurchaseDetailInfo,getPurchaseItemDetailInfo,updateStatus,updatePurchaseDetailInfo,
        updatePurchaseDetailItemInfo,getPurchaseRefundDetailInfo,getStorageProductArray,addRefundDetailItem,
        downLoadPDF} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();
    const [transferCostTypeFlag, setTransferCostTypeFlag] = useState(true);
    const [addTransferCostTypeFlag, setAddTransferCostTypeFlag] = useState(true);
    const [purchaseCountTotal, setPurchaseCountTotal] = useState(0);
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [modalUniqueOpenFlag, setUniqueModalOpenFlag] = useState(false);
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
    const [uniqueValidation,setUniqueValidation] = useState({});
    const [addValidation,setAddValidation] = useState({});
    const [productUnique,setProductUnique] = useState('');
    const [inputFile,setInputFile] =useState([]);
    const [allInfo,setAllInfo] =useState(null);
    const [errInfo,setErrInfo] =useState([]);
    const [fileName,setFileName]=useState('');
    const [dataBox,setDataBox]=useState(false);
    const [successData,setSuccessData]=useState(false);
    const [purchaseItemId,setPurchaseItemId]=useState('');
    const [productId,setProductId]=useState('');
    const [productName,setProductName]=useState('');
    const [count,setCount]=useState('');
    const buttonRef = useRef();
    useEffect(()=>{
        getPurchaseDetailInfo(id);
        getPurchaseItemDetailInfo(id);
    },[]);
    useEffect(()=>{
        setAddStorageTypeItem(1)

        for(let item of purchaseDetailReducer.storageProductArray){
            setAddStorageTypeItem(1)
            if(item.product_name==addProduct.product_name){
              return   setAddStorageType(1)
            }else {
                       setAddStorageType(0);
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
    const uniqueValidate = ()=>{
        const validateObj ={};
        if (!productUnique) {
            validateObj.productUnique ='请输入编码';
        }
        if(productUnique.length>40){
            validateObj.productUnique ='编码长度过长';
        }
        setUniqueValidation(validateObj);
        return Object.keys(validateObj).length
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
            purchaseDetailReducer.purchaseRefundDetailInfo=[];
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
    const handleOnBrandFileLoad = (file,fileName)=>{
        setAllInfo(file);
        setInputFile([]);
        var ext = fileName&&fileName.name.slice(fileName.name.lastIndexOf(".")+1).toLowerCase();
        if ("csv" != ext) {
            Swal.fire("文件类型错误");
            return false;
        } else {
            for (let i = 0; i < file.length; i++) {
                for(let j = 0;j<file[i].data.length; j++) {
                    if(file[i].data[j].length>0&&file[i].data[j].length<=40){
                        inputFile.push(file[i].data[j]);
                    }else if(file[i].data[j].length>40){
                        errInfo.push(file[i].data[j]);
                    }
                }
            }
            if(count - purchaseDetailReducer.uniqueList.length>= inputFile.length){
                if(errInfo.length==0){
                    setDataBox(false);
                    setSuccessData(true);
                }else {
                    setDataBox(true);
                    setSuccessData(false);
                }
            }else {
                Swal.fire("编码数量应小于等于商品数量");
            }
        }
    }
    const openUniqueModel =(id,pro,name,count)=>{
        setPurchaseItemId(id);
        setProductId(pro);
        setProductName(name);
        setCount(count);
        dispatch(PurchaseDetailAction.getUniqueList(id))
        setDataBox(false);
        setUniqueModalOpenFlag(true);
    }
    const closeUniqueModel =()=>{
        setUniqueModalOpenFlag(false);
    }
    const addUniqueItem =()=>{
        const errorCount = uniqueValidate();
        if(errorCount==0){
            setInputFile([productUnique]);
            dispatch(PurchaseDetailAction.addUniqueInfo({purchaseItemId,productId,id,productName,inputFile}))
            setProductUnique('');
        }
    }
    const addUniqueAll=(e)=>{
        if (buttonRef.current) {
            buttonRef.current.open(e)
        }
    }
    const uploadCsv =()=>{
        dispatch(PurchaseDetailAction.addUniqueInfo({purchaseItemId,productId,id,productName,inputFile}))
        setDataBox(false);
        setSuccessData(false);
    }
    const deleteRel=(purchaseItem,product,id)=>{
        dispatch(PurchaseDetailAction.deleteRel({purchaseItem,product,id}))
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
                            <Grid item xs={2}>
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
                            <Grid item xs={2}>
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
                            <Grid item xs={2}>
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
                            <Grid item xs={2}>
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
                                           value={purchaseDetailReducer.purchaseDetailInfo.transfer_cost>9999999.99?0:purchaseDetailReducer.purchaseDetailInfo.transfer_cost<0?0:purchaseDetailReducer.purchaseDetailInfo.transfer_cost}
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
                        </Grid>
                        {/*商品选择*/}
                        {purchaseDetailReducer.purchaseDetailItemInfo.map((item,index)=>(
                            <Grid  container spacing={3} key={index}>
                                <Grid item xs={2}>
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
                                <Grid item xs={2}>
                                    <TextField type="number" label="商品单价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                               value={item.unit_cost>9999999.99?0:item.unit_cost<0?0:item.unit_cost}
                                               onChange={(e) => {
                                                   dispatch(PurchaseDetailActionType.setPurchaseDetailItemInfo({index,name: "unit_cost",value: e.target.value}))
                                               }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField type="number" label="商品数量" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                               value={item.purchase_count}
                                               onChange={(e) => {
                                                   dispatch(PurchaseDetailActionType.setPurchaseDetailItemInfo({index,name: "purchase_count",value: e.target.value}))
                                               }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField type="number" disabled={true} label="商品总价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                               value={Number(item.unit_cost>9999999.99?0:item.unit_cost<0?0:item.unit_cost)*Number(item.purchase_count)}
                                    />
                                </Grid>
                                <Grid item xs={3}>
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
                                <Grid item xs={1}  align="center"  style={{display:purchaseDetailReducer.purchaseDetailInfo.status==3?'none':'block',marginTop:'14px'}}>
                                    <i className="mdi mdi-rename-box mdi-24px"  style={{color:'#3f51b5'}} onClick={() => {openUniqueModel(item.id,item.product_id,item.product_name,item.purchase_count )}}/>
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
                                <IconButton color="primary" edge="start" onClick={()=>{downLoadPDF(purchaseDetailReducer.purchaseDetailInfo,purchaseDetailReducer.purchaseDetailItemInfo,purchaseDetailReducer.purchaseDetailInfo.supplier_name)}}>
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
                                <Button variant="contained" color="secondary"  onClick={() => {updateStatus(id,7)}}>完成</Button>
                            </Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value='2'>
                        <Grid item xs align="right">
                            <Fab color="primary" aria-label="add" size="small" onClick={()=>{handleAddOpen()}}>退</Fab>
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
                                            <TableRow key={'table-row-' + row.id} style={{paddingTop:15}}>
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
                                            <StyledTableCell align="center">运费方式</StyledTableCell>
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
                                   value={addTransferCost>9999999.99?0:addTransferCost<0?0:addTransferCost}
                                   onChange={(e) => {
                                       setAddTransferCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField label="总价" fullWidth={true} disabled={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(addUnitCost>9999999.99?0:addUnitCost<0?0:addUnitCost*addPurchaseCount>9999999.99?0:addPurchaseCount<0?0:addPurchaseCount)-Number(addTransferCost>9999999.99?0:addTransferCost<0?0:addTransferCost)}
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
                                   value={addUnitCost>9999999.99?0:addUnitCost<0?0:addUnitCost}
                                   onChange={(e) => {
                                       setAddUnitCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="退货数量" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={addPurchaseCount>9999999.99?0:addPurchaseCount<0?0:addPurchaseCount}
                                   onChange={(e) => {
                                       setAddPurchaseCount(e.target.value)
                                   }}
                                   error={validation.addPurchaseCount && validation.addPurchaseCount!=''}
                                   helperText={validation.addPurchaseCount}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" disabled={true} label="退货总价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(addPurchaseCount>9999999.99?0:addPurchaseCount<0?0:addPurchaseCount)*Number(addUnitCost>9999999.99?0:addUnitCost<0?0:addUnitCost)}
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
                                   value={addTransferCost>9999999.99?0:addTransferCost<0?0:addTransferCost}
                                   onChange={(e) => {
                                       setAddTransferCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField label="总价" fullWidth={true} disabled={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(addUnitCost>9999999.99?0:addUnitCost<0?0:addUnitCost*addPurchaseCount>9999999.99?0:addPurchaseCount<0?0:addPurchaseCount)-Number(addTransferCost>9999999.99?0:addTransferCost<0?0:addTransferCost)}
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
                                   value={addUnitCost>9999999.99?0:addUnitCost<0?0:addUnitCost}
                                   onChange={(e) => {
                                       setAddUnitCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="退货数量" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={addPurchaseCount>9999999.99?0:addPurchaseCount<0?0:addPurchaseCount}
                                   onChange={(e) => {
                                       setAddPurchaseCount(e.target.value)
                                   }}
                                   error={addValidation.addPurchaseCount && addValidation.addPurchaseCount!=''}
                                   helperText={addValidation.addPurchaseCount}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" disabled={true} label="退货总价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(addPurchaseCount>9999999.99?0:addPurchaseCount<0?0:addPurchaseCount)*Number(addUnitCost>9999999.99?0:addUnitCost<0?0:addUnitCost)}
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

            <SimpleModal
                title= "编码信息"
                open={modalUniqueOpenFlag}
                onClose={closeUniqueModel}
                showFooter={true}
                footer={
                    <>
                        <Button onClick={closeUniqueModel} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            type='text'
                            margin="dense"
                           /* inputProps={{
                                maxLength: 40,
                            }}*/
                            variant="outlined"
                            value={productUnique}
                            onChange={(e)=>setProductUnique(e.target.value)}
                            error={uniqueValidation.productUnique && uniqueValidation.productUnique!=''}
                            helperText={uniqueValidation.productUnique}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton color="primary" edge="start"  size="medium" style={{marginTop:5}} disabled={count<=purchaseDetailReducer.uniqueList.length}
                                    onClick={() => {addUniqueItem()}}>
                            <i className="mdi mdi-plus mdi-24px"/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <CSVReader
                            ref={buttonRef}
                            noClick
                            noDrag
                            noProgressBar
                            onFileLoad={handleOnBrandFileLoad}
                        >
                            {( {file} ) => {
                               /* setInputFile(file);*/
                                return (
                                    <aside>
                                        <IconButton color="primary" edge="start"  size="medium" style={{marginTop:5}}
                                                    onClick={addUniqueAll} disabled={count<=purchaseDetailReducer.uniqueList.length}>
                                            <i className="mdi mdi-upload mdi-24px"/>
                                        </IconButton>
                                        <TextField  value={file? file.name:''} style={{display:'none'}}
                                                    onChange={(e,value)=>setFileName(value)} />
                                    </aside>
                                )}}
                        </CSVReader>
                    </Grid>
                </Grid>
                <div style={{display:dataBox?'block':'none'}}>
                    <p  xs={12} align='center' style={{padding: "20px",background:'#f50057',color:'white',fontSize:'18px'}}>错误数据<span>{errInfo.length}</span>条，请修改后重新上传</p>
                    <TableContainer component={Paper}>
                        <Table  size={'small'} aria-label="a dense table">
                            <TableHead >
                                <TableRow style={{height:50}}>
                                    <TableCell className={classes.head} align="center">序号</TableCell>
                                    <TableCell className={classes.head} align="center">编码</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {errInfo.map((item,index)=>(
                                    <TableRow key={'csv-'+index}>
                                        <TableCell align="center" >{index+1}</TableCell>
                                        <TableCell align="center" >{item}</TableCell>
                                    </TableRow>

                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                {/*上传校验*/}
                <div style={{display:successData?'block':'none'}}>
                    <p align='center'>
                        <Button variant="contained"  color="primary" onClick={uploadCsv} >
                            导入数据库
                        </Button>
                    </p>

                </div>
                <Grid container spacing={1}>
                    <TableContainer component={Paper} style={{marginTop:20}}>
                        <Table  size='small' aria-label="a dense table">
                            <TableBody>
                                {purchaseDetailReducer.uniqueList.length > 0 &&purchaseDetailReducer.uniqueList.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="left" >{row.unique_id}</TableCell>
                                        <TableCell align="right" >
                                            <IconButton color="secondary" size="small" edge="start" onClick={() => {deleteRel(row.purchase_item_id,row.product_id,row.id)}}
                                                        disabled={row.status!==0} >
                                                <i className="mdi mdi-delete"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>))}
                                {purchaseDetailReducer.uniqueList.length === 0 &&
                                <TableRow style={{height:60}}><TableCell align="center" colSpan="3">暂无数据</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
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
    getStorageProductArray:(id)=>{
        dispatch(PurchaseDetailAction.getStorageProductArray(id))
    },
    addRefundDetailItem:(id,item,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addTransferRemark,addStorageType)=>{
        dispatch(PurchaseDetailAction.addRefundDetailItem(id,item,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addTransferRemark,addStorageType))
    },
    downLoadPDF: (purchaseDetailInfo,purchaseDetailItemInfo,name) => {
        dispatch(PurchaseAction.downLoadPDF(purchaseDetailInfo,purchaseDetailItemInfo,name))
    },
    getUniqueList:(id)=>{
        dispatch(PurchaseDetailAction.getUniqueList(id))
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDetail)