import {handleActions} from 'redux-actions';
import {CollectionRefundDetailActionType} from '../../types';
const initialState = {
    // 检索条件
    paymentInfo: {
        remark: "",
        payment_type: '',
        actual_price: ''
    },
    orderInfo:[],
    orderServiceInfo:[],
    orderProdInfo:[]
}
export default handleActions({
    [CollectionRefundDetailActionType.getPaymentInfo]: (state, action) => {
        return {
            ...state,
            paymentInfo: action.payload
        }
    },
    [CollectionRefundDetailActionType.setPaymentInfo]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.paymentInfo, [name]: value};
        return {
            ...state,
            paymentInfo: paramsObj
        }
    },
    [CollectionRefundDetailActionType.getOrderInfo]: (state, action) => {
        return {
            ...state,
            orderInfo: action.payload
        }
    },
    [CollectionRefundDetailActionType.getOrderServiceInfo]: (state, action) => {
        return {
            ...state,
            orderServiceInfo: action.payload
        }
    },
    [CollectionRefundDetailActionType.getOrderProdInfo]: (state, action) => {
        return {
            ...state,
            orderProdInfo: action.payload
        }
    },
}, initialState)