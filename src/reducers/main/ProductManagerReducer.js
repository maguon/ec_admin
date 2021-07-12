import {handleActions} from 'redux-actions';
import {ProductManagerActionType} from '../../types';

const initialState = {
    // 检索结果
    productData: {
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
        category: null,
        categorySub: null,
        brand: null,
        brandModel: null,
        product: null,
        standardType: null,
        status: null
    }
};

export default handleActions({
    [ProductManagerActionType.setProductData]: (state, action) => {
        return {
            ...state,
            productData: action.payload
        }
    },
    [ProductManagerActionType.setQueryParams]: (state, action) => {
        return {
            ...state,
            queryParams: action.payload
        }
    },
    [ProductManagerActionType.setQueryParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryParams, [name]: value};
        return {
            ...state,
            queryParams: paramsObj
        }
    },
}, initialState)