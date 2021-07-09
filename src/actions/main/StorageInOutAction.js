import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageInOutActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getPurchaseItemStorage = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().StorageInOutReducer.purchaseItemStorage.size;
        // 检索条件
        const queryParams = getState().StorageInOutReducer.purchaseParams;
        let conditionsObj = {
            storageStatus: queryParams.storageStatus == null ? '' : queryParams.storageStatus,
            storageId: queryParams.storage == null ? '' : queryParams.storage.id,
            storageAreaId: queryParams.storageArea == null ? '' : queryParams.storageArea.id,
            supplierId: queryParams.supplier === null ? '' : queryParams.supplier.id,
            purchaseId: queryParams.purchaseId,
            productId: queryParams.productId,
        };

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseItemStorage?start=' + start + '&size=' + size;
        // 检索条件
        let conditions =  httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().StorageInOutReducer.purchaseItemStorage;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageInOutActionType.getPurchaseItemStorageData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取采购入库列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const putInStorage = (data) => async (dispatch, getState) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchase/' + data.purchaseItem.purchase_id + '/purchaseItem/'+ data.purchaseItem.purchase_item_id  +'/storageStatus';
        const params = {
            storageId: data.storage == null ? '' : data.storage.id,
            storageAreaId: data.storageArea == null ? '' : data.storageArea.id,
            remark: data.remark
        };
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            dispatch(getPurchaseItemStorage({dataStart: getState().StorageInOutReducer.purchaseItemStorage.start}));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getPurchaseRefund = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().StorageInOutReducer.purchaseRefundData.size;
        // 检索条件
        const queryParams = getState().StorageInOutReducer.refundParams;
        let conditionsObj = {
            refundStorageFlag: queryParams.refundStorageFlag == null ? '' : queryParams.refundStorageFlag,
            paymentStatus: queryParams.paymentStatus == null ? '' : queryParams.paymentStatus,
            transferCostType: queryParams.transferCostType == null ? '' : queryParams.transferCostType,
            supplierId: queryParams.supplier === null ? '' : queryParams.supplier.id,
            purchaseId: queryParams.purchaseId,
            productId: queryParams.productId,
        };

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefund?start=' + start + '&size=' + size + '&storageType=' + sysConst.STORAGE_TYPE[1].value;
        // 检索条件
        let conditions =  httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().StorageInOutReducer.purchaseRefundData;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageInOutActionType.getPurchaseRefundData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取退货出库列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getStorageProductRel = (purchaseItemId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRel?purchaseItemId=' + purchaseItemId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: StorageInOutActionType.setStorageProductRelList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取仓库商品列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getStorageProductRelDetail = (storageProductRelDetailId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRelDetail?storageProductRelDetailId=' + storageProductRelDetailId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: StorageInOutActionType.setStorageProductRelDetail, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取仓库商品详情失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const refundStorage = (data) => async (dispatch, getState) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefund/' + data.purchaseRefund.id + '/storageProductRel/'+ data.storageProduct.id  +'/refundStorage';
        const params = {
            remark: data.refundRemark
        };
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            dispatch(getPurchaseRefund({dataStart: getState().StorageInOutReducer.purchaseRefundData.start}));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getStorageProductRelDetailList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().StorageInOutReducer.storageProductDetail.size;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRelDetail?start=' + start + '&size=' + size;
        // 检索条件
        let conditions =  dispatch(getParams());
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().StorageInOutReducer.storageProductDetail;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageInOutActionType.setStorageProductDetail, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取出入库记录列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

const getParams = () => (dispatch, getState) => {
    // 检索条件
    const queryParams = getState().StorageInOutReducer.storageProductDetailParams;
    let conditionsObj = {
        storageType: queryParams.storageType == null ? '' : queryParams.storageType,
        storageSubType: queryParams.storageSubType == null ? '' : queryParams.storageSubType,
        storageId: queryParams.storage == null ? '' : queryParams.storage.id,
        storageAreaId: queryParams.storageArea == null ? '' : queryParams.storageArea.id,
        supplierId: queryParams.supplier === null ? '' : queryParams.supplier.id,
        purchaseId: queryParams.purchaseId,
        productId: queryParams.productId,
        dateIdStart: commonUtil.getDateFormat(queryParams.dateIdStart),
        dateIdEnd: commonUtil.getDateFormat(queryParams.dateIdEnd)
    };
    return httpUtil.objToUrl(conditionsObj);
};

export const downLoadCsv = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = 'http://' + apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRelDetail.csv?1=1';
        // 检索条件
        let conditions =  dispatch(getParams());
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};