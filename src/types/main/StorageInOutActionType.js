import {createAction} from 'redux-actions';

export const getPurchaseItemStorageData = createAction('GET_STORAGE_IN_OUT_PURCHASE_DATA');
export const setPurchaseParams = createAction('SET_STORAGE_IN_OUT_PURCHASE_QUERY_PARAMS');
export const setPurchaseParam = createAction('SET_STORAGE_IN_OUT_PURCHASE_QUERY_PARAM');

export const getPurchaseRefundData = createAction('GET_STORAGE_IN_OUT_PURCHASE_REFUND_DATA');
export const setRefundParams = createAction('SET_STORAGE_IN_OUT_PURCHASE_REFUND_QUERY_PARAMS');
export const setRefundParam = createAction('SET_STORAGE_IN_OUT_PURCHASE_REFUND_QUERY_PARAM');
export const setStorageProductRelList = createAction('SET_STORAGE_IN_OUT_PURCHASE_REFUND_MODAL_DATALIST');
export const setStorageProductRelDetail = createAction('SET_STORAGE_IN_OUT_PURCHASE_REFUND_MODAL_DETAIL');
