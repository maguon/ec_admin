import {createAction} from 'redux-actions';

export const setStorageProductData = createAction('SET_STORAGE_PRODUCT_LIST_DATA');
export const setStorageProductDataCnt = createAction('SET_STORAGE_PRODUCT_LIST_DATA_STATISTICS');
export const setQueryParams = createAction('SET_STORAGE_PRODUCT_LIST_QUERY_PARAMS');
export const setDefaultQueryParams = createAction('SET_STORAGE_PRODUCT_LIST_DEFAULT_QUERY_PARAMS');
export const setModalData = createAction('SET_STORAGE_PRODUCT_LIST_MODAL_DATA');