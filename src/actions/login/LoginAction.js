import Swal from 'sweetalert2';
import {apiHost} from '../../config';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
export const login = (params) => async () => {
  console.log(params);
  try {
    const res = await httpUtil.httpPost(apiHost + '/api/adminLogin', params);
    if (res.success === true) {
        localUtil.setSessionItem(sysConst.LOGIN_USER_ID, res.result.adminId);
        localUtil.setSessionItem(sysConst.LOGIN_USER_TYPE, res.result.type);
        localUtil.setSessionItem(sysConst.AUTH_TOKEN, res.result.accessToken);
        window.location.href = '/';
    } else if (res.success === false) {
      Swal.fire("登陆失败", res.msg, "warning");
    }
  } catch (err) {
    Swal.fire('操作失败', err.message, 'error');
  }
//  const url="http://stg.myxxjs.com:9901/api/admin/5f718161393ea43ba2ef5ec3/menuList?type=1"
//  const user={
//     "userName": "19999999999",
//     "password": "123456"
//   }
};