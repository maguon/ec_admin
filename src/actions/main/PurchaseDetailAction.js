import Swal from 'sweetalert2';
import {apiHost} from '../../config/index';
import {AppActionType, PurchaseDetailActionType, StorageCheckActionType} from '../../types';
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 采购管理详情 -> 获取采购信息
export const getPurchaseDetailInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchase?purchaseId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: PurchaseDetailActionType.getPurchaseDetailInfo, payload: res.rows[0]});
        } else if (res.success === false) {
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//商品
export const getProductList = (params) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseItem?purchaseId='+params;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: PurchaseDetailActionType.getProductDetailArray, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取商品列表失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getPurchaseItemDetailInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchaseItem?purchaseId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: PurchaseDetailActionType.getPurchaseDetailItemInfo, payload: res.rows});
        } else if (res.success === false) {
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

//采购管理 -> 修改
export const updatePurchaseDetailInfo = (params) => async (dispatch, getState) => {
    try {
        const params = getState().PurchaseDetailReducer.purchaseDetailInfo;
        var paramsObj={
            "remark": params.remark,
            "transferCostType": params.transfer_cost_type,
            "transferCost": params.transfer_cost
        }
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchase/'+params.id, paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}
//采购管理 -> 修改状态
export const updatePurchaseDetailInfoStatus = (id,params) => async (dispatch, getState) => {
    try {
        const url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase/'+id+'/status?status=' + params;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            dispatch(getPurchaseDetailInfo(id));
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}
export const updatePurchaseDetailItemInfo = (paramsId,index) => async (dispatch, getState) => {
    try {
        const params = getState().PurchaseDetailReducer.purchaseDetailItemInfo[index];
        var paramsObj={
            "unitCost":params.unit_cost,
            "purchaseCount": params.purchase_count,
            "remark": params.remark
        }
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpPut(apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchaseItem/'+paramsId, paramsObj);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true) {
            Swal.fire("修改成功", "", "success");
        } else if (res.success === false) {
            Swal.fire('修改失败', res.msg, 'warning');
        }
    }catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
}

//采购管理 -> 退货tab
export const getPurchaseRefundDetailInfo = (params) => async (dispatch, getState) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/'+localUtil.getSessionItem(sysConst.LOGIN_USER_ID)+'/purchaseRefund?purchaseId='+params;
        // 检索URL
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success === true && res.rows.length>0) {
            dispatch({type: PurchaseDetailActionType.getPurchaseRefundDetailInfo, payload: res.rows.slice(0,10)});
        } else if (res.success === false) {
            Swal.fire('获取供应商信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const getStorageProductArray = (params) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageProductRel?purchaseId='+params;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch({type: PurchaseDetailActionType.getStorageProductArray, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取商品列表失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};
export const addRefundDetailItem = (id,item,addTransferCostType,addTransferCost,addUnitCost,addPurchaseCount,addTransferRemark,addStorageType) => async (dispatch) => {
    try {
        const params = {
            "remark": addTransferRemark,
            "supplierId": item.supplier_id,
            "productId": item.product_id,
            "productName": item.product_name,
            "storageType": addStorageType,
            "refundUnitCost": addUnitCost,
            "refundCount": addPurchaseCount,
            "transferCostType": addTransferCostType,
            "transferCost": addTransferCost,
            "orderId": 0
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchase/'+id+'/purchaseItem/'+item.id+'/purchaseRefund';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getPurchaseRefundDetailInfo(id));
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire('保存失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadPDF = (params) => async (dispatch) => {
    try {
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/supplier?supplierName='+params;
        const res = await httpUtil.httpGet(url);
        if (res.success) {
            dispatch({type: PurchaseDetailActionType.getSupplierDetailArray, payload: res.rows[0]});
            html2canvas(document.getElementById("purchaseId"), {
                useCORS: true,
                scale: 2,
                dpi: 192,
                background: "#fff"
            }).then(function (canvas) {
                // Html / Canvas 画面 尺寸
                let contentWidth = canvas.width;
                let contentHeight = canvas.height;
                // 一页pdf显示html页面生成的canvas高度;（根据比例，算出来的固定值）
                let htmlPageHeight = contentWidth / 595.28 * 841.89;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                let pdfPageWidth = 595.28;
                let pdfPageHeight = 595.28 / contentWidth * contentHeight;
                let pageData = canvas.toDataURL('image/jpeg', 1.0);
                // 画面尺寸小于 一页，则默认为A4，否则：设定指定高度画面
                let pdf = new jsPDF('', 'pt', contentHeight < htmlPageHeight ? 'a4' : [pdfPageWidth, pdfPageHeight + 30]);
                pdf.addImage(pageData, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight);
                // 保存PDF文件
                pdf.save('采购单详情.pdf');
            });

        } else if (!res.success) {
            Swal.fire("获取采购详细列表失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};