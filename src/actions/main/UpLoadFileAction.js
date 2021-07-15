import {apiHost} from "../../config";
import Swal from "sweetalert2";
import {UpLoadFileActionType} from "../../types";
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
export  const brandFileUpload =  (file)  => (dispatch) => {
    try{
        if (file.name) {
            let formData = new FormData();
            formData.append('file', file);
            // 基本url
            let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/brandFile';
            httpUtil.httpAsyncFormPost(url, formData, function (res) {
                if (res.success) {
                    dispatch({type: UpLoadFileActionType.setUpLoadFlag, payload: true})
                    dispatch({type: UpLoadFileActionType.setArray, payload: res.rows})
                    Swal.fire("上传成功", "", "success");
                } else if (!res.success) {
                    Swal.fire("上传失败", res.msg, "warning");
                }
            }, function (err) {
                Swal.fire('上传失败', err.msg, 'warning');
            });
        } else {
                Swal.fire('上传失败', '请选择上传的文件！', 'warning');
    }} catch (err) {
            Swal.fire('不能上传空数据', err.message, 'error');
    }
};
export  const categoryFileUpload =  (file)  => (dispatch) => {
    try{
        if (file.name) {
            let formData = new FormData();
            formData.append('file', file);
            // 基本url
            let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/categoryFile';
            httpUtil.httpAsyncFormPost(url, formData, function (res) {
                if (res.success) {
                    dispatch({type: UpLoadFileActionType.setCategoryUpLoadFlag, payload: true})
                    dispatch({type: UpLoadFileActionType.setCategoryArray, payload: res.rows})
                    Swal.fire("上传成功", "", "success");
                } else if (!res.success) {
                    Swal.fire("上传失败", res.msg, "warning");
                }
            }, function (err) {
                Swal.fire('上传失败', err.msg, 'warning');
            });
        } else {
            Swal.fire('上传失败', '请选择上传的文件！', 'warning');
        }} catch (err) {
        Swal.fire('不能上传空数据', err.message, 'error');
    }
};