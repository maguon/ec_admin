import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, OrderDetailActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getOrderInfo = (orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/order?orderId=' + orderId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: OrderDetailActionType.getOrderInfo, payload: res.rows[0]});
            } else {
                dispatch({type: OrderDetailActionType.getOrderInfo, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取订单信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderItemService = (orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderItemService?orderId=' + orderId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: OrderDetailActionType.getOrderSerVList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取订单服务列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getOrderItemProd = (orderId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderItemProd?orderId=' + orderId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: OrderDetailActionType.getOrderProdList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取订单商品列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveOrder = () => async (dispatch, getState) => {
    try {
        const orderInfo = getState().OrderDetailReducer.orderInfo;
        const params = {
            reUserId: orderInfo.reUser == null ? '' : orderInfo.reUser.id,
            reUserName: orderInfo.reUser == null ? '' : orderInfo.reUser.real_name,
            clientRemark: orderInfo.client_remark,
            opRemark: orderInfo.op_remark,
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/order/' + orderInfo.id;
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

export const changeOrderStatus = (orderId, status) => async (dispatch) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order/' + orderId + '/status?status=' + status;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新
            dispatch(getOrderInfo(orderId));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveOrderItemService = (data) => async (dispatch, getState) => {
    try {
        let orderSerVList = getState().OrderDetailReducer.orderSerVList;
        const params = {
            discountServicePrice: data.discount_service_price,
            orderItemType: 1,
            remark: data.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderItemService/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            dispatch(getOrderInfo(data.order_id));
            await dispatch(getOrderItemService(data.order_id));
            let newOrderSerVList = getState().OrderDetailReducer.orderSerVList;
            for (let i = 0; i < orderSerVList.length; i++) {
                newOrderSerVList[i].discount_service_price = orderSerVList[i].discount_service_price;
                newOrderSerVList[i].remark = orderSerVList[i].remark;
                dispatch(OrderDetailActionType.getOrderSerVList(newOrderSerVList));
            }
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveOrderItemProd = (data) => async (dispatch, getState) => {
    try {
        let orderProdList = getState().OrderDetailReducer.orderProdList;
        const params = {
            discountProdPrice: data.discount_prod_price,
            prodCount: data.prod_count,
            remark: data.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/orderItemProd/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            dispatch(getOrderInfo(data.order_id));
            await dispatch(getOrderItemProd(data.order_id));
            let newOrderProdList = getState().OrderDetailReducer.orderProdList;
            for (let i = 0; i < orderProdList.length; i++) {
                newOrderProdList[i].prod_count = orderProdList[i].prod_count;
                newOrderProdList[i].discount_prod_price = orderProdList[i].discount_prod_price;
                newOrderProdList[i].remark = orderProdList[i].remark;
                dispatch(OrderDetailActionType.getOrderProdList(newOrderProdList));
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
            dispatch(getOrderInfo(orderId));
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
            dispatch(getOrderInfo(orderId));
            Swal.fire("保存成功", "", "success");
        } else {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const deleteOrderItemService = (data) => async (dispatch) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order/' + data.order_id + '/orderItemService/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpDelete(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("删除成功", "", "success");
            // 刷新
            dispatch(getOrderInfo(data.order_id));
        } else if (!res.success) {
            Swal.fire('删除失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const deleteOrderItemProd = (data) => async (dispatch) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order/' + data.order_id + '/orderItemProd/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpDelete(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("删除成功", "", "success");
            // 刷新
            dispatch(getOrderInfo(data.order_id));
        } else if (!res.success) {
            Swal.fire('删除失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveModalData = (modalData) => async (dispatch) => {
    try {
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
            dispatch(getOrderInfo(modalData.orderItemService.order_id));
        } else {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadPDF = (orderId) => async (dispatch, getState) => {
    try {
        await dispatch(getOrderInfo(orderId));
        await dispatch(getOrderItemProd(orderId));
        await dispatch(getOrderItemService(orderId));
        const orderInfo = getState().OrderDetailReducer.orderInfo;
        const orderSerVList = getState().OrderDetailReducer.orderSerVList;
        const orderProdList = getState().OrderDetailReducer.orderProdList;

        // 初始化jsPdf，并输出title，logo，以及body 头部
        let bodyHeader = [
            [{content: '',rowSpan: 3,styles: {halign: 'center', cellWidth: 28}},'订单编号：' + orderInfo.id, {content: '客户姓名：' + orderInfo.client_name,styles: {halign: 'right'}}],
            ['客户电话：' + orderInfo.client_tel, {content: '车牌：' + orderInfo.client_serial, styles: {halign: 'right'}}],
            ['',''],
        ];
        const doc = await commonUtil.initJSPDF('订单信息', bodyHeader, null);

        if (orderSerVList.length > 0) {
            let bodyList = [];
            orderSerVList.forEach((item) => {
                bodyList.push(
                    [
                        item.sale_service_name,
                        item.fixed_price == 0 ? item.unit_price + ' * ' + item.service_count : item.fixed_price + ' * 1',
                        item.discount_service_price,
                        item.actual_service_price,
                        item.remark,
                    ]);
            });
            bodyList.push([
                {content: '服务费：' + orderInfo.service_price, colSpan: 2, styles: {halign: 'right'}},
                {content: '折扣：' + orderInfo.discount_service_price, colSpan: 2, styles: {halign: 'right'}},
                {content: '实际费用：' + orderInfo.actual_service_price, styles: {halign: 'right'}},
            ]);
            doc.autoTable({
                head: [['服务', '售价', '折扣', '实际价格', '备注']],
                body: bodyList,
                didParseCell: function (data) {data.cell.styles.font = 'simhei'}
            });
        }
        if (orderProdList.length > 0) {
            let bodyList = [];
            orderProdList.forEach((item) => {
                bodyList.push(
                    [
                        item.prod_name,
                        item.unit_price,
                        item.prod_count,
                        item.discount_prod_price,
                        item.actual_prod_price,
                        item.remark,
                    ]);
            });
            bodyList.push([
                {content: '商品金额：' + orderInfo.prod_price, colSpan: 2, styles: {halign: 'right'}},
                {content: '折扣：' + orderInfo.discount_prod_price, colSpan: 2, styles: {halign: 'right'}},
                {content: '实际费用：' + orderInfo.actual_prod_price, colSpan: 2, styles: {halign: 'right'}},
            ]);
            doc.autoTable({
                head: [['商品', '价格', '数量', '折扣', '实际价格', '备注']],
                body: bodyList,
                didParseCell: function (data) {data.cell.styles.font = 'simhei'}
            });
        }
        doc.autoTable({
            body: [[{content: '合计：' + orderInfo.total_actual_price,styles: {halign: 'right', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
        doc.autoTable({
            body: [[{content: '订单备注：' + orderInfo.client_remark,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
        commonUtil.previewPDF(doc);
        // let base64 = doc.output('datauristring');
        // let pdfWindow = window.open('blob:http://localhost:9910/064fc7d4-7030-4bb6-a159-c2823aa9b690');
        // pdfWindow.document.write("<iframe type='application/pdf' width='100%' height='100%' src='" + base64 +"'></iframe>");
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};