import {createAction} from 'redux-actions';

export const getPurchaseStat = createAction('GET_FINANCE_PURCHASE_STAT');
export const getPurchaseRefundStat = createAction('GET_FINANCE_PURCHASE_REFUND_STAT');
export const getOrderStat = createAction('GET_FINANCE_ORDER_STAT');
export const getOrderRefundStat = createAction('GET_FINANCE_ORDER_REFUND_STAT');