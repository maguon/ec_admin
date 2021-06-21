import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {CommonActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 取得登录用户详细信息
export const getLoginUserInfo = (params) => async (dispatch) => {
    console.log('getLoginUserInfo',params);
    try {
        // admin用户 检索 URL
        const url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/adminUser?adminUserId=' + params.userId;

        console.log('url',url);
        // 发送 get 请求
        const res = await httpUtil.httpGet(url);
        console.log('res',res);
        if (res.success === true) {
            dispatch({type: CommonActionType.getLoginUserInfo, payload: res.result[0]})
        } else if (res.success === false) {
            Swal.fire('查询失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

// 取得登录用户权限菜单
export const getLoginUserMenu = () => async (dispatch) => {
    try {
        const userType = localUtil.getSessionItem(sysConst.LOGIN_USER_TYPE);
        // admin用户 检索 URL
        // const url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/menuList?type=' + userType;
        // admin用户 检索 URL
        const url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/menuList';

        // 发送 get 请求
        const res = await httpUtil.httpGet(url);


        if (res.success) {
            dispatch({type: CommonActionType.getLoginUserMenu, payload: sysConst.ALL_PAGE_LIST});

            // if (res.result[0].menu_list.length > 0) {
            //     dispatch({type: CommonActionType.getLoginUserMenu, payload: res.result[0].menu_list});
            // } else {
            //     dispatch({type: CommonActionType.getLoginUserMenu, payload: sysConst.ALL_PAGE_LIST});
            // }

        } else if (!res.success) {
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
        buttons: {
            cancel: '取消',
            confirm: '确定',
        },
    }).then((value) => {
        if (value) {
            localUtil.removeSessionStore(sysConst.LOGIN_USER_ID);
            localUtil.removeSessionStore(sysConst.LOGIN_USER_TYPE);
            localUtil.removeSessionStore(sysConst.AUTH_TOKEN);
            window.location.href = '/login.html';
        }
    });
};

// 取得 用户列表 (根据电话模糊查询)
export const getUserListByPhone = (phoneReg) => async (dispatch) => {
    try {
        const url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/user?phoneReg=' + phoneReg;
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: CommonActionType.getUserByPhoneList, payload: res.result});
        } else if (res.success === false) {
            Swal.fire('获取用户信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

// 取得App版本号列表
export const getAppVersionList = (deviceType) => async (dispatch) => {
    try {
        const url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/app?deviceType=' + deviceType;
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: CommonActionType.getAppVersionList, payload: res.result})
        } else if (res.success === false) {
            Swal.fire('获取App版本列表失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

