import {createAction} from 'redux-actions';

export const getAdminList = createAction('GET_ADMIN_LIST');
export const setStartNumber = createAction('SET_START_NUMBER');
export const setDataSize = createAction('SET_DATA_SIZE');
export const setConditionPhone = createAction('SET_CONDITION_ADMIN_PHONE');
export const setConditionAdminName = createAction('SET_CONDITION_ADMIN_NAME');
export const setConditionRealName = createAction('SET_CONDITION_ADMIN_REAL_NAME');
export const setConditionStatus = createAction('SET_CONDITION_ADMIN_STATUS');