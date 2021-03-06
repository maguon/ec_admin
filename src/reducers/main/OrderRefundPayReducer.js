import {handleActions} from 'redux-actions';
import {OrderRefundPayActionType} from '../../types';

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
        // 订单状态
        status: '',
        clientSerial:'',
        // 客户姓名
        clientId: null ,
        // 客户集群
        clientAgentId: null,
        // 支付状态
        paymentStatus: '',
        dateStart: '',
        dateEnd: '',
    },
    orderRefundStat:[],
    orderRefundSerVList:[],
    orderRefundProdList:[]
};

export default handleActions({
    [OrderRefundPayActionType.setOrderRefundPayData]: (state, action) => {
        return {
            ...state,
            orderData: action.payload
        }
    },
    [OrderRefundPayActionType.setQueryPayParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryParams, [name]: value};
        return {
            ...state,
            queryParams: paramsObj
        }
    },
    [OrderRefundPayActionType.setQueryPayParams]: (state, action) => {
        return {
            ...state,
            queryParams: action.payload
        }
    },
    [OrderRefundPayActionType.setOrderRefundStatData]: (state, action) => {
        return {
            ...state,
            orderRefundStat: action.payload
        }
    },
    [OrderRefundPayActionType.getOrderRefundPayService]: (state, action) => {
        return {
            ...state,
            orderRefundSerVList: action.payload
        }
    },
    [OrderRefundPayActionType.getOrderRefundPayProd]: (state, action) => {
        return {
            ...state,
            orderRefundProdList: action.payload
        }
    },
}, initialState)