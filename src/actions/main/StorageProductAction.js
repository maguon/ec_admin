import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageProductActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

const getParams = () => (dispatch, getState) => {
    // 检索条件
    const queryParams = getState().StorageProductReducer.queryParams;
    let conditionsObj = {
        storageId: queryParams.storage == null ? '' : queryParams.storage.id,
        storageAreaId: queryParams.storageArea == null ? '' : queryParams.storageArea.id,
        supplierId: queryParams.supplier === null ? '' : queryParams.supplier.id,
        productId: queryParams.product == null ? '' : queryParams.product.id,
        purchaseId: queryParams.purchaseId,
        dateIdStart: commonUtil.formatDate(queryParams.startDate, 'yyyyMMdd'),
        dateIdEnd: commonUtil.formatDate(queryParams.endDate, 'yyyyMMdd')
    };
    return httpUtil.objToUrl(conditionsObj);
};

export const getStorageProductList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().StorageProductReducer.storageProductData.size;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRel?status=1&start=' + start + '&size=' + size;
        // 检索条件
        let conditions =  dispatch(getParams());
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let productData = getState().StorageProductReducer.storageProductData;
        if (res.success) {
            productData.start = start;
            productData.dataSize = res.rows.length;
            productData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageProductActionType.setStorageProductData, payload: productData});

            // 取得统计数据
            url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageProductRelStat';
            url = conditions.length > 0 ? url + "?" + conditions : url;
            dispatch({type: AppActionType.showLoadProgress, payload: true});
            res = await httpUtil.httpGet(url);
            dispatch({type: AppActionType.showLoadProgress, payload: false});
            if (res.success && res.rows.length > 0) {
                dispatch({type: StorageProductActionType.setStorageProductDataCnt, payload: {totalCnt: res.rows[0].storage_count, totalCost: res.rows[0].total_cost}});
            } else {
                dispatch({type: StorageProductActionType.setStorageProductDataCnt, payload: {totalCnt: 0, totalCost: 0}});
            }
        } else if (!res.success) {
            Swal.fire("获取库存商品列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadCsv = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = 'http://' + apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRel.csv?status=1';
        // 检索条件
        let conditions =  dispatch(getParams());
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};