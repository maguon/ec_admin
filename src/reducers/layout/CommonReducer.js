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
    clientAgentList:[],
    saleServiceList:[],
    userList:[],
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
    [CommonActionType.setClientAgentList]: (state, action) => {
        return {
            ...state,
            clientAgentList: action.payload
        }
    },
    [CommonActionType.setSaleServiceList]: (state, action) => {
        return {
            ...state,
            saleServiceList: action.payload
        }
    },
    [CommonActionType.setUserList]: (state, action) => {
        return {
            ...state,
            userList: action.payload
        }
    },
}, initialState);
