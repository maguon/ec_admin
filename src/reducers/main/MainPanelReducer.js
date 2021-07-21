import {handleActions} from 'redux-actions';
import {MainPanelActionType} from '../../types';

const initialState = {
    todayUserCount: 0,
};

export default handleActions({
    [MainPanelActionType.setTodayUserCount]: (state, action) => {
        return {
            ...state,
            todayUserCount: action.payload
        }
    },
}, initialState);