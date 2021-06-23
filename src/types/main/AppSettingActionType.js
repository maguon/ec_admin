import {createAction} from 'redux-actions';

export const setAppData = createAction('SET_APP_DATA');
export const setConditionDeviceType = createAction('SET_CONDITION_APP_SETTING_DEVICE_TYPE');
export const setConditionStatus = createAction('SET_CONDITION_APP_SETTING_STATUS');
export const setModalOpen = createAction('SET_APP_SETTING_MODAL_OPEN');
export const setModalData = createAction('SET_APP_SETTING_MODAL_DATA');