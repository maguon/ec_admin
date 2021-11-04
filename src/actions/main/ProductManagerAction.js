import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, ProductManagerActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getProductList = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().ProductManagerReducer.productData.size;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/product?start=' + start + '&size=' + size;
        // 检索条件
        let conditions = dispatch(getParams());
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().ProductManagerReducer.productData;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: ProductManagerActionType.setProductData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取商品列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getProductParamsList = () => async (dispatch,getState) => {
    try {
        let url=apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/product?';
        const queryParams = getState().ProductManagerReducer.queryParams;
            let paramsObject = {
                categoryId: queryParams.category == null ? '' : queryParams.category.id,
                categorySubId: queryParams.categorySub == null ? '' : queryParams.categorySub.id,
                brandId: queryParams.brand === null ? '' : queryParams.brand.id,
                brandModelId: queryParams.brandModel == null ? '' : queryParams.brandModel.id,
            };
            let conditions = httpUtil.objToUrl(paramsObject);
            // 检索URL

            if(conditions.length> 0){
                url=url + "&" + conditions;
                dispatch({type: AppActionType.showLoadProgress, payload: true});
                const res = await httpUtil.httpGet(url);
                dispatch({type: AppActionType.showLoadProgress, payload: false});
                if (res.success === true) {
                    dispatch({type: ProductManagerActionType.setProductManagerArray, payload: res.rows});
                } else if (res.success === false) {
                    Swal.fire('获取商品列表信息失败', res.msg, 'warning');
                }
            }else {
                dispatch({type: ProductManagerActionType.setProductManagerArray, payload:[]});
            }

    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const changeStatus = (id, status) => async (dispatch, getState) => {
    try {
        // 状态
        let newStatus;
        if (status === 0) {
            newStatus = 1
        } else {
            newStatus = 0
        }

        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/product/' + id + '/status?status=' + newStatus;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新列表
            dispatch(getProductList(getState().ProductManagerReducer.productData.start));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveModalData = (modalData) => async (dispatch, getState) => {
    try {
        const params = {
            remark: modalData.remark,
            productName: modalData.productName,
            productSName: modalData.productSName,
            productSerial: modalData.productSerial,
            productAddress: modalData.productAddress,
            categoryId: modalData.category.id,
            categorySubId: modalData.categorySub.id,
            brandId: modalData.brand.id,
            brandModelId: modalData.brandModel.id,
            standardType: modalData.standardType,
            unitName: modalData.unitName,
            priceType: modalData.priceType,
            fixedPrice: modalData.fixedPrice,
            priceRaiseRatio: modalData.priceRaiseRatio,
            priceRaiseValue: modalData.priceRaiseValue,
            lastPurchasePrice: modalData.lastPurchasePrice,
            storageMin: modalData.storageMin,
            storageMax: modalData.storageMax,
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/product';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            // 刷新列表
            dispatch(getProductList(getState().ProductManagerReducer.productData.start));
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

const getParams = () => (dispatch, getState) => {
    // 检索条件
    const queryParams = getState().ProductManagerReducer.queryParams;
    let conditionsObj = {
        categoryId: queryParams.category == null ? '' : queryParams.category.id,
        categorySubId: queryParams.categorySub == null ? '' : queryParams.categorySub.id,
        brandId: queryParams.brand === null ? '' : queryParams.brand.id,
        brandModelId: queryParams.brandModel == null ? '' : queryParams.brandModel.id,
        productId: queryParams.productId == null ? '' : queryParams.productId.id,
        standardType: queryParams.standardType == null ? '' : queryParams.standardType,
        status: queryParams.status == null ? '' : queryParams.status,
    };
    return httpUtil.objToUrl(conditionsObj);
};

export const downLoadCsv = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = 'http://' + apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/product.csv?1=1';
        // 检索条件
        let conditions = dispatch(getParams());
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};