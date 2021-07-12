import {combineReducers} from 'redux'
import {reducer as reduxFormReducer} from 'redux-form';
import AppReducer from './layout/AppReducer';
import CommonReducer from './layout/CommonReducer';
import LoginReducer from './login/LoginReducer';
import MainPanelReducer from './main/MainPanelReducer';
import StoragePanelReducer from './main/StoragePanelReducer';
import CategoryManagerReducer from './main/CategoryManagerReducer';
import BrandManagerReducer from './main/BrandManagerReducer';
import StorageReducer from './main/StorageReducer';
import ProductManagerReducer from './main/ProductManagerReducer';
import ProductManagerDetailReducer from './main/ProductManagerDetailReducer';
import PurchasePayReducer from './main/PurchasePayReducer';
import PurchaseRefundPayReducer from './main/PurchaseRefundPayReducer';
import StorageProductReducer from './main/StorageProductReducer';
import StorageInOutReducer from './main/StorageInOutReducer';
import StorageCheckReducer from './main/StorageCheckReducer';
import StorageCheckDetailReducer from './main/StorageCheckDetailReducer';
import AuthoritySettingReducer from './main/AuthoritySettingReducer';
import AdminUserSettingReducer from "./main/AdminUserSettingReducer";
import AppSettingReducer from "./main/AppSettingReducer";
import SupplierReducer from './main/SupplierReducer';
import SupplierDetailReducer from './main/SupplierDetailReducer';
import PurchaseReducer from './main/PurchaseReducer';
import PurchaseDetailReducer from './main/PurchaseDetailReducer';
import DataDictionaryReducer from './main/DataDictionaryReducer';
import PurchaseRefundReducer from './main/PurchaseRefundReducer';
import ServiceSettingReducer from  './main/ServiceSettingReducer';
export default combineReducers({
    form: reduxFormReducer,
    AppReducer,
    CommonReducer,
    LoginReducer,
    MainPanelReducer,
    StoragePanelReducer,
    CategoryManagerReducer,
    BrandManagerReducer,
    StorageReducer,
    ProductManagerReducer,
    ProductManagerDetailReducer,
    PurchasePayReducer,
    PurchaseRefundPayReducer,
    StorageProductReducer,
    StorageInOutReducer,
    StorageCheckReducer,
    StorageCheckDetailReducer,
    AuthoritySettingReducer,
    AdminUserSettingReducer,
    AppSettingReducer,
    SupplierReducer,
    SupplierDetailReducer,
    PurchaseReducer,
    PurchaseDetailReducer,
    DataDictionaryReducer,
    PurchaseRefundReducer,
    ServiceSettingReducer
});
