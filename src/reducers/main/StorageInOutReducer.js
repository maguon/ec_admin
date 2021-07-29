import {handleActions} from 'redux-actions';
import {StorageInOutActionType} from '../../types';

const initialState = {
    // 采购入库
    purchaseItemStorage: {start: 0,size: 11,dataSize: 0,dataList: []},
    purchaseItemRefund:[],
    purchaseParams: {
        // 仓储状态
        storageStatus: '',
        // 仓库
        storage: null,
        // 仓库分区
        storageArea: null,
        // 供应商
        supplier: null,
        // 采购单ID
        purchaseId: '',
        // 商品ID
        productId: ''
    },
    // 退货出库
    purchaseRefundData: {start: 0, size: 11,dataSize: 0,dataList: []},
    refundParams: {
        // 退仓状态
        refundStorageFlag: '',
        // 退款状态
        paymentStatus: '',
        // 运费类型
        transferCostType: '',
        // 供应商
        supplier: null,
        // 采购单ID
        purchaseId: '',
        // 商品ID
        productId: ''
    },
    storageProductRelList: [],
    storageProductRelDetail: [],
    // 订单出库
    orderOutData: {start: 0,size: 11,dataSize: 0, dataList: []},
    orderOutParams: {
        // 状态
        orderItemStatus: '',
        // 订单ID
        orderId: '',
        // 领用人
        reUser: '',
        // 订单日期
        orderDateStart: '',
        orderDateEnd: '',
        // 商品ID
        productId: '',
        // 供应商
        supplier: null,
        // 仓库
        storage: null,
        // 仓库分区
        storageArea: null,
    },
    storageProductList: [],
    orderOutModalList: [],
    // 出入库
    storageProductDetail: {start: 0,size: 11,dataSize: 0,dataList: []},
    storageProductDetailParams: {
        // 仓储区分
        storageType: '',
        // 仓储子区分
        storageSubType: '',
        // 仓库
        storage: null,
        // 仓库分区
        storageArea: null,
        // 供应商
        supplier: null,
        // 采购单ID
        purchaseId: '',
        // 商品ID
        productId: '',
        // 日期
        dateIdStart: '',
        dateIdEnd: '',
    }
};

export default handleActions({
    [StorageInOutActionType.getPurchaseItemStorageData]: (state, action) => {
        return {
            ...state,
            purchaseItemStorage: action.payload
        }
    },
    [StorageInOutActionType.getPurchaseItemRefund]: (state, action) => {
        return {
            ...state,
            purchaseItemRefund: action.payload
        }
    },
    [StorageInOutActionType.setPurchaseParams]: (state, action) => {
        return {
            ...state,
            purchaseParams: action.payload
        }
    },
    [StorageInOutActionType.setPurchaseParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.purchaseParams, [name]: value};
        return {
            ...state,
            purchaseParams: paramsObj
        }
    },
    [StorageInOutActionType.getPurchaseRefundData]: (state, action) => {
        return {
            ...state,
            purchaseRefundData: action.payload
        }
    },
    [StorageInOutActionType.setRefundParams]: (state, action) => {
        return {
            ...state,
            refundParams: action.payload
        }
    },
    [StorageInOutActionType.setRefundParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.refundParams, [name]: value};
        return {
            ...state,
            refundParams: paramsObj
        }
    },
    [StorageInOutActionType.setStorageProductRelList]: (state, action) => {
        return {
            ...state,
            storageProductRelList: action.payload
        }
    },
    [StorageInOutActionType.setStorageProductRelDetail]: (state, action) => {
        return {
            ...state,
            storageProductRelDetail: action.payload
        }
    },
    [StorageInOutActionType.setOrderOutData]: (state, action) => {
        return {
            ...state,
            orderOutData: action.payload
        }
    },
    [StorageInOutActionType.setOrderOutParams]: (state, action) => {
        return {
            ...state,
            orderOutParams: action.payload
        }
    },
    [StorageInOutActionType.setOrderOutParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.orderOutParams, [name]: value};
        return {
            ...state,
            orderOutParams: paramsObj
        }
    },
    [StorageInOutActionType.setStorageProductList]: (state, action) => {
        return {
            ...state,
            storageProductList: action.payload
        }
    },
    [StorageInOutActionType.setOrderOutModalList]: (state, action) => {
        return {
            ...state,
            orderOutModalList: action.payload
        }
    },
    [StorageInOutActionType.setStorageProductDetail]: (state, action) => {
        return {
            ...state,
            storageProductDetail: action.payload
        }
    },
    [StorageInOutActionType.setStorageProductDetailParams]: (state, action) => {
        return {
            ...state,
            storageProductDetailParams: action.payload
        }
    },
    [StorageInOutActionType.setStorageProductDetailParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.storageProductDetailParams, [name]: value};
        return {
            ...state,
            storageProductDetailParams: paramsObj
        }
    }
}, initialState)