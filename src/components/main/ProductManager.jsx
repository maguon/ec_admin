import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
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
    Switch,
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
// 引入Dialog
import {SimpleModal} from "../index";
import {CommonActionType, ProductManagerActionType, PurchaseActionType} from "../../types";

const productManagerAction = require('../../actions/main/ProductManagerAction');
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

function ProductManager(props) {
    const {productManagerReducer, commonReducer, changeStatus, fromDetail} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!fromDetail) {
            let queryParams = {
                category: null,
                categorySub: null,
                brand: null,
                brandModel: null,
                productId: null,
                standardType: '',
                status: ''
            };
            dispatch(ProductManagerActionType.setQueryParams(queryParams));
        }

        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        dispatch(productManagerAction.getProductList(productManagerReducer.productData.start))
    }, []);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 模态数据
    const [modalData, setModalData] = React.useState({});
    // 模态校验
    const [validation,setValidation] = useState({});

    // 关闭模态
    const closeModal = () => {
        if (productManagerReducer.queryParams.category != null) {
            dispatch(commonAction.getCategorySubList(productManagerReducer.queryParams.category.id));
        } else {
            dispatch(CommonActionType.setCategorySubList([]));
        }
        if (productManagerReducer.queryParams.brand != null) {
            dispatch(commonAction.getBrandModelList(productManagerReducer.queryParams.brand.id));
        } else {
            dispatch(CommonActionType.setBrandModelList([]));
        }
        setModalOpen(false);
    };

    //初始添加模态框值
    const initModal =() =>{
        // 清空check内容
        setValidation({});
        // 清空商品子分类
        dispatch(CommonActionType.setCategorySubList([]));
        // 清空品牌型号
        dispatch(CommonActionType.setBrandModelList([]));
        setModalData({
            ...modalData,
            // 商品分类 *
            category: null,
            // 商品子分类 *
            categorySub: null,
            // 品牌 *
            brand: null,
            // 品牌型号 *
            brandModel: null,
            // 商品名称 *
            productName: '',
            // 商品别名
            productSName: '',
            // 产地
            productAddress: '',
            // 序列号
            productSerial: '',
            // 单位
            unitName: '',
            // 标准类型 *
            standardType: 1,

            // 最小库存 *
            storageMin: '',
            // 最大库存 *
            storageMax: '',
            // 定价方式 *
            priceType: 1,
            // 固定售价 *
            fixedPrice: 0,
            // 比率 *
            priceRaiseRatio: 1,
            // 加价 *
            priceRaiseValue: 0,
            // 当前采购价 *
            lastPurchasePrice: '',

            // 备注
            remark: '',
        });
        // 设定模态打开
        setModalOpen(true);
    };

    const validate = ()=>{
        const validateObj ={};
        if (!modalData.category) {
            validateObj.category ='请选择商品分类';
        }
        if (!modalData.categorySub) {
            validateObj.categorySub ='请选择商品子分类';
        }
        if (!modalData.brand) {
            validateObj.brand ='请选择品牌';
        }
        if (!modalData.brandModel) {
            validateObj.brandModel ='请选择品牌型号';
        }
        if (!modalData.productName) {
            validateObj.productName ='请输入商品名称';
        }
        if (!modalData.storageMin) {
            validateObj.storageMin ='请输入最小库存';
        } else if (!(/^\d+$/.test(modalData.storageMin))) {
            validateObj.storageMin ='请输入大于等于0的整数';
        }

        if (!modalData.storageMax) {
            validateObj.storageMax ='请输入最大库存';
        } else if (!(/^\d+$/.test(modalData.storageMax))) {
            validateObj.storageMax ='请输入大于等于0的整数';
        }
        // 定价方式
        switch (modalData.priceType) {
            case sysConst.PRICE_TYPE[0].value:
                if (!modalData.fixedPrice && modalData.fixedPrice !== 0) {
                    validateObj.fixedPrice ='请输入售价';
                }
                break;
            case sysConst.PRICE_TYPE[1].value:
                if (!modalData.priceRaiseRatio) {
                    validateObj.priceRaiseRatio ='请输入比率';
                } else if (!(/^\d+(\.\d{1,2})?$/.test(modalData.priceRaiseRatio))) {
                    validateObj.priceRaiseRatio ='请输入大于等于0的浮点数（最多2位小数）';
                }
                break;
            case sysConst.PRICE_TYPE[2].value:
                if (!modalData.priceRaiseValue && modalData.priceRaiseValue !== 0) {
                    validateObj.priceRaiseValue ='请输入加价';
                }
                break;
            default:
                break;
        }
        if (!modalData.lastPurchasePrice) {
            validateObj.lastPurchasePrice ='请输入当前采购价';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const submitModal= ()=>{
        const errorCount = validate();
        if(errorCount===0){
            dispatch(productManagerAction.saveModalData(modalData));
            setModalOpen(false);
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>商品</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={1}>
                    <Grid item xs>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.categoryList}
                                      getOptionLabel={(option) => option.category_name}
                                      value={productManagerReducer.queryParams.category}
                                      onChange={(event, value) => {
                                          dispatch(ProductManagerActionType.setQueryParam({name: "category", value: value}));
                                          dispatch(ProductManagerActionType.setQueryParam({name: "categorySub", value: null}));
                                          dispatch(ProductManagerActionType.setQueryParam({name: "productId", value: null}));
                                          dispatch(productManagerAction.getProductParamsList())
                                          if (value != null) {
                                              dispatch(commonAction.getCategorySubList(value.id));
                                          } else {
                                              dispatch(CommonActionType.setCategorySubList([]));
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.categorySubList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.category_sub_name}
                                      value={productManagerReducer.queryParams.categorySub}
                                      onChange={(event, value) => {
                                          dispatch(ProductManagerActionType.setQueryParam({name: "categorySub", value: value}));
                                          dispatch(ProductManagerActionType.setQueryParam({name: "productId", value: null}));
                                          dispatch(productManagerAction.getProductParamsList())
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.brandList}
                                      getOptionLabel={(option) => option.brand_name}
                                      value={productManagerReducer.queryParams.brand}
                                      onChange={(event, value) => {
                                          dispatch(ProductManagerActionType.setQueryParam({name: "brand", value: value}));
                                          dispatch(ProductManagerActionType.setQueryParam({name: "brandModel", value: null}));
                                          dispatch(ProductManagerActionType.setQueryParam({name: "productId", value: null}));
                                          dispatch(productManagerAction.getProductParamsList())
                                          // 品牌有选择时，取得品牌型号， 否则清空
                                          if (value != null) {
                                              dispatch(commonAction.getBrandModelList(value.id));
                                          } else {
                                              dispatch(CommonActionType.setBrandModelList([]));
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.brandModelList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.brand_model_name}
                                      value={productManagerReducer.queryParams.brandModel}
                                      onChange={(event, value) => {
                                          dispatch(ProductManagerActionType.setQueryParam({name: "brandModel", value: value}));
                                          dispatch(ProductManagerActionType.setQueryParam({name: "productId", value: null}));
                                          dispatch(productManagerAction.getProductParamsList())

                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }}
                                      options={productManagerReducer.productArray}
                                      getOptionLabel={(option) => option.product_name}
                                      onChange={(event, value) => {
                                          dispatch(ProductManagerActionType.setQueryParam({name: "productId", value: value}));
                                      }}
                                      value={productManagerReducer.queryParams.productId}
                                      renderInput={(params) => <TextField {...params} label="商品名称" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>标准类型</InputLabel>
                            <Select label="标准类型"
                                value={productManagerReducer.queryParams.standardType}
                                onChange={(e, value) => {
                                    dispatch(ProductManagerActionType.setQueryParam({name: "standardType", value: e.target.value}));
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.STANDARD_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>状态</InputLabel>
                            <Select label="状态"
                                value={productManagerReducer.queryParams.status}
                                onChange={(e, value) => {
                                    dispatch(ProductManagerActionType.setQueryParam({name: "status", value: e.target.value}));
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.USE_FLAG.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid item xs={2} container style={{textAlign:'right'}}>
                    {/*查询按钮*/}
                    <Grid item xs={4}>
                        <Fab color="primary" size="small" onClick={()=>{dispatch(productManagerAction.getProductList(0))}}>
                            <i className="mdi mdi-magnify mdi-24px"/>
                        </Fab>
                    </Grid>

                    {/*追加按钮*/}
                    <Grid item xs={4}>
                        <Fab color="primary" size="small" onClick={() => {initModal()}}>
                            <i className="mdi mdi-plus mdi-24px"/>
                        </Fab>
                    </Grid>

                    <Grid item xs={4}>
                        <Fab color="primary" size="small" onClick={()=>{dispatch(productManagerAction.downLoadCsv())}}>
                            <i className="mdi mdi-cloud-download mdi-24px"/>
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">ID</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品分类</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品子分类</TableCell>
                            <TableCell className={classes.tableHead} align="center">品牌</TableCell>
                            <TableCell className={classes.tableHead} align="center">品牌型号</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品名称</TableCell>
                            <TableCell className={classes.tableHead} align="center">标准类型</TableCell>
                            <TableCell className={classes.tableHead} align="center">单位</TableCell>
                            <TableCell className={classes.tableHead} align="right">售价</TableCell>
                            <TableCell className={classes.tableHead} align="right">库存</TableCell>
                            <TableCell className={classes.tableHead} align="center">状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productManagerReducer.productData.dataList.map((row) => (
                            <TableRow key={row.id} style={(row.storage_count != null && ((row.storage_min != null && row.storage_count < row.storage_min) || (row.storage_max != null && row.storage_count > row.storage_max))) ? {background: '#D3D3D3'} : {}}>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="center">{row.category_name}</TableCell>
                                <TableCell align="center">{row.category_sub_name}</TableCell>
                                <TableCell align="center">{row.brand_name}</TableCell>
                                <TableCell align="center">{row.brand_model_name}</TableCell>
                                <TableCell align="center">{row.product_name}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.STANDARD_TYPE, row.standard_type)}</TableCell>
                                <TableCell align="center">{row.unit_name}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                                {/*<TableCell align="right">*/}
                                {/*    {((row.storage_min != null && row.storage_count < row.storage_min) || (row.storage_max != null && row.storage_count > row.storage_max))*/}
                                {/*        ? <span style={{color: "red"}}><b>{row.storage_count}</b></span> : <span>{row.storage_count}</span>}*/}
                                {/*</TableCell>*/}
                                <TableCell align="right">{row.storage_count}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.USE_FLAG, row.status)}</TableCell>
                                <TableCell align="center">
                                    {/* 停用/可用 状态 */}
                                    <Switch color='primary' size="small" name="状态"
                                        checked={row.status==sysConst.USE_FLAG[1].value}
                                        onChange={(e)=>{changeStatus(row.id, row.status)}}
                                    />

                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" size="small">
                                        <Link to={{pathname: '/product_manager/' + row.id}}>
                                            <i className="mdi mdi-table-search"/>
                                        </Link>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {productManagerReducer.productData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={12} align="center">暂无数据</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {productManagerReducer.productData.start > 0 && productManagerReducer.productData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={()=>{dispatch(productManagerAction.getProductList(productManagerReducer.productData.start-(productManagerReducer.productData.size-1)))}}>上一页</Button>}
                {productManagerReducer.productData.dataSize >= productManagerReducer.productData.size &&
                <Button variant="contained" color="primary"
                        onClick={()=>{dispatch(productManagerAction.getProductList(productManagerReducer.productData.start+(productManagerReducer.productData.size-1)))}}>下一页</Button>}
            </Box>

            {/* 模态：新增/修改 */}
            <SimpleModal
                maxWidth={'sm'}
                title="新增商品"
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
                <Grid container spacing={1}>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.categoryList}
                                      getOptionLabel={(option) => option.category_name}
                                      value={modalData.category}
                                      onChange={(event, value) => {
                                          setModalData({...modalData,category:value, categorySub: null});
                                          // 商品分类有选择时，取得商品子分类， 否则清空
                                          if (value != null) {
                                              dispatch(commonAction.getCategorySubList(value.id));
                                          } else {
                                              dispatch(CommonActionType.setCategorySubList([]));
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"
                                                                          error={validation.category&&validation.category!=''}
                                                                          helperText={validation.category}/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.categorySubList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.category_sub_name}
                                      value={modalData.categorySub}
                                      onChange={(event, value) => {
                                          setModalData({...modalData,categorySub:value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"
                                                                          error={validation.categorySub&&validation.categorySub!=''}
                                                                          helperText={validation.categorySub}/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.brandList}
                                      getOptionLabel={(option) => option.brand_name}
                                      value={modalData.brand}
                                      onChange={(event, value) => {
                                          setModalData({...modalData,brand:value, brandModel: null});
                                          // 品牌有选择时，取得品牌型号， 否则清空
                                          if (value != null) {
                                              dispatch(commonAction.getBrandModelList(value.id));
                                          } else {
                                              dispatch(CommonActionType.setBrandModelList([]));
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"
                                                                          error={validation.brand&&validation.brand!=''}
                                                                          helperText={validation.brand}/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                      options={commonReducer.brandModelList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.brand_model_name}
                                      value={modalData.brandModel}
                                      onChange={(event, value) => {
                                          setModalData({...modalData,brandModel:value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"
                                                                          error={validation.brandModel&&validation.brandModel!=''}
                                                                          helperText={validation.brandModel}/>}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <TextField label="商品名称" fullWidth margin="dense" variant="outlined" value={modalData.productName}
                                   onChange={(e) => {
                                       setModalData({...modalData,productName:e.target.value});
                                   }}
                                   error={validation.productName&&validation.productName!=''}
                                   helperText={validation.productName}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField label="商品别名" fullWidth margin="dense" variant="outlined" value={modalData.productSName}
                                   onChange={(e) => {
                                       setModalData({...modalData,productSName:e.target.value});
                                   }}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField label="产地" fullWidth margin="dense" variant="outlined" value={modalData.productAddress}
                                   onChange={(e) => {
                                       setModalData({...modalData,productAddress:e.target.value});
                                   }}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <TextField label="序列号" fullWidth margin="dense" variant="outlined" value={modalData.productSerial}
                                   onChange={(e) => {
                                       setModalData({...modalData,productSerial:e.target.value});
                                   }}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>标准类型</InputLabel>
                            <Select label="标准类型"
                                value={modalData.standardType}
                                onChange={(e, value) => {
                                    setModalData({...modalData,standardType:e.target.value});
                                }}
                            >
                                {sysConst.STANDARD_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={3}>
                        <TextField label="单位" fullWidth margin="dense" variant="outlined" value={modalData.unitName}
                                   onChange={(e) => {
                                       setModalData({...modalData,unitName:e.target.value});
                                   }}
                        />
                    </Grid>

                    <Grid item sm={3}>
                        <TextField label="最小库存" fullWidth margin="dense" variant="outlined" type="number" 
                                value={modalData.storageMin}
                                onChange={(e) => {
                                    setModalData({...modalData,storageMin:e.target.value});
                                }}
                                error={validation.storageMin&&validation.storageMin!=''}
                                helperText={validation.storageMin}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <TextField label="最大库存" fullWidth margin="dense" variant="outlined" type="number" 
                                value={modalData.storageMax}
                                onChange={(e) => {
                                    setModalData({...modalData,storageMax:e.target.value});
                                }}
                                error={validation.storageMax&&validation.storageMax!=''}
                                helperText={validation.storageMax}
                        />
                    </Grid>

                    <Grid item sm={3}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>定价方式</InputLabel>
                            <Select label="定价方式"
                                value={modalData.priceType}
                                onChange={(e, value) => {
                                    setModalData({...modalData,priceType:e.target.value});
                                }}
                            >
                                {sysConst.PRICE_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {modalData.priceType == sysConst.PRICE_TYPE[0].value &&
                    <Grid item sm={3}>
                        <TextField label="售价" fullWidth margin="dense" variant="outlined" type="number" value={modalData.fixedPrice}
                                onChange={(e) => {
                                    setModalData({...modalData,fixedPrice:e.target.value || 0});
                                }}
                                error={validation.fixedPrice&&validation.fixedPrice!=''}
                                helperText={validation.fixedPrice}
                        />
                    </Grid>}

                    {modalData.priceType == sysConst.PRICE_TYPE[1].value &&
                    <Grid item sm={3}>
                        <TextField label="比率" fullWidth margin="dense" variant="outlined" type="number"
                                value={modalData.priceRaiseRatio}
                                onChange={(e) => {
                                    setModalData({...modalData,priceRaiseRatio:e.target.value || 1});
                                }}
                                error={validation.priceRaiseRatio&&validation.priceRaiseRatio!=''}
                                helperText={validation.priceRaiseRatio}
                        />
                    </Grid>}

                    {modalData.priceType == sysConst.PRICE_TYPE[2].value &&
                    <Grid item sm={3}>
                        <TextField label="加价" fullWidth margin="dense" variant="outlined" type="number"
                                value={modalData.priceRaiseValue}
                                onChange={(e) => {
                                    setModalData({...modalData,priceRaiseValue:e.target.value || 0});
                                }}
                                error={validation.priceRaiseValue&&validation.priceRaiseValue!=''}
                                helperText={validation.priceRaiseValue}
                        />
                    </Grid>}

                    <Grid item sm={3}>
                        <TextField label="当前采购价" fullWidth margin="dense" variant="outlined" type="number" 
                                value={modalData.lastPurchasePrice}
                                onChange={(e) => {
                                    setModalData({...modalData,lastPurchasePrice:e.target.value});
                                }}
                                error={validation.lastPurchasePrice&&validation.lastPurchasePrice!=''}
                                helperText={validation.lastPurchasePrice}
                        />
                    </Grid>

                    <Grid item sm={3}>
                        <TextField label="建议售价" fullWidth margin="dense" variant="outlined" type="number" disabled InputLabelProps={{shrink: true}}
                                value={modalData.priceType == sysConst.PRICE_TYPE[0].value ?  modalData.price : (modalData.priceType == sysConst.PRICE_TYPE[1].value ? 
                                        (modalData.lastPurchasePrice *  modalData.priceRaiseRatio).toFixed(2) : 
                                        (parseFloat(modalData.lastPurchasePrice) + parseFloat(modalData.priceRaiseValue)).toFixed(2))}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={modalData.remark}
                                   onChange={(e) => {
                                       setModalData({...modalData,remark:e.target.value});
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
        productManagerReducer: state.ProductManagerReducer,
        commonReducer: state.CommonReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getCategoryList());
        dispatch(commonAction.getBrandList());
    },
    changeStatus: (id, status) => {
        Swal.fire({
            title: status === 1 ? "确定停用该数据？" : "确定重新启用该数据？",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(productManagerAction.changeStatus(id, status));
            }
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductManager)
