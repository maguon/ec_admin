import {handleActions} from 'redux-actions';
import {PurchaseDetailActionType} from '../../types';
const initialState = {
    // 采购
    purchaseDetailInfo: {
        id: "",
        payment_status: '',
        plan_date_id: '',
        product_cost: "",
        remark: "",
        status: '',
        storage_status: '',
        supplier_id: '',
        supplier_name: "",
        total_cost: "",
        transfer_cost: "",
        transfer_cost_type: ''
    },
    purchaseDetailItemInfo:[],
    purchaseRefundDetailInfo:[],
    productDetailArray:[],
    storageProductArray:[],
    supplierDetailArray: {},
    uniqueList:[],
};
export default handleActions({
    [PurchaseDetailActionType.getPurchaseDetailInfo]: (state, action) => {
        return {
            ...state,
            purchaseDetailInfo: action.payload
        }
    },
    [PurchaseDetailActionType.setPurchaseDetailInfo]: (state, action) => {
        const {name,value} =action.payload;
        const  purchaseDetailObj = {...state. purchaseDetailInfo,[name]:value} ;
        return {
            ...state,
            purchaseDetailInfo:  purchaseDetailObj
        }
    },
    [PurchaseDetailActionType.getPurchaseDetailItemInfo]: (state, action) => {
        return {
            ...state,
            purchaseDetailItemInfo: action.payload
        }
    },
    [PurchaseDetailActionType.setPurchaseDetailItemInfo]: (state, action) => {
        const {index,name,value} =action.payload;
        const purchaseDetailItemObj1=[...state.purchaseDetailItemInfo];
        const purchaseDetailItemObj2 = {...state.purchaseDetailItemInfo[index],[name]:value} ;
        const purchaseDetailItemObj = purchaseDetailItemObj1.map(item=>
            item.id==purchaseDetailItemObj2.id? purchaseDetailItemObj2 : item
        );
        return {
            ...state,
            purchaseDetailItemInfo:purchaseDetailItemObj
        }
    },
    [PurchaseDetailActionType.getPurchaseRefundDetailInfo]: (state, action) => {
        return {
            ...state,
            purchaseRefundDetailInfo: action.payload
        }
    },
    [PurchaseDetailActionType.getProductDetailArray]: (state, action) => {
        return {
            ...state,
            productDetailArray: action.payload
        }
    },
    [PurchaseDetailActionType.getStorageProductArray]: (state, action) => {
        return {
            ...state,
            storageProductArray: action.payload
        }
    },
    [PurchaseDetailActionType.getSupplierDetailArray]: (state, action) => {
        return {
            ...state,
            supplierDetailArray: action.payload
        }
    },
    [PurchaseDetailActionType.getUniqueList]: (state, action) => {
        return {
            ...state,
            uniqueList: action.payload
        }
    },

}, initialState)