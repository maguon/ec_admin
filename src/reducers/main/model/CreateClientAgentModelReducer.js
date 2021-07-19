import {handleActions} from 'redux-actions';
import {CreateClientAgentModelActionType} from '../../../types';
const initialState = {
    flag:false,
    remark: "",
    name: "",
    clientType: '1',
    tel: "",
    address: "",
    idSerial: "",
    salesUserId: null,
    sourceType: '1',
    currentUserArray:[]
};
export default handleActions({
    [CreateClientAgentModelActionType.setFlag]: (state, action) => {
        return {
            ...state,
            flag: action.payload
        }
    },
    [CreateClientAgentModelActionType.setRemark]: (state, action) => {
        return {
            ...state,
            remark: action.payload
        }
    },
    [CreateClientAgentModelActionType.setName]: (state, action) => {
        return {
            ...state,
            name: action.payload
        }
    },
    [CreateClientAgentModelActionType.setClientType]: (state, action) => {
        return {
            ...state,
            clientType: action.payload
        }
    },
    [CreateClientAgentModelActionType.setTel]: (state, action) => {
        return {
            ...state,
            tel: action.payload
        }
    },
    [CreateClientAgentModelActionType.setAddress]: (state, action) => {
        return {
            ...state,
            address: action.payload
        }
    },
    [CreateClientAgentModelActionType.setIdSerial]: (state, action) => {
        return {
            ...state,
            idSerial: action.payload
        }
    },
    [CreateClientAgentModelActionType.setSalesUserId]: (state, action) => {
        return {
            ...state,
            salesUserId: action.payload
        }
    },
    [CreateClientAgentModelActionType.setSourceType]: (state, action) => {
        return {
            ...state,
            sourceType: action.payload
        }
    },
    [CreateClientAgentModelActionType.getCurrentUser]: (state, action) => {
        return {
            ...state,
            currentUserArray: action.payload
        }
    },
}, initialState)