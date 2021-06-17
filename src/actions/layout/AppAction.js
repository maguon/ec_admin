import Swal from 'sweetalert2';
import {AppActionType} from '../../types';
import {apiHost} from '../../config';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const setShowDrawerFlag = (showDrawerFlag) =>  (dispatch)=>{
    dispatch({type: AppActionType.showDrawer, payload: {showDrawerFlag}});
};

export const getCurrentUser = (params) => async (dispatch) => {
    try {
        // admin用户 检索 URL
        const url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/adminUser?adminUserId=' + params.userId;

        // 发送 get 请求
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: AppActionType.setCurrentUser, payload: res.result[0]})
        } else if (res.success === false) {
            Swal.fire('查询失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const getCurrentUserMenu = () => async (dispatch) => {
    try {
        // admin用户 检索 URL
        const url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/menuList';

        // 发送 get 请求
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: AppActionType.setCurrentUserMenu, payload: res.result[0].menu_list})
        } else if (res.success === false) {
            Swal.fire('查询失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
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