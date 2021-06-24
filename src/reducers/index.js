import {combineReducers} from 'redux'
import {reducer as reduxFormReducer} from 'redux-form';
import AppReducer from './layout/AppReducer';
import LoginReducer from './login/LoginReducer';
import MainPanelReducer from './main/MainPanelReducer';
import CategoryManagerReducer from './main/CategoryManagerReducer';
import AuthoritySettingReducer from './main/AuthoritySettingReducer';
import AdminUserSettingReducer from "./main/AdminUserSettingReducer";
import AppSettingReducer from "./main/AppSettingReducer";

export default combineReducers({
    form: reduxFormReducer,
    AppReducer,
    LoginReducer,
    MainPanelReducer,
    CategoryManagerReducer,
    AuthoritySettingReducer,
    AdminUserSettingReducer,
    AppSettingReducer,
});
