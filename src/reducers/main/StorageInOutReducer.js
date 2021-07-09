import {handleActions} from 'redux-actions';
import {StorageInOutActionType} from '../../types';

const initialState = {
    // 检索结果
    purchaseItemStorage: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
    // 检索条件
    purchaseParams: {
        // 仓储状态
        storageStatus: null,
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
    purchaseRefundData: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
    refundParams: {
        // 退仓状态
        refundStorageFlag: null,
        // 退款状态
        paymentStatus: null,
        // 运费类型
        transferCostType: null,
        // 供应商
        supplier: null,
        // 采购单ID
        purchaseId: '',
        // 商品ID
        productId: ''
    },
    storageProductRelList: [],
    storageProductRelDetail: [],
    storageProductDetail: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
    storageProductDetailParams: {
        // 仓储区分
        storageType: null,
        // 仓储子区分
        storageSubType: null,
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