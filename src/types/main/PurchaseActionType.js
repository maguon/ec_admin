import {createAction} from 'redux-actions';
//查询
export const getSupplierList = createAction('GET_SUPPLIER_LIST');
export const getProductList = createAction('GET_PRODUCT_LIST');
export const setPurchaseQueryObj = createAction('GET_PURCHASE_QUERY_OBJ');
export const setPurchaseArray = createAction('GET_PURCHASE_ARRAY');
export const setPurchaseListDataSize = createAction('GET_PURCHASE_LIST_DATA_SIZE');
//添加
export const getPurchaseAddObj = createAction('GET_PURCHASE_ADD_OBJ');
export const setPurchaseAddObj = createAction('SET_PURCHASE_ADD_OBJ');

export const setPurchasePdfData = createAction('SET_PURCHASE_PDF_DATA');
export const getSupplierArray = createAction('GET_SUPPLIER_ARRAY');
export const getPurchaseItemArray = createAction('GET_PURCHASE_ITEM_ARRAY');



