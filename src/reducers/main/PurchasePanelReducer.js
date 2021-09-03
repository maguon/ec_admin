import {handleActions} from 'redux-actions';
import {PurchasePanelActionType} from '../../types';

const initialState = {
    // 未完成的采购
    purchaseItemStat: {},
    // 未完成的退货
    purchaseRefundStat: {},
    //未出库的订单商品
    orderStat: {},
    prodStoreWarning:[],
    // 开始位置
    start: 0,
    // 每页数量
    size:11,
    // 检索结果数量
    dataSize: 0,
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
    },
    [PurchasePanelActionType.getOrderStat]: (state, action) => {
        return {
            ...state,
            orderStat: action.payload
        }
    },
    [PurchasePanelActionType.getProdStoreWarning]: (state, action) => {
        return {
            ...state,
            prodStoreWarning: action.payload
        }
    },
    [PurchasePanelActionType.getProdStoreWarningStart]: (state, action) => {
        return {
            ...state,
            start: action.payload
        }
    },
    [PurchasePanelActionType.getProdStoreWarningSize]: (state, action) => {
        return {
            ...state,
            size: action.payload
        }
    },
    [PurchasePanelActionType.getProdStoreWarningDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },

}, initialState);