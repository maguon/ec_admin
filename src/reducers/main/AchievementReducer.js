import {handleActions} from 'redux-actions';
import {AchievementActionType} from '../../types';
const initialState = {
    // 检索条件
    serviceParams: {
        orderId:'',
        saleServiceId:null,
        deployUserId:null,
        checkUserId:null,
        dateStart:'',
        dateEnd:''
    },
    productParams: {
        purchaseId:'',
        supplierId:null,
        orderId:'',
        saleUserId:null,
        prodId:null,
        dateStart:'',
        dateEnd:''
    },
    // 检索结果
    serviceData:{
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        serviceInfo: [],
    },
    productData:{
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        productInfo: [],
    }
};
export default handleActions({
    [AchievementActionType.setServiceParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.serviceParams, [name]: value};
        return {
            ...state,
            serviceParams: paramsObj
        }
    },
    [AchievementActionType.setServiceParams]: (state, action) => {
        return {
            ...state,
            serviceParams: action.payload
        }
    },
    [AchievementActionType.setProductParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.productParams, [name]: value};
        return {
            ...state,
            productParams: paramsObj
        }
    },
    [AchievementActionType.setProductParams]: (state, action) => {
        return {
            ...state,
            productParams: action.payload
        }
    },
    [AchievementActionType.setServiceData]: (state, action) => {
        return {
            ...state,
            serviceData: action.payload
        }
    },
    [AchievementActionType.setProductData]: (state, action) => {
        return {
            ...state,
            productData: action.payload
        }
    }
}, initialState)