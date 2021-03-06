import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType, ClientInformationDetailActionType} from '../../types';
const ClientInformationDetailAction = require('../../actions/main/ClientInformationDetailAction');
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
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
                dispatch({type: ClientInformationDetailActionType.getReferUserDetailInfo, payload: res.rows})
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
export const getClientAgent=() =>async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/clientAgent';
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: ClientInformationDetailActionType.getClientAgentDetailInfo, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取客户信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const getClientInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/client?clientId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: ClientInformationDetailActionType.getClientInfo, payload: res.rows[0]});
        } else if (res.success === false) {
            Swal.fire('获取客户信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const updateClient = () => async (dispatch, getState) => {
    try {
        const clientInfo = getState().ClientInformationDetailReducer.clientInfo;
        const params = {
            remark: clientInfo.remark,
            name: clientInfo.name,
            tel: clientInfo.tel,
            address: clientInfo.address,
            clientSerial: clientInfo.client_serial,
            clientSerialDetail: clientInfo.client_serial_detail,
            modelId: 0,
            modelName: "",
            clientAgentId: clientInfo.client_agent_id.id,
            matchBrandId: clientInfo.match_brand_id==null?0:clientInfo.match_brand_id.id,
            matchModelId:clientInfo.match_model_id==null?0:clientInfo.match_model_id.id
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/client/' + clientInfo.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const getOrderList =(id,params) => async (dispatch, getState) => {
    try{
        const start = params;
        const size = getState().ClientInformationDetailReducer.orderData.size;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/order?clientId='+id+'&start=' + start + '&size=' + size;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newOrderData = getState(). ClientInformationDetailReducer.orderData;
        if (res.success) {
            newOrderData.start = start;
            newOrderData.dataSize = res.rows.length;
            newOrderData.orderInfo = res.rows.slice(0, size - 1);
            dispatch({type: ClientInformationDetailActionType.getOrderList, payload: newOrderData});
        } else if (res.success === false) {
            Swal.fire('获取订单信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
}
export const getOrderItemProd=(id)=>async (dispatch, getState) => {
    try{
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/orderItemProd?clientId='+id;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: ClientInformationDetailActionType.getOrderItemProdList, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取订单信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
}
export const getOrderItemService=(id)=>async (dispatch, getState) => {
    try{
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/orderItemService?clientId='+id;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: ClientInformationDetailActionType.getOrderItemServiceList, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取订单信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
}
export const getProdMatchBrandList = () => async (dispatch,getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchBrand';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: ClientInformationDetailActionType.setMatchBrandList, payload: res.rows});
            if(getState().ClientInformationDetailReducer.clientInfo.match_brand_id==null){return;}else {
                dispatch(ClientInformationDetailAction.getMatchModelList(getState().ClientInformationDetailReducer.clientInfo.match_brand_id.id));
            }
        } else if (!res.success) {
            Swal.fire('获取品牌信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const getMatchModelList = (brandId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchModel?matchBrandId=' + brandId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: ClientInformationDetailActionType.setMatchModelList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取车型信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
