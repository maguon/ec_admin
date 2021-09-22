import Swal from "sweetalert2";
import {apiHost} from "../../config";
import {PurchaseRefundActionType, AppActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
export const getPurchaseRefundList = () => async (dispatch, getState) => {
    try {
        // 检索条件：每页数量
        const size = getState().PurchaseRefundReducer.size;
        // 检索条件
        const paramsObj=getState().PurchaseRefundReducer.queryPurchaseRefundObj;
        paramsObj.dateIdStart =paramsObj.dateIdStart==''?'':commonUtil.getDateFormat(paramsObj.dateIdStart);
        paramsObj.dateIdEnd =paramsObj.dateIdEnd==''?'':commonUtil.getDateFormat(paramsObj.dateIdEnd);
        paramsObj.paymentStatus =paramsObj.paymentStatus=='-1'?'': paramsObj.paymentStatus;
        paramsObj.status =paramsObj.status=='-1'?'': paramsObj.status;

        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchaseRefund?size=' + size;
        let conditions = httpUtil.objToUrl(paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: PurchaseRefundActionType.setPurchaseRefundListDataSize, payload: res.rows.length});
            dispatch({type: PurchaseRefundActionType.getPurchaseRefundList, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
            Swal.fire('获取采购列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const getPurchaseList = () => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase?'
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: PurchaseRefundActionType.setPurchaseItem, payload: res.rows});
        } else{
            Swal.fire('获取失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const getPurchaseItem = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseItemStorage?purchaseId='+params

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: PurchaseRefundActionType.setProductArray, payload: res.rows});
        }else{
            Swal.fire('获取失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const addPurchaseRefundItem = (purchaseRefundId,addProduct,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addStorageType,addTransferRemark) => async (dispatch, getState) => {
    try {
        const params = {
            "remark":addTransferRemark,
            "supplierId":addProduct.supplier_id,
            "productId": addProduct.product_id,
            "productName":addProduct.product_name,
            "storageType": addStorageType,
            "refundUnitCost": addUnitCost,
            "refundCount": addPurchaseCount,
            "transferCostType": addTransferCostType,
            "transferCost": addTransferCost,
            "orderId": 0
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase/'+purchaseRefundId+'/purchaseItem/'+addProduct.purchase_item_id+'/purchaseRefund';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getPurchaseRefundList())
            Swal.fire("新增成功", "", "success");
        } else if (!res.success) {
            Swal.fire("新增失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const updatePurchaseRefundDetailInfo = (putPurchaseRefundId,putPurchaseItemId,putTransferRemark,putStorageType,putUnitCost,putPurchaseCount,putTransferCostType,putTransferCost) => async (dispatch, getState) => {
    try {
        const params = {
            "remark": putTransferRemark,
            "storageType":putStorageType,
            "refundUnitCost": putUnitCost,
            "refundCount": putPurchaseCount,
            "transferCostType": putTransferCostType,
            "transferCost": putTransferCost
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseItem/'+ putPurchaseItemId+'/purchaseRefund/'+putPurchaseRefundId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getPurchaseRefundList())
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const updateRefundStatus = (id) => async (dispatch, getState) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseRefund/' + id + '/status?status=7';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新列表
            dispatch(getPurchaseRefundList())
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const getStorageProductRel = (id) => async (dispatch) => {
    try {
        if(id==null){
            dispatch({type: PurchaseRefundActionType.setStorageProductRelArray, payload:[]});
        }else {
            // 基本检索URL
            let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
                + '/storageProductRelDetail?storageProductRelDetailId=' + id;

            dispatch({type: AppActionType.showLoadProgress, payload: true});
            let res = await httpUtil.httpGet(url);
            dispatch({type: AppActionType.showLoadProgress, payload: false});
            if (res.success) {
                dispatch({type: PurchaseRefundActionType.setStorageProductRelArray, payload: res.rows});
            } else if (!res.success) {
                Swal.fire("获取仓库商品详情失败", res.msg, "warning");
            }
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
