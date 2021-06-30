import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, CategoryManagerActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getCategoryList = () => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/category';

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: CategoryManagerActionType.setCategoryList, payload: res.rows});
            res.rows.forEach((item) => {
                dispatch(getCategorySubList(item.id));
            });
        } else if (!res.success) {
            Swal.fire('获取商品分类信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getCategorySubList = (categoryId) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/categorySub?categoryId=' + categoryId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: CategoryManagerActionType.setCategorySubList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取商品子类信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const saveCategoryData = (categoryData) => async (dispatch, getState) => {
    try {
        const params = {
            categoryName: categoryData.categoryName,
            remark: categoryData.remark
        };

        const paramsSub = {
            categoryId: categoryData.categoryId,
            categorySubName: categoryData.categoryName,
            remark: categoryData.remark
        };

        let url;
        let res;
        switch (categoryData.pageType) {
            case "new":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/category';
                res = await httpUtil.httpPost(url, params);
                break;
            case "edit":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/category/' + categoryData.uid;
                res = await httpUtil.httpPut(url, params);
                break;
            case "sub_new":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/categorySub';
                res = await httpUtil.httpPost(url, paramsSub);
                break;
            case "sub_edit":
                url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/categorySub/' + categoryData.uid;
                res = await httpUtil.httpPut(url, paramsSub);
                break;
            default:
                break;
        }

        if (res.success) {
            Swal.fire("保存成功", "", "success");
            // 刷新页面
            dispatch(getCategoryList());
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};
