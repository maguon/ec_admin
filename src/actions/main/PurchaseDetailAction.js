import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType, PurchaseDetailActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
// 采购管理详情 -> 获取采购信息
export const getPurchaseDetailInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchase?purchaseId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: PurchaseDetailActionType.getPurchaseDetailInfo, payload: res.rows[0]});
            dispatch({type: PurchaseDetailActionType.getProductDetailArray, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getPurchaseItemDetailInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchaseItem?purchaseId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: PurchaseDetailActionType.getPurchaseDetailItemInfo, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取采购信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//采购管理 -> 修改
export const updatePurchaseDetailInfo = () => async (dispatch, getState) => {
    try {
        const params = getState().PurchaseDetailReducer.purchaseDetailInfo;
        const paramsObj={
            "remark": params.remark,
            "transferCostType": params.transfer_cost_type,
            "transferCost": params.transfer_cost
        }
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchase/'+params.id, paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}
//采购管理 -> 修改状态
export const updatePurchaseDetailInfoStatus = (id,params) => async (dispatch, getState) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase/'+id+'/status?status=' + params;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            Swal.fire("修改成功", "", "success");
            dispatch(getPurchaseDetailInfo(id));
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}

export const updatePurchaseDetailItemInfo = (paramsId,index) => async (dispatch, getState) => {
    try {
        const params = getState().PurchaseDetailReducer.purchaseDetailItemInfo[index];
        const paramsObj={
            "unitCost":params.unit_cost,
            "purchaseCount": params.purchase_count,
            "remark": params.remark
        }
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchaseItem/'+paramsId, paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}

//采购管理 -> 退货tab
export const getPurchaseRefundDetailInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchaseRefund?purchaseId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: PurchaseDetailActionType.getPurchaseRefundDetailInfo, payload: res.rows.slice(0,10)});
        } else if (res.success === false) {
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getStorageProductArray = (params) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageProductRel?purchaseId='+params;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: PurchaseDetailActionType.getStorageProductArray, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取商品列表失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};


export const addRefundDetailItem = (id,item,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addTransferRemark,addStorageType) => async (dispatch) => {
    try {
        let params = {
            "remark": addTransferRemark,
            "supplierId": item.supplier_id,
            "productId": item.product_id,
            "productName": item.product_name,
            "storageType": addStorageType,
            "refundUnitCost": addUnitCost,
            "refundCount": addPurchaseCount,
            "transferCostType": addTransferCostType,
            "transferCost": addTransferCost,
            "orderId": 0
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase/'+id+'/purchaseItem/'+item.id+'/purchaseRefund';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getPurchaseRefundDetailInfo(id));
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const addUniqueInfo = (param) => async (dispatch) => {
    try {
        let params = {
            purchaseId: param.id,
            productName: param.productName,
            uniqueIdArray: param.inputFile
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseItem/'+param.purchaseItemId+'/product/'+param.productId+'/uniqueRel';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getUniqueList(param.purchaseItemId));
        } else if (!res.success) {
            dispatch({type: PurchaseDetailActionType.addFlag, payload: true});
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getUniqueList=(params) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseItemUniqueRel?purchaseItemId='+params;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: PurchaseDetailActionType.getUniqueList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取编码列表失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}

export const deleteRel =(params) => async (dispatch) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseItem/' + params.purchaseItem + '/product/'+params.product+'/purchaseItemUniqueRel/'+params.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpDelete(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getUniqueList(params.purchaseItem));
        } else if (!res.success) {}
    } catch (err) {
        /* Swal.fire("操作失败", err.message, "error");*/
    }
}
