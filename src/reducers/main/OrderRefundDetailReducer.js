import {handleActions} from 'redux-actions';
import {OrderRefundDetailActionType} from '../../types';

const initialState = {
    orderRefundInfo: {},
    orderRefundSerVList: [],
    orderRefundProdList: []
};

export default handleActions({
    [OrderRefundDetailActionType.getOrderRefundInfo]: (state, action) => {
        return {
            ...state,
            orderRefundInfo: {...action.payload, reUser:{id:action.payload.re_user_id,real_name:action.payload.re_user_name}}
        }
    },
    [OrderRefundDetailActionType.setOrderRefundInfo]: (state, action) => {
        const {name, value} = action.payload;
        const newData = {...state.orderRefundInfo, [name]: value};
        return {
            ...state,
            orderRefundInfo: newData
        }
    },
    [OrderRefundDetailActionType.getOrderRefundSerVList]: (state, action) => {
        return {
            ...state,
            orderRefundSerVList: action.payload
        }
    },
    [OrderRefundDetailActionType.getOrderRefundProdList]: (state, action) => {
        return {
            ...state,
            orderRefundProdList: action.payload
        }
    },
}, initialState)