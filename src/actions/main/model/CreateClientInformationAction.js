import Swal from 'sweetalert2';
import {apiHost} from '../../../config/index';
import {CreateClientInformationActionType, AppActionType} from '../../../types';
const ClientInformationAction = require('../../main/ClientInformationAction');
const httpUtil = require('../../../utils/HttpUtils');
const localUtil = require('../../../utils/LocalUtils');
const sysConst = require('../../../utils/SysConst');
export  const openCreateClientInformation=()=> async (dispatch) => {
    dispatch({type: CreateClientInformationActionType.setInformationFlag, payload: true});
    dispatch({type: CreateClientInformationActionType.setInformationClientAgentId, payload: null});
    dispatch({type: CreateClientInformationActionType.setInformationClientSerial, payload: ''});
    dispatch({type: CreateClientInformationActionType.setInformationClientSerialDetail, payload: ''});
    dispatch({type: CreateClientInformationActionType.setInformationSourceType, payload: sysConst.SOURCE_TYPE[0].value});
    dispatch({type: CreateClientInformationActionType.setInformationName, payload: ''});
    dispatch({type: CreateClientInformationActionType.setInformationTel, payload: ''});
    dispatch({type: CreateClientInformationActionType.setInformationAddress, payload: ''});
    dispatch({type: CreateClientInformationActionType.setInformationReferUser, payload:null});
    dispatch({type: CreateClientInformationActionType.setInformationBrandName, payload: null});
    dispatch({type: CreateClientInformationActionType.setInformationMatchModelName, payload: null});
    dispatch({type: CreateClientInformationActionType.setInformationRemark, payload: ''});
}
export const getClientAgent=() =>async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/clientAgent';
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: CreateClientInformationActionType.getInformationClientAgentArray, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取客户信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
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
                dispatch({type: CreateClientInformationActionType.getInformationReferUserArray, payload: res.rows})
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

export const getProdMatchBrandList = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchBrand';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: CreateClientInformationActionType.getInformationProdMatchBrandArray, payload: res.rows});
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
            dispatch({type: CreateClientInformationActionType.getInformationProdMatchModelArray, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取车型信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const addClientAgentInformationItem = () => async (dispatch,getState) => {
    try {
        const params =getState().CreateClientInformationReducer;
        let param =  {
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
            "matchBrandId": params.brandName==null?0:params.brandName.id,
            "matchModelId": params.matchModelName==null?0:params.matchModelName.id
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/client';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, param);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch(ClientInformationAction.getClientInformationList(0));
            dispatch({type: CreateClientInformationActionType.setInformationFlag, payload: false});
            Swal.fire("新增成功", "", "success");
            // 刷新列表

        } else if (res.success === false) {
            Swal.fire("新增失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

