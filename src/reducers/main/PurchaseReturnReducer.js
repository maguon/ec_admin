import {handleActions} from 'redux-actions';
import {PurchaseReturnActionType} from '../../types';
const initialState = {
    //查询条件
    queryPurchaseReturnObj:{
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
    purchaseReturnArray:[],
    purchaseItem:[],
    productArray:[],
}

export default handleActions({
    [PurchaseReturnActionType.getPurchaseReturnList]: (state, action) => {
        return {
            ...state,
            purchaseReturnArray: action.payload
        }
    },
    [PurchaseReturnActionType.setPurchaseReturnQueryObj]: (state, action) => {
        return {
            ...state,
            queryPurchaseReturnObj: action.payload
        }
    },
    [PurchaseReturnActionType.setPurchaseReturnListDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
    [PurchaseReturnActionType.setPurchaseItem]: (state, action) => {
        return {
            ...state,
            purchaseItem: action.payload
        }
    },
    [PurchaseReturnActionType.setProductArray]: (state, action) => {
        return {
            ...state,
            productArray: action.payload
        }
    },


}, initialState)