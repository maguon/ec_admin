import {handleActions} from 'redux-actions';
import {CreateClientAgentModelActionType} from '../../../types';
const initialState = {
    setFlag:'',
    remark: "",
    name: "",
    clientType: '',
    tel: "",
    address: "",
    idSerial: "",
    salesUserId: null,
    sourceType: '',
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
        const {name, value} = action.payload;
        const paramsObj = {...state.remark, [name]: value};
        return {
            ...state,
            remark: paramsObj
        }
    },
    [CreateClientAgentModelActionType.setName]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.name, [name]: value};
        return {
            ...state,
            name: paramsObj
        }
    },
    [CreateClientAgentModelActionType.setClientType]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.clientType, [name]: value};
        return {
            ...state,
            clientType: paramsObj
        }
    },
    [CreateClientAgentModelActionType.setTel]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.tel, [name]: value};
        return {
            ...state,
            tel: paramsObj
        }
    },
    [CreateClientAgentModelActionType.setAddress]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.address, [name]: value};
        return {
            ...state,
            address: paramsObj
        }
    },
    [CreateClientAgentModelActionType.setIdSerial]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.idSerial, [name]: value};
        return {
            ...state,
            idSerial: paramsObj
        }
    },
    [CreateClientAgentModelActionType.setSalesUserId]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.salesUserId, [name]: value};
        return {
            ...state,
            salesUserId: paramsObj
        }
    },
    [CreateClientAgentModelActionType.setSourceType]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.sourceType, [name]: value};
        return {
            ...state,
            sourceType: paramsObj
        }
    },
    [CreateClientAgentModelActionType.getCurrentUser]: (state, action) => {
        return {
            ...state,
            currentUserArray: action.payload
        }
    },
}, initialState)