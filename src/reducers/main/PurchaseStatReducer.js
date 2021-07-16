import {handleActions} from 'redux-actions';
import {PurchaseStatActionType} from '../../types';

const initialState = {
    statPurchaseByMonth: [],
    statPurchaseByDay: []
};

export default handleActions({
    [PurchaseStatActionType.getStatPurchaseByMonth]: (state, action) => {
        return {
            ...state,
            statPurchaseByMonth: action.payload
        }
    },
    [PurchaseStatActionType.getStatPurchaseByDay]: (state, action) => {
        return {
            ...state,
            statPurchaseByDay: action.payload
        }
    }
}, initialState)