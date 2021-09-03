import {handleActions} from 'redux-actions';
import {PurchasePayActionType} from '../../types';

const initialState = {
    // 检索结果
    purchasePayData: {
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
    purchasePayStatData:[]
};

export default handleActions({
    [PurchasePayActionType.getPurchasePayData]: (state, action) => {
        return {
            ...state,
            purchasePayData: action.payload
        }
    },
    [PurchasePayActionType.setModalData]: (state, action) => {
        return {
            ...state,
            modalData: action.payload
        }
    },
    [PurchasePayActionType.setPurchaseStatData]: (state, action) => {
        return {
            ...state,
            purchasePayStatData: action.payload
        }
    },

}, initialState)