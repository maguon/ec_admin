import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType, UserAchievementActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
export const getUserType = () => async (dispatch) => {
    try {
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/typeMenu';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: UserAchievementActionType.setTypeInfo, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取用户群组信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const getUserAchievementList = (params) => async (dispatch, getState) => {
    try {
        const start = params;
        // 检索条件：每页数量
        const size = getState().UserAchievementReducer.userData.size;
        // 检索条件
        const paramsObj=getState().UserAchievementReducer.userParams;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/orderPerfStat?start=' + start + '&size=' + size;
        let paramsObject = {
            reUserId:paramsObj.reUserId == null? '' : paramsObj.reUserId.id,
            userType: paramsObj.userType == null? '' : paramsObj.userType.id,
            finDateStart: commonUtil.formatDate(paramsObj.finDateStart, 'yyyyMMdd'),
            finDateEnd: commonUtil.formatDate(paramsObj.finDateEnd, 'yyyyMMdd'),
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().UserAchievementReducer.userData;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.userInfo = res.rows.slice(0, size - 1);
            dispatch({type: UserAchievementActionType.setUserData, payload: newData});
        } else if (res.success === false) {
            Swal.fire('获取员工绩效信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}