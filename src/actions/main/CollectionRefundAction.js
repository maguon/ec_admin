import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, CollectionRefundActionType} from '../../types';
import {getOrderInfo, getOrderItemService} from "./OrderDetailAction";
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
