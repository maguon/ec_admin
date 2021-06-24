import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AdminUserSettingActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 系统设置 -> 员工管理 取得画面列表
export const getUserList = (params) => async (dispatch, getState) => {

    try {
        // 检索条件：开始位置
        const start = getState().AdminUserSettingReducer.start;
        // 检索条件：每页数量
        const size = getState().AdminUserSettingReducer.size;

        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/user?start=' + start + '&size=' + size;
        // 检索条件
        if(params==undefined){
            params=''
        }else {
            params.gender=(params.gender==-1?'': params.gender);
            params.type=(params.type==-1?'': params.type);
            params.status=(params.status==-1?'': params.status);
        }

        let conditions = httpUtil.objToUrl(params);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: AdminUserSettingActionType.setDataSize, payload: res.rows.length});
            dispatch({type: AdminUserSettingActionType.getUserList, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
             Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
         Swal.fire('操作失败', err.message, 'error');
    }
};

//群组查找
export const getUserTypeList = (params) => async (dispatch) => {
    try {
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/typeMenu';
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: AdminUserSettingActionType.setTypeArray, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

// 系统设置 -> 员工管理 添加员工
export const addUserItem = (params) => async (dispatch) => {
    try {
        const res = await httpUtil.httpPost(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/user', params);
        if (res.success === true) {
            params=[];
            dispatch(getUserList());
            Swal.fire("增加成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//系统设置 -> 员工管理  修改员工信息
export const updateUser = (id) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/user?id='+ id;
        const res = await httpUtil.httpGet(url);
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

export const updateUserItem = (params,id) => async (dispatch) => {
    try {
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+id, params);
        if (res.success === true) {
            params=[];
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
export const changeStatus =(status,id)  => async (dispatch) => {
    Swal.fire({
        title: status === 1 ? "确定停用该员工？" : "确定重新启用该员工？",
        text: "",
        icon: "warning",
        confirmButtonText:'确定',
        cancelButtonText: "取消",
    }).then(async function (isConfirm) {

        try{
            if (isConfirm) {
                // 状态
                let newStatus = 0;
                if (status === 0) {
                    newStatus = 1
                } else {
                    newStatus = 0
                }

                const url = apiHost + '/api/user/' + id + '/status?status=' +newStatus;
                const res = await httpUtil.httpPut(url);
                if (res.success === true) {
                    dispatch(updateUser(id));
                    dispatch(getUserList());
                    Swal.fire("修改成功", "", "success");
                } else if (res.success === false) {
                    Swal.fire('修改失败', res.msg, 'warning');
                }
            }
        }catch (e) {
            alert(e);
        }

    });
}

/*//系统设置 -> 员工管理 删除员工信息
export const deleteUser = (id) => async (dispatch) => {
    Swal.fire({
        title: "确定删除该员工信息？",
        text: "",
        icon: "warning",
        confirmButtonText:'确定',
        cancelButtonText: "取消",
    }).then(async function(isConfirm) {
        try {
            //判断 是否 点击的 确定按钮
            if (isConfirm.value) {
                const url = apiHost + '/api/user/' + id;
                const res = await httpUtil.httpDelete(url, {});
                if (res.success === true) {
                    Swal.fire("删除成功", "", "success");
                    dispatch(getUserList());
                } else if (res.success === false) {
                    Swal.fire('删除失败', res.msg, 'warning');
                }
            }
            else {
                Swal.fire('删除失败', "",'warning');
            }
        } catch (e) {
            alert(e);
        }
    })
};*/
