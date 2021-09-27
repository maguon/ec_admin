import {apiHost} from "../../config";
import {AppActionType, ClientInformationActionType} from "../../types";
import Swal from "sweetalert2";
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const ClientInformationDetailAction = require('../../actions/main/ClientInformationDetailAction');
export const getUserArray = () => async (dispatch) => {
    try {
        // admin用户 检索 URL
        const url = apiHost + '/api/user/'+ localUtil.getSessionItem(sysConst.LOGIN_USER_ID) +'/user';

        // 发送 get 请求
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: ClientInformationActionType.getClientInformationUserList, payload: res.rows})
            } else {
                Swal.fire('查询失败', res.msg, 'warning');
            }
        } else if (!res.success) {
            Swal.fire('查询失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const getClientInformationList=(params)=>async (dispatch,getState) => {
    try {
        const start = params;
        // 检索条件：每页数量
        const size = getState().ClientInformationReducer.size;
        // 检索条件
        const paramsObj=getState().ClientInformationReducer.queryClientObj;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/client?start=' + start + '&size=' + size;
        let paramsObject = {
            tel:paramsObj.tel,
            clientSerial:paramsObj.clientSerial,
            clientSerialDetail:paramsObj.clientSerialDetail,
            referUser :paramsObj.referUser==null?'':paramsObj.referUser.id,
            dateIdStart: commonUtil.formatDate(paramsObj.dateIdStart, 'yyyyMMdd'),
            dateIdEnd: commonUtil.formatDate(paramsObj.dateIdEnd, 'yyyyMMdd'),
            sourceType:paramsObj.sourceType==null?'':paramsObj.sourceType.value,
            clientAgentId:paramsObj.clientAgentId==null?'':paramsObj.clientAgentId.id,
            status:paramsObj.status==null?'':paramsObj.status.value,
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: ClientInformationActionType.setClientInformationListStart, payload: start});
            dispatch({type: ClientInformationActionType.setClientInformationListDataSize, payload: res.rows.length});
            dispatch({type: ClientInformationActionType.getClientInformationList, payload: res.rows.slice(0, size - 1)});
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
        if (status === 0) {
            newStatus = 1
        } else {
            newStatus = 0
        }
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/client/' + id + '/status?status=' + newStatus;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新列表
            dispatch(getClientInformationList(getState().ClientInformationReducer.start));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const getClientAgent=() =>async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/clientAgent';
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: ClientInformationActionType.getClientAgentList, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取客户信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const addClientInformation = (params) => async (dispatch) => {
    try {
        const param =  {
            "remark": params.remark,
            "name": params.name,
            "tel": params.tel,
            "address": params.address,
            "clientSerial": params.clientSerial,
            "clientSerialDetail": params.clientSerialDetail,
            "modelId": 0,
            "modelName": "",
            "clientAgentId": params.clientAgentId==null?'':params.clientAgentId.id,
            "referUser":params.referUser==null?'':params.referUser.id,
            "sourceType": params.sourceType,
            "matchBrandId": params.modalData.brandName==null?0:params.modalData.brandName.id,
            "matchModelId": params.modalData.matchModelName==null?0:params.modalData.matchModelName.id
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/client';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, param);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch(getClientInformationList(0));
            Swal.fire("新增成功", "", "success");
            // 刷新列表

        } else if (res.success === false) {
            Swal.fire("新增失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const getProdMatchBrandList = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchBrand';

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: ClientInformationActionType.setProdMatchBrandList, payload: res.rows});
            dispatch(ClientInformationDetailAction.getMatchModelList(res.rows[0].id));
        } else if (!res.success) {
            Swal.fire('获取品牌信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getProdMatchModelList = (brandId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchModel?matchBrandId=' + brandId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: ClientInformationActionType.setProdMatchModelList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取车型信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};