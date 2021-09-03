import {createAction} from 'redux-actions';

export const getProductInfo = createAction('GET_PRODUCT_DETAIL_INFO');
export const setProductInfo = createAction('SET_PRODUCT_DETAIL_INFO');
export const getProductPurchase = createAction('GET_PRODUCT_DETAIL_PURCHASE_LIST');
export const setProductStorage = createAction('GET_PRODUCT_DETAIL_STORAGE_LIST');
export const setCarBrandList = createAction('GET_PRODUCT_DETAIL_CAR_BRAND_LIST');
export const setCarModelList = createAction('GET_PRODUCT_DETAIL_CAR_MODEL_LIST');
export const setCurrentMatchList = createAction('GET_PRODUCT_DETAIL_CURRENT_MATCH_LIST');