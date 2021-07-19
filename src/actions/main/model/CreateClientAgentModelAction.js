import Swal from 'sweetalert2';
import {apiHost} from '../../../config/index';
import {CreateClientAgentModelActionType, AppActionType} from '../../../types';
const ClientAgentAction = require('../../../actions/main/ClientAgentAction');
const httpUtil = require('../../../utils/HttpUtils');
const localUtil = require('../../../utils/LocalUtils');
const sysConst = require('../../../utils/SysConst');

// 新增客户中心画面 初期
export const openCreateClientModel = () => async (dispatch) => {
    dispatch({type: CreateClientAgentModelActionType.setFlag, payload: true});
    dispatch({type: CreateClientAgentModelActionType.setRemark, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setName, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setClientType, payload: '1'});
    dispatch({type: CreateClientAgentModelActionType.setTel, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setAddress, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setIdSerial, payload: ''});
    dispatch({type: CreateClientAgentModelActionType.setSalesUserId, payload: null});
    dispatch({type: CreateClientAgentModelActionType.setSourceType, payload: '1'});
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
export const addClientAgentItem=()=>async (dispatch,getState) =>{
    try{
        const param = getState().CreateClientAgentModelReducer;
        let params = {
            remark: param.remark,
            name: param.name,
            clientType:param.clientType,
            tel: param.tel,
            address: param.address,
            idSerial:  param.idSerial,
            salesUserId: param.salesUserId==null?'': param.salesUserId.id,
            sourceType: param.sourceType,
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/clientAgent/';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(ClientAgentAction.getClientList(0))
            dispatch({type: CreateClientAgentModelActionType.setFlag, payload: false});
            Swal.fire("新增成功", "", "success");
        } else if (!res.success) {
            Swal.fire('新增失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}