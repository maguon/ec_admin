import {createAction} from 'redux-actions';

export const getOrderRefundInfo = createAction('GET_ORDER_REFUND_DETAIL_INFO');
export const setOrderRefundInfo = createAction('SET_ORDER_REFUND_DETAIL_INFO');
export const getOrderRefundSerVList = createAction('GET_ORDER_REFUND_DETAIL_SERVICE_LIST');
export const getOrderAvailableSerVList = createAction('GET_ORDER_REFUND_DETAIL_AVAILABLE_SERVICE_LIST');
export const getOrderRefundProdList = createAction('GET_ORDER_REFUND_DETAIL_PRODUCT_LIST');
export const getOrderAvailableProdList = createAction('GET_ORDER_REFUND_DETAIL_AVAILABLE_PRODUCT_LIST');