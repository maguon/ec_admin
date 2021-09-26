import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType, AchievementActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
// 绩效信息 -> 服务查询
export const getOrderItemService = (params) => async (dispatch, getState) => {
    try {
        const start = params;
        const size = getState().AchievementReducer.serviceData.size;
        // 检索条件
        const paramsObj=getState().AchievementReducer.serviceParams;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/orderItemService?start=' + start + '&size=' + size;
        let paramsObject = {
            orderId:paramsObj.orderId,
            dateStart:commonUtil.formatDate(paramsObj.dateStart, 'yyyyMMdd'),
            dateEnd:commonUtil.formatDate(paramsObj.dateEnd, 'yyyyMMdd'),
            saleServiceId: paramsObj.saleServiceId == null? '' : paramsObj.saleServiceId.id,
            deployUserId:paramsObj.deployUserId==null?'':paramsObj.deployUserId.id,
            checkUserId:paramsObj.checkUserId==null?'':paramsObj.checkUserId.id,
            clientSerial:paramsObj.clientSerial,
            clientAgentId:paramsObj.clientAgentId==null?'':paramsObj.clientAgentId.id,
            clientId:paramsObj.clientId==null?'':paramsObj.clientId.id,
        };
        let conditions = httpUtil.objToUrl(paramsObject);
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newServiceData = getState().AchievementReducer.serviceData;
        if (res.success) {
            newServiceData.start = start;
            newServiceData.dataSize = res.rows.length;
            newServiceData.serviceInfo = res.rows.slice(0, size - 1);
            dispatch({type: AchievementActionType.setServiceParam, payload: newServiceData});
        } else if (res.success === false) {
            Swal.fire('获取服务信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
// 绩效信息 -> 商品查询
export const getOrderItemProd = (params) => async (dispatch, getState) => {
    try {
        const start = params;
        const size = getState().AchievementReducer.productData.size;
        const param=getState().AchievementReducer.productParams;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/orderItemProd?start=' + start + '&size=' + size;
        let paramsObj = {
            purchaseId:param.purchaseId,
            supplierId:param.supplierId == null? '' : param.supplierId.id,
            orderId:param.orderId,
            dateStart:commonUtil.formatDate(param.dateStart, 'yyyyMMdd'),
            dateEnd:commonUtil.formatDate(param.dateEnd, 'yyyyMMdd'),
            saleUserId: param.saleUserId == null? '' : param.saleUserId.id,
            prodId:param.prodId==null?'':param.prodId.id,
            orderStatus:sysConst.ORDER_STATUS[3].value,
            clientSerial:param.clientSerial,
            clientAgentId:param.clientAgentId==null?'':param.clientAgentId.id,
            clientId:param.clientId==null?'':param.clientId.id
        };
        let conditions = httpUtil.objToUrl(paramsObj);
        url = conditions.length > 0 ? url + "&" + conditions : url;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newProductData = getState().AchievementReducer.productData;
        if (res.success) {
            newProductData.start = start;
            newProductData.dataSize = res.rows.length;
            newProductData.productInfo = res.rows.slice(0, size - 1);
            dispatch({type: AchievementActionType.setProductParam, payload: newProductData});
        } else if (res.success === false) {
            Swal.fire('获取商品信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const downServiceLoadCsv = () => async (dispatch,getState) => {
    try {
        const paramsObj=getState().AchievementReducer.serviceParams;
        let paramsObjCsv = {
            orderId:paramsObj.orderId,
            dateStart:commonUtil.formatDate(paramsObj.dateStart, 'yyyyMMdd'),
            dateEnd:commonUtil.formatDate(paramsObj.dateEnd, 'yyyyMMdd'),
            saleServiceId: paramsObj.saleServiceId == null? '' : paramsObj.saleServiceId.id,
            deployUserId:paramsObj.deployUserId==null?'':paramsObj.deployUserId.id,
            checkUserId:paramsObj.checkUserId==null?'':paramsObj.checkUserId.id,
            clientSerial:paramsObj.clientSerial,
            clientAgentId:paramsObj.clientAgentId==null?'':paramsObj.clientAgentId.id,
            clientId:paramsObj.clientId==null?'':paramsObj.clientId.id
        };
        // 基本检索URL
        let url = 'http://' + apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderItemService.csv?1=1';
        // 检索条件
        let conditions = httpUtil.objToUrl(paramsObjCsv);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
export const downLoadCsv = () => async (dispatch,getState) => {
    try {
        const param=getState().AchievementReducer.productParams;
        let paramsObjCsv = {
            purchaseId:param.purchaseId,
            supplierId:param.supplierId == null? '' : param.supplierId.id,
            orderId:param.orderId,
            dateStart:commonUtil.formatDate(param.dateStart, 'yyyyMMdd'),
            dateEnd:commonUtil.formatDate(param.dateEnd, 'yyyyMMdd'),
            saleUserId: param.saleUserId == null? '' : param.saleUserId.id,
            prodId:param.prodId==null?'':param.prodId.id,
            orderStatus:sysConst.ORDER_STATUS[3].value,
            clientSerial:param.clientSerial,
            clientAgentId:param.clientAgentId==null?'':param.clientAgentId.id,
            clientId:param.clientId==null?'':param.clientId.id
        };
        // 基本检索URL
        let url = 'http://' + apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/orderItemProd.csv?1=1';
        // 检索条件
        let conditions = httpUtil.objToUrl(paramsObjCsv);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};