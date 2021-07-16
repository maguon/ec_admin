import {handleActions} from 'redux-actions';
import {StorageInOutActionType} from '../../types';

const initialState = {
    // 检索结果
    purchaseItemStorage: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
};

export default handleActions({
    [StorageInOutActionType.getPurchaseItemStorageData]: (state, action) => {
        return {
            ...state,
            purchaseItemStorage: action.payload
        }
    },
}, initialState)