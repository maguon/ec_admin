import {PurchaseActionType, AppActionType} from '../../types';
import {apiHost} from "../../config";
import Swal from "sweetalert2";
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 采购管理 -> 采购 获取供应商列表
export const getSupplierList = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier?';
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: PurchaseActionType.getSupplierList, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
// 采购管理 -> 采购 获取商品列表
export const getCategoryList = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/category?';
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: PurchaseActionType.getCategoryList, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
// 采购管理 -> 采购 获取二级商品列表
export const getCategorySubList = (params) => async (dispatch, getState) => {
    try {
        params=params.split('&')[0];
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/categorySub?categoryId='+params;
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: PurchaseActionType.getCategorySubList, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
// 采购管理 -> 供应商 取得画面列表
export const getPurchaseArray = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：每页数量
        const size = getState().PurchaseReducer.size;
        // 检索条件
        const paramsObj=getState().PurchaseReducer.queryObj;


        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchase?size=' + size;
        let conditions = httpUtil.objToUrl(paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: PurchaseActionType.setPurchaseListDataSize, payload: res.rows.length});
            dispatch({type: PurchaseActionType.setPurchaseArray, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

