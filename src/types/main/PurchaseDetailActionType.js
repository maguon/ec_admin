import {createAction} from 'redux-actions';
//查询
export const getPurchaseDetailInfo = createAction('GET_PURCHASE_DETAIL_INFO');
export const setPurchaseDetailInfo = createAction('SET_PURCHASE_DETAIL_INFO');
export const getPurchaseDetailItemInfo = createAction('GET_PURCHASE_DETAIL_ITEM_INFO');
export const setPurchaseDetailItemInfo = createAction('SET_PURCHASE_DETAIL_ITEM_INFO');
export const getPurchaseRefundDetailInfo = createAction('GET_PURCHASE_REFUND_DETAIL_INFO');
export const getProductDetailArray = createAction('GET_PURCHASE_DETAIL_ARRAY');
export const getStorageProductArray = createAction('GET_STORAGE_PRODUCT_ARRAY');


