import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {SupplierActionType, AppActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 采购管理 -> 供应商 取得画面列表
export const getSupplierList = (params) => async (dispatch, getState) => {
    try {
        const start = params;
        // 检索条件：每页数量
        const size = getState().SupplierReducer.size;
        // 检索条件
        const paramsObj=getState().SupplierReducer.queryObj;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier?start=' + start + '&size=' + size;
        let paramsObject = {
            supplierType: paramsObj.supplierType == null? '' : paramsObj.supplierType.value,
            supplierId:paramsObj.supplierId==null?'':paramsObj.supplierId.id
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: SupplierActionType.setSupplierListStart, payload: start});
            dispatch({type: SupplierActionType.setSupplierListDataSize, payload: res.rows.length});
            dispatch({type: SupplierActionType.getSupplierList, payload: res.rows.slice(0, size - 1)});
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
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPost(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier', params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch(getSupplierList(0));
            Swal.fire("增加成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};