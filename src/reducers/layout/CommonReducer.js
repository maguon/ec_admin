import {handleActions} from 'redux-actions';
import {CommonActionType} from '../../types';

const initialState = {
    categoryList: [],
    categorySubList: [],
    brandList: [],
    brandModelList: [],
    productList: [],
    storageList: [],
    storageAreaList: [],
    supplierList: [],
    supplierInfo: {},
    clientList:[],
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
    [CommonActionType.setStorageList]: (state, action) => {
        return {
            ...state,
            storageList: action.payload
        }
    },
    [CommonActionType.setStorageAreaList]: (state, action) => {
        return {
            ...state,
            storageAreaList: action.payload
        }
    },
    [CommonActionType.setSupplierList]: (state, action) => {
        return {
            ...state,
            supplierList: action.payload
        }
    },
    [CommonActionType.setSupplierInfo]: (state, action) => {
        return {
            ...state,
            supplierInfo: action.payload
        }
    },
    [CommonActionType.setClientList]: (state, action) => {
        return {
            ...state,
            clientList: action.payload
        }
    },

}, initialState);
