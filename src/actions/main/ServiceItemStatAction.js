import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, ServiceItemStatActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const commonUtil =require('../../utils/CommonUtil');

export const getStatServiceOrderType = () => async (dispatch,getState) => {
    try {
        const paramsObj=getState().ServiceItemStatReducer.serviceParams;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderTypeStat?';
        let paramsObject = {
            finDateStart: commonUtil.formatDate(paramsObj.dateStart, 'yyyyMMdd'),
            finDateEnd: commonUtil.formatDate(paramsObj.dateEnd, 'yyyyMMdd'),
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: ServiceItemStatActionType.getStatServiceOrderTypeList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取服务类型统计失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const getStatServiceOrderPartType = () => async (dispatch,getState) => {
    try {
        const paramsObj=getState().ServiceItemStatReducer.serviceParams;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderPartTypeStat?';
        let paramsObject = {
            finDateStart: commonUtil.formatDate(paramsObj.dateStart, 'yyyyMMdd'),
            finDateEnd: commonUtil.formatDate(paramsObj.dateEnd, 'yyyyMMdd'),
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: ServiceItemStatActionType.getStatServiceOrderPartTypeList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取服务项目类型统计失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};