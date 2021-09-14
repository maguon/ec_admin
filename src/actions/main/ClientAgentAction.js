import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {ClientAgentActionType, AppActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
//取得画面列表
export const getClientList = (params) => async (dispatch, getState) => {
    try {
        const start = params;
        // 检索条件：每页数量
        const size = getState().ClientAgentReducer.size;
        // 检索条件
        const paramsObj=getState().ClientAgentReducer.queryClientObj;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/clientAgent?start=' + start + '&size=' + size;
        let paramsObject = {
            clientType: paramsObj.clientType == null? '' : paramsObj.clientType.value,
            dateIdStart: commonUtil.formatDate(paramsObj.dateIdStart, 'yyyyMMdd'),
            dateIdEnd: commonUtil.formatDate(paramsObj.dateIdEnd, 'yyyyMMdd'),
            sourceType:paramsObj.sourceType==null?'':paramsObj.sourceType.value,
            status:paramsObj.status==null?'':paramsObj.status.value,
            idSerial:paramsObj.idSerial
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: ClientAgentActionType.setClientListStart, payload: start});
            dispatch({type: ClientAgentActionType.setClientListDataSize, payload: res.rows.length});
            dispatch({type: ClientAgentActionType.getClientList, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
            Swal.fire('获取列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}
export const changeStatus = (id, status) => async (dispatch, getState) => {
    try {
        // 状态
        let newStatus;
        if (status === sysConst.USE_FLAG[0].value) {
            newStatus = sysConst.USE_FLAG[1].value
        } else {
            newStatus = sysConst.USE_FLAG[0].value
        }
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/clientAgent/' + id + '/status?status=' + newStatus;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新列表
            dispatch(getClientList(getState().ClientAgentReducer.start));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
