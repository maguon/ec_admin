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

function StoragePanel(props) {
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
                product: null,
                standardType: null,
                status: null
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
            // 售价 *
            price: '0',
            // 标准类型 *
            standardType: 1,
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
        if (!modalData.price) {
            validateObj.price ='请输入售价';
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
            <Typography gutterBottom className={classes.title}>仓储主控</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    asdfasdfasdfasdfasdf
                </Grid>

            </Grid>


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
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StoragePanel)
