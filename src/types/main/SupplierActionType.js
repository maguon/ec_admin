import {createAction} from 'redux-actions';
//查询
export const getSupplierList = createAction('GET_SUPPLIER_LIST');
export const setSupplierQueryObj= createAction('GET_SUPPLIER_QUERY_OBJ');
export const setSupplierQueryObjs= createAction('GET_SUPPLIER_QUERY_OBJS');
export const setSupplierListDataSize = createAction('SET_SUPPLIER_LIST_DATA_SIZE');
export const setSupplierListStart = createAction('SET_SUPPLIER_LIST_START');
