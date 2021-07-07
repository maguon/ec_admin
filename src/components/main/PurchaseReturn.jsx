import React, {useEffect,useState}from 'react';
import {connect} from 'react-redux';
import {SimpleModal} from '../index';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Stepper,
    Step,
    StepLabel,
} from "@material-ui/core";
import Fab from '@material-ui/core/Fab';
import {withStyles,makeStyles} from "@material-ui/core/styles";
import {PurchaseReturnActionType} from '../../types';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from "@material-ui/pickers";
const PurchaseReturnAction = require('../../actions/main/PurchaseReturnAction');
const PurchaseAction = require('../../actions/main/PurchaseAction');
const commonUtil = require('../../utils/CommonUtil');
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
    addCategory:{
        marginTop:'8px'
    }
}));
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}))(TableCell);

//采购
function PurchaseReturn (props){
    const {purchaseReducer,purchaseReturnReducer,getPurchaseReturnList,getProductList,getPurchaseList,postPurchaseReturnItem,getPurchaseItem,putPurchaseReturnDetailInfo} = props;
    const classes = useStyles();
    const [pageNumber,setPageNumber] = useState(0);
    // 供应商
    const [supplier, setSupplier] = React.useState(null);
    //商品
    const [product, setProduct] = React.useState(null);
    //退款状态
    const [paymentStatus, setPaymentStatus] = React.useState('-1');
    //采购状态
    const [status, setStatus] = React.useState('-1');
    //时间
    const [dateIdStart, setDateIdStart] = React.useState('');
    const [dateIdEnd, setDateIdEnd] = React.useState('');
    //添加
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [purchaseReturnId, setPurchaseReturnId] = useState('');
    const [addTransferCostType, setAddTransferCostType] = useState(1);
    const [addTransferCost, setAddTransferCost] = useState(0);
    const [addUnitCost, setAddUnitCost] = useState(0);
    const [addPurchaseCount, setAddPurchaseCount] = useState(0);
    const [validation,setValidation] = useState({});
    const [addTransferCostTypeFlag, setAddTransferCostTypeFlag] = useState(true);
    const [activeStep, setActiveStep] = React.useState(0);
    const [addStorageType, setAddStorageType] = useState(0);
    const [addTransferRemark, setAddTransferRemark] = useState('');
    const [addProduct, setAddProduct] = useState(-1);
    const [validationStep,setValidationStep] = useState({});
    const steps = ['填写采购ID', '填写商品单价数量', '填写运费'];
    //修改
    const [modalDetailOpenFlag, setModalDetailOpenFlag] = useState(false);
    const [putTransferCostType, setPutTransferCostType] = useState(1);
    const [putTransferCost, setPutTransferCost] = useState(0);
    const [putUnitCost, setPutUnitCost] = useState(0);
    const [putPurchaseCount, setPutPurchaseCount] = useState(0);
    const [putStorageType, setPutStorageType] = useState(0);
    const [putTransferRemark, setPutTransferRemark] = useState('');
    const [putProduct, setPutProduct] = useState(-1);
    const [putSupplier, setPutSupplier] = useState(-1);
    const [putPurchaseRefundId , setPurchaseRefundId] = useState(-1);
    const [putPurchaseItemId , setPurchaseItemId] = useState(-1);
    const [putTransferCostTypeFlag, setPutTransferCostTypeFlag] = useState(true);
    useEffect(()=>{
        getProductList();
        getPurchaseList();
    },[]);
    useEffect(()=>{
        const queryObj = {
            supplierId:supplier != null ? supplier.id : '',
            productId :product != null ? product.id : '',
            paymentStatus:paymentStatus,
            status:status,
            dateIdStart:dateIdStart,
            dateIdEnd:dateIdEnd,
            start :pageNumber
        };
        props.setPurchaseReturnQueryObj(queryObj);
    },[supplier,product,paymentStatus,status,dateIdStart,dateIdEnd])
    useEffect(()=>{
        getPurchaseReturnList();
    },[]);
    useEffect(()=>{
        if(addTransferCostType==2){
            setAddTransferCostTypeFlag(false)
        }else {
            setAddTransferCostTypeFlag(true)
            setAddTransferCost(0);
        }
    },[addTransferCostType]);
    useEffect(()=>{
        if(putTransferCostType==2){
            setPutTransferCostTypeFlag(false)
        }else {
            setPutTransferCostTypeFlag(true)
            setPutTransferCost(0);
        }
    },[putTransferCostType]);
    //验证()
    const validate = ()=>{
        const validateObj ={};
        if(!purchaseReturnId){
            validateObj.purchaseReturnId='请输入采购ID';
        }else {
            let arrnew = [];
            purchaseReturnReducer.purchaseItem.forEach(e => {
                arrnew.push(e.id)
            })
            if(arrnew.includes(purchaseReturnId)){
                getPurchaseItem(purchaseReturnId);
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }else {
                validateObj.purchaseReturnId='请输入正确的采购ID';
            }
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    const validateStep = ()=> {
        const validateStepObj = {};
        if (addProduct == '-1') {
            validateStepObj.addProduct = '请输入商品';
        }
        if (addPurchaseCount < 0) {
            validateStepObj.addPurchaseCount = '请输入大于0的退货数量';
        }
        if (addUnitCost < 0) {
            validateStepObj.addUnitCost = '请输入大于0的退货单价';
        }
        setValidationStep(validateStepObj);
        return Object.keys(validateStepObj).length
    }
    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return '填写采购ID';
            case 1:
                return '填写单价数量';
            case 2:
                return '填写运费方式';
            default:
                return 'Unknown stepIndex';
        }
    }
    const handleNext = (step) => {
        if(step==0){
            validate();
        }
        if(step==1){
            const errorCount = validateStep();
            if(errorCount==0) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
        if(step==2){
           postPurchaseReturnItem(purchaseReturnId,addProduct,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addStorageType,addTransferRemark);
            setModalOpenFlag(false);
            setActiveStep(0);
        }

    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    };
    const handleReset = () => {
        setActiveStep(0);
    };
    const getPurchaseReturnArray=()=>{
        props.setPurchaseReturnQueryObj({
            supplierId:supplier != null ? supplier.id : '',
            productId :product != null ? product.id : '',
            paymentStatus:paymentStatus,
            status:status,
            dateIdStart:dateIdStart,
            dateIdEnd:dateIdEnd,
            start :0})
        getPurchaseReturnList();
        setPageNumber(0);
    }
    const modalOpenPurchaseReturn=()=>{
        setModalOpenFlag(true);
        setAddTransferCostType(1);
        setAddTransferCost(0);
        setAddUnitCost(0);
        setAddPurchaseCount(0);
        setAddStorageType(0);
        setAddTransferRemark('');
        setAddProduct(-1);
        setPurchaseReturnId('');
    }
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
        setModalDetailOpenFlag(false);
    };
    const putPurchaseReturnDetail=()=>{
        putPurchaseReturnDetailInfo(putPurchaseRefundId,putPurchaseItemId,putTransferRemark,putStorageType,putUnitCost,putPurchaseCount,putTransferCostType,putTransferCost);
        setModalDetailOpenFlag(false);
    }
    const handleOpenPurchaseReturn=(item) =>{
        setModalDetailOpenFlag(true);
        setPutSupplier(item.supplier_name);
        setPutProduct(item.product_name);
        setPutTransferRemark(item.remark);
        setPutStorageType(item.storage_type);
        setPutPurchaseCount(item.refund_count);
        setPutTransferCost(item.transfer_cost);
        setPutUnitCost(item.refund_unit_cost);
        setPutTransferCostType(item.transfer_cost_type);
        setPurchaseRefundId(item.id);
        setPurchaseItemId(item.purchase_item_id);
    }
    //上一页
    const getPrePurchaseReturnList = () => {
        setPageNumber(pageNumber- (props.purchaseReturnReducer.size-1));
        props.setPurchaseReturnQueryObj({
            supplierId:supplier != null ? supplier.id : '',
            productId :product != null ? product.id : '',
            paymentStatus:paymentStatus,
            status:status,
            dateIdStart:dateIdStart,
            dateIdEnd:dateIdEnd,
            start :pageNumber- (props.purchaseReturnReducer.size-1)})
        getPurchaseReturnList();
    };
    //下一页
    const  getNextPurchaseReturnList= () => {
        setPageNumber(pageNumber+ (props.purchaseReturnReducer.size-1));
        props.setPurchaseReturnQueryObj({
            supplierId:supplier != null ? supplier.id : '',
            productId :product != null ? product.id : '',
            paymentStatus:paymentStatus,
            status:status,
            dateIdStart:dateIdStart,
            dateIdEnd:dateIdEnd,
            start :pageNumber+ (props.purchaseReturnReducer.size-1)})
        getPurchaseReturnList();
    };
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>退货</Typography>
            <Divider light className={classes.pageDivider}/>
            {/*查询条件*/}
            <Grid container  spacing={3}>
                <Grid container item xs={10} spacing={3}>
                    {/*供应商名称*/}
                    <Grid item xs>
                        <Autocomplete id="condition-supplier" fullWidth
                                      options={purchaseReducer.supplierArray}
                                      getOptionLabel={(option) => option.supplier_name}
                                      onChange={(event, value) => {
                                          setSupplier(value)
                                      }}
                                      value={supplier}
                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*商品名称*/}
                    <Grid item xs>
                        <Autocomplete id="condition-supplier" fullWidth
                                      options={purchaseReducer.productArray}
                                      getOptionLabel={(option) => option.product_name}
                                      onChange={(event, value) => {
                                          setProduct(value)
                                      }}
                                      value={product}
                                      renderInput={(params) => <TextField {...params} label="商品名称" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*退款状态*/}
                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="status-select-outlined-label">退款状态</InputLabel>
                            <Select
                                label="退款状态"
                                labelId="status-select-outlined-label"
                                id="status-select-outlined"
                                value={paymentStatus}
                                onChange={(event, value) => {
                                    setPaymentStatus(event.target.value);
                                }}
                            >
                                <MenuItem key={-1} value='-1'>请选择</MenuItem>
                                {sysConst.PAYMENT_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {/*退货状态*/}
                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="status-select-outlined-label">退货状态</InputLabel>
                            <Select
                                label="退货状态"
                                labelId="status-select-outlined-label"
                                id="status-select-outlined"
                                value={status}
                                onChange={(event, value) => {
                                    setStatus(event.target.value);
                                }}
                            >
                                <MenuItem key={-1} value='-1'>请选择</MenuItem>
                                {sysConst.REFUND_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* 完成时间*/}
                    <Grid item xs>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成时间（始）"
                                    value={dateIdStart=="" ? null : dateIdStart}
                                    onChange={(date)=>{
                                        setDateIdStart(date)
                                    }}
                        />
                    </Grid>
                    <Grid item xs>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成时间(终)"
                                    value={dateIdEnd=="" ? null : dateIdEnd}
                                    onChange={(date)=>setDateIdEnd(date)}
                        />
                    </Grid>
                </Grid>
                {/*查询按钮*/}
                <Grid item xs={1} align="center">
                    <Fab size="small" color="primary" aria-label="add" onClick={() => {getPurchaseReturnArray()}} style={{marginTop: 10}}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
                {/*添加按钮*/}
                <Grid item xs={1} align="center">
                    <Fab size="small" color="primary" aria-label="add" onClick={()=>{modalOpenPurchaseReturn()}} style={{marginTop: 10}}>
                        <i className="mdi mdi-plus mdi-24px" />
                    </Fab>
                </Grid>
                {/*主体*/}
                <Grid container spacing={2}>
                    <TableContainer component={Paper} style={{marginTop:40}}>
                        <Table  size={'small'} aria-label="a dense table">
                            <TableHead >
                                <TableRow style={{height:60}}>
                                    <StyledTableCell align="center">ID</StyledTableCell>
                                    <StyledTableCell align="center">供应商</StyledTableCell>
                                    <StyledTableCell align="center">商品名称</StyledTableCell>
                                    <StyledTableCell align="center">退款状态</StyledTableCell>
                                    <StyledTableCell align="center">退货单价</StyledTableCell>
                                    <StyledTableCell align="center">退货数量</StyledTableCell>
                                    <StyledTableCell align="center">运费支付方式</StyledTableCell>
                                    <StyledTableCell align="center">运费</StyledTableCell>
                                    <StyledTableCell align="center">退款总价</StyledTableCell>
                                    <StyledTableCell align="center">退货盈亏</StyledTableCell>
                                    <StyledTableCell align="center">状态</StyledTableCell>
                                    <StyledTableCell align="center">退货完成时间</StyledTableCell>
                                    <StyledTableCell align="center">操作</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchaseReturnReducer.purchaseReturnArray.length > 0 &&purchaseReturnReducer.purchaseReturnArray.map((row) => (
                                    <TableRow key={'purchase-'+row.id}>
                                        <TableCell align="center" >{row.id}</TableCell>
                                        <TableCell align="center" >{row.supplier_name}</TableCell>
                                        <TableCell align="center" >{row.product_name}</TableCell>
                                        <TableCell align="center" >{commonUtil.getJsonValue(sysConst.REFUND_PAYMENT_STATUS, row.payment_status)}</TableCell>
                                        <TableCell align="center" >{row.refund_unit_cost}</TableCell>
                                        <TableCell align="center" >{row.refund_count}</TableCell>
                                        <TableCell align="center" >{commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE,row.transfer_cost_type)}</TableCell>
                                        <TableCell align="center" >{row.transfer_cost}</TableCell>
                                        <TableCell align="center" >{row.total_cost}</TableCell>
                                        <TableCell align="center" >{row.refund_profile}</TableCell>
                                        <TableCell align="center" >{commonUtil.getJsonValue(sysConst.REFUND_STATUS,row.status)}</TableCell>
                                        <TableCell align="center" >{row.date_id}</TableCell>
                                        <TableCell align="center">
                                           {/*  详情按钮*/}
                                            <IconButton color="primary" edge="start" onClick={() => {handleOpenPurchaseReturn(row);}}>
                                                <i className="mdi mdi-table-search purple-font margin-left10"> </i>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>))}
                                {purchaseReturnReducer.purchaseReturnArray.length === 0 &&
                                <TableRow style={{height:60}}><TableCell align="center" colSpan="13">暂无数据</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>

                        {purchaseReturnReducer.dataSize >=purchaseReturnReducer.size &&
                        <Button className={classes.button} variant="contained" color="primary"  onClick={getNextPurchaseReturnList}>
                            下一页
                        </Button>}
                        {purchaseReturnReducer.queryPurchaseReturnObj.start > 0 &&purchaseReturnReducer.dataSize > 0 &&
                        <Button className={classes.button} variant="contained" color="primary" onClick={getPrePurchaseReturnList}>
                            上一页
                        </Button>}

                    </TableContainer>
                </Grid>
            </Grid>

            {/* 新增退货信息*/}
            <SimpleModal
                maxWidth={'md'}
                title= "新增退货信息"
                open={modalOpenFlag}
                onClose={modalClose}
                showFooter={false}
            >

                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div align="center">
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>完成</Typography>
                            <Button onClick={handleReset}>重置</Button>
                        </div>
                    ) : (
                        <div>
                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>


                            {/*第一步添加ID*/}
                            <div style={{display:activeStep==0?'block':'none'}}>

                                <TextField fullWidth
                                           style={{margin: '20px  0px'}}
                                           margin='normal'
                                           name="purchaseReturnId"
                                           type="text"
                                           label="采购ID"
                                           variant="outlined"
                                           value={purchaseReturnId}
                                           onChange={(e) => setPurchaseReturnId(e.target.value)}
                                           error={validation.purchaseReturnId&&validation.purchaseReturnId!=''}
                                           helperText={validation.purchaseReturnId}


                                />
                            </div>
                            {/*第二步添加单价数量*/}
                            <div style={{display:activeStep==1?'block':'none',margin:'20px 0'}}>
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
                                                error={validationStep.addProduct&&validationStep.addProduct!=''&&validationStep.addProduct!='-1' }
                                            >  <MenuItem key={-1} value={-1}>请选择</MenuItem>
                                                {purchaseReturnReducer.productArray.map((item, index) => (
                                                    <MenuItem key={item.id} value={item}>{item.product_name}</MenuItem>
                                                ))}
                                            </Select>
                                            {(validationStep.addProduct&&validationStep.addProduct!=''&&validationStep.addProduct!='-1' && <FormHelperText style={{color: 'red'}}>{validationStep.addProduct}</FormHelperText>)}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField type="number" label="退货单价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                                   value={addUnitCost}
                                                   onChange={(e) => {
                                                       setAddUnitCost(e.target.value)
                                                   }}
                                                   error={validationStep.addUnitCost&&validationStep.addUnitCost!=''}
                                                   helperText={validationStep.addUnitCost}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <TextField type="number" label="退货数量" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                                   value={addPurchaseCount}
                                                   onChange={(e) => {
                                                       setAddPurchaseCount(e.target.value)
                                                   }}
                                                   error={validationStep.addPurchaseCount && validationStep.addPurchaseCount!=''}
                                                   helperText={validationStep.addPurchaseCount}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <TextField type="number" disabled={true} label="退货总价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                                   value={Number(addPurchaseCount)*Number(addUnitCost)}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            {/*第三步添加运费方式*/}
                            <div style={{display:activeStep==2?'block':'none',margin:'20px 0'}}>
                                <Grid  container spacing={3} >
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
                                </Grid>
                                <Grid  container spacing={3}>
                                    <Grid item xs>
                                        <FormControl variant="outlined" fullWidth={true} margin="dense">
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
                            </div>
                            <div>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.backButton}
                                >
                                    返回
                                </Button>
                                <Button variant="contained" color="primary"  onClick={() => {handleNext(activeStep)}}>
                                    {activeStep === steps.length - 1 ? '完成' : '下一步'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </SimpleModal>

            {/*修改退货信息*/}
            <SimpleModal
                title="修改退货信息"
                open={modalDetailOpenFlag}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" onClick={putPurchaseReturnDetail} color="primary">
                            确定
                        </Button>
                        <Button onClick={()=>{setModalDetailOpenFlag(false)}} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
                onClose={()=>{setModalDetailOpenFlag(false)}}

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
                                       value={putSupplier}

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
                                value={putTransferCostType}
                                onChange={(e)=>{
                                    setPutTransferCostType(e.target.value)
                                }}
                            >
                                {sysConst.TRANSFER_COST_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="运费" disabled={putTransferCostTypeFlag} fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={putTransferCost}
                                   onChange={(e) => {
                                       setPutTransferCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField label="总价" fullWidth={true} disabled={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(putUnitCost*putPurchaseCount)-Number(putTransferCost)}
                        />
                    </Grid>
                </Grid>
                {/*商品选择*/}
                <Grid  container spacing={3}>
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
                                       value={putProduct}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="退货单价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={putUnitCost}
                                   onChange={(e) => {
                                       setPutUnitCost(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" label="退货数量" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={putPurchaseCount}
                                   onChange={(e) => {
                                       setPutPurchaseCount(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField type="number" disabled={true} label="退货总价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(putUnitCost)*Number(putPurchaseCount)}
                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="standard-select-outlined-label" shrink>是否出库</InputLabel>
                            <Select
                                label="是否出库"
                                labelId="standard-select-outlined-label"
                                id="standard-select-outlined"
                                value={putStorageType}
                                onChange={(e)=>{
                                    setPutStorageType(e.target.value)
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
                            value={putTransferRemark}
                            onChange={(e)=>setPutTransferRemark(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
};
const mapStateToProps = (state, ownProps) => {
    return {
        purchaseReturnReducer: state.PurchaseReturnReducer,
        purchaseReducer: state.PurchaseReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    setPurchaseReturnQueryObj:(queryObj) =>{
        dispatch(PurchaseReturnActionType.setPurchaseReturnQueryObj(queryObj))
    },
    //获取列表
    getPurchaseReturnList: () => {
        dispatch(PurchaseReturnAction.getPurchaseReturnList())
    },
    getPurchaseItem: (id) => {
        dispatch(PurchaseReturnAction.getPurchaseItem(id))
    },
    //获取商品
    getProductList:() =>{
        dispatch(PurchaseAction.getProductList())
    },
    getPurchaseList:() =>{
        dispatch(PurchaseReturnAction.getPurchaseList())
    },
    postPurchaseReturnItem:(purchaseReturnId,addProduct,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addStorageType,addTransferRemark) =>{
        dispatch(PurchaseReturnAction.postPurchaseReturnItem(purchaseReturnId,addProduct,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addStorageType,addTransferRemark))
    },
    putPurchaseReturnDetailInfo:(putPurchaseRefundId,putPurchaseItemId,putTransferRemark,putStorageType,putUnitCost,putPurchaseCount,putTransferCostType,putTransferCost) =>{
        dispatch(PurchaseReturnAction.putPurchaseReturnDetailInfo(putPurchaseRefundId,putPurchaseItemId,putTransferRemark,putStorageType,putUnitCost,putPurchaseCount,putTransferCostType,putTransferCost))
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseReturn)