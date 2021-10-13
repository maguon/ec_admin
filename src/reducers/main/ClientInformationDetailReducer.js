import {handleActions} from 'redux-actions';
import {ClientInformationDetailActionType} from '../../types';
const initialState = {
    clientInfo: {
        id:'',
        remark:'',
        name:'',
        tel:'',
        address:'',
        client_serial:'',
        client_serial_detail:'',
        client_agent_id:null,
        refer_user:'',
        source_type:0,
        match_brand_id: null,
        match_model_id: null
    },
    referUserInfo:[],
    clientAgentInfo:[],
    orderData:{
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        orderInfo: [],
    },
    orderItemProdInfo:[],
    orderItemServiceInfo:[],
    prodMatchModelArray:[],
    prodMatchBrandArray:[]
};

export default handleActions({
    [ClientInformationDetailActionType.getClientInfo]: (state, action) => {
        let ret = action.payload;
        ret.client_agent_id={id:action.payload.client_agent_id,name:action.payload.client_agent_name};
        if(action.payload.match_brand_id==0&&action.payload.match_brand_name==null){
            ret.match_brand_id=null
        }else {
            ret.match_brand_id={id:action.payload.match_brand_id,brand_name:action.payload.match_brand_name};
        }
       if(action.payload.match_model_id==0&&action.payload.match_model_name==null){
           ret.match_model_id=null
       }else {
           ret.match_model_id={id:action.payload.match_model_id,match_model_name:action.payload.match_model_name};
       }
        return {
            ...state,
            clientInfo: ret
        }
    },
    [ClientInformationDetailActionType.setClientInfo]: (state, action) => {
        const {name,value} =action.payload;
        const supplierObj = {...state.clientInfo,[name]:value} ;
        return {
            ...state,
            clientInfo: supplierObj
        }
    },

    [ClientInformationDetailActionType.getReferUserDetailInfo]: (state, action) => {
        return {
            ...state,
            referUserInfo: action.payload
        }
    },
    [ClientInformationDetailActionType.getClientAgentDetailInfo]: (state, action) => {
        return {
            ...state,
            clientAgentInfo: action.payload
        }
    },
    [ClientInformationDetailActionType.getOrderList]: (state, action) => {
        return {
            ...state,
            orderData: action.payload
        }
    },
    [ClientInformationDetailActionType.getOrderItemProdList]: (state, action) => {
        return {
            ...state,
            orderItemProdInfo: action.payload
        }
    },
    [ClientInformationDetailActionType.getOrderItemServiceList]: (state, action) => {
        return {
            ...state,
            orderItemServiceInfo: action.payload
        }
    },
    [ClientInformationDetailActionType.setMatchModelList]: (state, action) => {
        return {
            ...state,
            prodMatchModelArray: action.payload
        }
    },
    [ClientInformationDetailActionType.setMatchBrandList]: (state, action) => {
        return {
            ...state,
            prodMatchBrandArray: action.payload
        }
    },

}, initialState)