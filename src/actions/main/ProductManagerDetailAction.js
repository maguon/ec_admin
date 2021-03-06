import Swal from 'sweetalert2';
import {apiHost, fileHost} from '../../config/index';
import {AppActionType, ProductManagerDetailActionType} from '../../types';

const commonAction = require('../../actions/layout/CommonAction');
const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

export const getProductInfo = (productId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/product?productId=' + productId;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            if (res.rows.length > 0) {
                dispatch({type: ProductManagerDetailActionType.getProductInfo, payload: res.rows[0]});
                dispatch(commonAction.getCategorySubList(res.rows[0].category_id));
                dispatch(commonAction.getBrandModelList(res.rows[0].brand_id));
            } else {
                dispatch({type: ProductManagerDetailActionType.getProductInfo, payload: {}});
            }
        } else if (!res.success) {
            Swal.fire("获取商品信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const updateProduct = () => async (dispatch, getState) => {
    try {
        const productInfo = getState().ProductManagerDetailReducer.productInfo;
        const params = {
            remark: productInfo.remark,
            productName: productInfo.product_name,
            productSName: productInfo.product_s_name,
            productSerial: productInfo.product_serial,
            productAddress: productInfo.product_address,
            categoryId: productInfo.category.id,
            categorySubId: productInfo.category_sub.id,
            brandId: productInfo.brand.id,
            brandModelId: productInfo.brand_model.id,
            image: productInfo.image,
            standardType: productInfo.standard_type,
            // TODO
            // barcode: productInfo.remark,
            unitName: productInfo.unit_name,
            priceType: productInfo.price_type,
            fixedPrice: productInfo.fixed_price,
            priceRaiseRatio: (productInfo.price_raise_ratio),
            priceRaiseValue: productInfo.price_raise_value,
            storageMin: productInfo.storage_min,
            storageMax: productInfo.storage_max,
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/product/' + productInfo.id;
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getProductPurchase = (productId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/purchaseItem?productId=' + productId + '&start=0&size=10';

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: ProductManagerDetailActionType.getProductPurchase, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取采购记录失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getProductStorage = (productId) => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageProductRelDetail?productId=' + productId;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: ProductManagerDetailActionType.setProductStorage, payload: res.rows});
        } else if (!res.success) {
            Swal.fire("获取库存信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const uploadProductImg = (formData) => (dispatch) => {
    try {
        // 基本url
        let url = fileHost + '/api/user/' + localUtil.getSessionItem(sysConst.USER_ID) + '/image?imageType=1';
        httpUtil.httpAsyncFormPost(url, formData, function (result) {
            if (result.success === true) {
                // 上传图片成功后，刷新画面显示图片
                dispatch({type: ProductManagerDetailActionType.setProductInfo, payload: {name: "image", value: result.imageId}});
                dispatch(updateProduct());
            } else {
                Swal.fire("上传图片失败", '', "warning");
            }
        }, function (err) {
            Swal.fire("上传图片失败", err.msg, "warning");
        });
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const getProductMatchModel = (productId) => async (dispatch) => {
    let matchModel = new Map();
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/product/' + productId + '/matchModel';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success && res.rows.length > 0) {
            dispatch({type: ProductManagerDetailActionType.setCurrentMatchList, payload: res.rows});
            if (res.rows[0].match_model != null && res.rows[0].match_model.length > 0) {
                res.rows[0].match_model.forEach((item) => {
                    matchModel.set(item,'');
                });
            }
        } else {
            dispatch({type: ProductManagerDetailActionType.setCurrentMatchList, payload: []});
        }
        return matchModel;
    } catch (err) {
        return matchModel;
    }
};

export const getCarBrandList = () => async (dispatch) => {
    try {
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/prodMatchBrand';

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});

        if (res.success) {
            dispatch({type: ProductManagerDetailActionType.setCarBrandList, payload: res.rows});
            res.rows.forEach((item) => {
                dispatch(getCarModelList(item.id));
            });
        } else if (!res.success) {
            Swal.fire('获取车品牌信息失败', res.msg, 'warning');
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
            dispatch({type: ProductManagerDetailActionType.setCarModelList, payload: res.rows});
        } else if (!res.success) {
            Swal.fire('获取车型信息失败', res.msg, 'warning');
        }
    } catch (err) {
        Swal.fire('操作失败', err.message, 'error');
    }
};

export const updateMatchModel = (productId, matchModel) => async (dispatch, getState) => {
    try {
        const params = {
            matchModel: [...matchModel.keys()],
        };
        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/product/' + productId + '/matchModel';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPut(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success) {
            dispatch(getProductMatchModel(productId));
            Swal.fire("保存成功", "", "success");
        } else if (!res.success) {
            Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};