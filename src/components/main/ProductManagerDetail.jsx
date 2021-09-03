import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
    AppBar,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {ProductManagerDetailActionType} from '../../types';
import {fileHost} from '../../config/index';
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";

const productManagerDetailAction = require('../../actions/main/ProductManagerDetailAction');
const commonAction = require('../../actions/layout/CommonAction');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead
}));

// 商品- 详情
function ProductManagerDetail(props) {
    const {productManagerDetailReducer, commonReducer} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();

    // TAB 页面
    const [tabValue, setTabValue] = React.useState('base');
    // 校验
    const [validation,setValidation] = useState({});
    // 商品图片
    const [productImgSrc,setProductImgSrc] = useState('');
    // 适配车型
    const [matchModel, setMatchModel] = useState(new Map());

    useEffect(() => {
        // 取得画面 select控件，基础数据
        dispatch(commonAction.getCategoryList());
        dispatch(commonAction.getBrandList());
        // 取得画面 基本信息
        dispatch(productManagerDetailAction.getProductInfo(id));
    }, []);

    useEffect(() => {
        setValidation({});
        if (productManagerDetailReducer.productInfo.brand != null && productManagerDetailReducer.productInfo.id == id) {
            // 接口数据 组装的 商品图片
            let imgUrl = "http://" + fileHost + "/api/image/" + productManagerDetailReducer.productInfo.image;
            let imgObj = new Image();
            imgObj.src = imgUrl;
            // 图片地址有效
            imgObj.onload = () => {
                setProductImgSrc(imgUrl + "?" + commonUtil.formatDate(new Date(), 'yyyy-MM-dd_hh:mm:ss S'));
            };
            // 图片地址无效，使用默认图片
            imgObj.onerror = () => {
                setProductImgSrc('/default_product.png?' + commonUtil.formatDate(new Date(), 'yyyy-MM-dd_hh:mm:ss S'));
            }
        }
    }, [productManagerDetailReducer.productInfo]);

    const validate = ()=>{
        const validateObj ={};
        if (!productManagerDetailReducer.productInfo.category_sub) {
            validateObj.category_sub ='请选择商品子分类';
        }
        if (!productManagerDetailReducer.productInfo.brand_model) {
            validateObj.brand_model ='请选择品牌型号';
        }
        if (!productManagerDetailReducer.productInfo.storage_min && productManagerDetailReducer.productInfo.storage_min !== 0) {
            validateObj.storage_min ='请输入最小库存';
        } else if (!(/^\d+$/.test(productManagerDetailReducer.productInfo.storage_min))) {
            validateObj.storage_min ='请输入大于等于0的整数';
        }
        if (!productManagerDetailReducer.productInfo.storage_max) {
            validateObj.storage_max ='请输入最大库存';
        } else if (!(/^\d+$/.test(productManagerDetailReducer.productInfo.storage_max))) {
            validateObj.storage_max ='请输入大于等于0的整数';
        }

        // 定价方式
        switch (productManagerDetailReducer.productInfo.price_type) {
            case sysConst.PRICE_TYPE[0].value:
                if (!productManagerDetailReducer.productInfo.fixed_price && productManagerDetailReducer.productInfo.fixed_price !== 0) {
                    validateObj.fixed_price ='请输入售价';
                }
                break;
            case sysConst.PRICE_TYPE[1].value:
                if (!productManagerDetailReducer.productInfo.price_raise_ratio) {
                    validateObj.price_raise_ratio ='请输入比率';
                } else if (!(/^\d+(\.\d{1,2})?$/.test(productManagerDetailReducer.productInfo.price_raise_ratio))) {
                    validateObj.price_raise_ratio ='请输入大于等于0的浮点数（最多2位小数）';
                }
                break;
            case sysConst.PRICE_TYPE[2].value:
                if (!productManagerDetailReducer.productInfo.price_raise_value && productManagerDetailReducer.productInfo.price_raise_value !== 0) {
                    validateObj.price_raise_value ='请输入加价';
                }
                break;
            default:
                break;
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const updateProduct= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            dispatch(productManagerDetailAction.updateProduct());
        }
    };

    const changeTab = async (event, newValue) => {
        setTabValue(newValue);
        switch (newValue) {
            case "base":
                // 基本信息
                dispatch(productManagerDetailAction.getProductInfo(id));
                break;
            case "match":
                // 适配车型
                dispatch(productManagerDetailAction.getCarBrandList());
                let ret = await dispatch(productManagerDetailAction.getProductMatchModel(id));
                setMatchModel(ret);
                break;
            case "purchase":
                // 采购记录
                dispatch(productManagerDetailAction.getProductPurchase(id));
                break;
            case "storage":
                // 库存
                dispatch(productManagerDetailAction.getProductStorage(id));
                break;
            default:
                break;
        }
    };

    const updateProductImg= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            // 选择文件
            let file = document.getElementById('product_image').files[0];
            if (file) {
                // 文件格式限制
                if (file.type.indexOf("image") >= 0) {
                    // 文件限制: 1M
                    let max_size = 1 * 1024 * 1024; 
                    if (file.size > max_size) {
                        Swal.fire('图片文件最大: 1MB ', "", "warning");
                    } else {
                        let formData = new FormData();
                        formData.append('image', file);
                        dispatch(productManagerDetailAction.uploadProductImg(formData));
                    }
                } else {
                    Swal.fire("请选择图片文件", "", "warning");
                }
            }
        }
    };

    const [expanded, setExpanded] = React.useState([]);
    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const clickLabel = (event, nodeIds) => {
        event.preventDefault();
        dispatch(productManagerDetailAction.getCarModelList(nodeIds))
    };

    return (
        <div className={classes.root} style={{minWidth: 960}}>
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
                        <Tab label="适配车型" value="match" />
                        <Tab label="采购记录" value="purchase" />
                        <Tab label="库存" value="storage" />
                    </TabList>
                </AppBar>

                <TabPanel value="base">
                    <Grid container spacing={2}>
                        <Grid item container sm={5} style={{textAlign: 'center', alignContent: 'center', justifyContent:'center'}}>
                            <form id="addForm" encType="multipart/form-data" method="post">
                                <div style={{alignContent: 'center', justifyContent:'center',display: 'inline-block', position: 'relative', 
                                overflow:'hidden',width: 280, height: 280, border:'1px solid grey'}}>
                                    <img style={{width: 280, height: 280,objectFit: 'cover', objectPosition: 'center'}} src={productImgSrc}/>
                                    <input id="product_image" name="product_image" type="file" onChange={updateProductImg} style={{position: 'absolute',right: 0,top: 0,fontSize: 280,opacity: 0, cursor: 'pointer'}}/>
                                </div>
                            </form>
                        </Grid>
                        <Grid item container sm={7} spacing={2}>
                            <Grid item sm={6}>
                                <Autocomplete fullWidth disableClearable
                                            options={commonReducer.categoryList}
                                            getOptionLabel={(option) => option.category_name}
                                            value={productManagerDetailReducer.productInfo.category}
                                            onChange={(event, value) => {
                                                // 将当前选中值 赋值 reducer
                                                dispatch(ProductManagerDetailActionType.setProductInfo({name: "category", value: value}));
                                                // 清空 商品子分类
                                                dispatch(ProductManagerDetailActionType.setProductInfo({name: "category_sub", value: null}));
                                                // 根据选择内容，刷新 商品子分类 列表
                                                dispatch(commonAction.getCategorySubList(value.id));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Autocomplete fullWidth disableClearable
                                            options={commonReducer.categorySubList}
                                            noOptionsText="无选项"
                                            getOptionLabel={(option) => option.category_sub_name}
                                            value={productManagerDetailReducer.productInfo.category_sub}
                                            onChange={(event, value) => {
                                                dispatch(ProductManagerDetailActionType.setProductInfo({name: "category_sub", value: value}));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"
                                                                                error={validation.category_sub&&validation.category_sub!=''}
                                                                                helperText={validation.category_sub}/>}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Autocomplete fullWidth disableClearable
                                            options={commonReducer.brandList}
                                            getOptionLabel={(option) => option.brand_name}
                                            value={productManagerDetailReducer.productInfo.brand}
                                            onChange={(event, value) => {
                                                // 将当前选中值 赋值 reducer
                                                dispatch(ProductManagerDetailActionType.setProductInfo({name: "brand", value: value}));
                                                // 清空 商品子分类
                                                dispatch(ProductManagerDetailActionType.setProductInfo({name: "brand_model", value: null}));
                                                // 根据选择内容，刷新 商品子分类 列表
                                                dispatch(commonAction.getBrandModelList(value.id));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Autocomplete fullWidth disableClearable
                                            options={commonReducer.brandModelList}
                                            noOptionsText="无选项"
                                            getOptionLabel={(option) => option.brand_model_name}
                                            value={productManagerDetailReducer.productInfo.brand_model}
                                            onChange={(e, value) => {
                                                dispatch(ProductManagerDetailActionType.setProductInfo({name: "brand_model", value: value}));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"
                                                                                error={validation.brand_model&&validation.brand_model!=''}
                                                                                helperText={validation.brand_model}/>}
                                />
                            </Grid>

                            <Grid item sm={6}>
                                <TextField label="商品名称" fullWidth margin="dense" variant="outlined" disabled
                                        value={productManagerDetailReducer.productInfo.product_name}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "product_name", value: e.target.value}))
                                        }}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <TextField label="商品别名" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                        value={productManagerDetailReducer.productInfo.product_s_name}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "product_s_name",value: e.target.value}))
                                        }}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <TextField label="产地" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                        value={productManagerDetailReducer.productInfo.product_address}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "product_address",value: e.target.value}))
                                        }}
                                />
                            </Grid>

                            <Grid item sm={6}>
                                <TextField label="序列号" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                        value={productManagerDetailReducer.productInfo.product_serial}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "product_serial",value: e.target.value}))
                                        }}
                                />
                            </Grid>
                            <Grid item sm={3}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel shrink>标准类型</InputLabel>
                                    <Select label="标准类型"
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
                                <TextField label="单位" fullWidth margin="dense" variant="outlined"
                                        value={productManagerDetailReducer.productInfo.unit_name}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "unit_name",value: e.target.value}))
                                        }}
                                />
                            </Grid>
                            <Grid item sm={3}>
                                <TextField label="最小库存" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}}
                                        value={productManagerDetailReducer.productInfo.storage_min}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "storage_min",value: e.target.value}))
                                        }}
                                        error={validation.storage_min&&validation.storage_min!=''}
                                        helperText={validation.storage_min}
                                />
                            </Grid>
                            <Grid item sm={3}>
                                <TextField label="最大库存" fullWidth margin="dense" variant="outlined" type="number" InputLabelProps={{shrink: true}}
                                        value={productManagerDetailReducer.productInfo.storage_max}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "storage_max",value: e.target.value}))
                                        }}
                                        error={validation.storage_max&&validation.storage_max!=''}
                                        helperText={validation.storage_max}
                                />
                            </Grid>

                            <Grid item sm={3}>
                                <FormControl variant="outlined" fullWidth margin="dense">
                                    <InputLabel shrink>定价方式</InputLabel>
                                    <Select label="定价方式"
                                        value={productManagerDetailReducer.productInfo.price_type}
                                        onChange={(e, value) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "price_type",value: e.target.value}))
                                        }}
                                    >
                                        {sysConst.PRICE_TYPE.map((item, index) => (
                                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {productManagerDetailReducer.productInfo.price_type == sysConst.PRICE_TYPE[0].value &&
                            <Grid item sm={3}>
                                <TextField label="售价" fullWidth margin="dense" variant="outlined" type="number"
                                        value={productManagerDetailReducer.productInfo.fixed_price}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "fixed_price",value: e.target.value || 0}))
                                        }}
                                        error={validation.fixed_price&&validation.fixed_price!=''}
                                        helperText={validation.fixed_price}
                                />
                            </Grid>}

                            {productManagerDetailReducer.productInfo.price_type == sysConst.PRICE_TYPE[1].value &&
                            <Grid item sm={3}>
                                <TextField label="比率" fullWidth margin="dense" variant="outlined" type="number"
                                        value={productManagerDetailReducer.productInfo.price_raise_ratio}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "price_raise_ratio",value: e.target.value || 1}))
                                        }}
                                        error={validation.price_raise_ratio&&validation.price_raise_ratio!=''}
                                        helperText={validation.price_raise_ratio}
                                />
                            </Grid>}

                            {productManagerDetailReducer.productInfo.price_type == sysConst.PRICE_TYPE[2].value &&
                            <Grid item sm={3}>
                                <TextField label="加价" fullWidth margin="dense" variant="outlined" type="number"
                                        value={productManagerDetailReducer.productInfo.price_raise_value}
                                        onChange={(e) => {
                                            dispatch(ProductManagerDetailActionType.setProductInfo({name: "price_raise_value",value: e.target.value || 0}))
                                        }}
                                        error={validation.price_raise_value&&validation.price_raise_value!=''}
                                        helperText={validation.price_raise_value}
                                />
                            </Grid>}

                            <Grid item sm={3}>
                                <TextField label="当前采购价" fullWidth margin="dense" variant="outlined" type="number" disabled InputLabelProps={{shrink: true}}
                                        value={productManagerDetailReducer.productInfo.last_purchase_price}
                                />
                            </Grid>

                            <Grid item sm={3}>
                                <TextField label="建议售价" fullWidth margin="dense" variant="outlined" type="number" disabled InputLabelProps={{shrink: true}}
                                        value={productManagerDetailReducer.productInfo.price_type == sysConst.PRICE_TYPE[0].value ? 
                                            productManagerDetailReducer.productInfo.fixed_price : (productManagerDetailReducer.productInfo.price_type == sysConst.PRICE_TYPE[1].value ?
                                                (productManagerDetailReducer.productInfo.last_purchase_price *  productManagerDetailReducer.productInfo.price_raise_ratio).toFixed(2) : 
                                                (parseFloat(productManagerDetailReducer.productInfo.last_purchase_price) + parseFloat(productManagerDetailReducer.productInfo.price_raise_value)).toFixed(2))}
                                />
                            </Grid>
                        </Grid>


                        <Grid item xs={12}>
                            <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={4}
                                       value={productManagerDetailReducer.productInfo.remark}
                                       onChange={(e) => {
                                           dispatch(ProductManagerDetailActionType.setProductInfo({name: "remark",value: e.target.value}))
                                       }}
                            />
                        </Grid>
                        <Grid item xs={12}><Button variant="contained" color="primary" style={{float:'right'}} onClick={updateProduct}>修改</Button></Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value="match">
                    <Grid container spacing={0}>
                        <Grid item xs={12}><Button variant="contained" color="primary" style={{float:'right'}}
                                                   onClick={()=>{dispatch(productManagerDetailAction.updateMatchModel(id, matchModel))}}>修改</Button></Grid>
                        <Grid item xs={12}>
                            <TreeView
                                className={classes.root}
                                defaultCollapseIcon={<i className="mdi mdi-chevron-down mdi-24px" />}
                                defaultExpandIcon={<i className="mdi mdi-chevron-right mdi-24px" />}
                                expanded={expanded}
                                onNodeToggle={handleToggle}
                            >
                                {productManagerDetailReducer.carBrandList.map(function (item) {
                                    return (
                                        <TreeItem
                                            key={'brand' + item.id}
                                            nodeId={'' + item.id}
                                            style={{marginLeft:80, width: '80%'}}
                                            label={item.brand_name}
                                            onLabelClick={(e) => {clickLabel(e, item.id)}}
                                        >
                                            {item.sub && item.sub.map(function (child) {
                                                return (
                                                    <TreeItem
                                                        key={'brand-model' + child.id}
                                                        nodeId={'_' + child.id}
                                                        label={<div>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={matchModel.has(child.id)}
                                                                        onChange={(e)=>{
                                                                            if (e.target.checked) {
                                                                                matchModel.set(child.id,'')
                                                                            } else {
                                                                                matchModel.delete(child.id,)
                                                                            }
                                                                            setMatchModel(new Map(matchModel));
                                                                        }}
                                                                    />
                                                                }
                                                                label={child.match_model_name + '  ' + child.id}
                                                            />
                                                        </div>}
                                                    />
                                                )
                                            })}
                                        </TreeItem>
                                    )
                                })}
                            </TreeView>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value="purchase">
                    <TableContainer component={Paper}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                                    <TableCell className={classes.tableHead} align="center">商品</TableCell>
                                    <TableCell className={classes.tableHead} align="center">单价</TableCell>
                                    <TableCell className={classes.tableHead} align="center">采购数量</TableCell>
                                    <TableCell className={classes.tableHead} align="center">总成本</TableCell>
                                    <TableCell className={classes.tableHead} align="center">采购日期</TableCell>
                                    <TableCell className={classes.tableHead} align="center">备注</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productManagerDetailReducer.purchaseList.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{row.purchase_id}</TableCell>
                                        <TableCell align="center">{row.supplier_name}</TableCell>
                                        <TableCell align="center">{row.product_name}</TableCell>
                                        <TableCell align="center">{row.unit_cost}</TableCell>
                                        <TableCell align="center">{row.purchase_count}</TableCell>
                                        <TableCell align="center">{row.total_cost}</TableCell>
                                        <TableCell align="center">{commonUtil.getDate(row.created_on)}</TableCell>
                                        <TableCell align="left">{row.price}</TableCell>
                                    </TableRow>
                                ))}

                                {productManagerDetailReducer.purchaseList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={8} align="center">暂无数据</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value="storage">
                    <TableContainer component={Paper}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="center">仓库</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓库分区</TableCell>
                                    <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                                    <TableCell className={classes.tableHead} align="center">商品</TableCell>
                                    <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                                    <TableCell className={classes.tableHead} align="center">单价</TableCell>
                                    <TableCell className={classes.tableHead} align="center">数量</TableCell>
                                    <TableCell className={classes.tableHead} align="center">仓储日期</TableCell>
                                    <TableCell className={classes.tableHead} align="center">备注</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productManagerDetailReducer.storageList.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{row.storage_name}</TableCell>
                                        <TableCell align="center">{row.storage_area_name}</TableCell>
                                        <TableCell align="center">{row.supplier_name}</TableCell>
                                        <TableCell align="center">{row.product_name}</TableCell>
                                        <TableCell align="center">{row.purchase_id}</TableCell>
                                        <TableCell align="center">{row.unit_cost}</TableCell>
                                        <TableCell align="center">{row.storage_count}</TableCell>
                                        <TableCell align="center">{row.date_id}</TableCell>
                                        <TableCell align="left">{row.remark}</TableCell>
                                    </TableRow>
                                ))}

                                {productManagerDetailReducer.storageList.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={9} align="center">暂无数据</TableCell>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductManagerDetail)