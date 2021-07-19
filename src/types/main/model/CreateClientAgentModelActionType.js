import {createAction} from 'redux-actions';

export const setFlag = createAction('SET_FLAG');
export const setRemark = createAction('SET_REMARK');
export const setName = createAction('SET_NAME');
export const setClientType = createAction('SET_CLIENT_TYPE');
export const setTel = createAction('SET_TEL');
export const setAddress = createAction('SET_ADDRESS');
export const setIdSerial = createAction('SET_ID_SERIAL');
export const setSalesUserId = createAction('SET_SALES_USER_ID');
export const setSourceType = createAction('SET_SOURCE_TYPE');
export const getCurrentUser = createAction('GET_CURRENT_USER');