import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {
    Box,
    Button,
    Divider,
    Fab, FormControl,
    Grid,
    IconButton, InputLabel,
    makeStyles, MenuItem,
    Paper, Select,
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
import {CommonActionType, StorageProductActionType} from "../../types";
import {SimpleModal} from "../index";

const storageProductAction = require('../../actions/main/StorageProductAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead
}));

function StorageProduct(props) {
    const {storageProductReducer, commonReducer, downLoadCsv} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        // 清空reducer
        let queryParams = {
            storage: null,
            storageArea: null,
            supplier: null,
            product: null,
            oldFlag: '',
            purchaseId: '',
            startDate: '',
            endDate: ''
        };
        dispatch(StorageProductActionType.setDefaultQueryParams(queryParams));
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        dispatch(storageProductAction.getStorageProductList(storageProductReducer.storageProductData.start))
    }, []);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 模态数据
    const [modalData, setModalData] = React.useState({storageProduct:{}});
    // 模态校验
    const [validation,setValidation] = useState({});

    // 关闭模态
    const closeModal = () => {
        if (storageProductReducer.queryParams.storage != null) {
            dispatch(commonAction.getStorageAreaList(storageProductReducer.queryParams.storage.id));
        } else {
            dispatch(CommonActionType.setStorageAreaList([]));
        }
        setModalOpen(false);
    };

    //初始添加模态框值
    const initModal =(item) =>{
        // 清空仓库分区
        dispatch(CommonActionType.setStorageAreaList([]));
        // 清check内容
        setValidation({});
        // 页面属性
        setModalData({storageProduct:item,storage:null,storageArea:null,count:'',remark:''});
        // 设定模态打开
        setModalOpen(true);
    };

    const validate = ()=>{
        const validateObj ={};
        if (!modalData.storage) {
            validateObj.storage ='请选择仓库';
        }
        if (!modalData.storageArea) {
            validateObj.storageArea ='请选择仓库分区';
        }
        if (!modalData.count || modalData.count<1) {
            validateObj.count ='请输入移库数量';
        }else if(modalData.count > modalData.storageProduct.storage_count){
            validateObj.count ='移库数量不能大于库存数量';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const submitModal= ()=>{
        const errorCount = validate();
        if(errorCount===0){
            setModalOpen(false);
            dispatch(storageProductAction.moveProduct(modalData));
            if (storageProductReducer.queryParams.storage != null) {
                dispatch(commonAction.getStorageAreaList(storageProductReducer.queryParams.storage.id));
            } else {
                dispatch(CommonActionType.setStorageAreaList([]));
            }
        }
    };

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
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>是否全新</InputLabel>
                            <Select label="是否全新"
                                    value={storageProductReducer.queryParams.oldFlag}
                                    onChange={(e, value) => {
                                        dispatch(StorageProductActionType.setQueryParams({name: "oldFlag", value: e.target.value}));
                                    }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.OLD_FLAG.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="采购单ID" fullWidth margin="dense" variant="outlined" type="number" value={storageProductReducer.queryParams.purchaseId}
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
                    <Fab color="primary" size="small" onClick={()=>{dispatch(storageProductAction.getStorageProductList(0))}} style={{marginTop : 30}}>
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
                            <TableCell className={classes.tableHead} align="center">全新</TableCell>
                            <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                            <TableCell className={classes.tableHead} align="center">单价</TableCell>
                            <TableCell className={classes.tableHead} align="center">库存</TableCell>
                            <TableCell className={classes.tableHead} align="center">仓储日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {storageProductReducer.storageProductData.dataList.map((row) => (
                            <TableRow key={'table-row-' + row.id}>
                                <TableCell align="center">{row.storage_name}</TableCell>
                                <TableCell align="center">{row.storage_area_name}</TableCell>
                                <TableCell align="center">{row.supplier_name}</TableCell>
                                <TableCell align="center">{row.product_name}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.OLD_FLAG, row.old_flag)}</TableCell>
                                <TableCell align="center">{row.purchase_id}</TableCell>
                                <TableCell align="center">{row.unit_cost}</TableCell>
                                <TableCell align="center">{row.storage_count}</TableCell>
                                <TableCell align="center">{row.date_id}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" size="small" edge="start" onClick={() => {initModal(row)}}>
                                        <i className="mdi mdi-truck"/>
                                    </IconButton>
                                </TableCell>
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
                            <TableCell colSpan={10} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {storageProductReducer.storageProductData.start > 0 && storageProductReducer.storageProductData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={()=>{dispatch(storageProductAction.getStorageProductList(storageProductReducer.storageProductData.start-(storageProductReducer.storageProductData.size-1)))}}>上一页</Button>}
                {storageProductReducer.storageProductData.dataSize >= storageProductReducer.storageProductData.size &&
                <Button variant="contained" color="primary"
                        onClick={()=>{dispatch(storageProductAction.getStorageProductList(storageProductReducer.storageProductData.start+(storageProductReducer.storageProductData.size-1)))}}>下一页</Button>}
            </Box>

            <SimpleModal maxWidth={'sm'}
                         title="移库"
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
                    <Grid item sm={6}>仓库：{modalData.storageProduct.storage_name}</Grid>
                    <Grid item sm={6}>仓库分区：{modalData.storageProduct.storage_area_name}</Grid>
                    <Grid item sm={6}>商品：{modalData.storageProduct.product_name}</Grid>
                    <Grid item sm={6}>库存：{modalData.storageProduct.storage_count}</Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.storageList}
                                      getOptionLabel={(option) => option.storage_name}
                                      value={modalData.storage}
                                      onChange={(event, value) => {
                                          setModalData({...modalData, storage: value, storageArea: null});
                                          // 仓库有选择时，取得仓库分区， 否则清空
                                          if (value != null) {
                                              dispatch(commonAction.getStorageAreaList(value.id));
                                          } else {
                                              dispatch(CommonActionType.setStorageAreaList([]));
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                          error={validation.storage&&validation.storage!=''}
                                                                          helperText={validation.storage}
                                      />}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.storageAreaList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.storage_area_name}
                                      value={modalData.storageArea}
                                      onChange={(event, value) => {
                                          setModalData({...modalData, storageArea: value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"
                                                                          error={validation.storageArea&&validation.storageArea!=''}
                                                                          helperText={validation.storageArea}
                                      />}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="数量" fullWidth margin="dense" variant="outlined" type="number" value={modalData.count}
                                   onChange={(e)=>{setModalData({...modalData, count: e.target.value});}}
                                   error={validation.count&&validation.count!=''}
                                   helperText={validation.count}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={modalData.remark}
                                   onChange={(e) => {setModalData({...modalData, remark: e.target.value})}}/>
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        storageProductReducer: state.StorageProductReducer,
        commonReducer: state.CommonReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getStorageList());
        dispatch(commonAction.getSupplierList());
        dispatch(commonAction.getProductList(null));
    },
    downLoadCsv: () => {
        dispatch(storageProductAction.downLoadCsv())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageProduct)
