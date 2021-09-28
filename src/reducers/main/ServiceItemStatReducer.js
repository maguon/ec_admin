import {handleActions} from 'redux-actions';
import {ServiceItemStatActionType, StorageCheckDetailActionType} from '../../types';
const initialState = {
    serviceParams: {
        dateStart:'',
        dateEnd:''
    },
    servicePartTypeParams: {
        dateStart:'',
        dateEnd:''
    },
    serviceOrderTypeArray: [],
    serviceOrderPartTypeArray: []
};

export default handleActions({
    [ServiceItemStatActionType.getServiceParams]: (state, action) => {
        return {
            ...state,
            serviceParams: action.payload
        }
    },
    [ServiceItemStatActionType.setServiceParams]: (state, action) => {
        const {name, value} = action.payload;
        const Obj = {...state.serviceParams, [name]: value};
        return {
            ...state,
            serviceParams: Obj
        }
    },
    [ServiceItemStatActionType.getServicePartTypeParams]: (state, action) => {
        return {
            ...state,
            servicePartTypeParams: action.payload
        }
    },
    [ServiceItemStatActionType.setServicePartTypeParams]: (state, action) => {
        const {name, value} = action.payload;
        const Obj = {...state.servicePartTypeParams, [name]: value};
        return {
            ...state,
            servicePartTypeParams: Obj
        }
    },
    [ServiceItemStatActionType.getStatServiceOrderTypeList]: (state, action) => {
        return {
            ...state,
            serviceOrderTypeArray: action.payload
        }
    },
    [ServiceItemStatActionType.getStatServiceOrderPartTypeList]: (state, action) => {
        return {
            ...state,
            serviceOrderPartTypeArray: action.payload
        }
    }
}, initialState)
