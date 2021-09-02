import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, CarModelActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getCarList = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchBrand';

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: CarModelActionType.setCarList, payload: res.rows});
            res.rows.forEach((item) => {
                dispatch(getCarModelList(item.id));
            });
        } else if (!res.success) {
            Swal.fire('获取品牌信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getCarModelList = (brandId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchModel?matchBrandId=' + brandId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: CarModelActionType.setCarModelList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取车型信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const saveCarData = (brandData) => async (dispatch) => {
    try {
        const params = {
            brandName: brandData.brandName,
            remark: brandData.remark
        };

        const paramsSub = {
            matchBrandId: brandData.brandId,
            matchModelName: brandData.brandName,
            remark: brandData.remark
        };

        let url;
        let res;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        switch (brandData.pageType) {
            case "new":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchBrand';
                res = await httpUtil.httpPost(url, params);
                break;
            case "edit":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchBrand/' + brandData.uid;
                res = await httpUtil.httpPut(url, params);
                break;
            case "sub_new":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchModel';
                res = await httpUtil.httpPost(url, paramsSub);
                break;
            case "sub_edit":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchModel/' + brandData.uid;
                res = await httpUtil.httpPut(url, paramsSub);
                break;
            default:
                break;
        }
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            Swal.fire("保存成功", "", "success");
            // 刷新页面
            dispatch(getCarList());
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
