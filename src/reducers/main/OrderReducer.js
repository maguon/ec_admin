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
        // 订单编号
        orderId: '',
        // 订单类型
        orderType: '',
        // 订单状态
        status: '',
        // 订单支付状态
        paymentStatus: '',
        // 接单人（用户信息）
        reUser: null,
        // 客户集群
        clientAgent: null,
        // 客户
        client: null,
        // 客户电话
        clientTel: '',
        // 车牌
        clientSerial: '',
        // 创建日期
        dateStart: '',
        dateEnd: '',
        // 完成日期
        finDateStart: '',
        finDateEnd: ''
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