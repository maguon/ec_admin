import React, {useEffect, useState} from 'react';
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
    Select,Switch,
    Button, Fab, FormControl, InputLabel, MenuItem,FormHelperText, makeStyles
} from "@material-ui/core";

// 引入Dialog
import {SimpleModal} from "../index";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {CommonActionType, ProductManagerActionType} from "../../types";

const productManagerAction = require('../../actions/main/ProductManagerAction');
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

function ProductManager(props) {
    const {productManagerReducer, commonReducer, changeStatus, saveModalData} = props;
    const classes = useStyles();

    useEffect(() => {
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        let dataStart = props.productManagerReducer.productData.start;
        props.getProductList(dataStart);
    }, []);

    // 查询列表
    const queryProductList = () => {
        // 默认第一页
        props.getProductList(0);
    };

    // 上一页
    const getPrePage = () => {
        props.getProductList(props.productManagerReducer.productData.start - (props.productManagerReducer.productData.size - 1));
    };

    // 下一页
    const getNextPage = () => {
        props.getProductList(props.productManagerReducer.productData.start + (props.productManagerReducer.productData.size - 1));
    };

    // 检索条件
    const [paramCategory, setParamCategory] = React.useState(null);
    const [paramCategorySub, setParamCategorySub] = React.useState(null);
    const [paramBrand, setParamBrand] = React.useState(null);
    const [paramBrandModel, setParamBrandModel] = React.useState(null);
    const [paramProduct, setParamProduct] = React.useState(null);
    const [paramStandardType, setParamStandardType] = React.useState(null);
    const [paramStatus, setParamStatus] = React.useState(null);

    const refreshSubOptions = () => {
        console.log('paramCategory',paramCategory);
        // 商品分类有选择时，取得商品子分类， 否则清空
        if (paramCategory != null) {
            props.getCategorySubList(paramCategory.id);
        } else {
            props.setCategorySubList([]);
            setParamCategorySub(null);
        }
        console.log('paramBrand',paramBrand);
        // 品牌有选择时，取得品牌型号， 否则清空
        if (paramBrand != null) {
            props.getBrandModelList(paramBrand.id);
        } else {
            props.setBrandModelList([]);
            setParamBrandModel(null);
        }
    };
    const refreshSelectOptions = () => {
        // 刷新商品子分类,取得品牌型号 列表
        refreshSubOptions();
        // 商品分类/品牌 有1个选择时，取得商品列表，否则清空
        if (paramCategory != null || paramBrand != null) {

            let params = {
                categoryId: paramCategory != null ? paramCategory.id : '',
                categorySubId: paramCategorySub != null ? paramCategorySub.id : '',
                brandId: paramBrand != null ? paramBrand.id : '',
                brandModelId: paramBrandModel != null ? paramBrandModel.id : ''
            };
            console.log('',params);
            props.getCommonProductList(params);
        } else {
            props.setCommonProductList([]);
            setParamProduct(null);
        }
    };

    useEffect(() => {
        // 保存检索条件
        props.setQueryParams({paramCategory,paramCategorySub,paramBrand,paramBrandModel,paramProduct,paramStandardType,paramStatus});
        // 根据不同情况：刷新 【商品子分类】【品牌型号】【商品】的Options 选项
        refreshSelectOptions();
    }, [paramCategory,paramCategorySub,paramBrand,paramBrandModel,paramProduct,paramStandardType,paramStatus]);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 关闭模态
    const closeModal = () => {
        refreshSubOptions();
        setModalOpen(false);
    };
    // 新增 区分
    const [pageType, setPageType] = React.useState('');
    // App Id
    const [uid, setUid] = React.useState(-1);

    // 商品分类 *
    const [category, setCategory] = React.useState(null);
    // 商品子分类 *
    const [categorySub, setCategorySub] = React.useState(null);
    // 品牌 *
    const [brand, setBrand] = React.useState(null);
    // 品牌型号 *
    const [brandModel, setBrandModel] = React.useState(null);

    // 商品名称 *
    const [productName, setProductName] = React.useState('');
    // 商品别名
    const [productSName, setProductSName] = React.useState('');
    // 产地
    const [productAddress, setProductAddress] = React.useState('');

    // 序列号
    const [productSerial, setProductSerial] = React.useState('');
    // 单位
    const [unitName, setUnitName] = React.useState('');
    // 售价 *
    const [price, setPrice] = React.useState('0');
    // 标准类型 *
    const [standardType, setStandardType] = React.useState(1);
    // 备注
    const [remark, setRemark] = React.useState('');

    //初始添加模态框值
    const initModal =(data) =>{
        // 清楚check内容
        setValidation({});
        // 清空商品子分类
        props.setCategorySubList([]);
        // 清空品牌型号
        props.setBrandModelList([]);

        // 新建 / 修改
        if (data == null) {
            setPageType('new');
            setCategory(null);
            setCategorySub(null);
            setBrand(null);
            setBrandModel(null);
            setProductName('');
            setProductSName('');
            setProductAddress('');
            setProductSerial('');
            setUnitName('');
            setPrice('0');
            setStandardType(1);
            setRemark('');
        } else {
            setPageType('edit');
            setUid(data.id);
            setCategory({id: data.category_id, category_name : data.category_name});
            setCategorySub({id: data.category_sub_id, category_sub_name : data.category_sub_name});
            setBrand({id: data.brand_id, brand_name : data.brand_name});
            setBrandModel({id: data.brand_model_id, brand_model_name : data.brand_model_name});
            setProductName(data.product_name);
            setProductSName(data.product_s_name);
            setProductAddress(data.product_address);
            setProductSerial(data.product_serial);
            setUnitName(data.unit_name);
            setPrice(data.price);
            setStandardType(data.standard_type);
            setRemark(data.remark);
            console.log('standardType',standardType);
        }
        // 设定模态打开
        setModalOpen(true);
    };

    // 校验
    const [validation,setValidation] = useState({});
    const validate = ()=>{
        const validateObj ={};
        if (!category) {
            validateObj.category ='请选择商品分类';
        }
        if (!categorySub) {
            validateObj.categorySub ='请选择商品子分类';
        }
        if (!brand) {
            validateObj.brand ='请选择品牌';
        }
        if (!brandModel) {
            validateObj.brandModel ='请选择品牌型号';
        }

        if (!productName) {
            validateObj.productName ='请输入商品名称';
        }
        if (!price) {
            validateObj.price ='请输入售价';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const submitModal= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            console.log('category',category);
            console.log('categorySub',categorySub);
            console.log('brand',brand);
            console.log('brandModel',brandModel);

            saveModalData(pageType, uid, category, categorySub, brand, brandModel, productName, productSName, productAddress, productSerial, unitName, price, standardType, remark);
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
                <Grid container item xs={10} spacing={3}>
                    <Grid item xs={3}>
                        <Autocomplete id="condition-category" fullWidth={true}
                                      options={commonReducer.categoryList}
                                      getOptionLabel={(option) => option.category_name}
                                      onChange={(event, value) => {
                                          setParamCategory(value);
                                      }}
                                      value={paramCategory}
                                      renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete id="condition-category-sub" fullWidth={true}
                                      options={commonReducer.categorySubList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.category_sub_name}
                                      onChange={(event, value) => {
                                          setParamCategorySub(value);
                                      }}
                                      value={paramCategorySub}
                                      renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Autocomplete id="condition-brand" fullWidth={true}
                                      options={commonReducer.brandList}
                                      getOptionLabel={(option) => option.brand_name}
                                      onChange={(event, value) => {
                                          setParamBrand(value);
                                      }}
                                      value={paramBrand}
                                      renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete id="condition-brand-model" fullWidth={true}
                                      options={commonReducer.brandModelList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.brand_model_name}
                                      onChange={(event, value) => {
                                          setParamBrandModel(value);
                                      }}
                                      value={paramBrandModel}
                                      renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Autocomplete id="condition-product" fullWidth={true}
                                      options={commonReducer.productList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.product_name}
                                      onChange={(event, value) => {
                                          setParamProduct(value);
                                      }}
                                      value={paramProduct}
                                      renderInput={(params) => <TextField {...params} label="商品" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="standard-type-select-outlined-label">标准类型</InputLabel>
                            <Select
                                label="标准类型"
                                labelId="standard-type-select-outlined-label"
                                id="standard-select-outlined"
                                value={paramStandardType}
                                onChange={(event, value) => {
                                    setParamStandardType(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.STANDARD_TYPE.map((item, index) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="status-select-outlined-label">状态</InputLabel>
                            <Select
                                label="状态"
                                labelId="status-select-outlined-label"
                                id="status-select-outlined"
                                value={paramStatus}
                                onChange={(event, value) => {
                                    setParamStatus(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.USE_FLAG.map((item, index) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1}>
                    <Fab color="primary" aria-label="add" size="small" onClick={queryProductList}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>

                {/*追加按钮*/}
                <Grid item xs={1}>
                    <Fab color="primary" aria-label="add" size="small" onClick={() => {initModal(null)}}>
                        <i className="mdi mdi-plus mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="default" className={classes.head} align="center">商品名称</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">商品别名</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">序列号</TableCell>
                            <TableCell padding="default" className={classes.head} align="left">产地</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">标准类型</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">单位</TableCell>
                            <TableCell padding="default" className={classes.head} align="right">售价</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">状态</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productManagerReducer.productData.dataList.map((row) => (
                            <TableRow className={classes.tableRow}>
                                <TableCell padding="none" align="center">{row.product_name}</TableCell>
                                <TableCell padding="none" align="center">{row.product_s_name}</TableCell>
                                <TableCell padding="none" align="center">{row.product_serial}</TableCell>
                                <TableCell padding="none" align="left">{row.product_address}</TableCell>
                                <TableCell padding="none"
                                           align="center">{commonUtil.getJsonValue(sysConst.STANDARD_TYPE, row.standard_type)}</TableCell>
                                <TableCell padding="none" align="center">{row.unit_name}</TableCell>
                                <TableCell padding="none" align="right">{row.price}</TableCell>
                                <TableCell padding="none"
                                           align="center">{commonUtil.getJsonValue(sysConst.USE_FLAG, row.status)}</TableCell>
                                <TableCell padding="none" align="center">
                                    {/* 停用/可用 状态 */}
                                    <Switch
                                        checked={row.status==1}
                                        onChange={(e)=>{changeStatus(row.id, row.status)}}
                                        name="状态"
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />

                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" onClick={() => {initModal(row)}}>
                                        <i className="mdi mdi-table-search mdi-24px"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {productManagerReducer.productData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={8} style={{textAlign: 'center'}}>暂无数据</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {productManagerReducer.productData.start > 0 && productManagerReducer.productData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}} onClick={getPrePage}>上一页</Button>}
                {productManagerReducer.productData.dataSize >= productManagerReducer.productData.size &&
                <Button variant="contained" color="primary" onClick={getNextPage}>下一页</Button>}
            </Box>

            {/* 模态：新增/修改 高中信息 */}
            <SimpleModal
                maxWidth={'sm'}
                title={pageType === 'edit' ? '修改商品' : '新增商品'}
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
                    {pageType === 'edit' && <Grid item sm={12}><Typography color="primary">商品编号：{uid}</Typography></Grid>}
                    <Grid item sm={6}>
                        <Autocomplete id="condition-category" fullWidth={true}
                                      options={commonReducer.categoryList}
                                      getOptionLabel={(option) => option.category_name}
                                      onChange={(event, value) => {
                                          setCategory(value);
                                          // 商品分类有选择时，取得商品子分类， 否则清空
                                          if (value != null) {
                                              props.getCategorySubList(value.id);
                                          } else {
                                              props.setCategorySubList([]);
                                          }
                                      }}
                                      value={category}
                                      renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"
                                                                          error={validation.category&&validation.category!=''}
                                                                          helperText={validation.category}/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete id="condition-category-sub" fullWidth={true}
                                      options={commonReducer.categorySubList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.category_sub_name}
                                      onChange={(event, value) => {
                                          setCategorySub(value);
                                          if (value == null) {
                                              props.getCategorySubList(category.id);
                                          }
                                      }}
                                      value={categorySub}
                                      renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"
                                                                          error={validation.categorySub&&validation.categorySub!=''}
                                                                          helperText={validation.categorySub}/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete id="condition-brand" fullWidth={true}
                                      options={commonReducer.brandList}
                                      getOptionLabel={(option) => option.brand_name}
                                      onChange={(event, value) => {
                                          setBrand(value);
                                          // 品牌有选择时，取得品牌型号， 否则清空
                                          if (value != null) {
                                              props.getBrandModelList(value.id);
                                          } else {
                                              props.setBrandModelList([]);
                                          }
                                      }}
                                      value={brand}
                                      renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"
                                                                          error={validation.brand&&validation.brand!=''}
                                                                          helperText={validation.brand}/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete id="condition-brand-model" fullWidth={true}
                                      options={commonReducer.brandModelList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.brand_model_name}
                                      onChange={(event, value) => {
                                          setBrandModel(value);
                                          if (value == null) {
                                              props.getBrandModelList(brand.id);
                                          }
                                      }}
                                      value={brandModel}
                                      renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"
                                                                          error={validation.brandModel&&validation.brandModel!=''}
                                                                          helperText={validation.brandModel}/>}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <TextField label="商品名称" fullWidth={true} margin="dense" variant="outlined" value={productName}
                                   onChange={(e) => {
                                       setProductName(e.target.value)
                                   }}
                                   error={validation.productName&&validation.productName!=''}
                                   helperText={validation.productName}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField label="商品别名" fullWidth={true} margin="dense" variant="outlined" value={productSName}
                                   onChange={(e) => {
                                       setProductSName(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField label="产地" fullWidth={true} margin="dense" variant="outlined" value={productAddress}
                                   onChange={(e) => {
                                       setProductAddress(e.target.value)
                                   }}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <TextField label="序列号" fullWidth={true} margin="dense" variant="outlined" value={productSerial}
                                   onChange={(e) => {
                                       setProductSerial(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="standard-select-outlined-label">标准类型</InputLabel>
                            <Select
                                label="标准类型"
                                labelId="standard-select-outlined-label"
                                id="standard-select-outlined"
                                value={standardType}
                                onChange={(event, value) => {
                                    setStandardType(event.target.value);
                                }}
                            >
                                {sysConst.STANDARD_TYPE.map((item, index) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={3}>
                        <TextField label="单位" fullWidth={true} margin="dense" variant="outlined" value={unitName}
                                   onChange={(e) => {
                                       setUnitName(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <TextField label="售价" fullWidth={true} margin="dense" variant="outlined" type="number" value={price}
                                   onChange={(e) => {
                                       setPrice(e.target.value)
                                   }}
                                   error={validation.price&&validation.price!=''}
                                   helperText={validation.price}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth={true} margin="dense" variant="outlined" multiline rows={2} value={remark}
                                   onChange={(e) => {
                                       setRemark(e.target.value)
                                   }}
                        />
                    </Grid>
                </Grid>

            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        productManagerReducer: state.ProductManagerReducer,
        commonReducer: state.CommonReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getCategoryList());
        dispatch(commonAction.getBrandList());
    },
    // select控件，联动检索
    getCategorySubList: (categoryId) => {
        dispatch(commonAction.getCategorySubList(categoryId));
    },
    setCategorySubList: (value) => {
        dispatch(CommonActionType.setCategorySubList(value));
    },
    getBrandModelList: (brandId) => {
        dispatch(commonAction.getBrandModelList(brandId));
    },
    setBrandModelList: (value) => {
        dispatch(CommonActionType.setBrandModelList(value));
    },
    getCommonProductList: (queryParams) => {
        dispatch(commonAction.getProductList(queryParams));
    },
    setCommonProductList: (value) => {
        dispatch(CommonActionType.setProductList(value));
    },

    setQueryParams: (value) => {
        dispatch(ProductManagerActionType.setQueryParams(value));
    },
    getProductList: (dataStart) => {
        dispatch(productManagerAction.getProductList({dataStart}))
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
    },
    saveModalData: (pageType, uid, category, categorySub, brand, brandModel, productName, productSName, productAddress, productSerial, unitName, price, standardType, remark) => {
        dispatch(productManagerAction.saveModalData({
            pageType, uid, category, categorySub, brand, brandModel, productName, productSName, productAddress, productSerial, unitName, price, standardType, remark
        }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductManager)
