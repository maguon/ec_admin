import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AdminUserSettingActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 系统设置 -> 员工管理 取得画面列表
export const getAdminList = () => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = getState().AdminUserSettingReducer.start;
        // 检索条件：每页数量
        const size = getState().AdminUserSettingReducer.size;
        // 检索条件：手机
        const conditionPhone = getState().AdminUserSettingReducer.conditionPhone;
        // 检索条件：用户名称
        const conditionUserName = getState().AdminUserSettingReducer.conditionUserName;
        // 检索条件：性别
        const conditionGender = getState().AdminUserSettingReducer.conditionGender;
        // 检索条件：状态
        const conditionStatus = getState().AdminUserSettingReducer.conditionStatus;

        // 基本检索URL
        let url = apiHost + '/api/user?' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'&start=' + start + '&size=' + size;

        // 检索条件
        let conditionsObj = {
            // 检索条件：电话
            phone: conditionPhone,
            // 检索条件：用户名称
            userName: conditionUserName,
            // 检索条件：性别
            /*gender: conditionGender,*/
            gender: conditionGender === null ? '' : conditionGender.value,
            // 检索条件：状态
            status: conditionStatus === null ? '' : conditionStatus.value
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: AdminUserSettingActionType.setDataSize, payload: res.rows.length});
            dispatch({type: AdminUserSettingActionType.getAdminList, payload: res.rows.slice(0, size - 1)});
        } else if (res.success === false) {
             Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
         Swal.fire('操作失败', err.message, 'error');
    }
};
//群组查找
export const adminUserTypeSetting = (params) => async (dispatch) => {
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
export const adminUserSetting = (params) => async (dispatch) => {
    try {
        const res = await httpUtil.httpPost(apiHost + '/api/user', params);
        if (res.success === true) {
            params=[];
            dispatch(getAdminList());
            Swal.fire("增加成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

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
                    dispatch(getAdminList());
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

//系统设置 -> 员工管理  修改员工信息
export const putUser = (id) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user?id='+ id;
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

export const putAminUserSetting = (params,id) => async (dispatch) => {
    console.log(params,11111,id)
    try {
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+id, params);
        if (res.success === true) {
            params=[];
            dispatch(getAdminList());
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};



//修改状态
export const changePutStatus =(status,id)  => async (dispatch) => {
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

                const url = apiHost + '/api/user/' + id
                    + '/status?status=' +newStatus;
                const res = await httpUtil.httpPut(url);
                if (res.success === true) {
                    dispatch(getAdminList());
                    dispatch(putUser(id));
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
