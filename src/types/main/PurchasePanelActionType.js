import {createAction} from 'redux-actions';
export const getPurchaseItemStat = createAction('GET_PURCHASE_ITEM_STAT');
export const getPurchaseRefundStat = createAction('GET_PURCHASE_REFUND_STAT');
export const getOrderStat = createAction('GET_ORDER_STAT');
export const getProdStoreWarning = createAction('GET_PROD_STORE_WARNING');
export const getProdStoreWarningStart = createAction('GET_PROD_STORE_WARNING_START');
export const getProdStoreWarningSize = createAction('GET_PROD_STORE_WARNING_SIZE');
export const getProdStoreWarningDataSize = createAction('GET_PROD_STORE_WARNING_DATA_SIZE');