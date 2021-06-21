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
        const conditionPhone = getState().AdminUserSettingReducer.conditionPhone.trim();
        // 检索条件：管理员名称
        const conditionAdminName = getState().AdminUserSettingReducer.conditionAdminName.trim();
        // 检索条件：真实姓名
        const conditionRealName = getState().AdminUserSettingReducer.conditionRealName.trim();
        // 检索条件：状态
        const conditionStatus = getState().AdminUserSettingReducer.conditionStatus;

        // 基本检索URL
        let url = apiHost + '/api/admin/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/adminUser?type=0&start=' + start + '&size=' + size;

        // 检索条件
        let conditionsObj = {
            // 检索条件：电话
            phone: conditionPhone,
            // 检索条件：姓名
            name: conditionAdminName,
            // 检索条件：员工编号
            realname: conditionRealName,
            // 检索条件：状态
            status: conditionStatus === null ? '' : conditionStatus.value
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        if (res.success === true) {
            dispatch({type: AdminUserSettingActionType.setDataSize, payload: res.result.length});
            dispatch({type: AdminUserSettingActionType.getAdminList, payload: res.result.slice(0, size - 1)});
        } else if (res.success === false) {
             Swal.fire('获取管理员列表信息失败', res.msg, 'warning');
        }
    } catch (err) {
         Swal.fire('操作失败', err.message, 'error');
    }
};