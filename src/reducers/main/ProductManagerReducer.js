import {handleActions} from 'redux-actions';
import {ProductManagerActionType} from '../../types';

const initialState = {
    // 检索结果
    productData: {
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
    queryParams: {
        paramCategory: null,
        paramCategorySub: null,
        paramBrand: null,
        paramBrandModel: null,
        paramProduct: null,
        paramStandardType: null,
        paramStatus: null
    },
    // 检索结果
    modalData: {
        // 新增 / 修改 区分
        pageType: '',
        // 唯一键
        uid : -1,

        // 商品分类
        categoryType: null,
        // 商品子分类
        categorySubType: null,
        // 品牌
        brandType: null,
        // 品牌型号
        brandModelType: null,
        // 商品名称
        productName: '',
        // 商品别名
        productSName: '',
        // 序列号
        productSerial: '',
        // 产地
        productAddress: '',
        // 标准类型（标准、非标准）
        standardType: null,
        // 单位
        unitName:  '',
        // 单价
        price: 0,
        // 图片
        image: '',
        // "barcode": "string",
        // 备注
        remark: ''
    }
};

export default handleActions({
    [ProductManagerActionType.setProductData]: (state, action) => {
        return {
            ...state,
            productData: action.payload
        }
    },
    [ProductManagerActionType.setQueryParams]: (state, action) => {
        return {
            ...state,
            queryParams: action.payload
        }
    },
    [ProductManagerActionType.setModalData]: (state, action) => {
        return {
            ...state,
            modalData: action.payload
        }
    }
}, initialState)