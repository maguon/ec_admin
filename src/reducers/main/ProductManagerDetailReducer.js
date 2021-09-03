import {handleActions} from 'redux-actions';
import {ProductManagerDetailActionType} from '../../types';

const initialState = {
    productInfo: {
        // 商品分类
        category: null,
        // 商品子分类
        category_sub: null,
        // 品牌
        brand: null,
        // 品牌型号
        brand_model: null,
        // 商品名称
        product_name: '',
        // 商品别名
        product_s_name: '',
        // 序列号
        product_serial: '',
        // 产地
        product_address: '',
        // 标准类型（标准、非标准）
        standard_type: '',
        // 定价方式
        price_type: '',
        // 单位
        unit_name: '',
        // 单价
        price: 0,
        // 图片
        image: '',
        // "barcode": "string",
        // 备注
        remark: ''
    },
    carBrandList:[],
    currentMatchList: [],
    purchaseList:[],
    storageList:[]
};

export default handleActions({
    [ProductManagerDetailActionType.getProductInfo]: (state, action) => {
        let ret = action.payload;
        ret.category = {id: action.payload.category_id, category_name: action.payload.category_name};
        ret.category_sub = {id: action.payload.category_sub_id, category_sub_name: action.payload.category_sub_name};
        ret.brand = {id: action.payload.brand_id, brand_name: action.payload.brand_name};
        ret.brand_model = {id: action.payload.brand_model_id, brand_model_name: action.payload.brand_model_name};
        return {
            ...state,
            productInfo: ret
        }
    },
    [ProductManagerDetailActionType.setProductInfo]: (state, action) => {
        const {name, value} = action.payload;
        const productObj = {...state.productInfo, [name]: value};
        return {
            ...state,
            productInfo: productObj
        }
    },
    [ProductManagerDetailActionType.getProductPurchase]: (state, action) => {
        return {
            ...state,
            purchaseList: action.payload
        }
    },
    [ProductManagerDetailActionType.setProductStorage]: (state, action) => {
        return {
            ...state,
            storageList: action.payload
        }
    },
    [ProductManagerDetailActionType.setCarBrandList]: (state, action) => {
        return {
            ...state,
            carBrandList: action.payload
        }
    },
    [ProductManagerDetailActionType.setCarModelList]: (state, action) => {
        let carBrandList = state.carBrandList;
        if (action.payload && action.payload.length > 0) {
            for (let i = 0; i < carBrandList.length; i++) {
                if (carBrandList[i].id == action.payload[0].match_brand_id) {
                    carBrandList[i].sub = action.payload;
                    break;
                }
            }
        }
        return {
            ...state,
            carBrandList: carBrandList
        }
    },
    [ProductManagerDetailActionType.setCurrentMatchList]: (state, action) => {
        return {
            ...state,
            currentMatchList: action.payload
        }
    },
}, initialState)