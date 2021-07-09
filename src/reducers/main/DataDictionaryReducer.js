import {handleActions} from 'redux-actions';
import {DataDictionaryActionType} from '../../types';
const initialState = {
    // 供应商列表
    supplierArray: [],
    //商品分类列表
    categoryArray: [],
    //商品列表
    productArray: [],
    //品牌列表
    brandArray: [],
};
export default handleActions({
    [DataDictionaryActionType.setSupplierList]: (state, action) => {
        return {
            ...state,
            supplierArray: action.payload
        }
    },
    [DataDictionaryActionType.setCategoryList]: (state, action) => {
        return {
            ...state,
            categoryArray: action.payload
        }
    },
    [DataDictionaryActionType.setProductList]: (state, action) => {
        return {
            ...state,
            productArray: action.payload
        }
    },
    [DataDictionaryActionType.setBrandList]: (state, action) => {
        return {
            ...state,
            brandArray: action.payload
        }
    },
}, initialState)