import {createAction} from 'redux-actions';
//查询
export const getPurchaseReturnList = createAction('GET_PURCHASE_RETURN_LIST');
export const setPurchaseReturnQueryObj = createAction('SET_PURCHASE_RETURN_QUERY_OBJ');
export const setPurchaseReturnListDataSize = createAction('SET_PURCHASE_RETURN_LIST_DATA_SIZE');
export const setPurchaseItem = createAction('SET_PURCHASE_ITEM');
export const setProductArray = createAction('SET_PRODUCT_ARRAY');

