import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {SupplierManagerActionType, AppActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 采购管理 -> 供应商 取得画面列表
export const getSupplierList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：每页数量
        const size = getState().SupplierManagerReducer.size;
        // 检索条件
        const paramsObj=getState().SupplierManagerReducer.queryObj;

        paramsObj.status = paramsObj.status==-1?'': paramsObj.status;
        paramsObj.supplierType = paramsObj.supplierType==-1?'': paramsObj.supplierType;

        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier?size=' + size;
        let conditions = httpUtil.objToUrl(paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: SupplierManagerActionType.setSupplierListDataSize, payload: res.rows.length});
            dispatch({type: SupplierManagerActionType.getSupplierList, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
//添加供应商
export const addSupplier = (params) => async (dispatch) => {
    params.settleMonthDay=Number(params.settleMonthDay==''?null:params.settleMonthDay)
    try {
        const res = await httpUtil.httpPost(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier', params);
        if (res.success === true) {
            dispatch(getSupplierList());
            Swal.fire("增加成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//删除供应商
export const deleteSupplier =(params) => async (dispatch) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/supplier/' + params + '/del';
        const res = await httpUtil.httpDelete(url, {});
        if (res.success) {
            Swal.fire("删除成功", "", "success");
            // 刷新列表
            dispatch(getSupplierList());
        } else if (!res.success) {
            Swal.fire('删除失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
}
