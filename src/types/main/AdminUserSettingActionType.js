import {createAction} from 'redux-actions';

//查询
export const getAdminList = createAction('GET_ADMIN_LIST');
export const setStartNumber = createAction('SET_START_NUMBER');
export const setDataSize = createAction('SET_DATA_SIZE');
export const setConditionPhone = createAction('SET_CONDITION_PHONE');
export const setConditionRealName = createAction('SET_CONDITION_REAL_NAME');
export const setConditionGender = createAction('SET_CONDITION_GENDER');
export const setConditionStatus = createAction('SET_CONDITION_STATUS');
export const setConditionType = createAction('SET_CONDITION_TYPE');

//用户群组
export const setTypeArray = createAction('SET_TYPE_ARRAY');
//详情
export const setAdminItem = createAction('SET_ADMIN_ITEM');

