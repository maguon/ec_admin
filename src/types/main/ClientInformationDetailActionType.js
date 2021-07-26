import {createAction} from 'redux-actions';
export const getClientInfo = createAction('GET_CLIENT_INFO');
export const setClientInfo = createAction('SET_CLIENT_INFO');
export const getReferUserDetailInfo = createAction('GET_REFER_USER_DETAIL_INFO');
export const getClientAgentDetailInfo = createAction('GET_CLIENT_AGENT_DETAIL_INFO');
export const getOrderList = createAction('GET_ORDER_LIST');
export const getOrderItemProdList = createAction('GET_ORDER_ITEM_PROD_LIST');
export const getOrderItemServiceList = createAction('GET_ORDER_ITEM_SERVICE_LIST');

