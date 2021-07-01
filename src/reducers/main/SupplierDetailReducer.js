import {handleActions} from 'redux-actions';
import {SupplierDetailActionType} from '../../types';
const initialState = {
    // 供应商
    supplierInfo: {
        id:'',
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
    },
    purchaseInfo:[],
    purchaseRefundInfo:[]
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
    },

    [SupplierDetailActionType.getPurchaseInfo]: (state, action) => {
        return {
            ...state,
            purchaseInfo: action.payload
        }
    },
    [SupplierDetailActionType.getPurchaseRefundInfo]: (state, action) => {
        return {
            ...state,
            purchaseRefundInfo: action.payload
        }
    },

}, initialState)