import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType, ClientAgentDetailActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
export const updateClientAgent = (id) => async (dispatch, getState) => {
    try {
        const params = getState().ClientAgentDetailReducer.clientAgentInfo;
        const param=params.sales_user_id==null?{
            remark: params.remark,
            name: params.name,
            clientType: params.client_type,
            tel: params.tel,
            address: params.address,
            idSerial: params.id_serial,
            sourceType: params.source_type
        }:{
            salesUserId: params.sales_user_id.id,
            remark: params.remark,
            name: params.name,
            clientType: params.client_type,
            tel: params.tel,
            address: params.address,
            idSerial: params.id_serial,
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
export const getInvoiceList =(id,params)  => async (dispatch,getState) =>{
    try {
        const start = params;
        const size = getState().ClientAgentDetailReducer.invoiceData.size;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/clientAgentInvoice?clientAgentId='+id+'&start=' + start + '&size=' + size;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newInvoiceData = getState(). ClientAgentDetailReducer.invoiceData;
        if (res.success) {
            newInvoiceData.start = start;
            newInvoiceData.dataSize = res.rows.length;
            newInvoiceData.invoiceArray = res.rows.slice(0, size - 1);
            dispatch({type: ClientAgentDetailActionType.getInvoiceList, payload: newInvoiceData});
        } else if (res.success === false) {
            Swal.fire('获取发票信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}
export const getClientInfo =(id,params)  => async (dispatch,getState) =>{
    try {
        const start = params;
        const size = getState().ClientAgentDetailReducer.clientData.size;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/client?clientAgentId='+id+'&start=' + start + '&size=' + size;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newClientData = getState(). ClientAgentDetailReducer.clientData;
        if (res.success) {
            newClientData.start = start;
            newClientData.dataSize = res.rows.length;
            newClientData.clientArray = res.rows.slice(0, size - 1);
            dispatch({type: ClientAgentDetailActionType.getClientAgentDetailInfo, payload: newClientData});
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
            dispatch(getInvoiceList(id,0));
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
            dispatch(getInvoiceList(clientAgentId,0));
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}