import {createAction} from 'redux-actions';

//查询
export const getAdminList = createAction('GET_ADMIN_LIST');
export const setConditionPhone = createAction('SET_CONDITION_PHONE');
export const setConditionUserName = createAction('SET_CONDITION_USER_NAME');
export const setConditionGender = createAction('SET_CONDITION_GENDER');
export const setConditionStatus = createAction('SET_CONDITION_STATUS');
