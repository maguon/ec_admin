import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, OrderDetailActionType} from '../../types';
import {jsPDF} from "jspdf";

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
            dispatch({type: OrderDetailActionType.getOrderInfo, payload: {}});
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

export const getStorageProductRelDetail = (orderId, orderProdId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRelDetail?orderId=' + orderId + '&orderProdId=' + orderProdId;
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
            dispatch(getOrderItemService(orderId));
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
            dispatch(getOrderItemProd(orderId));
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
            dispatch(getOrderItemService(data.order_id));
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
            dispatch(getOrderItemProd(data.order_id));
        } else if (!res.success) {
            Swal.fire('删除失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveModalData = (modalData) => async (dispatch, getState) => {
    try {
        let orderSerVList = getState().OrderDetailReducer.orderSerVList;
        let params;
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderItemService/' + modalData.orderItemService.id;
        if (modalData.pageType === 'deploy') {
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
            await dispatch(getOrderItemService(modalData.orderItemService.order_id));
            let newOrderSerVList = getState().OrderDetailReducer.orderSerVList;
            for (let i = 0; i < orderSerVList.length; i++) {
                newOrderSerVList[i].discount_service_price = orderSerVList[i].discount_service_price;
                newOrderSerVList[i].remark = orderSerVList[i].remark;
                dispatch(OrderDetailActionType.getOrderSerVList(newOrderSerVList));
            }
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
            ['承修方(盖章):' + sysConst.ORDER_PDF.companyName, "开户银行:" + sysConst.ORDER_PDF.bank,"账   号:" +sysConst.ORDER_PDF.bankSer],
            ['E-mail:' + sysConst.ORDER_PDF.contactName, '',"网　 址:" +sysConst.ORDER_PDF.website],
            ["地  址:" + sysConst.ORDER_PDF.address,'电   话:' +sysConst.ORDER_PDF.mobile,"传   真:" + sysConst.ORDER_PDF.email],
            ["托修方 :"+ orderInfo.client_agent_name,"送修人 :"+ orderInfo.client_name,"联系电话:" + orderInfo.client_tel],
            ['车牌号码:' + orderInfo.client_serial,"厂牌车型:" + '',"车辆VIN:"+orderInfo.client_serial_detail],
            ['进厂日期:' + orderInfo.date_id,"出厂日期:"+ (orderInfo.fin_date_id==null?'':orderInfo.fin_date_id),"进厂里程:"+ ''],
            ['施工编号:'+ orderInfo.id]
        ];

        const doc = new jsPDF();
        doc.addFont('simhei.ttf', 'simhei', 'normal');
        doc.setFont('simhei');

        // 标题部分，白色背景，居中，粗体，20号字
        doc.autoTable({
            startY: 10,
            body: [[{content: sysConst.ORDER_PDF.title, styles: {halign: 'center', fillColor: 255, fontStyle: 'bold', fontSize: 20}}]],
            didParseCell: function (data) {
                data.cell.styles.font = 'simhei'
            },
        });
        if (bodyHeader != null) {
            // 头部内容
            doc.autoTable({
                body: bodyHeader,
                didParseCell: function (data) {
                    data.cell.styles.fontSize = 10;
                    data.cell.styles.cellPadding=0;
                    // 黑体字
                    data.cell.styles.font = 'simhei';
                    // 白底
                    data.cell.styles.fillColor = 255;
                }
            });
        }
        let finalY = 45
        //1
        doc.autoTable({
            startY: finalY+15,
            body: [[{content: '一、 结算价格(单位:元)' ,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei';},
        });
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            head: [['序号', '项目名称', '应收总计', '优惠总计', '实收总计']],
            body: [
                [1, "服务费", orderInfo.service_price,orderInfo.discount_service_price, orderInfo.actual_service_price],
                [2, "商品费", orderInfo.prod_price,orderInfo.discount_prod_price,orderInfo.actual_prod_price],
                [3, "合计", Number(orderInfo.service_price)+Number(orderInfo.prod_price),Number(orderInfo.discount_service_price)+Number(orderInfo.discount_prod_price),Number(orderInfo.actual_service_price)+Number(orderInfo.actual_prod_price)],
            ],
            didParseCell: function (data) {data.cell.styles.font = 'simhei';},
        });
        //2
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            body: [[{content: '二、 服务费' ,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
        if (orderSerVList.length > 0) {
            let bodyList = [];
            orderSerVList.forEach((item) => {
                bodyList.push(
                    [
                        item.sale_service_name,
                        item.fixed_price == 0 ? item.unit_price + ' * ' + Number(item.service_count) : item.fixed_price + ' * 1',
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
                startY: doc.lastAutoTable.finalY,
                head: [['服务', '售价', '折扣', '实际价格', '备注']],
                body: bodyList,
                /* head: [['项目序号', '项目名称', '工时定额', '工时单价', '应收金额', '折后金额', '备 注']],
           body: [
               [1, "更换空调泵换干燥罐", "0.00",'0.00','100.00',''],
               ['工时合计', "", "",'','100.00','100.00元','0.00元']
           ],*/
                didParseCell: function (data) {data.cell.styles.font = 'simhei'}
            })
        }
        //3
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            body: [[{content: '三、 商品费(单位:元)' ,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
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
                startY: doc.lastAutoTable.finalY,
                head: [['商品', '价格', '数量', '折扣', '实际价格', '备注']],
                body: bodyList,
                /* head: [['配件编码', '材料名称', '配件类型', '计量单位', '数量', '材料单价','应收金额','折后金额', '备 注']],
                  body: [
                ['WBWX117', "加工空调管1", "外修类",'根','1.00','165.00','165.00','165.00',''],
                ['YHP054', "氟利昂（250）", "易耗品",'瓶','4.00','19.80','79.20','79.20',''],
                ['0340', "空调滤芯-J6", "J6配件（油）",'个','1.00','8.80','8.80','8.80',''],
                ['材料合计', "", "",'','','','253.00','253.00元','0.00元'],
            ],*/
                didParseCell: function (data) {data.cell.styles.font = 'simhei'}
            });
        }
        //4
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            body: [[{content: '四、总计' ,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            head: [['应收总计', '现金券抵扣', '积分抵扣', '优惠总计', '实收总计']],
            body: [
                [Number(orderInfo.actual_service_price)+Number(orderInfo.actual_prod_price)+'元', "0.00元", "0.00元",'0.00元', Number(orderInfo.actual_service_price)+Number(orderInfo.actual_prod_price)+'元']
            ],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'}
        });
        //5
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            body: [[{content: '五、 质量保证期' ,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            body: [
                ['机动车维修质量保证期为车辆行驶_________________公里或________________日。\n' +
                '机动车维修质量保证期,从维修竣工出厂之日起计算。保证期中行驶里程和日期指标，以先到达者为准。'],
            ],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'}
        });
        //6
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            body: [[{content: '六、托修方支付费用更换的旧配件' ,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            body: [
                ['□ 旧配件已确认，并由委托方收回 □ 旧配件已确认，托修方声明放弃 □ 无旧配件']
            ],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'}
        });
        //7
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            body: [[{content: '七、工单备注' ,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'},
        });
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            head: [],
            body: [[{content: '' + orderInfo.client_remark,styles: {halign: 'left', fillColor: 255}}]],
            didParseCell: function (data) {data.cell.styles.font = 'simhei'}
        });
        doc.autoTable({
            startY: doc.lastAutoTable.finalY,
            body: [['结算员签名：' + '', '客户签字：' + '',{content: '结算日期：' + (orderInfo.fin_date_id==null?'':orderInfo.fin_date_id),styles: {halign: 'right'}}]],
            didParseCell:function (data) {
                data.cell.styles.font = 'simhei';
                // 白底
                data.cell.styles.fillColor = 255}

        });
        commonUtil.previewPDF(doc);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};