import {createAction} from 'redux-actions';
export const setClientInformationQueryObj = createAction('SET_CLIENT_INFORMATION_QUERY_OBJ');
export const setClientInformationQueryObjs= createAction('SET_CLIENT_INFORMATION_QUERY_OBJS');
export const getClientInformationList= createAction('GET_CLIENT_INFORMATION_LIST');
export const setClientInformationListDataSize = createAction('SET_CLIENT_INFORMATION_LIST_DATA_SIZE');
export const setClientInformationListStart = createAction('SET_CLIENT_INFORMATION_LIST_START');
export const getClientInformationUserList =createAction('GET_CLIENT_INFORMATION_USER_LIST');
export const getClientAgentList =createAction('GET_CLIENT_AGENT_LIST');
export const setProdMatchBrandList =createAction('SET_PROD_MATCH_BRAND_LIST');
export const setProdMatchModelList =createAction('SET_PROD_MATCH_MODEL_LIST');


