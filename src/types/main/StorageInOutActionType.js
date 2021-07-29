import {createAction} from 'redux-actions';

export const getPurchaseItemStorageData = createAction('GET_STORAGE_IN_OUT_PURCHASE_DATA');
export const getPurchaseItemRefund = createAction('GET_STORAGE_IN_OUT_PURCHASE_ITEM_REFUND');
export const setPurchaseParams = createAction('SET_STORAGE_IN_OUT_PURCHASE_QUERY_PARAMS');
export const setPurchaseParam = createAction('SET_STORAGE_IN_OUT_PURCHASE_QUERY_PARAM');
export const getPurchaseRefundData = createAction('GET_STORAGE_IN_OUT_PURCHASE_REFUND_DATA');
export const setRefundParams = createAction('SET_STORAGE_IN_OUT_PURCHASE_REFUND_QUERY_PARAMS');
export const setRefundParam = createAction('SET_STORAGE_IN_OUT_PURCHASE_REFUND_QUERY_PARAM');
export const setStorageProductRelList = createAction('SET_STORAGE_IN_OUT_PURCHASE_REFUND_MODAL_DATALIST');
export const setStorageProductRelDetail = createAction('SET_STORAGE_IN_OUT_PURCHASE_REFUND_MODAL_DETAIL');
export const setOrderOutData = createAction('SET_STORAGE_IN_OUT_ORDER_DATA');
export const setOrderOutParams = createAction('SET_STORAGE_IN_OUT_ORDER_QUERY_PARAMS');
export const setOrderOutParam = createAction('SET_STORAGE_IN_OUT_ORDER_QUERY_PARAM');
export const setStorageProductList = createAction('SET_STORAGE_IN_OUT_ORDER_MODAL_STORAGE_PRODUCT_LIST');
export const setOrderOutModalList = createAction('SET_STORAGE_IN_OUT_ORDER_MODAL_DATA_LIST');
export const setStorageProductDetail = createAction('SET_STORAGE_IN_OUT_STORAGE_DETAIL_DATA');
export const setStorageProductDetailParams = createAction('SET_STORAGE_IN_OUT_STORAGE_DETAIL_QUERY_PARAMS');
export const setStorageProductDetailParam = createAction('SET_STORAGE_IN_OUT_STORAGE_DETAIL_QUERY_PARAM');