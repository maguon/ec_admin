import Swal from 'sweetalert2';
import {apiHost, hiddenUserType} from '../../config/index';
import {AdminUserSettingActionType, AppActionType} from '../../types';
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
// 系统设置 -> 员工管理 取得画面列表
export const getUserList = () => async (dispatch, getState) => {
    try {
        // 检索条件：每页数量
        const size = getState().AdminUserSettingReducer.size;
        // 检索条件
       const paramsObj=getState().AdminUserSettingReducer.queryObj;
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/user?size=' + size;
        let conditions = httpUtil.objToUrl(paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: AdminUserSettingActionType.setUserListDataSize, payload: res.rows.length});
            dispatch({type: AdminUserSettingActionType.getUserList, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
             Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
         Swal.fire('操作失败', err.message, 'error');
    }
};

//群组查找
export const getUserTypeList = () => async (dispatch) => {
    try {
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/userTypeList';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            let roles = [];
            let hiddenFlag;
            res.rows.forEach((item) => {
                hiddenFlag = false;
                for (let i = 0; i < hiddenUserType.length; i++) {
                    if (item.id == hiddenUserType[i]) {
                        hiddenFlag = true;
                        break;
                    }
                }
                if (!hiddenFlag) {
                    roles.push(item);
                }
            });
            dispatch({type: AdminUserSettingActionType.setTypeArray, payload: roles});
        } else if (res.success === false) {
            Swal.fire('群组查询失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//绩效查找
export const getPerfLevelList = () => async (dispatch) => {
    try {
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/userPerfLevel';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch({type: AdminUserSettingActionType.setPerfLevelArray, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('绩效查询失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
// 系统设置 -> 员工管理 添加员工
export const addUser = (params) => async (dispatch) => {
    try {
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPost(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/user', params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true&&res.rows.length!==0) {
            dispatch(getUserList());
            Swal.fire("增加成功", "", "success");
        } else if(res.success === true&&res.rows.length==0){
            Swal.fire("手机号相同,增加失败", "", "warning");
        } else if (res.success === false) {
            Swal.fire('增加失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getUserById = (id) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/user?id='+ id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            if (res.rows.length > 0) {
                dispatch({type: AdminUserSettingActionType.setAdminItem, payload: res.rows});
            }
        } else if (res.success === false) {
            Swal.fire('获取员工详细信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const updateUserInfo = (params,id) => async (dispatch) => {
    try {
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+id, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch(getUserList());
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//修改状态
export const updateUserStatus =(status,id)  => async (dispatch) => {
    // 状态
    let newStatus;
    if (status === sysConst.USE_FLAG[0].value) {
        newStatus = sysConst.USE_FLAG[1].value
    } else {
        newStatus = sysConst.USE_FLAG[0].value
    }
    const url = apiHost + '/api/user/' + id + '/status?status=' + newStatus;
    dispatch({type: AppActionType.showLoadProgress, payload: true});
    const res = await httpUtil.httpPut(url);
    dispatch({type: AppActionType.showLoadProgress, payload: false});
    if (res.success === true) {
        dispatch(getUserList());
        Swal.fire("修改成功", "", "success");
    } else if (res.success === false) {
        Swal.fire('修改失败', res.msg, 'warning');
    }
}