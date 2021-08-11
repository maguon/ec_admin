import {createAction} from 'redux-actions';
export const getPaymentInfo = createAction('GET_PAYMENT_INFO');
export const setPaymentInfo = createAction('SET_PAYMENT_INFO');
export const getOrderInfo = createAction('GET_ORDER_INFO');
export const getOrderServiceInfo = createAction('GET_ORDER_SERVICE_INFO');
export const getOrderProdInfo = createAction('GET_ORDER_PROD_INFO');