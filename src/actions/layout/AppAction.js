import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getCurrentUser = (userId) => async (dispatch) => {
    try {
        // admin用户 检索 URL
        const url = apiHost + '/api/user/' + userId;

        // 发送 get 请求
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: AppActionType.setCurrentUser, payload: res.rows[0]})
            } else {
                window.location.href = '#!/login';
            }
        } else if (!res.success) {
            Swal.fire('查询失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getCurrentUserMenu = () => async (dispatch) => {
    try {
        const userType = localUtil.getSessionItem(sysConst.LOGIN_USER_TYPE);
        // admin用户 检索 URL
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/typeMenu?typeId=' + userType;

        // 发送 get 请求
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: AppActionType.setCurrentUserMenu, payload: commonUtil.objToMap(res.rows[0].menu_list)});
            } else {
                dispatch({type: AppActionType.setCurrentUserMenu, payload: new Map()});
            }
        } else if (!res.success) {
            Swal.fire('查询失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const sendSms = (phone) => async (dispatch) => {
    try {
        // 状态
        let url = apiHost + '/api/phone/' + phone + '/passwordSms';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPost(url, {});
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (!res.success) {
            Swal.fire("发送失败", res.msg, "warning");
        }
        return true;
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const changePassword = (originPassword, newPassword) => async (dispatch) => {
    try {
        const params = {
            originPassword: originPassword,
            newPassword: newPassword
        };
        // 状态
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/password';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        return res;
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const updatePassword = (data) => async (dispatch) => {
    try {
        const params = {
            code: data.code,
            newPassword: data.password
        };
        // 状态
        let url = apiHost + '/api/phone/' + data.phone + '/password';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("修改成功", "", "success");
        } else if (!res.success) {
            Swal.fire("修改失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

// 退出登录
export const logout = () => async () => {
    Swal.fire({
        title: "注销账号",
        text: "是否确认退出登录",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText:"取消"
    }).then((value) => {
        if (value.isConfirmed) {
            localUtil.removeSessionStore(sysConst.LOGIN_USER_ID);
            localUtil.removeSessionStore(sysConst.LOGIN_USER_TYPE);
            localUtil.removeSessionStore(sysConst.AUTH_TOKEN);
            window.location.href = '#!/login';
        }
    });
};
