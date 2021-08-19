import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, CollectionRefundActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
export const getCollectionRefundList=(dataStart)=>async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().CollectionRefundReducer.collectionRefundData.size;
        const paramsObj=getState().CollectionRefundReducer.collectionRefundParam;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/payment?start=' + start + '&size=' + size;
        let paramsObject = {
            paymentId: paramsObj.paymentId,
            status: paramsObj.status,
            type: paramsObj.type,
            clientAgentId:paramsObj.clientAgentId==null?'':paramsObj.clientAgentId.id,
            paymentType: paramsObj.paymentType,
            dateStart: commonUtil.formatDate(paramsObj.dateStart, 'yyyyMMdd'),
            dateEnd:  commonUtil.formatDate(paramsObj.dateEnd, 'yyyyMMdd'),
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().CollectionRefundReducer.collectionRefundData;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: CollectionRefundActionType.setCollectionRefundData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取付款退款列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
}
export const deletePaymentItem = (data,start) => async (dispatch) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/payment/' + data;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpDelete(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("删除成功", "", "success");
            // 刷新
            dispatch(getCollectionRefundList(start));
        } else if (!res.success) {
            Swal.fire('删除失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const getCollectionRefundStat =(data) =>async (dispatch)=>{
    try {
        let conditionsObj = {
            clientAgentId:data.clientAgent.id,
            finDateStart:commonUtil.formatDate(data.finDateStart, 'yyyyMMdd'),
            finDateEnd:commonUtil.formatDate(data.finDateEnd, 'yyyyMMdd'),
            paymentStatus:sysConst.ORDER_PAYMENT_STATUS[0].value
        }
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefundStat?';
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: CollectionRefundActionType.setOrderRefundStat, payload: res.rows[0]});
            } else {
                return
            }
        } else if (!res.success) {
            Swal.fire("获取订单信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
}
export const getCollectionStat =(data) =>async (dispatch)=>{
    try {
        let conditionsObj = {
            clientAgentId:data.clientAgent.id,
            finDateStart:commonUtil.formatDate(data.finDateStart, 'yyyyMMdd'),
            finDateEnd:commonUtil.formatDate(data.finDateEnd, 'yyyyMMdd'),
            paymentStatus:sysConst.ORDER_PAYMENT_STATUS[0].value
        }
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderStat?';
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: CollectionRefundActionType.setOrderStat, payload: res.rows[0]});
            } else {
                return
            }
        } else if (!res.success) {
            Swal.fire("获取订单信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
}
export const addPaymentItem=(param)=>async (dispatch, getState) => {
    try {
        let params = {
            remark: param.remark,
            type: param.type,
            paymentType: param.paymentType.value,
            finDateStart:commonUtil.formatDate(param.finDateStart, 'yyyyMMdd'),
            finDateEnd:commonUtil.formatDate(param.finDateEnd, 'yyyyMMdd'),
            actualPrice: param.actualPrice
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/clientAgent/'+param.clientAgent.id+'/payment';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getCollectionRefundList(0));
            Swal.fire("添加成功", "", "success");
        } else if (!res.success) {
            Swal.fire('添加失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
}

