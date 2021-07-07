import {PurchaseReturnActionType, AppActionType} from '../../types';
import {apiHost} from "../../config";
import Swal from "sweetalert2";
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');

export const getPurchaseReturnList = (params) => async (dispatch, getState) => {
    try {

        // 检索条件：每页数量
        const size = getState().PurchaseReturnReducer.size;
        // 检索条件
        const paramsObj=getState().PurchaseReturnReducer.queryPurchaseReturnObj;
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
            dispatch({type: PurchaseReturnActionType.setPurchaseReturnListDataSize, payload: res.rows.length});
            dispatch({type: PurchaseReturnActionType.getPurchaseReturnList, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
            Swal.fire('获取采购列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getPurchaseList = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase?'

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success&&res.rows.length>0) {
            dispatch({type: PurchaseReturnActionType.setPurchaseItem, payload: res.rows});
        } else if (res.success&&res.rows.length==0) {
            Swal.fire('未查到此采购ID', res.msg, 'warning');
        }else{
            Swal.fire('获取失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const getPurchaseItem = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseItem?purchaseId='+params

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: PurchaseReturnActionType.setProductArray, payload: res.rows});
        }else{
            Swal.fire('获取失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const postPurchaseReturnItem = (purchaseReturnId,addProduct,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addStorageType,addTransferRemark) => async (dispatch, getState) => {
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
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase/'+purchaseReturnId+'/purchaseItem/'+addProduct.id+'/purchaseRefund';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getPurchaseReturnList())
            Swal.fire("新增成功", "", "success");
        } else if (!res.success) {
            Swal.fire("新增失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const putPurchaseReturnDetailInfo = (putPurchaseRefundId,putPurchaseItemId,putTransferRemark,putStorageType,putUnitCost,putPurchaseCount,putTransferCostType,putTransferCost) => async (dispatch, getState) => {
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
            dispatch(getPurchaseReturnList())
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};




