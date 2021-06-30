import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link, useParams} from "react-router-dom";
import {
    Button,
    Divider,
    Grid,
    Typography,
    TextField,
    IconButton,
    FormControl, InputLabel, Select, MenuItem, makeStyles
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {CommonActionType, ProductManagerDetailActionType} from '../../types';

const productManagerDetailAction = require('../../actions/main/ProductManagerDetailAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: { marginBottom: 20},
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider
}));

// 商品- 详情
function ProductManagerDetail(props) {
    const {productManagerDetailReducer, commonReducer, getProductInfo} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();
    useEffect(() => {
        props.getBaseSelectList();
        getProductInfo(id);
    }, []);

    // 校验
    const [validation,setValidation] = useState({});
    const validate = ()=>{
        const validateObj ={};
        if (!productManagerDetailReducer.productInfo.category_sub.id) {
            validateObj.category_sub ='请选择商品子分类';
        }
        if (!productManagerDetailReducer.productInfo.brand_model.id) {
            validateObj.brand_model ='请选择品牌型号';
        }
        // if (!productManagerDetailReducer.productInfo.product_name) {
        //     validateObj.product_name ='请输入商品名称';
        // }
        if (!productManagerDetailReducer.productInfo.price) {
            validateObj.price ='请输入售价';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const updateProduct= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            props.updateProduct();
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>
                <Link to={{pathname: '/product_manager', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"></i>
                    </IconButton>
                </Link>
                商品- 详情
            </Typography>
            <Divider light className={classes.divider}/>

            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <Autocomplete id="condition-category" fullWidth={true} disableClearable={true}
                                  options={commonReducer.categoryList}
                                  getOptionLabel={(option) => option.category_name}
                                  onChange={(event, value) => {
                                      // 将当前选中值 赋值 reducer
                                      dispatch(ProductManagerDetailActionType.setProductInfo({name: "category", value: {id: value.id, category_name: value.category_name}}));
                                      // 清空 商品子分类
                                      dispatch(ProductManagerDetailActionType.setProductInfo({name: "category_sub", value: {}}));
                                      // 根据选择内容，刷新 商品子分类 列表
                                      props.getCategorySubList(value.id);
                                  }}
                                  value={productManagerDetailReducer.productInfo.category}
                                  renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"/>}
                    />
                </Grid>
                <Grid item sm={6}>
                    <Autocomplete id="condition-category-sub" fullWidth={true} disableClearable={true}
                                  options={commonReducer.categorySubList}
                                  noOptionsText="无选项"
                                  getOptionLabel={(option) => option.category_sub_name}
                                  onChange={(event, value) => {
                                      dispatch(ProductManagerDetailActionType.setProductInfo({name: "category_sub", value: {id: value.id, category_sub_name: value.category_sub_name}}));
                                  }}
                                  value={productManagerDetailReducer.productInfo.category_sub}
                                  renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"
                                                                      error={validation.category_sub&&validation.category_sub!=''}
                                                                      helperText={validation.category_sub}/>}
                    />
                </Grid>
                <Grid item sm={6}>
                    <Autocomplete id="condition-brand" fullWidth={true} disableClearable={true}
                                  options={commonReducer.brandList}
                                  getOptionLabel={(option) => option.brand_name}
                                  onChange={(event, value) => {
                                      // 将当前选中值 赋值 reducer
                                      dispatch(ProductManagerDetailActionType.setProductInfo({name: "brand", value: {id: value.id, brand_name: value.brand_name}}));
                                      // 清空 商品子分类
                                      dispatch(ProductManagerDetailActionType.setProductInfo({name: "brand_model", value: {}}));
                                      // 根据选择内容，刷新 商品子分类 列表
                                      props.getBrandModelList(value.id);
                                  }}
                                  value={productManagerDetailReducer.productInfo.brand}
                                  renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                    />
                </Grid>
                <Grid item sm={6}>
                    <Autocomplete id="condition-brand-model" fullWidth={true} disableClearable={true}
                                  options={commonReducer.brandModelList}
                                  noOptionsText="无选项"
                                  getOptionLabel={(option) => option.brand_model_name}
                                  onChange={(e, value) => {
                                      dispatch(ProductManagerDetailActionType.setProductInfo({name: "brand_model", value: {id: value.id, brand_model_name: value.brand_model_name}}));
                                  }}
                                  value={productManagerDetailReducer.productInfo.brand_model}
                                  renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"
                                                                      error={validation.brand_model&&validation.brand_model!=''}
                                                                      helperText={validation.brand_model}/>}
                    />
                </Grid>

                <Grid item sm={6}>
                    <TextField label="商品名称" fullWidth={true} margin="dense" variant="outlined" disabled
                               value={productManagerDetailReducer.productInfo.product_name}
                               onChange={(e) => {
                                   dispatch(ProductManagerDetailActionType.setProductInfo({name: "product_name", value: e.target.value}))
                               }}
                        // error={validation.product_name&&validation.product_name!=''}
                        // helperText={validation.product_name}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField label="商品别名" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                               value={productManagerDetailReducer.productInfo.product_s_name}
                               onChange={(e) => {
                                   dispatch(ProductManagerDetailActionType.setProductInfo({name: "product_s_name",value: e.target.value}))
                               }}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField label="产地" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                               value={productManagerDetailReducer.productInfo.product_address}
                               onChange={(e) => {
                                   dispatch(ProductManagerDetailActionType.setProductInfo({name: "product_address",value: e.target.value}))
                               }}
                    />
                </Grid>

                <Grid item sm={6}>
                    <TextField label="序列号" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                               value={productManagerDetailReducer.productInfo.product_serial}
                               onChange={(e) => {
                                   dispatch(ProductManagerDetailActionType.setProductInfo({name: "product_serial",value: e.target.value}))
                               }}
                    />
                </Grid>
                <Grid item sm={3}>
                    <FormControl variant="outlined" fullWidth={true} margin="dense">
                        <InputLabel id="standard-select-outlined-label" shrink>标准类型</InputLabel>
                        <Select
                            label="标准类型"
                            labelId="standard-select-outlined-label"
                            id="standard-select-outlined"
                            value={productManagerDetailReducer.productInfo.standard_type}
                            onChange={(e, value) => {
                                dispatch(ProductManagerDetailActionType.setProductInfo({name: "standard_type",value: e.target.value}))
                            }}
                        >
                            {sysConst.STANDARD_TYPE.map((item, index) => (
                                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="单位" fullWidth={true} margin="dense" variant="outlined"
                               value={productManagerDetailReducer.productInfo.unit_name}
                               onChange={(e) => {
                                   dispatch(ProductManagerDetailActionType.setProductInfo({name: "unit_name",value: e.target.value}))
                               }}
                    />
                </Grid>
                <Grid item sm={3}>
                    <TextField label="售价" fullWidth={true} margin="dense" variant="outlined" type="number"
                               value={productManagerDetailReducer.productInfo.price}
                               onChange={(e) => {
                                   dispatch(ProductManagerDetailActionType.setProductInfo({name: "price",value: e.target.value}))
                               }}
                        error={validation.price&&validation.price!=''}
                        helperText={validation.price}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField label="备注" fullWidth={true} margin="dense" variant="outlined" multiline rows={2}
                               value={productManagerDetailReducer.productInfo.remark}
                               onChange={(e) => {
                                   dispatch(ProductManagerDetailActionType.setProductInfo({name: "remark",value: e.target.value}))
                               }}
                    />
                </Grid>
                <Grid item xs={12}><Button variant="contained" color="primary" style={{float:'right'}} onClick={updateProduct}>修改</Button></Grid>
            </Grid>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        productManagerDetailReducer: state.ProductManagerDetailReducer,
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
    getProductInfo: (id) => {
        dispatch(productManagerDetailAction.getProductInfo(id));
    },
    updateProduct: () => {
        dispatch(productManagerDetailAction.updateProduct());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductManagerDetail)