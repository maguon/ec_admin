import Swal from 'sweetalert2';
import {MainPanelActionType} from '../../types';
import {apiHost} from '../../config';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
export const getTodayUserCount = () => async (dispatch) => {
    dispatch({type: MainPanelActionType.setTodayUserCount, payload: {}});
};

export const getUserMsg = (params) => async (dispatch) => {
    try {
        const res = await httpUtil.httpGet(apiHost + '/api/admin/5dd5f45de240c77601a86b84/msg?start=0&size=21');
        if (res.success === true) {
            dispatch({type: MainPanelActionType.setMsg, payload: res.result});
        } else if (res.success === false) {
          Swal.fire("登陆失败", res.msg, "warning");
        }
      } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
      }
    
};