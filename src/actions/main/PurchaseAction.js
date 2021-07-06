import {PurchaseActionType, AppActionType} from '../../types';
import {apiHost} from "../../config";
import Swal from "sweetalert2";
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');

// 采购管理 -> 采购 获取供应商列表
export const getSupplierList = (params) => async (dispatch, getState) => {
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
export const getProductList = (params) => async (dispatch, getState) => {
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
export const addPurchaseInfo = (supplier,paramsItem,transferCostType,transferCost,remark) => async (dispatch, getState) => {
    try {
        const paramsPurchase = [];
        for(let i=0;i<paramsItem.length;i++){
            var obj = {};
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
        console.log(params)
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            Swal.fire("新增成功", "", "success");
            // 刷新列表
            dispatch(getPurchaseList());
        } else if (res.success === false) {
            Swal.fire("新增失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }



};
// 采购管理 -> 供应商 取得画面列表
export const getPurchaseList = (params) => async (dispatch, getState) => {
    try {

        // 检索条件：每页数量
        const size = getState().PurchaseReducer.size;
        // 检索条件
        const paramsObj=getState().PurchaseReducer.queryPurchaseObj;
        paramsObj.planDateStart =paramsObj.planDateStart==''?'':commonUtil.getDateFormat(paramsObj.planDateStart);
        paramsObj.planDateEnd =paramsObj.planDateEnd==''?'':commonUtil.getDateFormat(paramsObj.planDateEnd);
        paramsObj.finishDateStart =paramsObj.finishDateStart==''?'':commonUtil.getDateFormat(paramsObj.finishDateStart);
        paramsObj.finishDateEnd =paramsObj.finishDateEnd==''?'':commonUtil.getDateFormat(paramsObj.finishDateEnd);
        paramsObj.paymentStatus =paramsObj.paymentStatus=='-1'?'': paramsObj.paymentStatus;
        paramsObj.storageStatus =paramsObj.storageStatus=='-1'?'': paramsObj.storageStatus;
        paramsObj.status =paramsObj.status=='-1'?'': paramsObj.status;

        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchase?size=' + size;
        let conditions = httpUtil.objToUrl(paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: PurchaseActionType.setPurchaseListDataSize, payload: res.rows.length});
            dispatch({type: PurchaseActionType.setPurchaseArray, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

