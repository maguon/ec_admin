import {createAction} from 'redux-actions';

export const setTodayUserCount = createAction('SET_TODAY_USER_COUNT');
export const setTodayArticle = createAction('SET_TODAY_ARTICLE');
export const setTodayHelp = createAction('SET_TODAY_HELP');
export const setTodayComment = createAction('SET_TODAY_COMMENT');
export const setTodayAnswer = createAction('SET_TODAY_ANSWER');
export const setMsg = createAction('SET_MSG');

export const setStartDate = createAction('SET_START_DATE');