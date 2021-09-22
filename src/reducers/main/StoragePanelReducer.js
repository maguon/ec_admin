import {handleActions} from 'redux-actions';
import {StoragePanelActionType} from '../../types';

const initialState = {
    // 未入库的商品
    purchaseItemStat: {},
    // 未出库的商品
    purchaseRefundStat: {},
    // 盘点未完成
    storageCheckStat: {},
    // 订单统计
    orderStat: {},
    // 退单统计
    orderRefundStat: {},
};

export default handleActions({
    [StoragePanelActionType.getPurchaseItemStat]: (state, action) => {
        return {
            ...state,
            purchaseItemStat: action.payload
        }
    },
    [StoragePanelActionType.getPurchaseRefundStat]: (state, action) => {
        return {
            ...state,
            purchaseRefundStat: action.payload
        }
    },
    [StoragePanelActionType.getStorageCheckStat]: (state, action) => {
        return {
            ...state,
            storageCheckStat: action.payload
        }
    },
    [StoragePanelActionType.getOrderStat]: (state, action) => {
        return {
            ...state,
            orderStat: action.payload
        }
    },
    [StoragePanelActionType.getOrderRefundStat]: (state, action) => {
        return {
            ...state,
            orderRefundStat: action.payload
        }
    },
}, initialState);