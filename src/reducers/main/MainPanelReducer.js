import {handleActions} from 'redux-actions';
import {MainPanelActionType} from '../../types';

const initialState = {
    // 今日新增用户数
    todayUserCount: 0,

    // 今日发布文章
    todayArticle: 0,
    // 今日发布求助
    todayHelp: 0,

    // 今日评论
    todayComment: 0,
    // 今日解答
    todayAnswer: 0,
    msgList:[]
};

export default handleActions({
    [MainPanelActionType.setTodayUserCount]: (state, action) => {
        return {
            ...state,
            todayUserCount: action.payload
        }
    },
    [MainPanelActionType.setTodayArticle]: (state, action) => {
        return {
            ...state,
            todayArticle: action.payload
        }
    },
    [MainPanelActionType.setTodayHelp]: (state, action) => {
        return {
            ...state,
            todayHelp: action.payload
        }
    },
    [MainPanelActionType.setTodayComment]: (state, action) => {
        return {
            ...state,
            todayComment: action.payload
        }
    },
    [MainPanelActionType.setTodayAnswer]: (state, action) => {
        return {
            ...state,
            todayAnswer: action.payload
        }
    },
    [MainPanelActionType.setMsg]: (state, action) => {
        return {
            ...state,
            msgList: action.payload
        }
    }
}, initialState);