import {combineReducers} from 'redux'
import {reducer as reduxFormReducer} from 'redux-form';
import AppReducer from './layout/AppReducer';
import CommonReducer from './layout/CommonReducer';
import LoginReducer from './login/LoginReducer';
import MainPanelReducer from './main/MainPanelReducer';
import CategoryManagerReducer from './main/CategoryManagerReducer';
import BrandManagerReducer from './main/BrandManagerReducer';
import ProductManagerReducer from './main/ProductManagerReducer';
import AuthoritySettingReducer from './main/AuthoritySettingReducer';
import AdminUserSettingReducer from "./main/AdminUserSettingReducer";
import AppSettingReducer from "./main/AppSettingReducer";
import SupplierManagerReducer from './main/SupplierManagerReducer';
import SupplierManagerDetailReducer from './main/SupplierManagerDetailReducer'
export default combineReducers({
    form: reduxFormReducer,
    AppReducer,
    CommonReducer,
    LoginReducer,
    MainPanelReducer,
    CategoryManagerReducer,
    BrandManagerReducer,
    ProductManagerReducer,
    AuthoritySettingReducer,
    AdminUserSettingReducer,
    AppSettingReducer,
    SupplierManagerReducer,
    SupplierManagerDetailReducer
});
