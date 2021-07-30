import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType,ClientAgentDetailActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
export const updateClientAgent = (id) => async (dispatch, getState) => {
    try {
        const params = getState().ClientAgentDetailReducer.clientAgentInfo;
        const param={
            remark: params.remark,
            name: params.name,
            clientType: params.client_type,
            tel: params.tel,
            address: params.address,
            idSerial: params.id_serial,
            salesUserId: params.sales_user_id==null?'':params.sales_user_id.id,
            sourceType: params.source_type
        }
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/clientAgent/'+id, param);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}
export const getClientAgentInfo=(id) =>async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/clientAgent?clientAgentId='+id;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: ClientAgentDetailActionType.getClientAgentInfo, payload: res.rows[0]});
        } else if (res.success === false) {
            Swal.fire('获取客户信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const getClientAgentArray = () => async (dispatch) => {
    try {
        // admin用户 检索 URL
        const url = apiHost + '/api/user/'+ localUtil.getSessionItem(sysConst.LOGIN_USER_ID) +'/user';

        // 发送 get 请求
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: ClientAgentDetailActionType.getClientAgentArray, payload: res.rows})
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
export const getInvoiceList =(id)  => async (dispatch) =>{
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/clientAgentInvoice?clientAgentId='+id;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: ClientAgentDetailActionType.getInvoiceList, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取发票信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}

export const getClientInfo =(id)  => async (dispatch) =>{
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/client?clientAgentId='+id;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: ClientAgentDetailActionType.getClientInfo, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取发票信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}
export const addInvoice=(id,params)=>async (dispatch) =>{
    try {
        const param={
            remark: params.addInvoiceRemark,
            invoiceType:params.invoiceType,
            invoiceTitle: params.invoiceTitle,
            invoiceBank: params.invoiceBank,
            invoiceBankSer: params.invoiceBankSer,
            invoiceAddress: params.invoiceAddress,
            settleType: params.settleType
        }
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + "/clientAgent/"+id+'/clientAgentInvoice';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, param);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            // 更新select框 数据
            dispatch(getInvoiceList(id));
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}
export const updateInvoice=(clientAgentId,id,params)=>async (dispatch)=>{
    try {
        const paramsObj={
            remark: params.updateInvoiceRemark,
            invoiceType:params.updateInvoiceType,
            invoiceTitle: params.updateInvoiceTitle,
            invoiceBank: params.updateInvoiceBank,
            invoiceBankSer: params.updateInvoiceBankSer,
            invoiceAddress: params.updateInvoiceAddress,
            settleType: params.updateSettleType
        }
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/clientAgentInvoice/'+id, paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch(getInvoiceList(clientAgentId));
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}