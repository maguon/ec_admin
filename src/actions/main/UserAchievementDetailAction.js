import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType, UserAchievementDetailActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getDeployServiceData = (id,finDateStart,finDateEnd) => async (dispatch, getState) => {
    try {
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/orderItemService?';
        let paramsObject = {
            deployUserId:id,
            finDateStart:finDateStart,
            finDateEnd:finDateEnd,
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: UserAchievementDetailActionType.setDeployServiceData, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取服务信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getCheckServiceData = (id,finDateStart,finDateEnd) => async (dispatch, getState) => {
    try {
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/orderItemService?';
        let paramsObj = {
            checkUserId:id,
            finDateStart:finDateStart,
            finDateEnd:finDateEnd,
        };
        let conditions = httpUtil.objToUrl(paramsObj);
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: UserAchievementDetailActionType.setCheckServiceData, payload:  res.rows});
        } else if (res.success === false) {
            Swal.fire('获取商品信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};