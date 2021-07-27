import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, OrderStatActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getStatOrderByMonth = () => async (dispatch) => {
    try {
        // 获取当前年月
        let myDate = new Date();
        // 12个月前
        let lastYearDate = new Date(myDate.getFullYear()-1, myDate.getMonth() + 1, 1);
        let lastYear = lastYearDate.getFullYear().toString();
        let lastMon = lastYearDate.getMonth() + 1;
        let monthStart = lastYear + (lastMon < 10 ? '0' + lastMon : lastMon);
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/statOrderByMonth?monthStart=' + monthStart;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: OrderStatActionType.getStatOrderByMonth, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取订单统计按月统计失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getStatOrderByDay = (size) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/statOrderByDay?start=0&size=' + size ;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: OrderStatActionType.getStatOrderByDay, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取订单统计按日统计失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};