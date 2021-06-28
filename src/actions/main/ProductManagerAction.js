import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {ProductManagerActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getProductList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().ProductManagerReducer.productData.size;
        // 检索条件
        const queryParams = getState().ProductManagerReducer.queryParams;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/product?start=' + start + '&size=' + size;
        // 检索条件
        let conditionsObj = {
            categoryId: queryParams.category === null ? '' : queryParams.category.value,
            categorySubId: queryParams.categorySub === null ? '' : queryParams.categorySub.value,
            brandId: queryParams.brand === null ? '' : queryParams.brand.value,
            brandModelId: queryParams.brandModel === null ? '' : queryParams.brandModel.value,
            productId: queryParams.product === null ? '' : queryParams.product.value,
            standardType: queryParams.standardType === null ? '' : queryParams.standardType.value,
            status: queryParams.status === null ? '' : queryParams.status.value,
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        const res = await httpUtil.httpGet(url);
        let productData = getState().ProductManagerReducer.productData;
        if (res.success) {
            productData.start = start;
            productData.dataSize = res.rows.length;
            productData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: ProductManagerActionType.setProductData, payload: productData});
        } else if (!res.success) {
            Swal.fire("获取商品列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
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
            + '/app/' + id + '/status?status=' + newStatus;
        const res = await httpUtil.httpPut(url, {});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新列表
            dispatch(getProductList({
                dataStart: getState().ProductManagerReducer.productData.start
            }));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveModalData = (modalData) => async (dispatch, getState) => {
    try {
        const params = {
            appType: modalData.appType,
            deviceType: modalData.deviceType,
            version: modalData.version,
            versionNum: modalData.versionNum,
            minVersionNum: modalData.minVersionNum,
            forceUpdate: modalData.forceUpdate,
            url: modalData.url,
            remarks: modalData.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/app';
        let res;
        if (modalData.pageType === 'new') {
            res = await httpUtil.httpPost(url, params);
        } else {
            url = url + '/' + modalData.uid;
            res = await httpUtil.httpPut(url, params);
        }
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            // 刷新列表
            dispatch(getProductList({
                dataStart: getState().ProductManagerReducer.productData.start
            }));
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};