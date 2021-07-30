import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageCheckDetailActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getStorageCheckInfo = (storageCheckId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheck?storageCheckId=' + storageCheckId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: StorageCheckDetailActionType.getStorageCheckInfo, payload: res.rows[0]});
            } else {
                dispatch({type: StorageCheckDetailActionType.getStorageCheckInfo, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取仓库盘点信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getStorageCheckRelList = (storageCheckId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheckRel?storageCheckId=' + storageCheckId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: StorageCheckDetailActionType.getDetailList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取仓库盘点详细列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveStorageCheck = () => async (dispatch, getState) => {
    try {
        const storageCheckInfo = getState().StorageCheckDetailReducer.storageCheckInfo;
        const params = {
            remark: storageCheckInfo.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageCheck/' + storageCheckInfo.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveStorageCheckRel = (data) => async (dispatch, getState) => {
    try {
        const storageCheckInfo = getState().StorageCheckDetailReducer.storageCheckInfo;
        let detailList = getState().StorageCheckDetailReducer.detailList;
        const params = {
            checkCount: data.checkCount,
            remark: data.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageCheckRel/' + data.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            dispatch(getStorageCheckInfo(storageCheckInfo.id));
            await dispatch(getStorageCheckRelList(storageCheckInfo.id));
            for (let i = 0; i < detailList.length; i++) {
                dispatch(StorageCheckDetailActionType.setDetailList({name: "check_count", value: detailList[i].check_count, index: i}))
                dispatch(StorageCheckDetailActionType.setDetailList({name: "remark", value: detailList[i].remark, index: i}))
            }
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const changeStorageCheckStatus = (storageCheckId, status) => async (dispatch) => {
    try {
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheck/' + storageCheckId + '/status?status=' + status;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
            // 刷新
            dispatch(getStorageCheckInfo(storageCheckId));
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveModalData = (modalData) => async (dispatch) => {
    try {
        let params = {
            storageCheckId: modalData.storageCheckId,
            storageId: modalData.storage.id,
            storageAreaId: modalData.storageArea.id,
            supplierId: modalData.supplier == null ? '' : modalData.supplier.id,
            productId: modalData.product.id,
            productName: modalData.product.product_name,
            checkCount: modalData.checkCount,
            storageDateId: commonUtil.getDateFormat(modalData.storageDateId),
            unitCost: modalData.unitCost,
            remark: modalData.remark
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageCheckRel';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success && res.rows.length > 0) {
            Swal.fire("保存成功", "", "success");
            dispatch(getStorageCheckInfo(modalData.storageCheckId));
            dispatch(getStorageCheckRelList(modalData.storageCheckId));
        } else {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};