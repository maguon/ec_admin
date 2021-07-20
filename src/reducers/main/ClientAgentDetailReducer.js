import {handleActions} from 'redux-actions';
import {ClientAgentDetailActionType} from '../../types';
const initialState = {
    clientAgentInfo: {
        id:'',
        remark: "",
        name: "",
        client_type: 0,
        tel: "",
        address: "",
        id_serial: "",
        sales_user_id: null,
        source_type:0
    },
    currentUserArray:[],
    invoiceArray:[],
};

export default handleActions({
    [ClientAgentDetailActionType.getClientAgentInfo]: (state, action) => {
        let ret = action.payload;
        ret.sales_user_id={id:action.payload.sales_user_id,real_name:action.payload.sales_real_name}
        return {
            ...state,
            clientAgentInfo: ret
        }
    },
    [ClientAgentDetailActionType.setClientAgentInfo]: (state, action) => {
        const {name,value} =action.payload;
        const supplierObj = {...state.clientAgentInfo,[name]:value} ;
        return {
            ...state,
            clientAgentInfo: supplierObj
        }
    },
    [ClientAgentDetailActionType.getClientAgentArray]: (state, action) => {
        return {
            ...state,
            currentUserArray: action.payload
        }
    },
    [ClientAgentDetailActionType.getInvoiceList]: (state, action) => {
        return {
            ...state,
            invoiceArray: action.payload
        }
    },
}, initialState)