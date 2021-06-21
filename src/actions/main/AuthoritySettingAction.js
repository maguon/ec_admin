import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AuthoritySettingActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 系统设置 -> 权限设置 取得画面列表
export const getMenuList = () => async (dispatch, getState) => {
    try {
        // 检索条件：用户类型
        let conditionUserType = getState().AuthoritySettingReducer.conditionUserType;
        let type = conditionUserType === null ? '' : conditionUserType.value;

        // 基本检索URL
        let url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/menuList?type=' + type;
        const res = await httpUtil.httpGet(url);

        dispatch({type: AuthoritySettingActionType.setCurrentUserType, payload: conditionUserType});
        if (res.success) {
            console.log('sysConst.ALL_PAGE_LIST',sysConst.ALL_PAGE_LIST);
            if (res.result.menu_list.length > 0) {
                dispatch({type: AuthoritySettingActionType.setMenuList, payload: res.result.menu_list});
            } else {
                dispatch({type: AuthoritySettingActionType.setMenuList, payload: sysConst.ALL_PAGE_LIST});
            }

            console.log('currentMenu',getState().AuthoritySettingReducer.currentMenu);
        } else if (!res.success) {
            Swal.fire('获取菜单权限信息失败', res.msg, 'warning');
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
            newStatus = !currentMenu[i].available;
            currentMenu[i].available = newStatus;
        } else {
            newStatus = !currentMenu[i].children[k].available;
            currentMenu[i].children[k].available = newStatus;
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
            type: currentUserType === null ? '' : currentUserType.value,
            menu_list: currentMenu
        };
        // 基本url
        let url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + "/menuList";
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
