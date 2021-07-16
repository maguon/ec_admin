import {createAction} from 'redux-actions';
export const getClientList = createAction('GET_CLIENT_LIST');
export const setClientAgentQueryObj= createAction('SET_CLIENT_QUERY_OBJ');
export const setClientAgentQueryObjs= createAction('SET_CLIENT_QUERY_OBJS');
export const setClientListDataSize = createAction('SET_CLIENT_LIST_DATA_SIZE');
export const setClientListStart = createAction('SET_CLIENT_LIST_START');