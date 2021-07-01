import {createAction} from 'redux-actions';

export const setCategoryList = createAction('SET_COMMON_CATEGORY_LIST');
export const setCategorySubList = createAction('SET_COMMON_CATEGORY_SUB_LIST');
export const setBrandList = createAction('SET_COMMON_BRAND_LIST');
export const setBrandModelList = createAction('SET_COMMON_BRAND_MODEL_LIST');
export const setProductList = createAction('SET_COMMON_PRODUCT_LIST');
export const setStorageList = createAction('SET_COMMON_STORAGE_LIST');
export const setStorageAreaList = createAction('SET_COMMON_STORAGE_AREA_LIST');
export const setSupplierList = createAction('SET_COMMON_SUPPLIER_LIST');