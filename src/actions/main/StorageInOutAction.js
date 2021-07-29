import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageInOutActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

// TAB：采购入库 列表检索
export const getPurchaseItemStorage = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().StorageInOutReducer.purchaseItemStorage.size;
        // 检索条件
        const queryParams = getState().StorageInOutReducer.purchaseParams;
        let conditionsObj = {
            storageStatus: queryParams.storageStatus,
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

// TAB：采购入库 采购商品入库MODAL 中 采购商品退货列表
export const getPurchaseItemRefund = (purchaseItemId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefund?purchaseItemId=' + purchaseItemId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: StorageInOutActionType.getPurchaseItemRefund, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取退货列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// TAB：采购入库 采购商品入库MODAL 确认入库
export const putInStorage = (data) => async (dispatch, getState) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchase/' + data.purchaseItem.purchase_id + '/purchaseItem/'+ data.purchaseItem.purchase_item_id  +'/storageStatus';
        const params = {
            storageId: data.storage == null ? '' : data.storage.id,
            storageAreaId: data.storageArea == null ? '' : data.storageArea.id,
            storageCount: data.productCnt,
            remark: data.remark
        };
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            dispatch(getPurchaseItemStorage(getState().StorageInOutReducer.purchaseItemStorage.start));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// TAB：退货出库 列表查询
export const getPurchaseRefund = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().StorageInOutReducer.purchaseRefundData.size;
        // 检索条件
        const queryParams = getState().StorageInOutReducer.refundParams;
        let conditionsObj = {
            refundStorageFlag: queryParams.refundStorageFlag,
            paymentStatus: queryParams.paymentStatus,
            transferCostType: queryParams.transferCostType,
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

// TAB：退货出库 退货出库MODAL 获取仓库商品
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

// TAB：退货出库 退货出库MODAL 取得退货信息
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

// TAB：退货出库 退货出库MODAL 确定退货
export const refundStorage = (data) => async (dispatch, getState) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefund/' + data.purchaseRefund.id + '/storageProductRel/'+ data.storageProduct.id  +'/refundStorage';
        const params = {
            remark: data.remark
        };
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            dispatch(getPurchaseRefund(getState().StorageInOutReducer.purchaseRefundData.start));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// TAB：订单出库 列表查询
export const getOrderItemProdStorage = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().StorageInOutReducer.orderOutData.size;
        // 检索条件
        const queryParams = getState().StorageInOutReducer.orderOutParams;
        let conditionsObj = {
            // 状态
            status: queryParams.orderItemStatus,
            // 订单ID
            orderId: queryParams.orderId,
            // 领用人
            reUserId: queryParams.reUser === null ? '' : queryParams.reUser.id,
            // 订单日期
            orderDateStart: commonUtil.getDateFormat(queryParams.orderDateStart),
            orderDateEnd: commonUtil.getDateFormat(queryParams.orderDateEnd),
            // 商品ID
            productId: queryParams.productId,
            // 供应商
            supplierId: queryParams.supplier === null ? '' : queryParams.supplier.id,
            // 仓库
            storageId: queryParams.storage === null ? '' : queryParams.storage.id,
            // 仓库分区
            storageAreaId: queryParams.storageArea === null ? '' : queryParams.storageArea.id,
        };

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderItemProdStorage?start=' + start + '&size=' + size;
        console.log('',url);
        // 检索条件
        let conditions =  httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().StorageInOutReducer.orderOutData;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageInOutActionType.setOrderOutData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取订单出库列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// TAB：订单出库 MODAL 商品库存select列表查询
export const getStorageProduct = (productId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRel?productId=' + productId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        console.log('',url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: StorageInOutActionType.setStorageProductList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取仓库商品列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// TAB：订单出库 MODAL 确定出库
export const outOrderProduct = (data) => async (dispatch, getState) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRel/' + data.storageProduct.id + '/storageProductRelDetail';
        const params = {
            // 出库
            storageType: sysConst.STORAGE_OP_TYPE[1].value,
            // 订单出库
            storageSubType: sysConst.STORAGE_OP_EXPORT_TYPE[3].value,
            // 商品数量
            storageCount: parseFloat(data.orderItem.prod_count),
            // 领用人
            reUserId: data.reUser === null ? '' : data.reUser.id,
            // 订单
            orderId: data.orderItem.order_id,
            orderProdId: data.orderItem.prod_id,
            remark: data.remark
        };
        console.log('',url);
        console.log('',params);
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        console.log('',res);
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            dispatch(getOrderItemProdStorage(getState().StorageInOutReducer.orderOutData.start));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// TAB：订单出库 MODAL 取得出库信息
export const getOrderOutModalDataList = (orderItemId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRelDetail?orderProdId=' + orderItemId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: StorageInOutActionType.setStorageProductList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取商品出库详情失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// TAB：出入库 列表查询
export const getStorageProductRelDetailList = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
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

// TAB：出入库 列表检索条件
const getParams = () => (dispatch, getState) => {
    // 检索条件
    const queryParams = getState().StorageInOutReducer.storageProductDetailParams;
    let conditionsObj = {
        storageType: queryParams.storageType,
        storageSubType: queryParams.storageSubType,
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

// TAB：出入库 下载CSV
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