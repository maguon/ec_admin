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
    AppBar,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    makeStyles,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer
} from "@material-ui/core";
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {ProductManagerDetailActionType} from '../../types';

const productManagerDetailAction = require('../../actions/main/ProductManagerDetailAction');
const commonAction = require('../../actions/layout/CommonAction');
const formatUtil = require('../../utils/FormatUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: { marginBottom: 20},
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider
}));

// 商品- 详情
function ProductManagerDetail(props) {
    const {productManagerDetailReducer, commonReducer} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();
    useEffect(() => {
        props.getBaseSelectList();
        props.getProductInfo(id);
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

    // TAB 页面
    const [tabValue, setTabValue] = React.useState('base');
    const changeTab = (event, newValue) => {
        setTabValue(newValue);
        switch (newValue) {
            case "base":
                props.getProductInfo(id);
                break;
            case "purchase":
                props.getProductPurchase(id);
                break;
            case "storage":
                props.getProductStorage(id);
                break;
            default:
                break;
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>
                <Link to={{pathname: '/product_manager', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"/>
                    </IconButton>
                </Link>
                商品 - <span>{productManagerDetailReducer.productInfo.product_name}（{productManagerDetailReducer.productInfo.id}）</span>
            </Typography>
            <Divider light className={classes.divider}/>

            <TabContext value={tabValue}>
                <AppBar position="static" color="default">
                    <TabList onChange={changeTab} indicatorColor="primary" variant="fullWidth" textColor="primary">
                        <Tab label="基本信息" value="base" />
                        <Tab label="采购记录" value="purchase" />
                        <Tab label="库存" value="storage" />
                    </TabList>
                </AppBar>

                <TabPanel value="base">
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            <Autocomplete id="condition-category" fullWidth={true} disableClearable={true}
                                          options={commonReducer.categoryList}
                                          getOptionLabel={(option) => option.category_name}
                                          onChange={(event, value) => {
                                              // 将当前选中值 赋值 reducer
                                              dispatch(ProductManagerDetailActionType.setProductInfo({name: "category", value: value}));
                                              // 清空 商品子分类
                                              dispatch(ProductManagerDetailActionType.setProductInfo({name: "category_sub", value: null}));
                                              // 根据选择内容，刷新 商品子分类 列表
                                              dispatch(commonAction.getCategorySubList(value.id));
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
                                              dispatch(ProductManagerDetailActionType.setProductInfo({name: "category_sub", value: value}));
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
                                              dispatch(ProductManagerDetailActionType.setProductInfo({name: "brand", value: value}));
                                              // 清空 商品子分类
                                              dispatch(ProductManagerDetailActionType.setProductInfo({name: "brand_model", value: null}));
                                              // 根据选择内容，刷新 商品子分类 列表
                                              dispatch(commonAction.getBrandModelList(value.id));
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
                                              dispatch(ProductManagerDetailActionType.setProductInfo({name: "brand_model", value: value}));
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
                            <TextField label="备注" fullWidth={true} margin="dense" variant="outlined" multiline rows={4}
                                       value={productManagerDetailReducer.productInfo.remark}
                                       onChange={(e) => {
                                           dispatch(ProductManagerDetailActionType.setProductInfo({name: "remark",value: e.target.value}))
                                       }}
                            />
                        </Grid>
                        <Grid item xs={12}><Button variant="contained" color="primary" style={{float:'right'}} onClick={updateProduct}>修改</Button></Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value="purchase">
                    <TableContainer component={Paper}>
                        <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="default" className={classes.head} align="center">采购单号</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">供应商</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">商品</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">单位成本</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">采购数量</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">总成本</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">采购日期</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">备注</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productManagerDetailReducer.purchaseList.map((row) => (
                                    <TableRow className={classes.tableRow} key={row.id}>
                                        <TableCell padding="" align="center">{row.purchase_id}</TableCell>
                                        <TableCell padding="" align="center">{row.supplier_name}</TableCell>
                                        <TableCell padding="" align="center">{row.product_name}</TableCell>
                                        <TableCell padding="" align="center">{row.unit_cost}</TableCell>
                                        <TableCell padding="" align="center">{row.purchase_count}</TableCell>
                                        <TableCell padding="" align="center">{row.total_cost}</TableCell>
                                        <TableCell padding="" align="center">{formatUtil.getDate(row.created_on)}</TableCell>
                                        <TableCell padding="" align="left">{row.price}</TableCell>
                                    </TableRow>
                                ))}

                                {productManagerDetailReducer.purchaseList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={8} style={{textAlign: 'center'}}>暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value="storage">
                    <TableContainer component={Paper}>
                        <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="default" className={classes.head} align="center">仓库</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">仓库分区</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">供应商</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">商品</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">采购单号</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">单价</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">数量</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">仓储日期</TableCell>
                                    <TableCell padding="default" className={classes.head} align="center">备注</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productManagerDetailReducer.storageList.map((row) => (
                                    <TableRow className={classes.tableRow} key={row.id}>
                                        <TableCell padding="" align="center">{row.storage_name}</TableCell>
                                        <TableCell padding="" align="center">{row.storage_area_name}</TableCell>
                                        <TableCell padding="" align="center">{row.supplier_name}</TableCell>
                                        <TableCell padding="" align="center">{row.product_name}</TableCell>
                                        <TableCell padding="" align="center">{row.purchase_id}</TableCell>
                                        <TableCell padding="" align="center">{row.unit_cost}</TableCell>
                                        <TableCell padding="" align="center">{row.storage_count}</TableCell>
                                        <TableCell padding="" align="center">{row.date_id}</TableCell>
                                        <TableCell padding="" align="left">{row.remark}</TableCell>
                                    </TableRow>
                                ))}

                                {productManagerDetailReducer.storageList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={8} style={{textAlign: 'center'}}>暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
            </TabContext>
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
    getProductInfo: (id) => {
        dispatch(productManagerDetailAction.getProductInfo(id));
    },
    updateProduct: () => {
        dispatch(productManagerDetailAction.updateProduct());
    },
    // 采购记录
    getProductPurchase: (id) => {
        dispatch(productManagerDetailAction.getProductPurchase(id));
    },
    // 库存
    getProductStorage: (id) => {
        dispatch(productManagerDetailAction.getProductStorage(id));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductManagerDetail)