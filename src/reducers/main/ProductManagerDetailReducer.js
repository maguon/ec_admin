import {handleActions} from 'redux-actions';
import {SupplierDetailActionType} from '../../types';
const initialState = {
    // 供应商
    supplierInfo: {
        supplier_name:'',
        supplier_type:0,
        contact_name:'',
        email:'',
        tel:'',
        mobile:'',
        fax:'',
        address:'',
        invoice_title:'',
        invoice_bank:'',
        invoice_bank_ser:'',
        invoice_address:'',
        settle_type:0,
        settle_month_day:0,
        remark:''
    }
};

export default handleActions({
    [SupplierDetailActionType.getSupplierInfo]: (state, action) => {
        return {
            ...state,
            supplierInfo: action.payload
        }
    },
    [SupplierDetailActionType.setSupplierInfo]: (state, action) => {
        const {name,value} =action.payload;
        const supplierObj = {...state.supplierInfo,[name]:value} ;
        return {
            ...state,
            supplierInfo: supplierObj
        }
    }
}, initialState)