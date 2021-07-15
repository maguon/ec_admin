import {handleActions} from 'redux-actions';
import {PurchasePanelActionType} from '../../types';

const initialState = {
    // 未完成的采购
    purchaseItemStat: {},
    // 未完成的退货
    purchaseRefundStat: {},
};

export default handleActions({
    [PurchasePanelActionType.getPurchaseItemStat]: (state, action) => {
        return {
            ...state,
            purchaseItemStat: action.payload
        }
    },
    [PurchasePanelActionType.getPurchaseRefundStat]: (state, action) => {
        return {
            ...state,
            purchaseRefundStat: action.payload
        }
    }
}, initialState);