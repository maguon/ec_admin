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
    invoiceData:{
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        invoiceArray: [],
    },
    clientData:{
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        clientArray:[],
    }
};

export default handleActions({
    [ClientAgentDetailActionType.getClientAgentInfo]: (state, action) => {
        let ret = action.payload;
        if(ret.sales_user_id==null){
            return {
                ...state,
                clientAgentInfo: action.payload
            }
        }
        else {
            ret.sales_user_id={id:action.payload.sales_user_id,real_name:action.payload.sales_real_name}
            return {
                ...state,
                clientAgentInfo: ret
            }
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
            invoiceData: action.payload
        }
    },
    [ClientAgentDetailActionType.getClientAgentDetailInfo]: (state, action) => {
        return {
            ...state,
            clientData: action.payload
        }
    },
}, initialState)