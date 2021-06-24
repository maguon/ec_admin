import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppSettingActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getAppList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().AppSettingReducer.appData.size;
        // 检索条件：系统类型
        const deviceType = params.conditionDeviceType;
        // 检索条件：状态
        const status = params.conditionStatus;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/app?start=' + start + '&size=' + size;

        // 检索条件
        let conditionsObj = {
            deviceType: deviceType,
            status: status
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        const res = await httpUtil.httpGet(url);
        let appData = getState().AppSettingReducer.appData;
        if (res.success) {
            appData.start = start;
            appData.dataSize = res.rows.length;
            appData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: AppSettingActionType.setAppData, payload: appData});
        } else if (!res.success) {
            Swal.fire("获取App系统列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const changeStatus = (id, status, condition) => async (dispatch, getState) => {
    Swal.fire({
        title: status === 1 ? "确定停用该数据？" : "确定重新启用该数据？",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText:"取消"
    }).then(async (value) => {
        if (value.isConfirmed) {
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
                dispatch(getAppList({
                    conditionDeviceType: condition.conditionDeviceType,
                    conditionStatus: condition.conditionStatus,
                    dataStart: getState().AppSettingReducer.appData.start
                }));
            } else if (!res.success) {
                Swal.fire("修改失败", res.msg, "warning");
            }
        }
    });
};

export const deleteApp = (id, condition) => async (dispatch, getState) => {
    Swal.fire({
        title: "确定删除该App版本",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText:"取消"
    }).then(async (value) => {
        if (value.isConfirmed) {
            const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
                + '/app/' + id + '/del';
            const res = await httpUtil.httpDelete(url, {});
            if (res.success) {
                Swal.fire("删除成功", "", "success");
                // 刷新列表
                dispatch(getAppList({
                    conditionDeviceType: condition.conditionDeviceType,
                    conditionStatus: condition.conditionStatus,
                    dataStart: getState().AppSettingReducer.appData.start
                }));
            } else if (!res.success) {
                Swal.fire('删除失败', res.msg, 'warning');
            }
        }
    });
};

export const saveModalData = (modalData, condition) => async (dispatch, getState) => {
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
            dispatch(getAppList({
                conditionDeviceType: condition.conditionDeviceType,
                conditionStatus: condition.conditionStatus,
                dataStart: getState().AppSettingReducer.appData.start
            }));
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};