import {createAction} from 'redux-actions';
export const setOrderRefundPayData = createAction('SET_ORDER_REFUND_PAY_DATA');
export const setQueryPayParam = createAction('SET_ORDER_PAY_PARAM');
export const setQueryPayParams = createAction('SET_ORDER_PAY_PARAMS');
export const setOrderRefundStatData = createAction('SET_ORDER_REFUND_STAT_DATA');
export const getOrderRefundPayService = createAction('GET_ORDER_REFUND_PAY_SERVICE');
export const getOrderRefundPayProd = createAction('GET_ORDER_REFUND_PAY_PROD');

