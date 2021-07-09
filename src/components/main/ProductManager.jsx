import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
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
import {CommonActionType, ProductManagerActionType} from "../../types";

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
    const {productManagerReducer, commonReducer, changeStatus, saveModalData, fromDetail} = props;
    const classes = useStyles();

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
    // const [paramProduct, setParamProduct] = React.useState(null);
    const [paramStandardType, setParamStandardType] = React.useState('');
    const [paramStatus, setParamStatus] = React.useState('');

    useEffect(() => {
        if (!fromDetail) {
            setParamCategory(null);
            setParamCategorySub(null);
            setParamBrand(null);
            setParamBrandModel(null);
            setParamStandardType('');
            setParamStatus('');
            props.setQueryParams({paramCategory,paramCategorySub,paramBrand,paramBrandModel,paramStandardType,paramStatus});
        } else {
            setParamCategory(productManagerReducer.queryParams.paramCategory);
            setParamCategorySub(productManagerReducer.queryParams.paramCategorySub);
            setParamBrand(productManagerReducer.queryParams.paramBrand);
            setParamBrandModel(productManagerReducer.queryParams.paramBrandModel);
            setParamStandardType(productManagerReducer.queryParams.paramStandardType);
            setParamStatus(productManagerReducer.queryParams.paramStatus);
        }
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        let dataStart = props.productManagerReducer.productData.start;
        props.getProductList(dataStart);
    }, []);

    // const refreshSubOptions = () => {
    //     // 商品分类有选择时，取得商品子分类， 否则清空
    //     if (paramCategory != null) {
    //         props.getCategorySubList(paramCategory.id);
    //         setParamCategorySub(null);
    //     } else {
    //         props.setCategorySubList([]);
    //         setParamCategorySub(null);
    //     }
    //     // 品牌有选择时，取得品牌型号， 否则清空
    //     if (paramBrand != null) {
    //         props.getBrandModelList(paramBrand.id);
    //         setParamBrandModel(null);
    //     } else {
    //         props.setBrandModelList([]);
    //         setParamBrandModel(null);
    //     }
    // };
    // const refreshSelectOptions = () => {
    //     // 刷新商品子分类,取得品牌型号 列表
    //     refreshSubOptions();
    //     // 商品分类/品牌 有1个选择时，取得商品列表，否则清空
    //     if (paramCategory != null || paramBrand != null) {
    //         let params = {
    //             categoryId: paramCategory != null ? paramCategory.id : '',
    //             categorySubId: paramCategorySub != null ? paramCategorySub.id : '',
    //             brandId: paramBrand != null ? paramBrand.id : '',
    //             brandModelId: paramBrandModel != null ? paramBrandModel.id : ''
    //         };
    //         props.getCommonProductList(params);
    //         setParamProduct(null);
    //     } else {
    //         props.setCommonProductList([]);
    //         setParamProduct(null);
    //     }
    // };

    // 保存检索条件
    useEffect(() => {
        props.setQueryParams({paramCategory,paramCategorySub,paramBrand,paramBrandModel,paramStandardType,paramStatus});
    }, [paramCategory,paramCategorySub,paramBrand,paramBrandModel,paramStandardType,paramStatus]);

    useEffect(() => {
        // 商品分类有选择时，取得商品子分类， 否则清空
        setParamCategorySub(null);
        if (paramCategory != null) {
            props.getCategorySubList(paramCategory.id);
        } else {
            props.setCategorySubList([]);
        }
    }, [paramCategory]);

    useEffect(() => {
        // 品牌有选择时，取得品牌型号， 否则清空
        setParamBrandModel(null);
        if (paramBrand != null) {
            props.getBrandModelList(paramBrand.id);
        } else {
            props.setBrandModelList([]);
        }
    }, [paramBrand]);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 关闭模态
    const closeModal = () => {
        if (paramCategory != null) {
            props.getCategorySubList(paramCategory.id);
        } else {
            props.setCategorySubList([]);
        }
        if (paramBrand != null) {
            props.getBrandModelList(paramBrand.id);
        } else {
            props.setBrandModelList([]);
        }
        setModalOpen(false);
    };

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
    const initModal =() =>{
        // 清空check内容
        setValidation({});
        // 清空商品子分类
        props.setCategorySubList([]);
        // 清空品牌型号
        props.setBrandModelList([]);
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
        if(errorCount===0){
            saveModalData(category, categorySub, brand, brandModel, productName, productSName, productAddress, productSerial, unitName, price, standardType, remark);
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
                    <Grid item xs={2}>
                        <Autocomplete fullWidth
                                      options={commonReducer.categoryList}
                                      getOptionLabel={(option) => option.category_name}
                                      onChange={(event, value) => {
                                          setParamCategory(value);
                                      }}
                                      value={paramCategory}
                                      renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Autocomplete fullWidth
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

                    <Grid item xs={2}>
                        <Autocomplete fullWidth
                                      options={commonReducer.brandList}
                                      getOptionLabel={(option) => option.brand_name}
                                      onChange={(event, value) => {
                                          setParamBrand(value);
                                      }}
                                      value={paramBrand}
                                      renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Autocomplete fullWidth
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

                    {/*<Grid item xs={3}>*/}
                    {/*    <Autocomplete id="condition-product" fullWidth*/}
                    {/*                  options={commonReducer.productList}*/}
                    {/*                  noOptionsText="无选项"*/}
                    {/*                  getOptionLabel={(option) => option.product_name}*/}
                    {/*                  onChange={(event, value) => {*/}
                    {/*                      setParamProduct(value);*/}
                    {/*                  }}*/}
                    {/*                  value={paramProduct}*/}
                    {/*                  renderInput={(params) => <TextField {...params} label="商品" margin="dense" variant="outlined"/>}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>标准类型</InputLabel>
                            <Select label="标准类型"
                                value={paramStandardType}
                                onChange={(event, value) => {
                                    setParamStandardType(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.STANDARD_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>状态</InputLabel>
                            <Select label="状态"
                                value={paramStatus}
                                onChange={(event, value) => {
                                    setParamStatus(event.target.value);
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

                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign: 'right'}}>
                    <Fab color="primary" size="small" onClick={queryProductList}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>

                {/*追加按钮*/}
                <Grid item xs={1} style={{textAlign: 'right'}}>
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
                            <TableCell className={classes.tableHead} align="center">ID</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品分类</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品子分类</TableCell>
                            <TableCell className={classes.tableHead} align="center">品牌</TableCell>
                            <TableCell className={classes.tableHead} align="center">品牌型号</TableCell>
                            <TableCell className={classes.tableHead} align="center">商品名称</TableCell>
                            <TableCell className={classes.tableHead} align="center">标准类型</TableCell>
                            <TableCell className={classes.tableHead} align="center">单位</TableCell>
                            <TableCell className={classes.tableHead} align="right">售价</TableCell>
                            <TableCell className={classes.tableHead} align="center">状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productManagerReducer.productData.dataList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="center">{row.category_name}</TableCell>
                                <TableCell align="center">{row.category_sub_name}</TableCell>
                                <TableCell align="center">{row.brand_name}</TableCell>
                                <TableCell align="center">{row.brand_model_name}</TableCell>
                                <TableCell align="center">{row.product_name}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.STANDARD_TYPE, row.standard_type)}</TableCell>
                                <TableCell align="center">{row.unit_name}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
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
                                            <i className="mdi mdi-table-search mdi-24px"/>
                                        </Link>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {productManagerReducer.productData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={11} align="center">暂无数据</TableCell>
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
                        <Autocomplete fullWidth
                                      options={commonReducer.categoryList}
                                      getOptionLabel={(option) => option.category_name}
                                      value={category}
                                      onChange={(event, value) => {
                                          setCategory(value);
                                          // 商品分类有选择时，取得商品子分类， 否则清空
                                          if (value != null) {
                                              props.getCategorySubList(value.id);
                                          } else {
                                              props.setCategorySubList([]);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"
                                                                          error={validation.category&&validation.category!=''}
                                                                          helperText={validation.category}/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.categorySubList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.category_sub_name}
                                      value={categorySub}
                                      onChange={(event, value) => {
                                          setCategorySub(value);
                                          if (value == null) {
                                              props.getCategorySubList(category.id);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"
                                                                          error={validation.categorySub&&validation.categorySub!=''}
                                                                          helperText={validation.categorySub}/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.brandList}
                                      getOptionLabel={(option) => option.brand_name}
                                      value={brand}
                                      onChange={(event, value) => {
                                          setBrand(value);
                                          // 品牌有选择时，取得品牌型号， 否则清空
                                          if (value != null) {
                                              props.getBrandModelList(value.id);
                                          } else {
                                              props.setBrandModelList([]);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"
                                                                          error={validation.brand&&validation.brand!=''}
                                                                          helperText={validation.brand}/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.brandModelList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.brand_model_name}
                                      value={brandModel}
                                      onChange={(event, value) => {
                                          setBrandModel(value);
                                          if (value == null) {
                                              props.getBrandModelList(brand.id);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"
                                                                          error={validation.brandModel&&validation.brandModel!=''}
                                                                          helperText={validation.brandModel}/>}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <TextField label="商品名称" fullWidth margin="dense" variant="outlined" value={productName}
                                   onChange={(e) => {
                                       setProductName(e.target.value)
                                   }}
                                   error={validation.productName&&validation.productName!=''}
                                   helperText={validation.productName}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField label="商品别名" fullWidth margin="dense" variant="outlined" value={productSName}
                                   onChange={(e) => {
                                       setProductSName(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField label="产地" fullWidth margin="dense" variant="outlined" value={productAddress}
                                   onChange={(e) => {
                                       setProductAddress(e.target.value)
                                   }}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <TextField label="序列号" fullWidth margin="dense" variant="outlined" value={productSerial}
                                   onChange={(e) => {
                                       setProductSerial(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>标准类型</InputLabel>
                            <Select label="标准类型"
                                value={standardType}
                                onChange={(event, value) => {
                                    setStandardType(event.target.value);
                                }}
                            >
                                {sysConst.STANDARD_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={3}>
                        <TextField label="单位" fullWidth margin="dense" variant="outlined" value={unitName}
                                   onChange={(e) => {
                                       setUnitName(e.target.value)
                                   }}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <TextField label="售价" fullWidth margin="dense" variant="outlined" type="number" value={price}
                                   onChange={(e) => {
                                       setPrice(e.target.value)
                                   }}
                                   error={validation.price&&validation.price!=''}
                                   helperText={validation.price}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={remark}
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
    // getCommonProductList: (queryParams) => {
    //     dispatch(commonAction.getProductList(queryParams));
    // },
    // setCommonProductList: (value) => {
    //     dispatch(CommonActionType.setProductList(value));
    // },

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
    saveModalData: (category, categorySub, brand, brandModel, productName, productSName, productAddress, productSerial, unitName, price, standardType, remark) => {
        dispatch(productManagerAction.saveModalData({
            category, categorySub, brand, brandModel, productName, productSName, productAddress, productSerial, unitName, price, standardType, remark
        }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductManager)
