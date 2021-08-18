import {handleActions} from 'redux-actions';
import {FinancePanelActionType} from '../../types';

const initialState = {
    // 未完成的采购付款
    purchaseStat: {},
    // 未出库的商品
    purchaseRefundStat: {},
    // 未付款的订单
    orderStat: {},
    // 未付款的退单
    orderRefundStat: {}
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
    },
    [FinancePanelActionType.getOrderStat]: (state, action) => {
        return {
            ...state,
            orderStat: action.payload
        }
    },
    [FinancePanelActionType.getOrderRefundStat]: (state, action) => {
        return {
            ...state,
            orderRefundStat: action.payload
        }
    }
}, initialState);