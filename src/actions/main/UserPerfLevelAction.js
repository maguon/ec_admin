import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, UserPerfLevelActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getUserPerfLevel = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：每页数量
        const size = getState().UserPerfLevelReducer.userPerfLevelData.size;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/userPerfLevel?start=' + dataStart + '&size=' + size + '&status=1';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let newData = getState().UserPerfLevelReducer.userPerfLevelData;
        if (res.success) {
            newData.start = dataStart;
            newData.dataSize = res.rows.length;
            newData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: UserPerfLevelActionType.getUserPerfLevelData, payload: newData});
        } else if (!res.success) {
            Swal.fire("获取绩效设置列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveModalData = (modalData) => async (dispatch, getState) => {
    try {
        const params = {
            perfName: modalData.perfName,
            remark: modalData.remark,
            saleRatio: modalData.saleRatio,
            deployRatio: modalData.deployRatio,
            checkRatio: modalData.checkRatio
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/userPerfLevel';
        let res;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        if (modalData.pageType === 'new') {
            res = await httpUtil.httpPost(url, params);
        } else {
            url = url + '/' + modalData.uid;
            res = await httpUtil.httpPut(url, params);
        }
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
            // 刷新列表
            dispatch(getUserPerfLevel(getState().UserPerfLevelReducer.userPerfLevelData.start));
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};