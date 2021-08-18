import {createAction} from 'redux-actions';
export const getOrderStat = createAction('GET_ORDER_STAT');
export const getOrderStatIng = createAction('GET_ORDER_STAT_ING');
export const getTodayOrderStat = createAction('GET_TODAY_ORDER_STAT');
export const getOrderRefundStat = createAction('GET_ORDER_REFUND_STAT');