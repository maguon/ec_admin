import {handleActions} from 'redux-actions';
import {FinancePanelActionType} from '../../types';

const initialState = {
    // 未完成的采购付款
    purchaseStat: {},
    // 未出库的商品
    purchaseRefundStat: {}
};

export default handleActions({
    [FinancePanelActionType.getPurchaseStat]: (state, action) => {
        return {
            ...state,
            purchaseStat: action.payload
        }
    },
    [FinancePanelActionType.getPurchaseRefundStat]: (state, action) => {
        return {
            ...state,
            purchaseRefundStat: action.payload
        }
    }
}, initialState);