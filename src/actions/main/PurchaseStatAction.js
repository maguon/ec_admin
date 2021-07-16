import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageInOutActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getPurchaseItemStorage = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().StorageInOutReducer.purchaseItemStorage.size;
        // 检索条件
        const queryParams = getState().StorageInOutReducer.purchaseParams;
        let conditionsObj = {
            storageStatus: queryParams.storageStatus,
            storageId: queryParams.storage == null ? '' : queryParams.storage.id,
            storageAreaId: queryParams.storageArea == null ? '' : queryParams.storageArea.id,
            supplierId: queryParams.supplier === null ? '' : queryParams.supplier.id,
            purchaseId: queryParams.purchaseId,
            productId: queryParams.productId,
        };

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/purchaseItemStorage?start=' + start + '&size=' + size;
        // 检索条件
        let conditions =  httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().StorageInOutReducer.purchaseItemStorage;
        if (res.success) {
            newData.start = start;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageInOutActionType.getPurchaseItemStorageData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取采购入库列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

