import Swal from "sweetalert2";
import {apiHost} from "../../config";
import {PurchaseActionType, AppActionType} from '../../types';
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
export const downLoadPDF = (params,name) => async (dispatch) => {
    try {
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/supplier?supplierName='+name;
        let urlPurchase = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseItem?purchaseId='+params;
        const res = await httpUtil.httpGet(url);
        const resPurchase = await httpUtil.httpGet(urlPurchase);
        if (res.success&&resPurchase.success) {
            dispatch({type: PurchaseActionType.getSupplierArray, payload: res.rows[0]});
            dispatch({type: PurchaseActionType.getPurchaseItemArray, payload: resPurchase.rows});
            commonUtil.downLoadPDF(document.getElementById("purchaseItemId"),'采购单详情-' + params + '.pdf');
        } else if (!res.success) {
            Swal.fire("获取采购详细列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

