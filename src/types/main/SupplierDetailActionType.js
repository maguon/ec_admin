import {createAction} from 'redux-actions';
//查询
export const getSupplierInfo = createAction('GET_SUPPLIER_INFO');
export const setSupplierInfo = createAction('SET_SUPPLIER_INFO');
export const getPurchaseInfo = createAction('GET_PURCHASE_INFO');
export const getPurchaseRefundInfo = createAction('GET_PURCHASE_REFUND_INFO');


