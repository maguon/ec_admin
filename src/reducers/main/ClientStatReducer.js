import {handleActions} from 'redux-actions';
import {ClientStatActionType} from '../../types';

const initialState = {
    statClientByMonth: [],
    statClientByDay: []
};

export default handleActions({
    [ClientStatActionType.getStatClientByMonth]: (state, action) => {
        return {
            ...state,
            statClientByMonth: action.payload
        }
    },
    [ClientStatActionType.getStatClientByDay]: (state, action) => {
        return {
            ...state,
            statClientByDay: action.payload
        }
    }
}, initialState)