import { createAction } from 'redux-actions';
export const loginInit = createAction('LOGIN_INIT');
export const setLoginUsername = createAction('SET_LOGIN_USERNAME');
export const setLoginPassword = createAction('SET_LOGIN_PASSWORD');