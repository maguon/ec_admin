import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, OrderRefundDetailActionType} from '../../types';
import {getOrderInfo} from "./OrderDetailAction";

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

export const getOrderServiceOpts = (orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefundService?orderId=' + orderId;
        let res = await httpUtil.httpGet(url);
        if (res.success) {
            // 基本检索URL
            let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderItemService?orderId=' + orderId;
            let itemsRes = await httpUtil.httpGet(url);
            let has;
            let selectOpts = [];
            if (itemsRes.success && itemsRes.rows.length > 0) {
                for (let i =0; i < itemsRes.rows.length; i++) {
                    has = false;
                    for (let j=0; j< res.rows.length; j++) {
                        if (itemsRes.rows[i].id == res.rows[j].item_service_id) {
                            has = true;
                            break;
                        }
                    }
                    if (!has) {
                        selectOpts.push(itemsRes.rows[i]);
                    }
                }
                dispatch({type: OrderRefundDetailActionType.getOrderAvailableSerVList, payload: selectOpts});
            } else {
                dispatch({type: OrderRefundDetailActionType.getOrderAvailableSerVList, payload: []});
            }
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderRefundService = (orderRefundId, orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefundService?orderRefundId=' + orderRefundId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: OrderRefundDetailActionType.getOrderRefundSerVList, payload: res.rows});
            dispatch(getOrderServiceOpts(orderId));
        } else if (!res.success) {
            Swal.fire("获取退单服务列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderProdOpts = (orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefundProd?orderId=' + orderId;
        const res = await httpUtil.httpGet(url);
        if (res.success) {
            // 基本检索URL
            let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderItemProd?orderId=' + orderId;
            let itemsRes = await httpUtil.httpGet(url);
            let has;
            let selectOpts = [];
            if (itemsRes.success && itemsRes.rows.length > 0) {
                for (let i =0; i < itemsRes.rows.length; i++) {
                    has = false;
                    for (let j=0; j< res.rows.length; j++) {
                        if (itemsRes.rows[i].id == res.rows[j].item_prod_id) {
                            has = true;
                            break;
                        }
                    }
                    if (!has) {
                        selectOpts.push(itemsRes.rows[i]);
                    }
                }
                dispatch({type: OrderRefundDetailActionType.getOrderAvailableProdList, payload: selectOpts});
            } else {
                dispatch({type: OrderRefundDetailActionType.getOrderAvailableProdList, payload: []});
            }
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderRefundProd = (orderRefundId, orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderRefundProd?orderRefundId=' + orderRefundId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: OrderRefundDetailActionType.getOrderRefundProdList, payload: res.rows});
            dispatch(getOrderProdOpts(orderId));
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
        let orderRefundInfo = getState().OrderRefundDetailReducer.orderRefundInfo;
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
            await dispatch(getOrderRefundService(data.order_refund_id, orderRefundInfo.order_id));
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
        let orderRefundInfo = getState().OrderRefundDetailReducer.orderRefundInfo;
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
            await dispatch(getOrderRefundProd(data.order_refund_id, orderRefundInfo.order_id));
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

export const addOrderRefundService = (orderRefundId, data) => async (dispatch, getState) => {
    try {
        let orderRefundInfo = getState().OrderRefundDetailReducer.orderRefundInfo;
        let params = {
            serviceRefundPrice: data.serviceRefundPrice,
            remark: data.remark
        };
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order/' + orderRefundInfo.order_id + '/orderRefund/' + orderRefundId + '/itemService/' + data.serviceInfo.id + '/orderRefundService';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getOrderRefundInfo(orderRefundId));
            dispatch(getOrderRefundService(orderRefundId, orderRefundInfo.order_id));
            Swal.fire("保存成功", "", "success");
        } else {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const deleteOrderRefundService = (data) => async (dispatch) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order/' + data.order_id + '/orderRefund/' + data.order_refund_id + '/itemService/' + data.item_service_id + '/orderRefundService/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpDelete(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("删除成功", "", "success");
            // 刷新
            dispatch(getOrderRefundInfo(data.order_refund_id));
            dispatch(getOrderRefundService(data.order_refund_id, data.order_id));
        } else if (!res.success) {
            Swal.fire('删除失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const addOrderRefundProd = (orderRefundId, data) => async (dispatch, getState) => {
    try {
        let orderRefundInfo = getState().OrderRefundDetailReducer.orderRefundInfo;
        let params = {
            prodRefundCount: data.prodRefundCount,
            prodRefundPrice: data.prodRefundPrice,
            remark: data.remark
        };
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order/' + orderRefundInfo.order_id + '/orderRefund/' + orderRefundId + '/itemProd/' + data.productInfo.id + '/orderRefundProd';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getOrderRefundInfo(orderRefundId));
            dispatch(getOrderRefundProd(orderRefundId, orderRefundInfo.order_id));
            Swal.fire("保存成功", "", "success");
        } else {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const deleteOrderRefundProd = (data) => async (dispatch) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order/' + data.order_id + '/orderRefund/' + data.order_refund_id + '/itemProd/' + data.item_prod_id + '/orderRefundProd/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpDelete(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("删除成功", "", "success");
            // 刷新
            dispatch(getOrderRefundInfo(data.order_refund_id));
            dispatch(getOrderRefundProd(data.order_refund_id, data.order_id));
        } else if (!res.success) {
            Swal.fire('删除失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadPDF = (orderRefundId) => async (dispatch, getState) => {
    try {
        let orderRefundInfo = getState().OrderRefundDetailReducer.orderRefundInfo;
        let orderRefundSerVList = getState().OrderRefundDetailReducer.orderRefundSerVList;
        let orderRefundProdList = getState().OrderRefundDetailReducer.orderRefundProdList;

        await dispatch(getOrderInfo(orderRefundInfo.order_id));
        const orderInfo = getState().OrderDetailReducer.orderInfo;

        // 初始化jsPdf，并输出title，logo，以及body 头部
        let bodyHeader = [
            [{content: '',rowSpan: 3,styles: {halign: 'center', cellWidth: 28}},'退单编号：' + orderRefundInfo.id, {content: '订单编号：' + orderRefundInfo.order_id,styles: {halign: 'right'}}],
            ['客户姓名：' + orderInfo.client_name, {content: '客户电话：' + orderInfo.client_tel, styles: {halign: 'right'}}],
            ['车牌：' + orderInfo.client_serial,{content: '退货运费：' + orderRefundInfo.transfer_refund_price, styles: {halign: 'right'}}],
        ];
        const doc = await commonUtil.initJSPDF('退单信息', bodyHeader, null);

        if (orderRefundSerVList.length > 0) {
            let bodyList = [];
            orderRefundSerVList.forEach((item) => {
                bodyList.push(
                    [
                        item.sale_service_name,
                        item.fixed_price == 0 ? item.unit_price + ' * ' + item.service_count : item.fixed_price + ' * 1',
                        item.discount_service_price,
                        item.actual_service_price,
                        item.service_refund_price,
                        item.remark,
                    ]);
            });
            bodyList.push([
                {content: '服务退款：' + orderRefundInfo.service_refund_price, colSpan: 6, styles: {halign: 'right'}},
            ]);
            doc.autoTable({
                head: [['服务', '售价', '折扣', '实际价格', '退款金额', '备注']],
                body: bodyList,
                didParseCell: function (data) {data.cell.styles.font = 'simhei'}
            });
        }
        if (orderRefundProdList.length > 0) {
            let bodyList = [];
            orderRefundProdList.forEach((item) => {
                bodyList.push(
                    [
                        item.prod_name,
                        item.unit_price,
                        item.prod_count,
                        item.discount_prod_price,
                        item.actual_prod_price,
                        item.prod_refund_price,
                        item.prod_refund_count,
                        item.remark,
                    ]);
            });
            bodyList.push([
                {content: '商品退款：' + orderRefundInfo.prod_refund_price, colSpan: 5, styles: {halign: 'right'}},
                {content: '退货数量：' + orderRefundInfo.prod_refund_count, colSpan: 3, styles: {halign: 'right'}},
            ]);
            doc.autoTable({
                head: [['商品', '价格', '数量', '折扣', '实际价格', '退款金额', '退款数量', '备注']],
                body: bodyList,
                didParseCell: function (data) {data.cell.styles.font = 'simhei'}
            });
        }
        doc.autoTable({
            body: [[{content: '合计：' + orderRefundInfo.total_refund_price,styles: {halign: 'right', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
        doc.autoTable({
            body: [[{content: '退单备注：' + orderRefundInfo.remark,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
        commonUtil.previewPDF(doc);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};


export const getStorageProductRelDetailInfo = (orderRefundProdId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRelDetail?orderRefundProdId=' + orderRefundProdId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success && res.rows.length > 0) {
            return res.rows[0];
        } else {
            return {};
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};