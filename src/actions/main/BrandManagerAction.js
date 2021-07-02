import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, BrandManagerActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getBrandList = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/brand';

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: BrandManagerActionType.setBrandList, payload: res.rows});
            res.rows.forEach((item) => {
                dispatch(getBrandModelList(item.id));
            });
        } else if (!res.success) {
            Swal.fire('获取品牌信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getBrandModelList = (brandId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/brandModel?brandId=' + brandId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: BrandManagerActionType.setBrandModelList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取品牌型号信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const saveBrandData = (brandData) => async (dispatch) => {
    try {
        const params = {
            brandName: brandData.brandName,
            remark: brandData.remark
        };

        const paramsSub = {
            brandId: brandData.brandId,
            brandModelName: brandData.brandName,
            remark: brandData.remark
        };

        let url;
        let res;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        switch (brandData.pageType) {
            case "new":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/brand';
                res = await httpUtil.httpPost(url, params);
                break;
            case "edit":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/brand/' + brandData.uid;
                res = await httpUtil.httpPut(url, params);
                break;
            case "sub_new":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/brandModel';
                res = await httpUtil.httpPost(url, paramsSub);
                break;
            case "sub_edit":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/brandModel/' + brandData.uid;
                res = await httpUtil.httpPut(url, paramsSub);
                break;
            default:
                break;
        }
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            Swal.fire("保存成功", "", "success");
            // 刷新页面
            dispatch(getBrandList());
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
