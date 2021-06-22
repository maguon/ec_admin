import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AdminUserSettingActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 系统设置 -> 员工管理 取得画面列表
export const getAdminList = () => async (dispatch, getState) => {
    try {
     /*   // 检索条件：开始位置
        const start = getState().AdminUserSettingReducer.start;
        // 检索条件：每页数量
        const size = getState().AdminUserSettingReducer.size;
*/
        // 检索条件：手机
        const conditionPhone = getState().AdminUserSettingReducer.conditionPhone;
        // 检索条件：用户名称
        const conditionUserName = getState().AdminUserSettingReducer.conditionUserName;
        // 检索条件：性别
        const conditionGender = getState().AdminUserSettingReducer.conditionGender;
        // 检索条件：状态
        const conditionStatus = getState().AdminUserSettingReducer.conditionStatus;

        // 基本检索URL
        let url = apiHost + '/api/user?' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID);
       /* let url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/adminUser?type=0'*/
            /*&start=' + start + '&size=' + size*/

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
         /*   dispatch({type: AdminUserSettingActionType.setDataSize, payload: res.result.length});*/
            dispatch({type: AdminUserSettingActionType.getAdminList, payload: res.rows /*payload: res.result.slice(0, size - 1)*/});
        } else if (res.success === false) {
             Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
         Swal.fire('操作失败', err.message, 'error');
    }
};

// 系统设置 -> 员工管理 添加员工
export const addAdminUserSetting = (params) => async (dispatch) => {
    try {
        const res = await httpUtil.httpPost(apiHost + '/api/user', params);
        if (res.success === true) {
            dispatch(getAdminList());
            Swal.fire("增加成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//系统设置 -> 员工管理 删除员工信息
export const deleteUser = (id) => async (dispatch) => {
    Swal.fire({
        title: "确定删除该员工信息？",
        text: "",
        icon: "warning",
        buttons: {
            cancel: '取消',
            confirm: '确定',
        },
    }).then(async function (isConfirm) {
        if (isConfirm) {
            const url = apiHost + '/api/user/' + id;
            const res = await httpUtil.httpDelete(url, {});
            if (res.success === true) {
                Swal.fire("删除成功", "", "success");
                dispatch(getAdminList());
            } else if (res.success === false) {
                Swal.fire('删除失败', res.msg, 'warning');
            }
        }
    });
};