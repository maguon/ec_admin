import {handleActions} from 'redux-actions';
import {OrderRefundActionType} from '../../types';

const initialState = {
    // 检索结果
    orderRefundData: {
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
        orderId: '',
        status: '',
        paymentStatus: '',
        paymentType: '',
        dateStart: '',
        dateEnd: ''
    }
};

export default handleActions({
    [OrderRefundActionType.getOrderRefundData]: (state, action) => {
        return {
            ...state,
            orderRefundData: action.payload
        }
    },
    [OrderRefundActionType.setQueryParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryParams, [name]: value};
        return {
            ...state,
            queryParams: paramsObj
        }
    },
    [OrderRefundActionType.setQueryParams]: (state, action) => {
        return {
            ...state,
            queryParams: action.payload
        }
    }
}, initialState)