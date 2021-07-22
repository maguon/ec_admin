import {handleActions} from 'redux-actions';
import {StorageCheckDetailActionType} from '../../types';

const initialState = {
    storageCheckInfo: {},
    detailList: []
};

export default handleActions({
    [StorageCheckDetailActionType.getStorageCheckInfo]: (state, action) => {
        return {
            ...state,
            storageCheckInfo: action.payload
        }
    },
    [StorageCheckDetailActionType.getDetailList]: (state, action) => {
        return {
            ...state,
            detailList: action.payload
        }
    },
    [StorageCheckDetailActionType.setStorageCheckInfo]: (state, action) => {
        const {name, value} = action.payload;
        const storageCheckObj = {...state.storageCheckInfo, [name]: value};
        return {
            ...state,
            storageCheckInfo: storageCheckObj
        }
    },
    [StorageCheckDetailActionType.setDetailList]: (state, action) => {
        const {name, value, index} = action.payload;
        let newDetailList = state.detailList;
        newDetailList[index][name] = value;
        return {
            ...state,
            detailList: newDetailList
        }
    },
}, initialState)