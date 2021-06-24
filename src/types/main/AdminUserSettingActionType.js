import {createAction} from 'redux-actions';

//查询
export const getUserList = createAction('GET_USER_LIST');
export const setStartNumber = createAction('SET_START_NUMBER');
export const setDataSize = createAction('SET_DATA_SIZE');
//用户群组
export const setTypeArray = createAction('SET_TYPE_ARRAY');
//详情
export const setAdminItem = createAction('SET_ADMIN_ITEM');

