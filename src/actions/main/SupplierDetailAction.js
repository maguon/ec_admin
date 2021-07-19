import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType, SupplierDetailActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 采购管理 -> 供应商 详情
export const getSupplierInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier?supplierId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: SupplierDetailActionType.getSupplierInfo, payload: res.rows[0]});
        } else if (res.success === false) {
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
// 采购管理 -> 采购tab
export const getPurchaseInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchaseItem?supplierId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: SupplierDetailActionType.getPurchaseInfo, payload: res.rows.slice(0,10)});
        } else if (res.success === false) {
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

// 采购管理 -> 退货tab
export const getPurchaseRefundInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchaseRefund?supplierId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: SupplierDetailActionType.getPurchaseRefundInfo, payload: res.rows.slice(0,10)});
        } else if (res.success === false) {
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//采购管理 -> 供应商 修改
export const updateSupplier = (params) => async (dispatch, getState) => {
    try {
        const params = getState().SupplierDetailReducer.supplierInfo;
        const paramsObj={
                "remark":params.remark,
                "supplierName": params.supplier_name,
                "supplierType": params.supplier_type,
                "contactName": params.contact_name,
                "email": params.email,
                "tel": params.tel,
                "mobile": params.mobile,
                "fax": params.fax,
                "address": params.address,
                "invoiceTitle":params.invoice_title,
                "invoiceBank": params.invoice_bank,
                "invoiceBankSer": params.invoice_bank_ser,
                "invoiceAddress": params.invoice_address,
                "settleType": params.settle_type,
                "settleMonthDay": params.settle_month_day==''?0:params.settle_month_day
        }
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier/'+params.id, paramsObj);
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
