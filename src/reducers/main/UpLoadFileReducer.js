import {handleActions} from 'redux-actions';
import {UpLoadFileActionType} from '../../types';
const initialState = {
    array:{
        failedCase:0,
        successedInsert:0,
    },
    uploadFlag:false
}
export default handleActions({
    [UpLoadFileActionType.setArray]: (state, action) => {
        return {
            ...state,
            array: action.payload
        }
    },
    [UpLoadFileActionType.setUpLoadFlag]: (state, action) => {
        return {
            ...state,
            uploadFlag: action.payload
        }
    },
}, initialState)