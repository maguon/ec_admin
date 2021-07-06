import {createAction} from 'redux-actions';

export const getStorageCheckInfo = createAction('GET_STORAGE_CHECK_DETAIL_INFO');
export const getDetailList = createAction('GET_STORAGE_CHECK_DETAIL_LIST');
export const setStorageCheckInfo = createAction('SET_STORAGE_CHECK_DETAIL_INFO');
export const setDetailList = createAction('SET_STORAGE_CHECK_DETAIL_LIST');