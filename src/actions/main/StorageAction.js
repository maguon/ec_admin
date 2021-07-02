import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getStorageList = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storage';

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: StorageActionType.setStorageList, payload: res.rows});
            res.rows.forEach((item) => {
                dispatch(getStorageAreaList(item.id));
            });
        } else if (!res.success) {
            Swal.fire('获取仓库列表失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getStorageAreaList = (storageId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageArea?storageId=' + storageId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: StorageActionType.setStorageAreaList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取仓库分区列表失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const saveStorageData = (storageData) => async (dispatch, getState) => {
    try {
        const params = {
            storageName: storageData.storageName,
            remark: storageData.remark
        };

        const paramsSub = {
            storageId: storageData.storageId,
            storageAreaName: storageData.storageName,
            remark: storageData.remark
        };

        let url;
        let res;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        switch (storageData.pageType) {
            case "new":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storage';
                res = await httpUtil.httpPost(url, params);
                break;
            case "edit":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storage/' + storageData.uid;
                res = await httpUtil.httpPut(url, params);
                break;
            case "sub_new":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageArea';
                res = await httpUtil.httpPost(url, paramsSub);
                break;
            case "sub_edit":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageArea/' + storageData.uid;
                res = await httpUtil.httpPut(url, paramsSub);
                break;
            default:
                break;
        }
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            Swal.fire("保存成功", "", "success");
            // 刷新页面
            dispatch(getStorageList());
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
