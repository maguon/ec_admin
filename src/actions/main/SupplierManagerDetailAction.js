import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType, SupplierManagerActionType, SupplierManagerDetailActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 采购管理 -> 供应商 详情
export const getSupplierManagerInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier?supplierId='+params;
        // 检索URL
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: SupplierManagerDetailActionType.getSupplierInfo, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
