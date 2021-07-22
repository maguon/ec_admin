import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
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
import {DatePicker} from '@material-ui/pickers';
// 引入Dialog
import {SimpleModal} from "../index";
import {CommonActionType, OrderActionType} from "../../types";

const orderAction = require('../../actions/main/OrderAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
    // pdfPage:customTheme.pdfPage,
    // pdfTitle:customTheme.pdfTitle,
    // tblHeader:customTheme.tblHeader,
    // tblLastHeader:customTheme.tblLastHeader,
    // tblBody:customTheme.tblBody,
    // tblLastBody:customTheme.tblLastBody
}));

function Order(props) {
    const {orderReducer, commonReducer, downLoadCsv, downLoadPDF, fromDetail} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        // 详情页面 返回 保留reducer，否则，清空
        if (!fromDetail) {
            let queryParams = {
                dateIdStart: '',
                dateIdEnd: '',
                checkStatus: null,
                status: null
            };
            dispatch(OrderActionType.setQueryParams(queryParams));
        }
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        props.getStorageCheckList(props.orderReducer.orderData.start);
    }, []);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 模态数据
    const [storageChkInfo, setStorageChkInfo] = React.useState({});

    // 关闭模态
    const closeModal = () => {
        setModalOpen(false);
    };

    //初始添加模态框值
    const initModal =() =>{
        // 清空仓库分区
        props.setStorageAreaList([]);
        // 清空商品子分类
        props.setCategorySubList([]);
        // 清空品牌型号
        props.setBrandModelList([]);
        setStorageChkInfo({
            ...storageChkInfo,
            storage: null,
            storageArea: null,
            category: null,
            categorySub: null,
            brand: null,
            brandModel: null,
            supplier: null,
            remark: ''
        });
        // 设定模态打开
        setModalOpen(true);
    };

    const submitModal= ()=>{
        let desc = "";
        if (storageChkInfo.storage != null) {
            desc = desc + "仓库：" + storageChkInfo.storage.storage_name + ",";
        }
        if (storageChkInfo.storageArea != null) {
            desc = desc + "仓库分区：" + storageChkInfo.storageArea.storage_area_name + ",";
        }
        if (storageChkInfo.category != null) {
            desc = desc + "商品分类：" + storageChkInfo.category.category_name + ",";
        }
        if (storageChkInfo.categorySub != null) {
            desc = desc + "商品子分类：" + storageChkInfo.categorySub.category_sub_name + ",";
        }
        if (storageChkInfo.brand != null) {
            desc = desc + "品牌：" + storageChkInfo.brand.brand_name + ",";
        }
        if (storageChkInfo.brandModel != null) {
            desc = desc + "品牌型号：" + storageChkInfo.brandModel.brand_model_name + ",";
        }
        if (storageChkInfo.supplier != null) {
            desc = desc + "供应商：" + storageChkInfo.supplier.supplier_name + ",";
        }
        if(desc.length > 0) {
            desc = desc.substr(0, desc.length-1);
        } else {
            desc = "全部";
        }
        dispatch(orderAction.saveModalData({...storageChkInfo,desc: desc}));
        setModalOpen(false);
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>仓库盘点</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={1}>
                    <Grid item xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="盘点日期（始）"
                                    value={orderReducer.queryParams.dateIdStart=="" ? null : orderReducer.queryParams.dateIdStart}
                                    onChange={(date)=>{
                                        dispatch(OrderActionType.setQueryParam({name: "dateIdStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="盘点日期（终）"
                                    value={orderReducer.queryParams.dateIdEnd=="" ? null : orderReducer.queryParams.dateIdEnd}
                                    onChange={(date)=>{
                                        dispatch(OrderActionType.setQueryParam({name: "dateIdEnd", value: date}))
                                    }}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>盘点状态</InputLabel>
                            <Select label="盘点状态"
                                value={orderReducer.queryParams.checkStatus}
                                onChange={(e, value) => {
                                    dispatch(OrderActionType.setQueryParam({name: "checkStatus", value: e.target.value}));
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.STORAGE_CHECK_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>完成状态</InputLabel>
                            <Select label="完成状态"
                                value={orderReducer.queryParams.status}
                                onChange={(e, value) => {
                                    dispatch(OrderActionType.setQueryParam({name: "status", value: e.target.value}));
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.STORAGE_RET_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" size="small" onClick={()=>{dispatch(orderAction.getStorageCheckList(0))}}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>

                {/*追加按钮*/}
                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" size="small" onClick={() => {initModal()}}>
                        <i className="mdi mdi-plus mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">盘点日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作人员</TableCell>
                            <TableCell className={classes.tableHead} align="center">计划盘点数</TableCell>
                            <TableCell className={classes.tableHead} align="center">盘点完成数</TableCell>
                            <TableCell className={classes.tableHead} align="center">盘点状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">完成状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderReducer.orderData.dataList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">{row.date_id == 0 ? '' : row.date_id}</TableCell>
                                <TableCell align="center">{row.real_name}</TableCell>
                                <TableCell align="center">{row.plan_check_count}</TableCell>
                                <TableCell align="center">{row.checked_count}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.STORAGE_CHECK_STATUS, row.check_status)}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.STORAGE_RET_STATUS, row.status)}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" edge="start" size="small" onClick={()=>{downLoadCsv(row.id)}}>
                                        <i className="mdi mdi-file-excel"/>
                                    </IconButton>
                                    <IconButton color="primary" edge="start" size="small" onClick={()=>{downLoadPDF(row)}}>
                                        <i className="mdi mdi-file-pdf"/>
                                    </IconButton>
                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" size="small">
                                        <Link to={{pathname: '/storage_check/' + row.id}}>
                                            <i className="mdi mdi-table-search"/>
                                        </Link>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {orderReducer.orderData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={7} align="center">暂无数据</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {orderReducer.orderData.start > 0 && orderReducer.orderData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={()=>{dispatch(orderAction.getStorageCheckList(orderReducer.orderData.start-(orderReducer.orderData.size-1)))}}>上一页</Button>}
                {orderReducer.orderData.dataSize >= orderReducer.orderData.size &&
                <Button variant="contained" color="primary"
                        onClick={()=>{dispatch(orderAction.getStorageCheckList(orderReducer.orderData.start+(orderReducer.orderData.size-1)))}}>下一页</Button>}
            </Box>

            <SimpleModal
                maxWidth={'sm'}
                title="新增仓库盘点"
                open={modalOpen}
                onClose={closeModal}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" color="primary" onClick={submitModal}>确定</Button>
                        <Button variant="contained" onClick={closeModal}>关闭</Button>
                    </>
                }
            >
                <Grid container spacing={2}>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.storageList}
                                      getOptionLabel={(option) => option.storage_name}
                                      value={storageChkInfo.storage}
                                      onChange={(event, value) => {
                                          setStorageChkInfo({...storageChkInfo,storage:value, storageArea:null});
                                          // 仓库有选择时，取得仓库分区， 否则清空
                                          if (value != null) {
                                              dispatch(commonAction.getStorageAreaList(value.id));
                                          } else {
                                              props.setStorageAreaList([]);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.storageAreaList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.storage_area_name}
                                      value={storageChkInfo.storageArea}
                                      onChange={(event, value) => {
                                          setStorageChkInfo({...storageChkInfo,storageArea:value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.categoryList}
                                      getOptionLabel={(option) => option.category_name}
                                      value={storageChkInfo.category}
                                      onChange={(event, value) => {
                                          setStorageChkInfo({...storageChkInfo,category:value,categorySub:null});
                                          // 商品分类有选择时，取得商品子分类， 否则清空
                                          if (value != null) {
                                              dispatch(commonAction.getCategorySubList(value.id));
                                          } else {
                                              props.setCategorySubList([]);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.categorySubList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.category_sub_name}
                                      value={storageChkInfo.categorySub}
                                      onChange={(event, value) => {
                                          setStorageChkInfo({...storageChkInfo,categorySub:value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.brandList}
                                      getOptionLabel={(option) => option.brand_name}
                                      value={storageChkInfo.brand}
                                      onChange={(event, value) => {
                                          setStorageChkInfo({...storageChkInfo,brand:value,brandModel:null});
                                          // 品牌有选择时，取得品牌型号， 否则清空
                                          if (value != null) {
                                              dispatch(commonAction.getBrandModelList(value.id));
                                          } else {
                                              props.setBrandModelList([]);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.brandModelList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.brand_model_name}
                                      value={storageChkInfo.brandModel}
                                      onChange={(event, value) => {
                                          setStorageChkInfo({...storageChkInfo,brandModel:value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.supplierList}
                                      getOptionLabel={(option) => option.supplier_name}
                                      value={storageChkInfo.supplier}
                                      onChange={(event, value) => {
                                          setStorageChkInfo({...storageChkInfo,supplier:value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={storageChkInfo.remark}
                                   onChange={(e) => {
                                       setStorageChkInfo({...storageChkInfo,remark:e.target.value});
                                   }}
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
        orderReducer: state.OrderReducer,
        commonReducer: state.CommonReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getStorageList());
        dispatch(commonAction.getCategoryList());
        dispatch(commonAction.getBrandList());
        dispatch(commonAction.getSupplierList());
    },
    setStorageAreaList: (value) => {
        dispatch(CommonActionType.setStorageAreaList(value));
    },
    setCategorySubList: (value) => {
        dispatch(CommonActionType.setCategorySubList(value));
    },
    setBrandModelList: (value) => {
        dispatch(CommonActionType.setBrandModelList(value));
    },

    getStorageCheckList: (dataStart) => {
        dispatch(orderAction.getStorageCheckList(dataStart))
    },
    downLoadCsv: (storageCheckId) => {
        dispatch(orderAction.downLoadCsv(storageCheckId))
    },
    downLoadPDF: (storageCheckInfo) => {
        dispatch(orderAction.downLoadPDF(storageCheckInfo));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Order)
