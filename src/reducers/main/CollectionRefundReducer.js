import {handleActions} from 'redux-actions';
import {CollectionRefundActionType} from '../../types';

const initialState = {
    // 检索条件
    collectionRefundParam: {
        paymentId:'',
        status:'',
        type:'',
        paymentType:'',
        dateStart:'',
        dateEnd:'',
    },
    // 检索结果
    collectionRefundData: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
    orderRefundInfo:[],
    orderStatInfo:[]
};

export default handleActions({
    [CollectionRefundActionType.setCollectionRefundData]: (state, action) => {
        return {
            ...state,
            collectionRefundData: action.payload
        }
    },
    [CollectionRefundActionType.setCollectionRefundParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.collectionRefundParam, [name]: value};
        return {
            ...state,
            collectionRefundParam: paramsObj
        }
    },
    [CollectionRefundActionType.setCollectionRefundParams]: (state, action) => {
        return {
            ...state,
            collectionRefundParam: action.payload
        }
    },
    [CollectionRefundActionType.setOrderRefundStat]: (state, action) => {
        return {
            ...state,
            orderRefundInfo: action.payload
        }
    },
    [CollectionRefundActionType.setOrderStat]: (state, action) => {
        return {
            ...state,
            orderStatInfo: action.payload
        }
    },
}, initialState)