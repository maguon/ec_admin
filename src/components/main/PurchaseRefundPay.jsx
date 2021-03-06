import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import Swal from "sweetalert2";
// 引入material-ui基础组件
import {
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from "@material-ui/pickers";
// 引入Dialog
import {SimpleModal} from "../index";

const commonAction = require('../../actions/layout/CommonAction');
const purchaseRefundPayAction = require('../../actions/main/PurchaseRefundPayAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead
}));

function PurchaseRefundPay(props) {
    const {purchaseRefundPayReducer, commonReducer, confirmPay} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    /** 检索条件 */
    // 退款日期
    const [paymentDateStart, setPaymentDateStart] = React.useState(null);
    const [paymentDateEnd, setPaymentDateEnd] = React.useState(null);
    // 采购单号
    const [purchaseId, setPurchaseId] = React.useState('');
    // 供应商
    const [supplier, setSupplier] = React.useState(null);
    // 支付状态
    const [paymentStatus, setPaymentStatus] = React.useState('');

    useEffect(() => {
        props.getBaseSelectList();
        let dataStart = props.purchaseRefundPayReducer.purchaseRefundData.start;
        props.getPurchaseRefundList(paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus,dataStart);
        dispatch(purchaseRefundPayAction.getPurchaseRefundPayStat({paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus}))
    }, []);

    // 查询列表
    const queryPurchaseRefundList = () => {
        dispatch(purchaseRefundPayAction.getPurchaseRefundPayStat({paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus}))
        // 默认第一页
        props.getPurchaseRefundList(paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus, 0);
    };

    // 上一页
    const getPrePage = () => {
        props.getPurchaseRefundList(paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus
            , props.purchaseRefundPayReducer.purchaseRefundData.start - (props.purchaseRefundPayReducer.purchaseRefundData.size - 1));
    };

    // 下一页
    const getNextPage = () => {
        props.getPurchaseRefundList(paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus
            , props.purchaseRefundPayReducer.purchaseRefundData.start + (props.purchaseRefundPayReducer.purchaseRefundData.size - 1));
    };

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 关闭模态
    const closeModal = () => {
        setModalOpen(false);
    };

    // 采购信息
    const [purchaseRefundData, setPurchaseRefundData] = React.useState({});

    //初始添加模态框值
    const initModal =(purchaseRefundData) =>{
        setPurchaseRefundData(purchaseRefundData);
        // props.getPurchaseItem(purchaseRefundData.id);
        props.getSupplierInfo(purchaseRefundData.supplier_id);
        // 设定模态打开
        setModalOpen(true);
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>采购退款</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={11} spacing={1}>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="退款日期（始）"
                                    value={paymentDateStart}
                                    onChange={(date)=>{
                                        setPaymentDateStart(date);
                                    }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="退款日期（终）"
                                    value={paymentDateEnd}
                                    onChange={(date)=>{
                                        setPaymentDateEnd(date);
                                    }}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField label="采购单ID" fullWidth margin="dense" variant="outlined" type="number" value={purchaseId}
                                   onChange={(e)=>{setPurchaseId(e.target.value)}}/>
                    </Grid>

                    <Grid item xs={3}>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} id="condition-supplier" fullWidth
                                      options={commonReducer.supplierList}
                                      getOptionLabel={(option) => option.supplier_name}
                                      value={supplier}
                                      onChange={(event, value) => {
                                          setSupplier(value)
                                      }}
                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>退款状态</InputLabel>
                            <Select label="退款状态"
                                value={paymentStatus}
                                onChange={(event, value) => {
                                    setPaymentStatus(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.REFUND_PAYMENT_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign:'center', marginTop: 10}}>
                    <Fab color="primary" size="small" onClick={queryPurchaseRefundList}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                            <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品</TableCell>
                            <TableCell className={classes.tableHead} align="center">退款日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">运费类型</TableCell>
                            <TableCell className={classes.tableHead} align="center">运费</TableCell>
                            <TableCell className={classes.tableHead} align="center">总成本</TableCell>
                            <TableCell className={classes.tableHead} align="center">退货单价</TableCell>
                            <TableCell className={classes.tableHead} align="center">退货数量</TableCell>
                            <TableCell className={classes.tableHead} align="center">退款盈亏</TableCell>
                            <TableCell className={classes.tableHead} align="center">退款状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchaseRefundPayReducer.purchaseRefundData.dataList.map((row) => (
                            <TableRow key={'table-row-' + row.id}>
                                <TableCell align="center">{row.purchase_id}</TableCell>
                                <TableCell align="center">{row.supplier_name}</TableCell>
                                <TableCell align="center">{row.product_name}</TableCell>
                                <TableCell align="center">{row.date_id}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE, row.transfer_cost_type)}</TableCell>
                                <TableCell align="center">{row.transfer_cost}</TableCell>
                                <TableCell align="center">{row.total_cost}</TableCell>
                                <TableCell align="center">{row.refund_unit_cost}</TableCell>
                                <TableCell align="center">{row.refund_count}</TableCell>
                                <TableCell align="center">{row.refund_profile}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.REFUND_PAYMENT_STATUS, row.payment_status)}</TableCell>
                                <TableCell align="center">
                                    {/* 支付状态 */}
                                    {row.payment_status==1 &&
                                    <IconButton color="primary" edge="start" size="small"
                                                onClick={() => {confirmPay(row.id,paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus)}}>
                                        <i className="mdi mdi-bitcoin"/>
                                    </IconButton>}
                                    {row.payment_status!=1 &&
                                    <IconButton color="default" edge="start" size="small" disabled>
                                        <i className="mdi mdi-check-circle-outline"/>
                                    </IconButton>}

                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" size="small" onClick={() => {initModal(row)}}>
                                        <i className="mdi mdi-table-search"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}


                           {purchaseRefundPayReducer.purchaseRefundData.dataList.length !== 0&&
                        <TableRow>
                            <TableCell colSpan={8}/>
                            <TableCell colSpan={1}
                                       align="center">总退款单：{purchaseRefundPayReducer.purchaseRefundPayStatData.count}</TableCell>
                            <TableCell colSpan={1}
                                       align="center">总退货数量：{purchaseRefundPayReducer.purchaseRefundPayStatData.refund_count}</TableCell>
                            <TableCell colSpan={1}
                                       align="center">退款总价：{purchaseRefundPayReducer.purchaseRefundPayStatData.total_cost}</TableCell>
                            <TableCell colSpan={1} align="right"
                                       style={{paddingRight: 40}}>总退款盈亏：{purchaseRefundPayReducer.purchaseRefundPayStatData.refund_profile}</TableCell>
                        </TableRow>}


                        {purchaseRefundPayReducer.purchaseRefundData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={12} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {purchaseRefundPayReducer.purchaseRefundData.start > 0 && purchaseRefundPayReducer.purchaseRefundData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}} onClick={getPrePage}>上一页</Button>}
                {purchaseRefundPayReducer.purchaseRefundData.dataSize >= purchaseRefundPayReducer.purchaseRefundData.size &&
                <Button variant="contained" color="primary" onClick={getNextPage}>下一页</Button>}
            </Box>

            <SimpleModal
                maxWidth={'md'}
                title="采购退款详情"
                open={modalOpen}
                onClose={closeModal}
                showFooter={true}
                footer={<Button variant="contained" onClick={closeModal}>关闭</Button>}
            >
                <Grid container spacing={2}>
                    <Grid item sm={3}><Typography color="primary">采购单号：{purchaseRefundData.purchase_id}</Typography></Grid>
                    <Grid item xs={9}>备注：{purchaseRefundData.remark}</Grid>
                    <Grid item xs={6}>商品：{purchaseRefundData.product_name}</Grid>
                    <Grid item xs={3}>退款盈亏：{purchaseRefundData.refund_profile}</Grid>
                    <Grid item xs={3}>退款状态：{commonUtil.getJsonValue(sysConst.REFUND_PAYMENT_STATUS, purchaseRefundData.payment_status)}</Grid>
                    <Grid item sm={6}>供应商：{purchaseRefundData.supplier_name}</Grid>
                    <Grid item sm={3}>联系人：{commonReducer.supplierInfo.contact_name}</Grid>
                    <Grid item sm={3}>手机：{commonReducer.supplierInfo.mobile}</Grid>
                    <Grid item sm={6}>地址：{commonReducer.supplierInfo.address}</Grid>
                    <Grid item sm={3}>传真：{commonReducer.supplierInfo.fax}</Grid>
                    <Grid item sm={3}>电话：{commonReducer.supplierInfo.tel}</Grid>
                    <Grid item sm={6}>邮箱：{commonReducer.supplierInfo.email}</Grid>
                    <Grid item sm={6}>公司抬头：{commonReducer.supplierInfo.invoice_title}</Grid>
                    <Grid item sm={12}>开户地址：{commonReducer.supplierInfo.invoice_address}</Grid>
                    <Grid item sm={6}>开户行：{commonReducer.supplierInfo.invoice_bank}</Grid>
                    <Grid item sm={6}>开户账号：{commonReducer.supplierInfo.invoice_bank_ser}</Grid>
                </Grid>

            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        purchaseRefundPayReducer: state.PurchaseRefundPayReducer,
        commonReducer: state.CommonReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getSupplierList());
    },
    getSupplierInfo: (supplierId) => {
        dispatch(commonAction.getSupplierInfo(supplierId));
    },
    getPurchaseRefundList: (paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus,dataStart) => {
        dispatch(purchaseRefundPayAction.getPurchaseRefundList({paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus,dataStart}))
    },
    confirmPay: (id, paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus) => {
        Swal.fire({
            title: "确定完成该退款？",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(purchaseRefundPayAction.confirmPayment(id, {paymentDateStart,paymentDateEnd,purchaseId,supplier,paymentStatus}));
            }
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseRefundPay)
