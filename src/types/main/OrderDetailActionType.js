import {createAction} from 'redux-actions';

export const getOrderInfo = createAction('GET_ORDER_DETAIL_INFO');
export const setOrderInfo = createAction('SET_ORDER_DETAIL_INFO');
export const getOrderSerVList = createAction('GET_ORDER_DETAIL_SERVICE_LIST');
export const getOrderProdList = createAction('GET_ORDER_DETAIL_PRODUCT_LIST');