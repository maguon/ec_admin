import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, OrderPayActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
export const getOrderList = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().OrderPayReducer.orderData.size;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order?start=' + start + '&size=' + size;
        let conditions = dispatch(getParams());
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().OrderPayReducer.orderData;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: OrderPayActionType.setOrderPayData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取订单列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
const getParams = () => (dispatch, getState) => {
    // 检索条件
    const queryParams = getState().OrderPayReducer.queryParams;
    let conditionsObj = {
        // 订单编号
        orderId: queryParams.orderId,
        // 订单状态
        status: queryParams.status,
        // 订单类型
        orderType: queryParams.orderType,

        // 接单人（用户信息）
        reUserId: queryParams.reUser == null ? '' : queryParams.reUser.id,
        // 客户姓名
        clientId: queryParams.client == null ? '' : queryParams.client.id,
        // 客户集群
        clientAgentId: queryParams.clientAgent == null ? '' : queryParams.clientAgent.id,
        // 订单支付状态
        paymentStatus: queryParams.paymentStatus,
       /* // 客户电话
        clientTel: queryParams.clientTel,*/
        // 车牌号
        clientSerial: queryParams.clientSerial,
        // 创建日期
        dateStart: commonUtil.formatDate(queryParams.dateStart, 'yyyyMMdd'),
        dateEnd: commonUtil.formatDate(queryParams.dateEnd, 'yyyyMMdd'),
        // 完成日期
        finDateStart: commonUtil.formatDate(queryParams.finDateStart, 'yyyyMMdd'),
        finDateEnd: commonUtil.formatDate(queryParams.finDateEnd, 'yyyyMMdd'),
    };
    return httpUtil.objToUrl(conditionsObj);
};
export const getAllOrder=(remarks,paymentType,selectedId,batchData)=>async (dispatch, getState) => {
    try {
        let params = {
            remark: remarks,
            type: 1,
            paymentType: paymentType,
            orderIds:selectedId,
            orderRefundIds: [0],
            actualPrice: batchData.totalActualPrice
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
export const getOrderStat = () => async (dispatch) => {
    try {
        let conditions = dispatch(getParams());
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderStat?';
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: OrderPayActionType.setOrderPayStatData, payload: res.rows[0]});
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
