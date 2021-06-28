import {createAction} from 'redux-actions';
//查询
export const getSupplierList = createAction('GET_SUPPLIER_LIST');
export const setSupplierQueryObj= createAction('GET_SUPPLIER_QUERY_OBJ');
export const setSupplierListDataSize = createAction('SET_SUPPLIER_LIST_DATA_SIZE');