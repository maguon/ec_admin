import {createAction} from 'redux-actions';
export const getClientInfo = createAction('GET_CLIENT_INFO');
export const setClientInfo = createAction('SET_CLIENT_INFO');
export const getReferUserDetailInfo = createAction('GET_REFER_USER_DETAIL_INFO');
export const getClientAgentDetailInfo = createAction('GET_CLIENT_AGENT_DETAIL_INFO');