import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, OrderDetailActionType, OrderRefundPayActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
export const getOrderList = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().OrderRefundPayReducer.orderData.size;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderRefund?start=' + start + '&size=' + size;
        let conditions = dispatch(getParams());
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().OrderRefundPayReducer.orderData;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: OrderRefundPayActionType.setOrderRefundPayData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取订单列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
const getParams = () => (dispatch, getState) => {
    // 检索条件
    const queryParams = getState().OrderRefundPayReducer.queryParams;
    let conditionsObj = {
        // 订单编号
        orderId: queryParams.orderId,
        // 订单状态
        status: queryParams.status,
        paymentStatus: queryParams.paymentStatus,
        dateStart: commonUtil.formatDate(queryParams.dateStart, 'yyyyMMdd'),
        dateEnd: commonUtil.formatDate(queryParams.dateEnd, 'yyyyMMdd'),
    };
    return httpUtil.objToUrl(conditionsObj);
};
export const getAllOrder=(remarks,paymentType,selectedId,batchData)=>async (dispatch, getState) => {
    try {
        let params = {
            remark: remarks,
            type: 2,
            paymentType: paymentType,
            orderIds:[0],
            orderRefundIds: selectedId,
            actualPrice: batchData.totalRefundPrice
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/payment/';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            window.location.href = '#!/collection_refund/'+res.rows[0].id;
        } else if (!res.success) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
}
export const getOrderInfo = (orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/order?orderId=' + orderId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                return res.rows[0];
            } else {
              return
            }
        } else if (!res.success) {
            Swal.fire("获取订单信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
