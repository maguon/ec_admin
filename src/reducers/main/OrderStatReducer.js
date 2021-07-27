import {handleActions} from 'redux-actions';
import {OrderStatActionType} from '../../types';

const initialState = {
    statOrderByMonth: [],
    statOrderByDay: []
};

export default handleActions({
    [OrderStatActionType.getStatOrderByMonth]: (state, action) => {
        return {
            ...state,
            statOrderByMonth: action.payload
        }
    },
    [OrderStatActionType.getStatOrderByDay]: (state, action) => {
        return {
            ...state,
            statOrderByDay: action.payload
        }
    }
}, initialState)