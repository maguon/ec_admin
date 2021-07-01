import React, {useEffect,useState}from 'react';
import {connect, useDispatch} from 'react-redux';
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
    TableBody, IconButton, FormControl, InputLabel, Select, MenuItem,
} from "@material-ui/core";
import Fab from '@material-ui/core/Fab';
import {withStyles,makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {PurchaseActionType} from '../../types';
import Autocomplete from "@material-ui/lab/Autocomplete";
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
function Purchase (props){
    const {purchaseReducer,getSupplierList,getProductList,getPurchaseList} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    //添加采购信息
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [transferCostTypeFlag, setTransferCostTypeFlag] = useState(true);
    const [supplier, setSupplier] = useState("");
    const [transferCost, setTransferCost] = useState("");
    const [transferCostType, setTransferCostType] = useState("");
    const [transferRemark, setTransferRemark] = useState("");
    const [purchaseCountTotal, setPurchaseCountTotal] = useState(0);

    //查询
    const [pageNumber,setPageNumber] = useState(0);
    const [supplierName, setSupplierName] = useState(null);
    const [planDateStart, setPlanDateStart] = useState("");
    const [planDateEnd, setPlanDateEnd] = useState("");
    const [finishDateStart, setFinishDateStart] = useState("");
    const [finishDateEnd, setFinishDateEnd] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [storageStatus, setStorageStatus] = useState(null);
    const [status, setStatus] = useState(null);


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
        const queryObj = {
            supplierId:supplierName != null ? supplierName.id : '',
            storageStatus:storageStatus,
            paymentStatus:paymentStatus,
            status:status,
            planDateStart :planDateStart,
            planDateEnd:planDateEnd,
            finishDateStart:finishDateStart,
            finishDateEnd:finishDateEnd,
            start :pageNumber
        };
        props.setPurchaseQueryObj(queryObj);
    },[supplierName,planDateStart,planDateEnd,finishDateStart,finishDateEnd])
    useEffect(()=>{
        getPurchaseList();
    },[])

    //change
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
        props.setPurchaseQueryObj({
            supplierId:supplierName != null ? supplierName.id : '',
            storageStatus:storageStatus,
            paymentStatus:paymentStatus,
            status:status,
            planDateStart :planDateStart,
            planDateEnd:planDateEnd,
            finishDateStart:finishDateStart,
            finishDateEnd:finishDateEnd,
            start :0})
        getPurchaseList();
        setPageNumber(0);
    }
    //初始添加模态框值
    const modalOpenPurchase =() =>{
        setModalOpenFlag(true);
        setSupplier('-1');
        setTransferCostType('1');
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

    //上一页
    const getPreSupplierList = () => {
        setPageNumber(pageNumber- (props.purchaseReducer.size-1));
        props.setPurchaseQueryObj({
            supplierId:supplierName != null ? supplierName.id : '',
            storageStatus:storageStatus,
            paymentStatus:paymentStatus,
            status:status,
            planDateStart :planDateStart,
            planDateEnd:planDateEnd,
            finishDateStart:finishDateStart,
            finishDateEnd:finishDateEnd,
            start :pageNumber- (props.purchaseReducer.size-1)})
            getPurchaseList();
    };

    //下一页
    const getNextSupplierList = () => {
        setPageNumber(pageNumber+ (props.purchaseReducer.size-1));
        props.setPurchaseQueryObj({
            supplierId:supplierName != null ? supplierName.id : '',
            storageStatus:storageStatus,
            paymentStatus:paymentStatus,
            status:status,
            planDateStart :planDateStart,
            planDateEnd:planDateEnd,
            finishDateStart:finishDateStart,
            finishDateEnd:finishDateEnd,
            start :pageNumber+ (props.purchaseReducer.size-1)})
            getPurchaseList();
    };

    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>采购</Typography>
            <Divider light className={classes.pageDivider}/>
            {/*查询条件*/}
            <Grid container  spacing={3}>
                <Grid container item xs={10} spacing={3}>
                    {/*供应商名称*/}
                    <Grid item xs={3}>
                        <Autocomplete id="condition-category" fullWidth={true}
                                      options={purchaseReducer.supplierArray}
                                      getOptionLabel={(option) => option.supplier_name}
                                      onChange={(event, value) => {
                                          setSupplierName(value);
                                      }}
                                      value={supplierName}
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
                                value={storageStatus}
                                onChange={(event, value) => {
                                    setStorageStatus(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.STORAGE_STATUS.map((item, index) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
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
                                value={paymentStatus}
                                onChange={(event, value) => {
                                    setPaymentStatus(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.PAYMENT_STATUS.map((item, index) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
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
                                value={status}
                                onChange={(event, value) => {
                                    setStatus(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.PURCHASE_STATUS.map((item, index) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* 计划开始时间*/}
                    <Grid item  xs={3}>
                        <TextField
                            size="small"
                            fullWidth={true}
                            variant="outlined"
                            label="开始日期(始)"
                            type="date"
                            value={planDateStart}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e)=>setPlanDateStart(e.target.value)}
                        />
                    </Grid>
                    <Grid item  xs={3}>
                        <TextField
                            size="small"
                            fullWidth={true}
                            variant="outlined"
                            label="开始日期(终)"
                            type="date"
                            defaultValue={planDateEnd}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e)=>setPlanDateEnd(e.target.value)}
                        />
                    </Grid>
                    {/*完成时间*/}
                    <Grid item  xs={3}>
                        <TextField
                            size="small"
                            fullWidth={true}
                            variant="outlined"
                            label="完成日期(始)"
                            type="date"
                            defaultValue={finishDateStart}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e)=>setFinishDateStart(e.target.value)}
                        />
                    </Grid>
                    <Grid item  xs={3}>
                        <TextField
                            size="small"
                            fullWidth={true}
                            variant="outlined"
                            label="完成日期(终)"
                            type="date"
                            defaultValue={finishDateEnd}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e)=>setFinishDateEnd(e.target.value)}
                        />
                    </Grid>
                </Grid>
                {/*查询按钮*/}
                <Grid item xs={1} align="center">
                    <Fab size="small" color="primary" aria-label="add" onClick={() => {getPurchaseArray()}} style={{marginTop: 50}}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
                {/*添加按钮*/}
                <Grid item xs={1} align="center">
                    <Fab size="small" color="primary" aria-label="add" onClick={()=>{modalOpenPurchase()}} style={{marginTop: 50}}>
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
                                    <TableRow key={row.id}>
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
                                            {/* 详情按钮 */}
                                            <IconButton color="primary" edge="start">
                                                <Link to={{pathname: '/supplier/' + row.supplier_id}}>
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

                        {purchaseReducer.dataSize >=purchaseReducer.size &&
                        <Button className={classes.button} variant="contained" color="primary"  onClick={getNextSupplierList}>
                            下一页
                        </Button>}
                        {purchaseReducer.queryPurchaseObj.start > 0 &&purchaseReducer.dataSize > 0 &&
                        <Button className={classes.button} variant="contained" color="primary" onClick={getPreSupplierList}>
                            上一页
                        </Button>}

                    </TableContainer>
                </Grid>
            </Grid>

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
                            fullWidth={true}
                            disabled={transferCostTypeFlag}
                            text='number'
                            margin="dense"
                            variant="outlined"
                            label="运费"
                            value={transferCost}
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
                            value={Number(transferCost)+Number(purchaseCountTotal)}
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
                    <Grid  container spacing={3} key={index}>
                       {/* <Grid item xs>
                            <TextField className={classes.selectCondition}
                                       select
                                       margin="dense"
                                       label="类目"
                                       value={item.category}
                                       onChange={
                                           (e)=>setPurchaseItemParams(index,'category',e.target.value)}
                                       SelectProps={{
                                           native: true,
                                       }}
                                       variant="outlined"
                            >
                                {purchaseReducer.categoryArray.map((option) => (
                                    <option key={option.id} value={option.id+'&'+option.category_name}>
                                        {option.category_name}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs>
                            <TextField className={classes.selectCondition}
                                       select
                                       margin="dense"
                                       label="二级类目"
                                       value={item.categorySub}
                                       onChange={(e)=>setPurchaseItemParams(index,'categorySub',e.target.value)}
                                       SelectProps={{
                                           native: true,
                                       }}
                                       error={validation.categorySub&&validation.categorySub!=''}
                                       helperText={validation.categorySub}
                                       variant="outlined"
                            >
                                <option key={1} value={-1}>请选择</option>
                                {item.categorySubArray==null?'':item.productArray.map((option) => (
                                    <option key={option.id} value={option.id+'&'+option.category_sub_name}>
                                        {option.category_sub_name}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>*/}
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
        </div>
    )

}
const mapStateToProps = (state, ownProps) => {
    return {
        purchaseReducer: state.PurchaseReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    setPurchaseQueryObj:(queryObj) =>{
        dispatch(PurchaseActionType.setPurchaseQueryObj(queryObj))
    },
    //获取列表
    getPurchaseList: () => {
        dispatch(PurchaseAction.getPurchaseList())
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
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(Purchase)