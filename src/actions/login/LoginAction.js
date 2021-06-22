import Swal from 'sweetalert2';
import {apiHost} from '../../config';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
export const login = (params) => async () => {
    try {
        const res = await httpUtil.httpPost(apiHost + '/api/userLogin', params);
        if (res.success === true) {
            localUtil.setSessionItem(sysConst.LOGIN_USER_ID, res.rows.userId);
            localUtil.setSessionItem(sysConst.LOGIN_USER_TYPE, res.rows.type);
            localUtil.setSessionItem(sysConst.AUTH_TOKEN, res.rows.accessToken);
            window.location.href = '/';
        } else if (res.success === false) {
            Swal.fire("登陆失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};