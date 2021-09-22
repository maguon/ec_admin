import {createAction} from 'redux-actions';

export const getPurchaseItemStat = createAction('GET_STORAGE_PANEL_PURCHASE_ITEM_STAT');
export const getPurchaseRefundStat = createAction('GET_STORAGE_PANEL_PURCHASE_REFUND_STAT');
export const getStorageCheckStat = createAction('GET_STORAGE_PANEL_STORAGE_CHECK_STAT');
export const getOrderStat = createAction('GET_STORAGE_PANEL_ORDER_STAT');
export const getOrderRefundStat = createAction('GET_STORAGE_PANEL_ORDER_REFUND_STAT');