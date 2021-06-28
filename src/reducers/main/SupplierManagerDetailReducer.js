import {handleActions} from 'redux-actions';
import {SupplierManagerActionType, SupplierManagerDetailActionType} from '../../types';
const initialState = {
    // 供应商
    getSupplierInfo: []
};

export default handleActions({
    [SupplierManagerActionType.getSupplierInfo]: (state, action) => {
        return {
            ...state,
            supplierInfo: action.payload
        }
    }
}, initialState)