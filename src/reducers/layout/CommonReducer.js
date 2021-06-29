import {handleActions} from 'redux-actions';
import {CommonActionType} from '../../types';

const initialState = {
    categoryList: [],
    categorySubList: [],
    brandList: [],
    brandModelList: [],
    productList: [],
};

export default handleActions({
    [CommonActionType.setCategoryList]: (state, action) => {
        return {
            ...state,
            categoryList: action.payload
        }
    },
    [CommonActionType.setCategorySubList]: (state, action) => {
        return {
            ...state,
            categorySubList: action.payload
        }
    },
    [CommonActionType.setBrandList]: (state, action) => {
        return {
            ...state,
            brandList: action.payload
        }
    },
    [CommonActionType.setBrandModelList]: (state, action) => {
        return {
            ...state,
            brandModelList: action.payload
        }
    },
    [CommonActionType.setProductList]: (state, action) => {
        return {
            ...state,
            productList: action.payload
        }
    },
}, initialState);
