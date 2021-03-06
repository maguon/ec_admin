import {createAction} from 'redux-actions';
export const setInformationFlag = createAction('SET_INFORMATION_FLAG');
export const setInformationClientAgentId = createAction('SET_INFORMATION_CLIENT_AGENT_ID');
export const setInformationClientSerial = createAction('SET_INFORMATION_CLIENT_SERIAL');
export const setInformationClientSerialDetail = createAction('SET_INFORMATION_CLIENT_SERIAL_DETAIL');
export const setInformationSourceType = createAction('SET_INFORMATION_SOURCE_TYPE');
export const setInformationName = createAction('SET_INFORMATION_NAME');
export const setInformationTel = createAction('SET_INFORMATION_TEL');
export const setInformationAddress = createAction('SET_INFORMATION_ADDRESS');
export const setInformationReferUser = createAction('SET_INFORMATION_REFER_USER');
export const setInformationBrandName = createAction('SET_INFORMATION_BRAND_NAME');
export const setInformationMatchModelName = createAction('SET_INFORMATION_MATCH_MODEL_NAME');
export const setInformationRemark = createAction('SET_INFORMATION_REMARK');
export const getInformationClientAgentArray = createAction('GET_INFORMATION_CLIENT_AGENT_ARRAY');
export const getInformationReferUserArray = createAction('GET_INFORMATION_REFER_USER_ARRAY');
export const getInformationProdMatchBrandArray = createAction('GET_INFORMATION_PROD_MATCH_BRAND_ARRAY');
export const getInformationProdMatchModelArray = createAction('GET_INFORMATION_PROD_MATCH_MODEL_ARRAY');