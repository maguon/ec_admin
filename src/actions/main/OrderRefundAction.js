import {createHashHistory} from 'history';
import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, OrderRefundActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getOrderList = (dataStart,queryParams) => async (dispatch, getState) => {
    console.log('getOrderList queryParams is : ',queryParams)
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().OrderReducer.orderData.size;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order?start=' + start + '&size=' + size;
        let conditions = dispatch(getParams(queryParams));
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().OrderReducer.orderData;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: OrderRefundActionType.setOrderData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取订单列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderInfo = (orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order?orderId=' + orderId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            return res.rows;
        } else if (!res.success) {
            return [];
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderItemService = (orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderItemService?orderId=' + orderId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            return res.rows;
        } else if (!res.success) {
            return [];
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderItemProd = (orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderItemProd?orderId=' + orderId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            return res.rows;
        } else if (!res.success) {
            return [];
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};



export const getSaleServiceProdRel = (saleServiceId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/saleServiceProdRel?saleServiceId=' + saleServiceId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            return res.rows;
        } else if (!res.success) {
            return [];
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveModalData = (modalData) => async (dispatch) => {
    try {
        let params = {
            reUserId: modalData.user.id,
            reUserName: modalData.user.real_name,
            clientRemark: modalData.clientRemark,
            opRemark: '',
            orderType: sysConst.ORDER_TYPE[0].value,
            clientId: modalData.clientSerial.id,
            clientAgentId: modalData.clientSerial.client_agent_id,
            transferPrice: 0,
            OrderItemProdArray: modalData.productList,
            OrderItemServiceArray: modalData.serviceList
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/order';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success && res.rows.length > 0) {
            const history = createHashHistory();
            history.push('/order/' + res.rows[0].id);
            Swal.fire("保存成功", "", "success");
        } else {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

const getParams = (queryParams) => (dispatch, getState) => {
    let conditionsObj = {
        // 订单编号
        orderId: queryParams.orderId,
        // 订单状态
        status: queryParams.status == null ? '' : queryParams.status,
        // 订单类型
        orderType: queryParams.orderType == null ? '' : queryParams.orderType,

        // 接单人（用户信息）
        reUserId: queryParams.reUser == null ? '' : queryParams.reUser.id,
        // 客户姓名
        clientId: queryParams.client == null ? '' : queryParams.client.id,
        // 客户集群
        clientAgentId: queryParams.clientAgent == null ? '' : queryParams.clientAgent.id,

        // 客户电话
        clientTel: queryParams.clientTel,
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

export const downLoadCsv = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = 'http://' + apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order.csv?1=1';
        // 检索条件
        let conditions = dispatch(getParams());
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};