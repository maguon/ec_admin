import Swal from "sweetalert2";
import {apiHost} from "../../config";
import {PurchaseActionType, AppActionType} from '../../types';
import 'jspdf-autotable';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
// 采购管理 -> 采购 获取供应商列表
export const getSupplierList = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/supplier?';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: PurchaseActionType.getSupplierList, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
// 采购管理 -> 采购 获取商品列表
export const getProductList = () => async (dispatch) => {
    try {
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/product?';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: PurchaseActionType.getProductList, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
// 采购管理 -> 采购 增加商品列表
export const addPurchaseInfo = (supplier,paramsItem,transferCostType,transferCost,remark) => async (dispatch) => {
    try {
        const paramsPurchase = [];
        for(let i=0;i<paramsItem.length;i++){
            let obj = {};
            obj.remark = paramsItem[i].remark;
            obj.productId= paramsItem[i].product.split('&')[0];
            obj.productName= paramsItem[i].product.split('&')[1];
            obj.unitCost= paramsItem[i].unitCost;
            obj.purchaseCount= paramsItem[i].unitNumber;
            paramsPurchase.push(obj);
        }
        const params =  {
                remark:remark,
                supplierId: supplier.split('&')[0],
                supplierName: supplier.split('&')[1],
                transferCostType: transferCostType,
                transferCost:transferCost,
                orderId: 0,
                purchaseItem: paramsPurchase
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch(getPurchaseList(0));
            Swal.fire("新增成功", "", "success");
            // 刷新列表

        } else if (res.success === false) {
            Swal.fire("新增失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
// 采购管理 -> 采购 取得画面列表
export const getPurchaseList = (params) => async (dispatch, getState) => {
    try {
        const start = params;
        // 检索条件：每页数量
        const size = getState().PurchaseReducer.size;
        // 检索条件
        const paramsObj=getState().PurchaseReducer.queryPurchaseObj;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchase?start=' + start + '&size=' + size;
        let paramsObject = {
            planDateStart: commonUtil.formatDate(paramsObj.planDateStart, 'yyyyMMdd'),
            planDateEnd: commonUtil.formatDate(paramsObj.planDateEnd, 'yyyyMMdd'),
            finishDateStart: commonUtil.formatDate(paramsObj.finishDateStart, 'yyyyMMdd'),
            finishDateEnd: commonUtil.formatDate(paramsObj.finishDateEnd, 'yyyyMMdd'),
            storageStatus: paramsObj.storageStatus == null||paramsObj.storageStatus=='-1' ? '' : paramsObj.storageStatus,
            paymentStatus: paramsObj.paymentStatus == null|| paramsObj.paymentStatus=='-1' ? '' : paramsObj.paymentStatus,
            status: paramsObj.status == null || paramsObj.status=='-1' ? '' : paramsObj.status,
            supplierId:paramsObj.supplierId==null?'':paramsObj.supplierId.id
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: PurchaseActionType.setStart, payload: start});
            dispatch({type: PurchaseActionType.setPurchaseListDataSize, payload: res.rows.length});
            dispatch({type: PurchaseActionType.setPurchaseArray, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const downLoadPDF = (params,dataList,name) => async (dispatch) => {
    try {
        let supplierInfo={};
        let urlSupplier = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/supplier?supplierName='+name;
        const res = await httpUtil.httpGet(urlSupplier);
        if (res.success) {
            supplierInfo=res.rows[0]
            dispatch({type: PurchaseActionType.getSupplierArray, payload: res.rows[0]});
        } else if (!res.success) {
            Swal.fire("获取采购详细列表失败", res.msg, "warning");
        }

        const doc = commonUtil.initJSPDF();

        // 标题部分，白色背景，居中，粗体，20号字
        doc.autoTable({
            startY: 10,
            body: [[{content: '采购单',styles: {halign: 'center', fillColor: 255, fontStyle: 'bold', fontSize: 20}}]],
            didParseCell: function (data) {
                data.cell.styles.font = 'simhei'
            },
        });

        // 取得logo图片值
        let base64Img = await commonUtil.getImgBase64('/logo120.png');
        // 头部内容
        doc.autoTable({
            body: [
                [{content: '',rowSpan:7,styles: {halign: 'center', cellWidth: 28}},
                 '采购单号：' + params.id,{content: '操作人员：' + params.op_user,styles: {halign: 'right'}}],
                ['供应商名称：' + params.supplier_name, {content: '联系人：' + supplierInfo.contact_name, styles: {halign: 'right'}}],
                ['手机：' + supplierInfo.mobile, {content: '邮箱：' + supplierInfo.contact_name, styles: {halign: 'right'}}],
                ['电话：' + supplierInfo.tel, {content: '传真：' + supplierInfo.email, styles: {halign: 'right'}}],
                ['地址：' + supplierInfo.address, {content: '', styles: {halign: 'right'}}],
                ['公司抬头：' + supplierInfo.invoice_title, {content: '开户行：' + supplierInfo.invoice_bank, styles: {halign: 'right'}}],
                ['开户行账号：' + supplierInfo.invoice_bank_ser, {content: '开户地址：' +supplierInfo.invoice_address, styles: {halign: 'right'}}],
            ],
            didParseCell: function (data) {
                data.cell.styles.fontSize = '10'
                data.cell.styles.cellPadding='5'
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
            {header: '商品名称', dataKey: 'product_name'},
            {header: '单价', dataKey: 'unit_cost'},
            {header: '数量', dataKey: 'purchase_count'},
            {header: '总价', dataKey: 'total_cost'},
            {header: '备注', dataKey: 'remark'},
        ];

        if (dataList == null) {
            // 基本检索URL
            let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseItem?purchaseId='+params.id;
            dispatch({type: AppActionType.showLoadProgress, payload: true});
            const res = await httpUtil.httpGet(url);
            if (res.success) {
                doc.autoTable({columns:columnsDef, body:res.rows, didParseCell:function (data) {data.cell.styles.font = 'simhei'}});
                doc.autoTable({

                    body: [ [{content: '',rowSpan:2,styles: {halign: 'center', cellWidth: 50}},
                        commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE,params.transfer_cost_type)+ '运费：' + params.transfer_cost,{content: '总价：' + params.total_cost,styles: {halign: 'right'}}],
                        ['备注：' + params.remark, {content: '', styles: {halign: 'right'}}]],
                    didParseCell:function (data) {
                        data.cell.styles.font = 'simhei';
                        // 白底
                        data.cell.styles.fillColor = 255}

                });
                doc.save('采购单详情-' + params.id + '.pdf');
            } else if (!res.success) {
                Swal.fire("获取采购单详细列表失败", res.msg, "warning");
            }
            dispatch({type: AppActionType.showLoadProgress, payload: false});
        } else {
            doc.autoTable({columns:columnsDef, body:dataList, didParseCell:function (data) {data.cell.styles.font = 'simhei'}});
            doc.autoTable({

                body: [ [{content: '',rowSpan:2,styles: {halign: 'center', cellWidth: 50}},
                    commonUtil.getJsonValue(sysConst.TRANSFER_COST_TYPE,params.transfer_cost_type)+ '运费：' + params.transfer_cost,{content: '总价：' + params.total_cost,styles: {halign: 'right'}}],
                    ['备注：' + params.remark, {content: '', styles: {halign: 'right'}}]],
                didParseCell:function (data) {
                    data.cell.styles.font = 'simhei';
                    // 白底
                    data.cell.styles.fillColor = 255}

            });
            doc.save('采购单详情-' + params.id + '.pdf');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

