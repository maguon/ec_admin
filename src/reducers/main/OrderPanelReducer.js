import {handleActions} from 'redux-actions';
import {OrderPanelActionType} from '../../types';

const initialState = {
    orderStat: {},
    orderStatIng: {},

};

export default handleActions({
    [OrderPanelActionType.getOrderStat]: (state, action) => {
        return {
            ...state,
            orderStat: action.payload
        }
    },
    [OrderPanelActionType.getOrderStatIng]: (state, action) => {
        return {
            ...state,
            orderStatIng: action.payload
        }
    },
}, initialState);