import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, AuthoritySettingActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 系统设置 -> 权限设置 取得用户群组列表
export const getUserGroupList = () => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/typeMenu';

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: AuthoritySettingActionType.setUserGroupList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取用户群组信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

// 系统设置 -> 权限设置 取得画面列表
export const getMenuList = (conditionUserType) => async (dispatch, getState) => {
    try {
        // 检索条件：用户类型
        let type = conditionUserType === null ? '' : conditionUserType.value;

        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/typeMenu?typeId=' + type;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: AuthoritySettingActionType.setCurrentUserType, payload: conditionUserType});
            if (res.rows[0].menu_list.length > 0) {
                dispatch({type: AuthoritySettingActionType.setMenuList, payload: res.rows[0].menu_list});
            } else {
                dispatch({type: AuthoritySettingActionType.setMenuList, payload: sysConst.ALL_PAGE_LIST});
            }
        } else if (!res.success) {
            Swal.fire('获取菜单权限信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

// 系统设置 -> 权限设置 新增用户群组
export const createUserGroup = (params) => async (dispatch, getState) => {
    try {
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + "/typeMenu";
        let res = await httpUtil.httpPost(url, params);

        if (res.success) {
            dispatch(getUserGroupList());
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

// 系统设置 -> 权限设置 修改权限设置
export const changeMenuList = (i , k) => async (dispatch, getState) => {
    try {
        // 当前权限菜单
        const currentMenu = getState().AuthoritySettingReducer.currentMenu;

        let newStatus;
        if (k === -1) {
            newStatus = !currentMenu[i].usable;
            currentMenu[i].usable = newStatus;
        } else {
            newStatus = !currentMenu[i].children[k].usable;
            currentMenu[i].children[k].usable = newStatus;
        }
        dispatch({type: AuthoritySettingActionType.setMenuList, payload: currentMenu});
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

// 系统设置 -> 权限设置 保存权限
export const saveMenu = () => async (dispatch, getState) => {
    try {
        // 当前权限
        const currentUserType = getState().AuthoritySettingReducer.currentUserType;
        // 当前权限菜单
        const currentMenu = getState().AuthoritySettingReducer.currentMenu;

        const params = {
            id: currentUserType === null ? '' : currentUserType.value,
            typeName: currentUserType === null ? '' : currentUserType.label,
            menuList: currentMenu
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + "/typeMenu";
        let res = await httpUtil.httpPost(url, params);

        if (res.success) {
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
