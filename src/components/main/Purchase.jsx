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
    TableBody, IconButton,
} from "@material-ui/core";
import Fab from '@material-ui/core/Fab';
import {withStyles,makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
const PurchaseAction = require('../../actions/main/PurchaseAction');
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
    const {purchaseReducer,getSupplierList,getCategoryList,getCategorySubList,getPurchaseArray} = props;

    const classes = useStyles();


    //添加采购信息
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [supplier, setSupplier] = useState("");
    const [category, setCategory] = useState("");
    const [categorySub, setCategorySub] = useState("");
    const [unitCost, setUnitCost] = useState("");
    const [unitNumber, setUnitNumber] = useState("");
    const [count, setCount] = useState("");
    const [remark, setRemark] = useState("");
    const [validation,setValidation] = useState({});
    const [purchaseItem,setPurchaseItem]  = useState([{categoryId:0,categorySubId:0,productId:0,remark:""}])
    const item=[];
    const setPurchaseItemParams = (index,name,value)=>{

    }

    //查询
    const [pageNumber,setPageNumber] = useState(0);
    const [supplierName, setSupplierName] = useState("-1");
    const [planDateId, setPlanDateId] = useState("");



    useEffect(()=>{
        getSupplierList();
        getCategoryList();
        getCategorySubList(category);
    },[category,categorySub,unitCost,unitNumber,count,remark]);


    //初始添加模态框值
    const modalOpenPurchase =() =>{
        setModalOpenFlag(true);
        getCategorySubList(purchaseReducer.categoryArray[0].id+'&')
        setSupplier('');
    }
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
    };

    const addCategoryItem =()=>{

        AddCategoryItem()
    }

    const AddCategoryItem=()=> {

        return (
            <Grid  container spacing={3}>
                <Grid item xs>
                    <TextField className={classes.selectCondition}
                               select
                               margin="dense"
                               label="商品"
                               value={category}
                               onChange={(e)=>setCategory(e.target.value)}
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
                               label="二级商品"
                               value={categorySub}
                               onChange={(e)=>setCategorySub(e.target.value)}
                               SelectProps={{
                                   native: true,
                               }}
                               variant="outlined"
                    >
                        <option key={1} value={-1}>请选择</option>
                        {purchaseReducer.categorySubArray.map((option) => (
                            <option key={option.id} value={option.id+'&'+option.category_sub_name}>
                                {option.category_sub_name}
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
                        value={unitCost}
                        onChange={(e)=>setUnitCost(e.target.value)}
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        fullWidth={true}
                        text='number'
                        margin="dense"
                        variant="outlined"
                        label="商品数量"
                        value={unitNumber}
                        onChange={(e)=>setUnitNumber(e.target.value)}
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
                        value={unitNumber*unitCost}
                        onChange={(e)=>setCount(e.target.value)}
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        fullWidth={true}
                        margin="dense"
                        variant="outlined"
                        label="备注"
                        value={remark}
                        onChange={(e)=>setPurchaseItemParams(0,'remark',e.target.value)}
                    />
                </Grid>
            </Grid>
        );
    }


    //验证()
    const validate = ()=>{
      /*  const validateObj ={}
            if (!supplier) {
                validateObj.supplier ='请';
            }
            if (!adminUsername) {
                validateObj.adminUsername ='请输入用户姓名';
            }
            if (!password) {
                validateObj.password ='请输入密码';
            }else if (password.length <6) {
                validateObj.password ='请输入大于6位的密码';
            }
        setValidation(validateObj);
        return Object.keys(validateObj).length*/
    }

    //添加采购
    const addPurchase= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            setModalOpenFlag(false);
        }
    }


    //查询
    useEffect(()=>{
        getPurchaseArray();
    },[])



    //上一页
    const getPreSupplierList = () => {
        setPageNumber(pageNumber- (props.supplierReducer.size-1));
        props.setSupplierQueryObj({
            supplierId:'',
            planDateId :'',
            finishDateId:'',
            start :pageNumber- (props.supplierReducer.size-1)})
            getPurchaseArray();
    };

    //下一页
    const getNextSupplierList = () => {
        setPageNumber(pageNumber+ (props.supplierReducer.size-1));
        props.setSupplierQueryObj({
            supplierId:'',
            planDateId :'',
            finishDateId:'',
            start :pageNumber+ (props.supplierReducer.size-1)})
            getPurchaseArray();
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

                    <Grid item xs={6} sm={3}>
                        <TextField className={classes.selectCondition}
                            select
                            margin="dense"
                            variant="outlined"
                            label="供应商名称"
                                   SelectProps={{
                                       native: true,
                                   }}
                            value={supplierName}
                            onChange={(e)=>setSupplierName(e.target.value)}
                        >
                            <option key={-1} value={-1}> 请选择</option>
                            {purchaseReducer.supplierArray.map((option) => (
                                <option key={option.id} value={option.id+'&'+option.supplier_name}>
                                    {option.supplier_name}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                   {/* 计划开始时间*/}
                    <Grid item  xs={6} sm={3}>
                        <Paper className={classes.paper} elevation={3}>
                            <TextField label="年份" fullWidth={true} margin={'normal'} type="date"
                                       value={planDateId} onChange={setPlanDateId}/>
                        </Paper>
                    </Grid>

                    {/*完成时间*/}

                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1}>
                    <Fab size="small" color="primary" aria-label="add" onClick={() => {getPurchaseArray()}}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
                {/*添加按钮*/}
                <Grid item xs={1}>
                    <Fab size="small" color="primary" aria-label="add" onClick={()=>{modalOpenPurchase()}}>
                        <i className="mdi mdi-plus mdi-24px" />
                    </Fab>
                </Grid>
                {/*主体*/}
                <Grid container spacing={2}>
                    <TableContainer component={Paper} style={{marginTop:40}}>
                        <Table  size={'small'} aria-label="a dense table">
                            <TableHead >
                                <TableRow style={{height:60}}>
                                    <StyledTableCell align="center">供应商</StyledTableCell>
                                    <StyledTableCell align="center">开始时间</StyledTableCell>
                                    <StyledTableCell align="center">结束时间</StyledTableCell>
                                    <StyledTableCell align="center">仓储状态</StyledTableCell>
                                    <StyledTableCell align="center">支付状态</StyledTableCell>
                                    <StyledTableCell align="center">支付时间</StyledTableCell>
                                    <StyledTableCell align="center">运费</StyledTableCell>
                                    <StyledTableCell align="center">商品价格</StyledTableCell>
                                    <StyledTableCell align="center">总格</StyledTableCell>
                                    <StyledTableCell align="center">操作</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchaseReducer.purchaseArray.length > 0 &&purchaseReducer.purchaseArray.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center" >{row.supplier_name}</TableCell>
                                        <TableCell align="center" >{row.plan_date_id}</TableCell>
                                        <TableCell align="center" >{row.finish_date_id}</TableCell>
                                        <TableCell align="center" >{row.storage_status}</TableCell>
                                        <TableCell align="center" >{row.payment_status}</TableCell>
                                        <TableCell align="center" >{row.payment_date_id}</TableCell>
                                        <TableCell align="center" >{row.transfer_cost}</TableCell>
                                        <TableCell align="center" >{row.product_cost}</TableCell>
                                        <TableCell align="center" >{row.total_cost}</TableCell>
                                      {/*  <TableCell align="center">{commonUtil.getJsonValue(sysConst.USE_FLAG, row.status)}</TableCell>
                                        <TableCell align="center">{commonUtil.getJsonValue(sysConst.USE_FLAG, row.status)}</TableCell>*/}
                                        <TableCell align="center">
                                            {/* 删除按钮 */}
                                            <IconButton color="primary" edge="start">
                                                <Link to={{pathname: '/supplier/' + row.supplier_id}}>
                                                    <i className="mdi mdi-table-search purple-font margin-left10"> </i>
                                                </Link>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>))}
                                {purchaseReducer.purchaseArray.length === 0 &&
                                <TableRow style={{height:60}}> <TableCell align="center" colSpan="9">暂无数据</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>

                        {purchaseReducer.dataSize >=purchaseReducer.size &&
                        <Button className={classes.button} variant="contained" color="primary"  onClick={getNextSupplierList}>
                            下一页
                        </Button>}
                        {purchaseReducer.queryObj.start > 0 &&purchaseReducer.dataSize > 0 &&
                        <Button className={classes.button} variant="contained" color="primary" onClick={getPreSupplierList}>
                            上一页
                        </Button>}

                    </TableContainer>
                </Grid>
            </Grid>

            {/*模态框*/}
            <SimpleModal
                maxWidth="md"
                title= "新增采购信息"
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
                        >
                            {purchaseReducer.supplierArray.map((option) => (
                                <option key={option.id} value={option.id+'&'+option.supplier_name}>
                                    {option.supplier_name}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={1} className={classes.addCategory}>
                        <Fab size="small" color="primary" aria-label="add" onClick={addCategoryItem()}>
                            <i className="mdi mdi-plus mdi-24px" />
                        </Fab>
                    </Grid>
                </Grid>
                {/*商品选择*/}
                <AddCategoryItem></AddCategoryItem>
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
    //获取列表
    getPurchaseArray: () => {
        dispatch(PurchaseAction.getPurchaseArray())
    },
    //获取供应商
    getSupplierList:() =>{
        dispatch(PurchaseAction.getSupplierList())
    },
    //获取商品
    getCategoryList:() =>{
        dispatch(PurchaseAction.getCategoryList())
    },
    //获取二级商品
    getCategorySubList:(id) =>{
        dispatch(PurchaseAction.getCategorySubList(id))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Purchase)