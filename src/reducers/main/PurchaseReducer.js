import {handleActions} from 'redux-actions';
import {PurchaseActionType} from '../../types';
const initialState = {
    //查询条件
    queryPurchaseObj:{
        supplierId:null,
        storageStatus:'',
        paymentStatus:'',
        status:'',
        planDateStart :'',
        planDateEnd:'',
        finishDateStart:'',
        finishDateEnd:''
    },
    //添加条件
    addPurchaseObj:{
        remark: "",
        supplierId: 0,
        supplierName: "",
        transferCostType: 0,
        transferCost: 0,
        orderId: 0,
        purchaseItem: [
            {
                remark: "",
                productId: 0,
                productName: "",
                unitCost: 0,
                purchaseCount: 0
            }
        ]
    },
    start:0,
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 采购列表
    purchaseArray: [],
    // 供应商列表
    supplierArray: [],
    //商品
    productArray:[],
    purchasePdfData: {},
    supplierPdfArray:{},
    purchaseItemArray:[],
};
export default handleActions({
    [PurchaseActionType.setPurchaseQueryObj]: (state, action) => {
        return {
            ...state,
            queryPurchaseObj: action.payload
        }
    },
    [PurchaseActionType.setPurchaseQueryObjs]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryPurchaseObj, [name]: value};
        return {
            ...state,
            queryPurchaseObj: paramsObj
        }
    },
    [PurchaseActionType.getPurchaseAddObj]: (state, action) => {
        return {
            ...state,
            addPurchaseObj: action.payload
        }
    },
    [PurchaseActionType.setPurchaseAddObj]: (state, action) => {
        const {index,name,value} =action.payload;
        const addPurchaseInfo = {...state.addPurchaseObj,index,[name]:value} ;
        return {
            ...state,
            addPurchaseObj: addPurchaseInfo
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
    [PurchaseActionType.setPurchaseListDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
    [PurchaseActionType.setStart]: (state, action) => {
        return {
            ...state,
            start: action.payload
        }
    },
    [PurchaseActionType.getProductList]: (state, action) => {
        return {
            ...state,
            productArray: action.payload
        }
    },
    [PurchaseActionType.setPurchasePdfData]: (state, action) => {
        return {
            ...state,
            purchasePdfData: action.payload
        }
    },
    [PurchaseActionType.getSupplierArray]: (state, action) => {
        return {
            ...state,
            supplierPdfArray: action.payload
        }
    },
    [PurchaseActionType.getPurchaseItemArray]: (state, action) => {
        return {
            ...state,
           purchaseItemArray: action.payload
        }
    },
}, initialState)