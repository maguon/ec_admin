import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {SupplierDetailActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 采购管理 -> 供应商 详情
export const getSupplierInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier?supplierId='+params;
        // 检索URL
        const res = await httpUtil.httpGet(url);
        if (res.success === true && res.rows.length>0) {
            dispatch({type: SupplierDetailActionType.getSupplierInfo, payload: res.rows[0]});
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
        var paramsObj={
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
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier/'+params.id, paramsObj);
        if (res.success === true) {
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}
