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
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//采购管理 -> 修改
export const updatePurchaseDetailInfo = (params) => async (dispatch, getState) => {
    try {
        const params = getState().PurchaseDetailReducer.purchaseDetailInfo;
        var paramsObj={
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
            dispatch(getPurchaseDetailInfo(id));
            Swal.fire("修改成功", "", "success");
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
        var paramsObj={
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