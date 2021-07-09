import {createHashHistory, createBrowserHistory} from 'history';
import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageCheckActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getStorageCheckList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().StorageCheckReducer.storageCheckData.size;
        // 检索条件
        const queryParams = getState().StorageCheckReducer.queryParams;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheck?start=' + start + '&size=' + size;
        // 检索条件
        let conditionsObj = {
            dateIdStart: commonUtil.formatDate(queryParams.dateIdStart, 'yyyyMMdd'),
            dateIdEnd: commonUtil.formatDate(queryParams.dateIdEnd, 'yyyyMMdd'),
            checkStatus: queryParams.checkStatus == null ? '' : queryParams.checkStatus,
            status: queryParams.status == null ? '' : queryParams.status
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let storageCheckData = getState().StorageCheckReducer.storageCheckData;
        if (res.success) {
            storageCheckData.start = start;
            storageCheckData.dataSize = res.rows.length;
            storageCheckData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageCheckActionType.setStorageCheckData, payload: storageCheckData});
        } else if (!res.success) {
            Swal.fire("获取仓库盘点列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveModalData = (modalData) => async (dispatch, getState) => {
    try {
        let params = {
            checkDesc: modalData.desc,
            remark: modalData.remark
        };
        if (modalData.storage != null) {
            params = {...params, storageId: modalData.storage.id};
        }
        if (modalData.storageArea != null) {
            params = {...params, storageAreaId: modalData.storageArea.id};
        }
        if (modalData.supplier != null) {
            params = {...params, supplierId: modalData.supplier.id};
        }
        if (modalData.category != null) {
            params = {...params, categoryId: modalData.category.id};
        }
        if (modalData.categorySub != null) {
            params = {...params, categorySubId: modalData.categorySub.id};
        }
        if (modalData.brand != null) {
            params = {...params, brandId: modalData.brand.id};
        }
        if (modalData.brandModel != null) {
            params = {...params, brandModelId: modalData.brandModel.id};
        }

        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageCheck';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success && res.rows.length > 0) {
            const history = createHashHistory();
            history.push('/storage_check/' + res.rows[0].id);
            Swal.fire("保存成功", "", "success");
            // } else if (!res.success) {
            //     Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadCsv = (storageCheckId) => async () => {
    try {
        // 基本检索URL
        let url = 'http://' + apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheck/' + storageCheckId + '/storageCheckRel.csv';
        window.open(url);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadPDF = (storageCheckId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheckRel?storageCheckId=' + storageCheckId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        if (res.success) {
            dispatch({type: StorageCheckActionType.setPdfDataList, payload: res.rows});
            commonUtil.downLoadPDF(document.getElementById("pdf"),'仓库盘点详情-' + storageCheckId + '.pdf');
        } else if (!res.success) {
            Swal.fire("获取仓库盘点详细列表失败", res.msg, "warning");
        }
        dispatch({type: AppActionType.showLoadProgress, payload: false});
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};