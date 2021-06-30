import {combineReducers} from 'redux'
import {reducer as reduxFormReducer} from 'redux-form';
import AppReducer from './layout/AppReducer';
import CommonReducer from './layout/CommonReducer';
import LoginReducer from './login/LoginReducer';
import MainPanelReducer from './main/MainPanelReducer';
import CategoryManagerReducer from './main/CategoryManagerReducer';
import BrandManagerReducer from './main/BrandManagerReducer';
import StorageReducer from './main/StorageReducer';
import ProductManagerReducer from './main/ProductManagerReducer';
import ProductManagerDetailReducer from './main/ProductManagerDetailReducer';
import AuthoritySettingReducer from './main/AuthoritySettingReducer';
import AdminUserSettingReducer from "./main/AdminUserSettingReducer";
import AppSettingReducer from "./main/AppSettingReducer";
import SupplierReducer from './main/SupplierReducer';
import SupplierDetailReducer from './main/SupplierDetailReducer';
import PurchaseReducer from './main/PurchaseReducer';
import DataDictionaryReducer from './main/DataDictionaryReducer'
export default combineReducers({
    form: reduxFormReducer,
    AppReducer,
    CommonReducer,
    LoginReducer,
    MainPanelReducer,
    CategoryManagerReducer,
    BrandManagerReducer,
    StorageReducer,
    ProductManagerReducer,
    ProductManagerDetailReducer,
    AuthoritySettingReducer,
    AdminUserSettingReducer,
    AppSettingReducer,
    SupplierReducer,
    SupplierDetailReducer,
    PurchaseReducer,
    DataDictionaryReducer
});
