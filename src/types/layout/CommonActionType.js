import {createAction} from 'redux-actions';

export const setDrawerOpen = createAction('SET_DRAWER_OPEN_STATUS');
export const setMobileMoreAnchorEl = createAction('SET_HEADER_MOBILE_MORE_ANCHOR_EL');




export const getHighSchoolList = createAction('GET_HIGH_SCHOOL_LIST');


export const getLoginUserInfo = createAction('GET_LOGIN_USER_INFO');
export const getLoginUserMenu = createAction('GET_LOGIN_USER_MENU');
export const getUserByPhoneList = createAction('GET_USER_BY_PHONE_LIST');
export const getAppVersionList = createAction('GET_APP_VERSION_LIST');
