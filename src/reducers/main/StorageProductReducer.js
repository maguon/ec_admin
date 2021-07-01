import {handleActions} from 'redux-actions';
import {StorageProductActionType} from '../../types';

const initialState = {
    // 检索结果
    storageProductData: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 10,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: [],
        // 统计
        statistics: {totalCnt: 0, totalCost: 0}
    },
    // 检索条件
    queryParams: {
        // 仓库
        storage: null,
        // 仓库分区
        storageArea: null,
        // 供应商
        supplier: null,
        // 商品
        product: null,
        // 采购单ID
        purchaseId: '',
        // 仓储日期（始）
        startDate: '',
        // 仓储日期（终）
        endDate: ''
    },
    modalData: {}
};

export default handleActions({
    [StorageProductActionType.setStorageProductData]: (state, action) => {
        return {
            ...state,
            storageProductData: action.payload
        }
    },
    [StorageProductActionType.setStorageProductDataCnt]: (state, action) => {
        state.storageProductData.statistics = action.payload;
        return {
            ...state,
            storageProductData: state.storageProductData
        }
    },
    [StorageProductActionType.setDefaultQueryParams]: (state, action) => {
        return {
            ...state,
            queryParams: action.payload
        }
    },
    [StorageProductActionType.setQueryParams]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryParams, [name]: value};
        return {
            ...state,
            queryParams: paramsObj
        }
    },
    [StorageProductActionType.setModalData]: (state, action) => {
        return {
            ...state,
            modalData: action.payload
        }
    }
}, initialState)