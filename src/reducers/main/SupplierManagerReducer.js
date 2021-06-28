import {handleActions} from 'redux-actions';
import {SupplierManagerActionType} from '../../types';
const initialState = {
    //查询条件
    queryObj:{
        supplierName:'',
        supplierType :'',
        start :0
    },
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 供应商列表
    supplierArray: []
};

export default handleActions({
    [SupplierManagerActionType.setSupplierQueryObj]: (state, action) => {
        return {
            ...state,
            queryObj: action.payload
        }
    },
    [SupplierManagerActionType.getSupplierList]: (state, action) => {
        return {
            ...state,
            supplierArray: action.payload
        }
    },
    [SupplierManagerActionType.setSupplierListDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
}, initialState)