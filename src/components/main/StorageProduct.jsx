import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
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
    Select,Switch,
    Button, Fab, FormControl, InputLabel, MenuItem, makeStyles
} from "@material-ui/core";

// 引入Dialog
import {SimpleModal} from "../index";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {CommonActionType, StorageProductActionType} from "../../types";
import {Link} from "react-router-dom";

const storageProductAction = require('../../actions/main/StorageProductAction');
const commonAction = require('../../actions/layout/CommonAction');
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
                <Grid container item xs={10} spacing={3}>
                    <Grid item xs={3}>
                        <Autocomplete id="condition-storage" fullWidth
                                      options={commonReducer.storageList}
                                      getOptionLabel={(option) => option.storage_name}
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
                                      value={storageProductReducer.queryParams.storage}
                                      renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete id="condition-storage-area" fullWidth
                                      options={commonReducer.storageAreaList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.storage_area_name}
                                      onChange={(event, value) => {
                                          dispatch(StorageProductActionType.setQueryParams({name: "storageArea", value: value}));
                                      }}
                                      value={storageProductReducer.queryParams.storageArea}
                                      renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Autocomplete id="condition-supplier" fullWidth
                                      options={commonReducer.supplierList}
                                      getOptionLabel={(option) => option.supplier_name}
                                      onChange={(event, value) => {
                                          dispatch(StorageProductActionType.setQueryParams({name: "supplier", value: value}));
                                      }}
                                      value={storageProductReducer.queryParams.supplier}
                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Autocomplete id="condition-product" fullWidth
                                      options={commonReducer.productList}
                                      getOptionLabel={(option) => option.product_name}
                                      onChange={(event, value) => {
                                          dispatch(StorageProductActionType.setQueryParams({name: "product", value: value}));
                                      }}
                                      value={storageProductReducer.queryParams.product}
                                      renderInput={(params) => <TextField {...params} label="商品" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField label="采购单ID" fullWidth margin="dense" variant="outlined" type="search" value={storageProductReducer.queryParams.purchaseId}
                             onChange={(e)=>{dispatch(StorageProductActionType.setQueryParams({name: "purchaseId", value: e.target.value}))}}/>
                    </Grid>

                    <Grid item xs={3}>
                        <TextField label="仓储日期（始）" fullWidth margin="dense" variant="outlined" type="date" InputLabelProps={{ shrink: true }} pattern="yyyyMMdd"
                                   value={storageProductReducer.queryParams.startDate}
                                   onChange={(e)=>{dispatch(StorageProductActionType.setQueryParams({name: "startDate", value: e.target.value}))}}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="仓储日期（始）" fullWidth margin="dense" variant="outlined" type="date" InputLabelProps={{ shrink: true }} value={storageProductReducer.queryParams.endDate}
                                   onChange={(e)=>{dispatch(StorageProductActionType.setQueryParams({name: "endDate", value: e.target.value}))}}/>
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" aria-label="add" size="small" onClick={queryStorageProductList} style={{marginTop : 50}}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>

                {/*追加按钮*/}
                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" aria-label="add" size="small" onClick={() => {downLoadCsv()}} style={{marginTop : 50}}>
                        <i className="mdi mdi-cloud-download mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="default" className={classes.head} align="center">仓库</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">仓库分区</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">供应商</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">商品名称</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">单价</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">库存</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">仓储日期</TableCell>
                            {/*<TableCell padding="default" className={classes.head} align="center">操作</TableCell>*/}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {storageProductReducer.storageProductData.dataList.map((row) => (
                            <TableRow className={classes.tableRow} key={'table-row-' + row.id} style={{paddingTop:15}}>
                                <TableCell padding="" align="center">{row.storage_name}</TableCell>
                                <TableCell padding="" align="center">{row.storage_area_name}</TableCell>
                                <TableCell padding="" align="center">{row.supplier_name}</TableCell>
                                <TableCell padding="" align="center">{row.product_name}</TableCell>
                                <TableCell padding="" align="center">{row.unit_cost}</TableCell>
                                <TableCell padding="" align="center">{row.storage_count}</TableCell>
                                <TableCell padding="" align="center">{row.date_id}</TableCell>
                                {/*<TableCell padding="" align="center">*/}
                                {/*    /!* 编辑按钮 *!/*/}
                                {/*    <IconButton color="primary" edge="start">*/}
                                {/*        <Link to={{pathname: '/product_manager/' + row.id}}>*/}
                                {/*            <i className="mdi mdi-table-search mdi-24px"/>*/}
                                {/*        </Link>*/}
                                {/*    </IconButton>*/}
                                {/*</TableCell>*/}
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
                            <TableCell colSpan={9} style={{textAlign: 'center'}}>暂无数据</TableCell>
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
    },
    saveModalData: () => {
        // dispatch(storageProductAction.saveModalData({
        //     category, categorySub, brand, brandModel, productName, productSName, productAddress, productSerial, unitName, price, standardType, remark
        // }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageProduct)
