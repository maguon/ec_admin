import {handleActions} from 'redux-actions';
import {OrderPanelActionType} from '../../types';

const initialState = {
    orderStat: {},
    orderStatIng: {},
    todayOrderStat: {},
    orderRefundStat: {},
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
    [OrderPanelActionType.getTodayOrderStat]: (state, action) => {
        return {
            ...state,
            todayOrderStat: action.payload
        }
    },
    [OrderPanelActionType.getOrderRefundStat]: (state, action) => {
        return {
            ...state,
            orderRefundStat: action.payload
        }
    },
}, initialState);