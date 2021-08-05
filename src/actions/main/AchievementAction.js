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
            checkUserId:paramsObj.checkUserId==null?'':paramsObj.checkUserId.id
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
            orderId:param.orderId,
            dateStart:commonUtil.formatDate(param.dateStart, 'yyyyMMdd'),
            dateEnd:commonUtil.formatDate(param.dateEnd, 'yyyyMMdd'),
            saleUserId: param.saleUserId == null? '' : param.saleUserId.id,
            prodId:param.prodId==null?'':param.prodId.id,
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