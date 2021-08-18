import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {ServiceSettingActionType, AppActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
//取得画面列表
export const getServiceSettingList = (params) => async (dispatch, getState) => {
    try {
        const start = params;
        // 检索条件：每页数量
        const size = getState().ServiceSettingReducer.size;
        // 检索条件
        const paramsObj=getState().ServiceSettingReducer.queryObj;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/saleService?start=' + start + '&size=' + size;
        let paramsObject = {
            serviceType: paramsObj.serviceType == null? '' : paramsObj.serviceType.value,
            servicePriceType:paramsObj.servicePriceType==null?'':paramsObj.servicePriceType.value,
            serviceCostType:paramsObj.serviceCostType==null?'':paramsObj.serviceCostType.value,
            salePerfType:paramsObj.salePerfType==null?'':paramsObj.salePerfType.value,
            deployPerfType:paramsObj.deployPerfType==null?'':paramsObj.deployPerfType.value,
            checkPerfType:paramsObj.checkPerfType==null?'':paramsObj.checkPerfType.value,
            status:paramsObj.status==null?'':paramsObj.status.value,
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: ServiceSettingActionType.setServiceSettingListStart, payload: start});
            dispatch({type: ServiceSettingActionType.setServiceSettingListDataSize, payload: res.rows.length});
            dispatch({type: ServiceSettingActionType.getServiceSettingList, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
            Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const addServiceSetting = (params) => async (dispatch, getState) => {
    try {
        const paramsObj = {
            "remark": params.remarks,
            "serviceName":params.serviceName,
            "serviceType":params.serviceType,
            "servicePriceType": params.servicePriceType,
            "fixedPrice":params.fixedPrice==''?0:params.fixedPrice,
            "unitPrice": params.unitPrice==''?0:params.unitPrice,
            "servicePriceCount": params.servicePriceCount==''?0:params.servicePriceCount,
            "serviceCostType": params.serviceCostType,
            "fixedCost": params.fixedCost==''?0: params.fixedCost,
            "unitCost": params.unitCost==''?0:params.unitCost,
            "serviceCostCount": params.serviceCostCount==''?0: params.serviceCostCount,
            "totalPrice": params.totalPrice==''?0:params.totalPrice,
            "totalCost": params.totalCost==''?0:params.totalCost,
            "totalProfit": params.totalPrice-params.totalCost,
            "salePerfType": params.salePerfType,
            "salePerfFixed": params.salePerfFixed==''?0:params.salePerfFixed,
            "salePerfRatio": params.salePerfRatio==''?0:params.salePerfRatio/100,
            "deployPerfType": params.deployPerfType,
            "deployPerfFixed": params.deployPerfFixed==''?0:params.deployPerfFixed,
            "deployPerfRatio": params.deployPerfRatio==''?0:params.deployPerfRatio/100,
            "checkPerfType": params.checkPerfType,
            "checkPerfFixed": params.checkPerfFixed==''?0: params.checkPerfFixed,
            "checkPerfRatio": params.checkPerfRatio==''?0:params.checkPerfRatio/100
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/saleService';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getServiceSettingList(0))
            Swal.fire("新增成功", "", "success");
        } else if (!res.success) {
            Swal.fire("新增失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const updateServiceSettingItem = (params) => async (dispatch, getState) => {
    try {
        const paramsObj={
            "remark": params.modifyRemarks,
            "serviceName":params.modifyServiceName,
            "serviceType":params.modifyServiceType,
            "servicePriceType": params.modifyServicePriceType,
            "fixedPrice":params.modifyFixedPrice==''?0:params.modifyFixedPrice,
            "unitPrice": params.modifyUnitPrice==''?0:params.modifyUnitPrice,
            "servicePriceCount": params.modifyServicePriceCount==''?0:params.modifyServicePriceCount,
            "serviceCostType": params.modifyServiceCostType,
            "fixedCost": params.modifyFixedCost==''?0: params.modifyFixedCost,
            "unitCost": params.modifyUnitCost==''?0:params.modifyUnitCost,
            "serviceCostCount": params.modifyServiceCostCount==''?0: params.modifyServiceCostCount,
            "totalPrice": params.modifyTotalPrice==''?0:params.modifyTotalPrice,
            "totalCost": params.modifyTotalCost==''?0:params.modifyTotalCost,
            "totalProfit": params.modifyTotalPrice-params.modifyTotalCost,
            "salePerfType": params.modifySalePerfType,
            "salePerfFixed": params.modifySalePerfFixed==''?0:params.modifySalePerfFixed,
            "salePerfRatio": params.modifySalePerfRatio==''?0:params.modifySalePerfRatio/100,
            "deployPerfType": params.modifyDeployPerfType,
            "deployPerfFixed": params.modifyDeployPerfFixed==''?0:params.modifyDeployPerfFixed,
            "deployPerfRatio": params.modifyDeployPerfRatio==''?0:params.modifyDeployPerfRatio/100,
            "checkPerfType": params.modifyCheckPerfType,
            "checkPerfFixed": params.modifyCheckPerfFixed==''?0: params.modifyCheckPerfFixed,
            "checkPerfRatio": params.modifyCheckPerfRatio==''?0: params.modifyCheckPerfRatio/100
        }
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/saleService/'+params.modifyId, paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch(getServiceSettingList(getState().ServiceSettingReducer.start));
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const changeStatus = (id, status) => async (dispatch, getState) => {
    try {
        // 状态
        let newStatus;
        if (status === 0) {
            newStatus = 1
        } else {
            newStatus = 0
        }

        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/saleService/' + id + '/status?status=' + newStatus;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新列表
            dispatch(getServiceSettingList(getState().ServiceSettingReducer.start));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const getServiceSettingRelList = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/saleServiceProdRel?saleServiceId='+params;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: ServiceSettingActionType.getServiceSettingRelList, payload: res.rows});
        } else if (!res.success) {
           /* Swal.fire('获取列表失败', res.msg, 'warning');*/
        }
    } catch (err) {
        /*Swal.fire('操作失败', err.message, 'error');*/
    }
}
export const addProduct = (params) => async (dispatch, getState) => {
    try {
        const paramsObj = {
            "serviceName": params.modifyServiceName,
            "productName": params.productArray.product_name,
            "productCount":params.productCount
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/saleService/'+params.modifyId+'/product/'+params.productArray.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getServiceSettingRelList(params.modifyId));
        } else if (!res.success) {
           /* Swal.fire("新增失败", res.msg, "warning");*/
        }
    } catch (err) {
       /* Swal.fire("操作失败", err.message, "error");*/
    }
};
export const deleteRel =(params) => async (dispatch, getState) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/saleService/' + params.sale_service_id + '/product/'+params.product_id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpDelete(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getServiceSettingRelList( params.sale_service_id));
        } else if (!res.success) {
          /*  Swal.fire('删除失败', res.msg, 'warning');*/
        }
    } catch (err) {
       /* Swal.fire("操作失败", err.message, "error");*/
    }
}
