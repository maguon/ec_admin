import {handleActions} from 'redux-actions';
import {PurchaseRefundPayActionType} from '../../types';

const initialState = {
    // 检索结果
    purchaseRefundData: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
    // 检索结果
    modalData: [],
    purchaseRefundPayStatData:[]
};

export default handleActions({
    [PurchaseRefundPayActionType.getPurchaseRefundData]: (state, action) => {
        return {
            ...state,
            purchaseRefundData: action.payload
        }
    },
    [PurchaseRefundPayActionType.setModalData]: (state, action) => {
        return {
            ...state,
            modalData: action.payload
        }
    },
    [PurchaseRefundPayActionType.setPurchaseRefundPayStatData]: (state, action) => {
        return {
            ...state,
            purchaseRefundPayStatData: action.payload
        }
    }
}, initialState)