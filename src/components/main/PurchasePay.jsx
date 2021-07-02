import React, {useEffect} from 'react';
import {connect} from 'react-redux';
// 引入material-ui基础组件
import {
    Box,
    Grid,
    IconButton,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    Paper,
    Typography,
    Divider,
    Select,
    Button, Fab, FormControl, InputLabel, MenuItem,makeStyles
} from "@material-ui/core";

// 引入Dialog
import {SimpleModal} from "../index";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";

const commonAction = require('../../actions/layout/CommonAction');
const purchasePayAction = require('../../actions/main/PurchasePayAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;

const useStyles = makeStyles((theme) => ({
    root:{
        marginBottom: 20,
    },
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableRow: {
        padding: 5,
    },
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'
    }
}));

function PurchasePay(props) {
    const {purchasePayReducer, commonReducer, confirmPay} = props;
    const classes = useStyles();

    /** 检索条件 */
    // 采购日期
    const [planDateStart, setPlanDateStart] = React.useState('');
    const [planDateEnd, setPlanDateEnd] = React.useState('');
    // 支付日期
    const [paymentDateStart, setPaymentDateStart] = React.useState('');
    const [paymentDateEnd, setPaymentDateEnd] = React.useState('');
    // 采购单号
    const [purchaseId, setPurchaseId] = React.useState('');
    // 供应商
    const [supplier, setSupplier] = React.useState(null);
    // 支付状态
    const [paymentStatus, setPaymentStatus] = React.useState(null);

    useEffect(() => {
        props.getBaseSelectList();
        let dataStart = props.purchasePayReducer.purchasePayData.start;
        props.getPurchasePayList(planDateStart,planDateEnd,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus,dataStart);
    }, []);

    // 查询列表
    const queryPurchasePayList = () => {
        // 默认第一页
        props.getPurchasePayList(planDateStart,planDateEnd,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus, 0);
    };

    // 上一页
    const getPrePage = () => {
        props.getPurchasePayList(planDateStart,planDateEnd,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus
            , props.purchasePayReducer.purchasePayData.start - (props.purchasePayReducer.purchasePayData.size - 1));
    };

    // 下一页
    const getNextPage = () => {
        props.getPurchasePayList(planDateStart,planDateEnd,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus
            , props.purchasePayReducer.purchasePayData.start + (props.purchasePayReducer.purchasePayData.size - 1));
    };

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 关闭模态
    const closeModal = () => {
        setModalOpen(false);
    };

    //初始添加模态框值
    const initModal =(purchaseId) =>{
        props.getPurchaseItem(purchaseId);
        // 设定模态打开
        setModalOpen(true);
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>采购付款</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={11} spacing={3}>
                    <Grid item xs={3}>
                        <TextField label="采购日期（始）" fullWidth margin="dense" variant="outlined" type="date" InputLabelProps={{ shrink: true }}
                                   value={planDateStart}
                                   onChange={(e)=>{setPlanDateStart(e.target.value)}}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="采购日期（始）" fullWidth margin="dense" variant="outlined" type="date" InputLabelProps={{ shrink: true }}
                                   value={planDateEnd}
                                   onChange={(e)=>{setPlanDateEnd(e.target.value)}}/>
                    </Grid>

                    <Grid item xs={3}>
                        <TextField label="支付日期（始）" fullWidth margin="dense" variant="outlined" type="date" InputLabelProps={{ shrink: true }}
                                   value={paymentDateStart}
                                   onChange={(e)=>{setPaymentDateStart(e.target.value)}}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="支付日期（始）" fullWidth margin="dense" variant="outlined" type="date" InputLabelProps={{ shrink: true }}
                                   value={paymentDateEnd}
                                   onChange={(e)=>{setPaymentDateEnd(e.target.value)}}/>
                    </Grid>

                    <Grid item xs={3}>
                        <TextField label="采购单ID" fullWidth margin="dense" variant="outlined" type="search" value={purchaseId}
                                   onChange={(e)=>{setPurchaseId(e.target.value)}}/>
                    </Grid>

                    <Grid item xs={3}>
                        <Autocomplete id="condition-supplier" fullWidth
                                      options={commonReducer.supplierList}
                                      getOptionLabel={(option) => option.supplier_name}
                                      onChange={(event, value) => {
                                          setSupplier(value)
                                      }}
                                      value={supplier}
                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="device-type-select-outlined-label">支付状态</InputLabel>
                            <Select
                                label="支付状态"
                                labelId="device-type-select-outlined-label"
                                id="device-type-select-outlined"
                                value={paymentStatus}
                                onChange={(event, value) => {
                                    setPaymentStatus(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.PAYMENT_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" aria-label="add" size="small" onClick={queryPurchasePayList} style={{marginTop : 50}}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="default" className={classes.head} align="center">采购单号</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">供应商</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">采购日期</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">运费类型</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">运费</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">商品成本</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">总成本</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">支付日期</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">支付状态</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchasePayReducer.purchasePayData.dataList.map((row) => (
                            <TableRow className={classes.tableRow} key={'table-row-' + row.id}>
                                <TableCell padding="none" align="center">{row.id}</TableCell>
                                <TableCell padding="none" align="center">{row.supplier_name}</TableCell>
                                <TableCell padding="none" align="center">{row.plan_date_id}</TableCell>
                                <TableCell padding="none" align="center">{commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE, row.transfer_cost_type)}</TableCell>
                                <TableCell padding="none" align="center">{row.transfer_cost}</TableCell>
                                <TableCell padding="none" align="center">{row.product_cost}</TableCell>
                                <TableCell padding="none" align="center">{row.total_cost}</TableCell>
                                <TableCell padding="none" align="center">{row.payment_date_id}</TableCell>
                                <TableCell padding="none" align="center">{commonUtil.getJsonValue(sysConst.PAYMENT_STATUS, row.payment_status)}</TableCell>
                                <TableCell padding="none" align="center">
                                    {/* 支付状态 */}
                                    {row.payment_status==1 &&
                                    <IconButton color="primary" edge="start"
                                                onClick={() => {confirmPay(row.id,planDateStart,planDateEnd,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus)}}>
                                        <i className="mdi mdi-bitcoin mdi-24px"/>
                                    </IconButton>}
                                    {row.payment_status!=1 &&
                                    <IconButton color="default" edge="start" disabled>
                                        <i className="mdi mdi-check-circle-outline mdi-24px"/>
                                    </IconButton>}

                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" onClick={() => {initModal(row.id)}}>
                                        <i className="mdi mdi-table-search mdi-24px"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {purchasePayReducer.purchasePayData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={10} style={{textAlign: 'center'}}>暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {purchasePayReducer.purchasePayData.start > 0 && purchasePayReducer.purchasePayData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}} onClick={getPrePage}>上一页</Button>}
                {purchasePayReducer.purchasePayData.dataSize >= purchasePayReducer.purchasePayData.size &&
                <Button variant="contained" color="primary" onClick={getNextPage}>下一页</Button>}
            </Box>

            {/* 模态：新增/修改 */}
            <SimpleModal
                maxWidth={'sm'}
                title="采购支付详情"
                open={modalOpen}
                onClose={closeModal}
                showFooter={true}
                footer={<Button variant="contained" onClick={closeModal}>关闭</Button>}
            >
                <Grid container spacing={2}>
                    <Grid item sm={12}><Typography color="primary">采购单号：{purchasePayReducer.modalData.purchase_id}</Typography></Grid>
                    <Grid item sm={6}>供应商：{purchasePayReducer.modalData.supplier_name}</Grid>
                    <Grid item sm={6}>商品：{purchasePayReducer.modalData.product_name}</Grid>
                    <Grid item xs={6}>单价：{purchasePayReducer.modalData.unit_cost}</Grid>
                    <Grid item xs={6}>采购数量：{purchasePayReducer.modalData.purchase_count}</Grid>
                    <Grid item xs={6}>总成本：{purchasePayReducer.modalData.total_cost}</Grid>
                    <Grid item xs={12}>备注：{purchasePayReducer.modalData.remark}</Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        purchasePayReducer: state.PurchasePayReducer,
        commonReducer: state.CommonReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getSupplierList());
    },
    getPurchasePayList: (planDateStart,planDateEnd,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus,dataStart) => {
        dispatch(purchasePayAction.getPurchasePayList({planDateStart,planDateEnd,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus,dataStart}))
    },
    confirmPay: (id, planDateStart,planDateEnd,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus) => {
        Swal.fire({
            title: "确定支付该订单？",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(purchasePayAction.confirmPayment(id, {planDateStart,planDateEnd,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus}));
            }
        });
    },
    getPurchaseItem: (purchaseId) => {
        dispatch(purchasePayAction.getPurchaseItem(purchaseId))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchasePay)
