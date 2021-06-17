import {combineReducers} from 'redux'
import {reducer as reduxFormReducer} from 'redux-form';
import AppReducer from './layout/AppReducer';
import LoginReducer from './login/LoginReducer';
import MainPanelReducer from './main/MainPanelReducer';

export default combineReducers({
    form: reduxFormReducer,
    AppReducer,
    LoginReducer,
    MainPanelReducer
});
