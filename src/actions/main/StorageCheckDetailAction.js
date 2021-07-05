import { createHashHistory,createBrowserHistory } from 'history';
import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageCheckActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getStorageCheckList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().StorageCheckReducer.storageCheckData.size;
        // 检索条件
        const queryParams = getState().StorageCheckReducer.queryParams;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/product?start=' + start + '&size=' + size;
        // 检索条件
        // let conditionsObj = {
        //     categoryId: queryParams.paramCategory == null ? '' : queryParams.paramCategory.id,
        //     categorySubId: queryParams.paramCategorySub == null ? '' : queryParams.paramCategorySub.id,
        //     brandId: queryParams.paramBrand === null ? '' : queryParams.paramBrand.id,
        //     brandModelId: queryParams.paramBrandModel == null ? '' : queryParams.paramBrandModel.id,
        //     productId: queryParams.paramProduct == null ? '' : queryParams.paramProduct.id,
        //     standardType: queryParams.paramStandardType == null ? '' : queryParams.paramStandardType,
        //     status: queryParams.paramStatus == null ? '' : queryParams.paramStatus,
        // };
        // let conditions = httpUtil.objToUrl(conditionsObj);
        // // 检索URL
        // url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let storageCheckData = getState().StorageCheckReducer.storageCheckData;
        if (res.success) {
            storageCheckData.start = start;
            storageCheckData.dataSize = res.rows.length;
            storageCheckData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageCheckActionType.setStorageCheckData, payload: storageCheckData});
        } else if (!res.success) {
            Swal.fire("获取仓库盘点列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// export const changeStatus = (id, status) => async (dispatch, getState) => {
//     try {
//         // 状态
//         let newStatus;
//         if (status === 0) {
//             newStatus = 1
//         } else {
//             newStatus = 0
//         }
//
//         // 状态
//         let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
//             + '/product/' + id + '/status?status=' + newStatus;
//         dispatch({type: AppActionType.showLoadProgress, payload: true});
//         const res = await httpUtil.httpPut(url, {});
//         dispatch({type: AppActionType.showLoadProgress, payload: false});
//         if (res.success) {
//             Swal.fire("修改成功", "", "success");
//             // 刷新列表
//             dispatch(getProductList({
//                 dataStart: getState().StorageCheckReducer.storageCheckData.start
//             }));
//         } else if (!res.success) {
//             Swal.fire("修改失败", res.msg, "warning");
//         }
//     } catch (err) {
//         Swal.fire("操作失败", err.message, "error");
//     }
// };

export const saveModalData = (modalData) => async (dispatch, getState) => {
    try {
        const params = {
            categoryId: modalData.category.id,
            categorySubId: modalData.categorySub.id,
            brandId: modalData.brand.id,
            brandModelId: modalData.brandModel.id,
            productName: modalData.productName,
            productSName: modalData.productSName,
            productSerial: modalData.productSerial,
            productAddress: modalData.productAddress,
            unitName: modalData.unitName,
            price: modalData.price,
            standardType: modalData.standardType,
            remark: modalData.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/product';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            console.log('',res);
            const history = createHashHistory();
            history.push('/product_manager/' + res.rows[0].id);
            Swal.fire("保存成功", "", "success");
            // // 刷新列表
            // dispatch(getProductList({
            //     dataStart: getState().StorageCheckReducer.storageCheckData.start
            // }));
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};