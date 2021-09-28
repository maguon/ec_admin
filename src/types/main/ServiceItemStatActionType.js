import {createAction} from 'redux-actions';
export const getServiceParams = createAction('GET_SERVICE_PARAMS');
export const setServiceParams = createAction('SET_SERVICE_PARAMS');
export const getServicePartTypeParams = createAction('GET_SERVICE_PART_TYPE_PARAMS');
export const setServicePartTypeParams = createAction('SET_SERVICE_PART_TYPE_PARAMS');
export const getStatServiceOrderTypeList = createAction('GET_STAT_SERVICE_ORDER_TYPE_LIST');
export const getStatServiceOrderPartTypeList = createAction('GET_STAT_SERVICE_ORDER_PART_TYPE_LIST');