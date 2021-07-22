import {handleActions} from 'redux-actions';
import {OrderActionType} from '../../types';

const initialState = {
    // 检索结果
    orderData: {
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
        checkStatus: null,
        status: null
    }
};

export default handleActions({
    [OrderActionType.setOrderData]: (state, action) => {
        return {
            ...state,
            orderData: action.payload
        }
    },
    [OrderActionType.setQueryParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryParams, [name]: value};
        return {
            ...state,
            queryParams: paramsObj
        }
    },
    [OrderActionType.setQueryParams]: (state, action) => {
        return {
            ...state,
            queryParams: action.payload
        }
    }
}, initialState)