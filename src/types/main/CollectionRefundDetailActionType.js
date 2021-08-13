import {createAction} from 'redux-actions';
export const getPaymentInfo = createAction('GET_PAYMENT_INFO');
export const setPaymentInfo = createAction('SET_PAYMENT_INFO');
export const getOrderInfo = createAction('GET_ORDER_INFO');
export const getOrderServiceInfo = createAction('GET_ORDER_SERVICE_INFO');
export const getOrderProdInfo = createAction('GET_ORDER_PROD_INFO');
export const getCollectionRefundPayService = createAction('GET_COLLECTION_REFUND_PAY_SERVICE');
export const getCollectionRefundPayProd = createAction('GET_COLLECTION_REFUND_PAY_PROD');

