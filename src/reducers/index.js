import {combineReducers} from 'redux'
import {reducer as reduxFormReducer} from 'redux-form';
import AppReducer from './layout/AppReducer';
import LoginReducer from './login/LoginReducer';
import MainPanelReducer from './main/MainPanelReducer';
import AuthoritySettingReducer from './main/AuthoritySettingReducer';
import AdminUserSettingReducer from "./main/AdminUserSettingReducer";
import NewAdminModalReducer from "./modules/NewAdminModalReducer";

export default combineReducers({
    form: reduxFormReducer,
    AppReducer,
    LoginReducer,
    MainPanelReducer,
    AuthoritySettingReducer,
    AdminUserSettingReducer,
    NewAdminModalReducer
});
