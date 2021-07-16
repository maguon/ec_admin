import Swal from 'sweetalert2';
import {apiHost} from '../../../config/index';
import {CreateClientAgentModelActionType, AppActionType} from '../../../types';
const httpUtil = require('../../../utils/HttpUtils');
const localUtil = require('../../../utils/LocalUtils');
const sysConst = require('../../../utils/SysConst');
const commonUtil = require('../../../utils/CommonUtil');


// 新增客户中心画面 初期
export const openCreateClientModel = () => async (dispatch) => {
    dispatch({type: CreateClientAgentModelActionType.setFlag, payload: true});
    /*dispatch({type: CreateClientAgentModelActionType.setRemark, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setName, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setClientType, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setTel, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setAddress, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setIdSerial, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setSalesUserId, payload: null});
    dispatch({type: CreateClientAgentModelActionType.setSourceType, payload: ''});*/
};

export const getCurrentUser = () => async (dispatch) => {
    try {
        // admin用户 检索 URL
        const url = apiHost + '/api/user/'+ localUtil.getSessionItem(sysConst.LOGIN_USER_ID) +'/user';

        // 发送 get 请求
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: CreateClientAgentModelActionType.getCurrentUser, payload: res.rows})
            } else {
                Swal.fire('查询失败', res.msg, 'warning');
            }
        } else if (!res.success) {
            Swal.fire('查询失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};