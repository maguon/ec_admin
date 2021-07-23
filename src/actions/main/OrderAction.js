import {createHashHistory, createBrowserHistory} from 'history';
import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, OrderActionType} from '../../types';
import 'jspdf-autotable'

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getOrderList = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().OrderReducer.orderData.size;
        // 检索条件
        const queryParams = getState().OrderReducer.queryParams;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/order?start=' + start + '&size=' + size;
        // 检索条件
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

        let conditions = httpUtil.objToUrl(conditionsObj);
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
            dispatch({type: OrderActionType.setOrderData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取订单列表信息失败", res.msg, "warning");
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
            OrderItemProdArray: modalData.serviceList,
            OrderItemServiceArray: modalData.productList
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

export const downLoadCsv = (storageCheckId) => () => {
    try {
        // 基本检索URL
        let url = 'http://' + apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheck/' + storageCheckId + '/storageCheckRel.csv';
        window.open(url);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadPDF = (storageCheckInfo) => async (dispatch) => {
    try {
        const doc = commonUtil.initJSPDF();
        // 标题部分，白色背景，居中，粗体，20号字
        doc.autoTable({
            startY: 10,
            body: [[{content: '仓库盘点',styles: {halign: 'center', fillColor: 255, fontStyle: 'bold', fontSize: 20}}]],
            didParseCell: function (data) {
                data.cell.styles.font = 'simhei'
            },
        });

        // 取得logo图片值
        let base64Img = await commonUtil.getImgBase64('/logo120.png');
        // 头部内容
        doc.autoTable({
            body: [
                [{content: '',rowSpan: 3,styles: {halign: 'center', cellWidth: 28}}, '盘点ID：' + storageCheckInfo.id,{content: '计划盘点数：' + storageCheckInfo.plan_check_count,styles: {halign: 'right'}}],
                ['操作人员：' + storageCheckInfo.real_name, {content: '盘点创建时间：' + commonUtil.getDateTime(storageCheckInfo.created_on), styles: {halign: 'right'}}],
                [{content: '盘点描述：' + storageCheckInfo.check_desc, colSpan: 3, styles: {halign: 'left'}}],
            ],
            didParseCell: function (data) {
                // 黑体
                data.cell.styles.font = 'simhei';
                // 白底
                data.cell.styles.fillColor = 255
            },
            didDrawCell: (data) => {
                // body第一个单元格，添加图片
                if (data.section === 'body' && data.column.index === 0) {
                    doc.addImage(base64Img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 20, 20)
                }
            },
        });

        // 定义表头， header：表头文字，dataKey：列数据定义
        let columnsDef = [
            {header: '仓库', dataKey: 'storage_name'},
            {header: '仓库分区', dataKey: 'storage_area_name'},
            {header: '商品', dataKey: 'product_name'},
            {header: '库存数', dataKey: 'storage_count'},
            {header: '盘点数', dataKey: 'check_count'},
            {header: '备注', dataKey: 'remark'},
        ];

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheckRel?storageCheckId=' + storageCheckInfo.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        if (res.success) {
            doc.autoTable({columns:columnsDef, body:res.rows, didParseCell:function (data) {data.cell.styles.font = 'simhei'}});
            doc.save('仓库盘点详情-' + storageCheckInfo.id + '.pdf');
        } else if (!res.success) {
            Swal.fire("获取仓库盘点详细列表失败", res.msg, "warning");
        }
        dispatch({type: AppActionType.showLoadProgress, payload: false});
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};