import {handleActions} from 'redux-actions';
import {OrderDetailActionType} from '../../types';

const initialState = {
    orderInfo: {reUser:{},opUser:{}},
    orderSerVList: [],
    orderProdList: []
};

export default handleActions({
    [OrderDetailActionType.getOrderInfo]: (state, action) => {
        return {
            ...state,
            orderInfo: {...action.payload, reUser:{id:action.payload.re_user_id,real_name:action.payload.re_user_name}}
        }
    },
    [OrderDetailActionType.setOrderInfo]: (state, action) => {
        const {name, value} = action.payload;
        const newData = {...state.orderInfo, [name]: value};
        return {
            ...state,
            orderInfo: newData
        }
    },
    [OrderDetailActionType.getOrderSerVList]: (state, action) => {
        return {
            ...state,
            orderSerVList: action.payload
        }
    },
    [OrderDetailActionType.getOrderProdList]: (state, action) => {
        return {
            ...state,
            orderProdList: action.payload
        }
    },
}, initialState)