import {handleActions} from 'redux-actions';
import {PurchaseActionType} from '../../types';
const initialState = {
    //查询条件
    queryObj:{
        supplierId:'',
        planDateId :'20200101',
        finishDateId:'20200101',
        start :0
    },
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 采购列表
    purchaseArray: [],
    // 供应商列表
    supplierArray: [],
    //商品列表
    categoryArray:[],
    //二级商品
    categorySubArray:[],
};

export default handleActions({
    [PurchaseActionType.setPurchaseQueryObj]: (state, action) => {
        return {
            ...state,
            queryObj: action.payload
        }
    },
    [PurchaseActionType.setPurchaseArray]: (state, action) => {
        return {
            ...state,
            purchaseArray: action.payload
        }
    },
    [PurchaseActionType.getSupplierList]: (state, action) => {
        return {
            ...state,
            supplierArray: action.payload
        }
    },
    [PurchaseActionType.getCategoryList]: (state, action) => {
        return {
            ...state,
            categoryArray: action.payload
        }
    },
    [PurchaseActionType.getCategorySubList]: (state, action) => {
        return {
            ...state,
            categorySubArray: action.payload
        }
    },
    [PurchaseActionType.setPurchaseListDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
}, initialState)