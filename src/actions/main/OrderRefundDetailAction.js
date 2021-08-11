import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, OrderRefundDetailActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getOrderRefundInfo = (orderRefundId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefund?orderRefundId=' + orderRefundId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: OrderRefundDetailActionType.getOrderRefundInfo, payload: res.rows[0]});
            } else {
                dispatch({type: OrderRefundDetailActionType.getOrderRefundInfo, payload: {}});
            }
        } else if (!res.success) {
            dispatch({type: OrderRefundDetailActionType.getOrderRefundInfo, payload: {}});
            Swal.fire("获取退单信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderRefundService = (orderRefundId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefundService?orderRefundId=' + orderRefundId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: OrderRefundDetailActionType.getOrderRefundSerVList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取退单服务列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderRefundProd = (orderRefundId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefundProd?orderRefundId=' + orderRefundId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: OrderRefundDetailActionType.getOrderRefundProdList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取退单商品列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveOrderRefund = () => async (dispatch, getState) => {
    try {
        const orderRefundInfo = getState().OrderRefundDetailReducer.orderRefundInfo;
        const params = {
            remark: orderRefundInfo.remark,
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefund/' + orderRefundInfo.id;
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

export const changeOrderRefundStatus = (orderRefundId, status) => async (dispatch) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderRefund/' + orderRefundId + '/status?status=' + status;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新
            dispatch(getOrderRefundInfo(orderRefundId));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};














export const saveOrderRefundService = (data) => async (dispatch, getState) => {
    try {
        let orderRefundSerVList = getState().OrderRefundDetailReducer.orderRefundSerVList;
        const params = {
            serviceRefundPrice: data.service_refund_price,
            remark: data.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefundService/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            dispatch(getOrderRefundInfo(data.order_refund_id));
            await dispatch(getOrderRefundService(data.order_refund_id));
            let newOrderSerVList = getState().OrderRefundDetailReducer.orderRefundSerVList;
            for (let i = 0; i < orderRefundSerVList.length; i++) {
                newOrderSerVList[i].service_refund_price = orderRefundSerVList[i].service_refund_price;
                newOrderSerVList[i].remark = orderRefundSerVList[i].remark;
                dispatch(OrderRefundDetailActionType.getOrderRefundSerVList(newOrderSerVList));
            }
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveOrderRefundProd = (data) => async (dispatch, getState) => {
    try {
        let orderRefundProdList = getState().OrderRefundDetailReducer.orderRefundProdList;
        const params = {
            prodRefundPrice: data.prod_refund_price,
            prodRefundCount: data.prod_refund_count,
            remark: data.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefundProd/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            dispatch(getOrderRefundInfo(data.order_refund_id));
            await dispatch(getOrderRefundProd(data.order_refund_id));
            let newOrderProdList = getState().OrderRefundDetailReducer.orderRefundProdList;
            for (let i = 0; i < orderRefundProdList.length; i++) {
                newOrderProdList[i].prod_refund_count = orderRefundProdList[i].prod_refund_count;
                newOrderProdList[i].prod_refund_price = orderRefundProdList[i].prod_refund_price;
                newOrderProdList[i].remark = orderRefundProdList[i].remark;
                dispatch(OrderRefundDetailActionType.getOrderRefundProdList(newOrderProdList));
            }
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const addOrderItemService = (orderId, data) => async (dispatch) => {
    try {
        let params = {
            clientId: data.clientId,
            clientAgentId: data.clientAgentId,
            orderItemType: 1,
            saleServiceId: data.saleServiceId,
            saleServiceName: data.saleServiceName,
            discountServicePrice: data.discountServicePrice,
            remark: data.remark
        };
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order/' + orderId + '/orderItemService';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getOrderRefundInfo(orderId));
            dispatch(getOrderRefundService(orderId));
            Swal.fire("保存成功", "", "success");
        } else {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const addOrderItemProd = (orderId, data) => async (dispatch) => {
    try {
        let params = {
            clientId: data.clientId,
            clientAgentId: data.clientAgentId,
            orderItemType: 1,
            prodId: data.prodId,
            prodName: data.prodName,
            prodCount: data.prodCount,
            discountProdPrice: data.discountProdPrice,
            remark: data.remark
        };
        // 基本url
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order/' + orderId + '/orderItemProd';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getOrderRefundInfo(orderId));
            dispatch(getOrderRefundProd(orderId));
            Swal.fire("保存成功", "", "success");
        } else {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// export const deleteOrderItemService = (data) => async (dispatch) => {
//     try {
//         const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
//             + '/order/' + data.order_id + '/orderItemService/' + data.id;
//         dispatch({type: AppActionType.showLoadProgress, payload: true});
//         const res = await httpUtil.httpDelete(url, {});
//         dispatch({type: AppActionType.showLoadProgress, payload: false});
//         if (res.success) {
//             Swal.fire("删除成功", "", "success");
//             // 刷新
//             dispatch(getOrderRefundInfo(data.order_id));
//             dispatch(getOrderRefundService(data.order_id));
//         } else if (!res.success) {
//             Swal.fire('删除失败', res.msg, 'warning');
//         }
//     } catch (err) {
//         Swal.fire("操作失败", err.message, "error");
//     }
// };
//
// export const deleteOrderItemProd = (data) => async (dispatch) => {
//     try {
//         const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
//             + '/order/' + data.order_id + '/orderItemProd/' + data.id;
//         dispatch({type: AppActionType.showLoadProgress, payload: true});
//         const res = await httpUtil.httpDelete(url, {});
//         dispatch({type: AppActionType.showLoadProgress, payload: false});
//         if (res.success) {
//             Swal.fire("删除成功", "", "success");
//             // 刷新
//             dispatch(getOrderRefundInfo(data.order_id));
//             dispatch(getOrderRefundProd(data.order_id));
//         } else if (!res.success) {
//             Swal.fire('删除失败', res.msg, 'warning');
//         }
//     } catch (err) {
//         Swal.fire("操作失败", err.message, "error");
//     }
// };

export const saveModalData = (modalData) => async (dispatch, getState) => {
    try {
        let orderRefundSerVList = getState().OrderRefundDetailReducer.orderRefundSerVList;
        let params;
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderItemService/' + modalData.orderItemService.id;
        if (modalData.orderStatus === sysConst.ORDER_STATUS[1].value) {
            params = {
                deployUserId: modalData.deployUser == null ? '' : modalData.deployUser.id,
                deployUserName: modalData.deployUser == null ? '' : modalData.deployUser.real_name
            };
            url = url + '/deploy';
        } else {
            params = {
                checkUserId: modalData.checkUser == null ? '' : modalData.checkUser.id,
                checkUserName: modalData.checkUser == null ? '' : modalData.checkUser.real_name
            };
            url = url + '/check';
        }
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            await dispatch(getOrderRefundService(modalData.orderItemService.order_id));
            let newOrderSerVList = getState().OrderRefundDetailReducer.orderRefundSerVList;
            for (let i = 0; i < orderRefundSerVList.length; i++) {
                newOrderSerVList[i].discount_service_price = orderRefundSerVList[i].discount_service_price;
                newOrderSerVList[i].remark = orderRefundSerVList[i].remark;
                dispatch(OrderRefundDetailActionType.getOrderSerVList(newOrderSerVList));
            }
        } else {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};