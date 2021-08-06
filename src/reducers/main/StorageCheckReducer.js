import {handleActions} from 'redux-actions';
import {StorageCheckActionType} from '../../types';

const initialState = {
    // 检索结果
    storageCheckData: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
    // 检索条件
    queryParams: {
        dateIdStart: '',
        dateIdEnd: '',
        checkStatus: '',
        status: ''
    }
};

export default handleActions({
    [StorageCheckActionType.setStorageCheckData]: (state, action) => {
        return {
            ...state,
            storageCheckData: action.payload
        }
    },
    [StorageCheckActionType.setQueryParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryParams, [name]: value};
        return {
            ...state,
            queryParams: paramsObj
        }
    },
    [StorageCheckActionType.setQueryParams]: (state, action) => {
        return {
            ...state,
            queryParams: action.payload
        }
    }
}, initialState)