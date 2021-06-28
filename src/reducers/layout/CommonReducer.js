import {handleActions} from 'redux-actions';
import {CommonActionType} from '../../types';

const initialState = {
    categoryList: [],
    categorySubList: [],
    brandList: [],
    brandModelList: [],
};

export default handleActions({
    [CommonActionType.setCategoryList]: (state, action) => {
        let categoryList = [];
        action.payload.forEach((item) => {
            categoryList.push({value: item.id, label: item.category_name})
        });
        return {
            ...state,
            categoryList: categoryList
        }
    },
    [CommonActionType.setCategorySubList]: (state, action) => {
        let categorySubList = [];
        action.payload.forEach((item) => {
            categorySubList.push({value: item.id, label: item.category_sub_name})
        });
        return {
            ...state,
            categorySubList: categorySubList
        }
    },
    [CommonActionType.setBrandList]: (state, action) => {
        let brandList = [];
        action.payload.forEach((item) => {
            brandList.push({value: item.id, label: item.brand_name})
        });
        return {
            ...state,
            brandList: brandList
        }
    },
    [CommonActionType.setBrandModelList]: (state, action) => {
        let brandModelList = [];
        action.payload.forEach((item) => {
            brandModelList.push({value: item.id, label: item.brand_model_name})
        });
        return {
            ...state,
            brandModelList: brandModelList
        }
    },
}, initialState);
