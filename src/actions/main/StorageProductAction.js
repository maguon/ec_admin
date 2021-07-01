import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {StorageProductActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getStorageProductList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().StorageProductReducer.storageProductData.size;
        // 检索条件
        const queryParams = getState().StorageProductReducer.queryParams;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageProductRel?start=' + start + '&size=' + size;
        // 检索条件
        let conditionsObj = {
            storageId: queryParams.storage == null ? '' : queryParams.storage.id,
            storageAreaId: queryParams.storageArea == null ? '' : queryParams.storageArea.id,
            supplierId: queryParams.supplier === null ? '' : queryParams.supplier.id,
            productId: queryParams.product == null ? '' : queryParams.product.id,
            purchaseId: queryParams.purchaseId,
            dateIdStart: queryParams.startDate.replace(/-/g, ""),
            dateIdEnd: queryParams.endDate.replace(/-/g, "")
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        let res = await httpUtil.httpGet(url);
        let productData = getState().StorageProductReducer.storageProductData;
        if (res.success) {
            productData.start = start;
            productData.dataSize = res.rows.length;
            productData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageProductActionType.setStorageProductData, payload: productData});

            // 取得统计数据
            url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageProductRelStatistics';
            url = conditions.length > 0 ? url + "?" + conditions : url;
            res = await httpUtil.httpGet(url);
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


// export const saveModalData = (modalData) => async (dispatch, getState) => {
//     try {
//         const params = {
//             categoryId: modalData.category.id,
//             categorySubId: modalData.categorySub.id,
//             brandId: modalData.brand.id,
//             brandModelId: modalData.brandModel.id,
//             productName: modalData.productName,
//             productSName: modalData.productSName,
//             productSerial: modalData.productSerial,
//             productAddress: modalData.productAddress,
//             unitName: modalData.unitName,
//             price: modalData.price,
//             standardType: modalData.standardType,
//             remark: modalData.remark
//         };
//         // 基本url
//         let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/product';
//         let res = await httpUtil.httpPost(url, params);
//         if (res.success) {
//             Swal.fire("保存成功", "", "success");
//             // 刷新列表
//             dispatch(getProductList({
//                 dataStart: getState().StorageProductReducer.storageProductData.start
//             }));
//         } else if (!res.success) {
//             Swal.fire("保存失败", res.msg, "warning");
//         }
//     } catch (err) {
//         Swal.fire("操作失败", err.message, "error");
//     }
// };