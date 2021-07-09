import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {DatePicker} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
    Box,
    Grid,
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
    Button, Fab, makeStyles
} from "@material-ui/core";
import {CommonActionType, StorageProductActionType} from "../../types";

const storageProductAction = require('../../actions/main/StorageProductAction');
const commonAction = require('../../actions/layout/CommonAction');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root:{
        marginBottom: 20,
        minWidth: 800
    },
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead
}));

function StorageProduct(props) {
    const {storageProductReducer, commonReducer, fromDetail, downLoadCsv} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    // 查询列表，默认第一页
    const queryStorageProductList = () => {
        props.getStorageProductList(0);
    };

    // 上一页
    const getPrePage = () => {
        props.getStorageProductList(props.storageProductReducer.storageProductData.start - (props.storageProductReducer.storageProductData.size - 1));
    };

    // 下一页
    const getNextPage = () => {
        props.getStorageProductList(props.storageProductReducer.storageProductData.start + (props.storageProductReducer.storageProductData.size - 1));
    };

    useEffect(() => {
        // 详情页面 返回 保留reducer，否则，清空
        if (!fromDetail) {
            let queryParams = {
                storage: null,
                storageArea: null,
                supplier: null,
                product: null,
                purchaseId: '',
                startDate: '',
                endDate: ''
            };
            dispatch(StorageProductActionType.setDefaultQueryParams(queryParams));
        }
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        props.getStorageProductList(props.storageProductReducer.storageProductData.start);
    }, []);

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>库存商品</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={1}>
                    <Grid item xs={3}>
                        <Autocomplete fullWidth
                                      options={commonReducer.storageList}
                                      getOptionLabel={(option) => option.storage_name}
                                      value={storageProductReducer.queryParams.storage}
                                      onChange={(event, value) => {
                                          // 选择时 将当前选中值 赋值 reducer
                                          dispatch(StorageProductActionType.setQueryParams({name: "storage", value: value}));
                                          // 清空 子分类
                                          dispatch(StorageProductActionType.setQueryParams({name: "storageArea", value: null}));
                                          // 根据选择内容，刷新 子分类 列表
                                          if (value != null) {
                                              dispatch(commonAction.getStorageAreaList(value.id));
                                          } else {
                                              dispatch(CommonActionType.setStorageAreaList([]));
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete fullWidth
                                      options={commonReducer.storageAreaList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.storage_area_name}
                                      value={storageProductReducer.queryParams.storageArea}
                                      onChange={(event, value) => {
                                          dispatch(StorageProductActionType.setQueryParams({name: "storageArea", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Autocomplete fullWidth
                                      options={commonReducer.supplierList}
                                      getOptionLabel={(option) => option.supplier_name}
                                      value={storageProductReducer.queryParams.supplier}
                                      onChange={(event, value) => {
                                          dispatch(StorageProductActionType.setQueryParams({name: "supplier", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Autocomplete fullWidth
                                      options={commonReducer.productList}
                                      getOptionLabel={(option) => option.product_name}
                                      value={storageProductReducer.queryParams.product}
                                      onChange={(event, value) => {
                                          dispatch(StorageProductActionType.setQueryParams({name: "product", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField label="采购单ID" fullWidth margin="dense" variant="outlined" type="search" value={storageProductReducer.queryParams.purchaseId}
                             onChange={(e)=>{dispatch(StorageProductActionType.setQueryParams({name: "purchaseId", value: e.target.value}))}}/>
                    </Grid>

                    <Grid item xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="仓储日期（始）"
                                    value={storageProductReducer.queryParams.startDate == '' ? null : storageProductReducer.queryParams.startDate}
                                    onChange={(date)=>{
                                        dispatch(StorageProductActionType.setQueryParams({name: "startDate", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="仓储日期（终）"
                                    value={storageProductReducer.queryParams.endDate == '' ? null : storageProductReducer.queryParams.endDate}
                                    onChange={(date)=>{
                                        dispatch(StorageProductActionType.setQueryParams({name: "endDate", value: date}))
                                    }}
                        />
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" size="small" onClick={queryStorageProductList} style={{marginTop : 30}}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>

                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" size="small" onClick={() => {downLoadCsv()}} style={{marginTop : 30}}>
                        <i className="mdi mdi-cloud-download mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">仓库</TableCell>
                            <TableCell className={classes.tableHead} align="center">仓库分区</TableCell>
                            <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品名称</TableCell>
                            <TableCell className={classes.tableHead} align="center">单价</TableCell>
                            <TableCell className={classes.tableHead} align="center">库存</TableCell>
                            <TableCell className={classes.tableHead} align="center">仓储日期</TableCell>
                            {/*<TableCell className={classes.tableHead} align="center">操作</TableCell>*/}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {storageProductReducer.storageProductData.dataList.map((row) => (
                            <TableRow key={'table-row-' + row.id}>
                                <TableCell align="center">{row.storage_name}</TableCell>
                                <TableCell align="center">{row.storage_area_name}</TableCell>
                                <TableCell align="center">{row.supplier_name}</TableCell>
                                <TableCell align="center">{row.product_name}</TableCell>
                                <TableCell align="center">{row.unit_cost}</TableCell>
                                <TableCell align="center">{row.storage_count}</TableCell>
                                <TableCell align="center">{row.date_id}</TableCell>
                            </TableRow>
                        ))}
                        {storageProductReducer.storageProductData.dataList.length > 0 &&
                        <TableRow>
                            <TableCell rowSpan={2} />
                            <TableCell rowSpan={2} />
                            <TableCell rowSpan={2} />
                            <TableCell colSpan={3} align="center">库存总量：{storageProductReducer.storageProductData.statistics.totalCnt}</TableCell>
                            <TableCell colSpan={3} align="right" style={{paddingRight:40}}>库存总成本：{storageProductReducer.storageProductData.statistics.totalCost}</TableCell>
                        </TableRow>}
                        {storageProductReducer.storageProductData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={7} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {storageProductReducer.storageProductData.start > 0 && storageProductReducer.storageProductData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}} onClick={getPrePage}>上一页</Button>}
                {storageProductReducer.storageProductData.dataSize >= storageProductReducer.storageProductData.size &&
                <Button variant="contained" color="primary" onClick={getNextPage}>下一页</Button>}
            </Box>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        fromDetail = true;
    }
    return {
        storageProductReducer: state.StorageProductReducer,
        commonReducer: state.CommonReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getStorageList());
        dispatch(commonAction.getSupplierList());
        dispatch(commonAction.getProductList(null));
    },
    getStorageProductList: (dataStart) => {
        dispatch(storageProductAction.getStorageProductList({dataStart}))
    },
    downLoadCsv: () => {
        dispatch(storageProductAction.downLoadCsv())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageProduct)
