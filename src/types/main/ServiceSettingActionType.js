import {createAction} from 'redux-actions';
export const getServiceSettingList = createAction('GET_SERVICE_SETTING_LIST');
export const setServiceSettingQueryObj= createAction('SET_SERVICE_SETTING_QUERY_OBJ');
export const setServiceSettingQueryObjs= createAction('SET_SERVICE_SETTING_QUERY_OBJS');
export const setServiceSettingListDataSize = createAction('SET_SERVICE_SETTING_LIST_DATA_SIZE');
export const setServiceSettingListStart = createAction('SET_SERVICE_SETTING_LIST_START');
export const getServiceSettingRelList = createAction('GET_SERVICE_SETTING_REL_LIST');
