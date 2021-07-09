import {handleActions} from 'redux-actions';
import {SupplierActionType} from '../../types';
const initialState = {
    //查询条件
    queryObj:{
        supplierId:null,
        supplierType :null,
    },
    start :0,
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 供应商列表
    supplierArray: []
};
export default handleActions({
    [SupplierActionType.setSupplierQueryObj]: (state, action) => {
        return {
            ...state,
            queryObj: action.payload
        }
    },
    [SupplierActionType.setSupplierQueryObjs]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryObj, [name]: value};
        return {
            ...state,
            queryObj: paramsObj
        }
    },
    [SupplierActionType.getSupplierList]: (state, action) => {
        return {
            ...state,
            supplierArray: action.payload
        }
    },
    [SupplierActionType.setSupplierListDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
    [SupplierActionType.setSupplierListStart]: (state, action) => {
        return {
            ...state,
            start: action.payload
        }
    },

}, initialState)