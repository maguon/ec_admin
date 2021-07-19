import {handleActions} from 'redux-actions';
import {PurchaseRefundActionType} from '../../types';
const initialState = {
    //查询条件
    queryPurchaseRefundObj:{
        purchaseId:'',
        supplierId:'',
        productId :'',
        paymentStatus:'',
        status:'',
        dateIdStart:'',
        dateIdEnd:'',
        start :0
    },
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    purchaseRefundArray:[],
    purchaseItem:[],
    productArray:[],
    storageProductRelArray:[]
}
export default handleActions({
    [PurchaseRefundActionType.getPurchaseRefundList]: (state, action) => {
        return {
            ...state,
            purchaseRefundArray: action.payload
        }
    },
    [PurchaseRefundActionType.setPurchaseRefundQueryObj]: (state, action) => {
        return {
            ...state,
            queryPurchaseRefundObj: action.payload
        }
    },
    [PurchaseRefundActionType.setPurchaseRefundListDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
    [PurchaseRefundActionType.setPurchaseItem]: (state, action) => {
        return {
            ...state,
            purchaseItem: action.payload
        }
    },
    [PurchaseRefundActionType.setProductArray]: (state, action) => {
        return {
            ...state,
            productArray: action.payload
        }
    },
    [PurchaseRefundActionType.setStorageProductRelArray]: (state, action) => {
        return {
            ...state,
            storageProductRelArray: action.payload
        }
    },

}, initialState)