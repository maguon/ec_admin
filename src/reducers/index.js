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
import OrderReducer from './main/OrderReducer';
import OrderDetailReducer from './main/OrderDetailReducer';
import OrderRefundReducer from './main/OrderRefundReducer';
import OrderRefundDetailReducer from './main/OrderRefundDetailReducer';
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
import UpLoadFileReducer from './main/UpLoadFileReducer';
import FinancePanelReducer from './main/FinancePanelReducer';
import PurchasePanelReducer from './main/PurchasePanelReducer';
import ClientAgentReducer from './main/ClientAgentReducer';
import PurchaseStatReducer from './main/PurchaseStatReducer';
import CreateClientAgentModelReducer from './main/model/CreateClientAgentModelReducer';
import ClientAgentDetailReducer from  './main/ClientAgentDetailReducer';
import ClientInformationReducer from './main/ClientInformationReducer';
import ClientInformationDetailReducer from './main/ClientInformationDetailReducer';
import OrderStatReducer from './main/OrderStatReducer';
import ClientStatReducer from './main/ClientStatReducer';
import OrderPanelReducer from "./main/OrderPanelReducer";
import AchievementReducer from './main/AchievementReducer';
import OrderPayReducer from './main/OrderPayReducer';
import CollectionRefundDetailReducer from './main/CollectionRefundDetailReducer';
import CollectionRefundReducer from './main/CollectionRefundReducer';
import OrderRefundPayReducer from './main/OrderRefundPayReducer';
import UserAchievementReducer from './main/UserAchievementReducer';
import UserAchievementDetailReducer from './main/UserAchievementDetailReducer';
import CarModelReducer from './main/CarModelReducer';
import UserPerfLevelReducer from './main/UserPerfLevelReducer';
import ServiceItemStatReducer from './main/ServiceItemStatReducer';
import CreateClientInformationReducer from './main/model/CreateClientInformationReducer';
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
    OrderReducer,
    OrderRefundReducer,
    OrderRefundDetailReducer,
    OrderDetailReducer,
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
    ServiceSettingReducer,
    UpLoadFileReducer,
    FinancePanelReducer,
    PurchasePanelReducer,
    ClientAgentReducer,
    PurchaseStatReducer,
    CreateClientAgentModelReducer,
    ClientAgentDetailReducer,
    ClientInformationReducer,
    ClientInformationDetailReducer,
    OrderStatReducer,
    ClientStatReducer,
    OrderPanelReducer,
    AchievementReducer,
    OrderPayReducer,
    CollectionRefundDetailReducer,
    CollectionRefundReducer,
    OrderRefundPayReducer,
    UserAchievementReducer,
    UserAchievementDetailReducer,
    CarModelReducer,
    UserPerfLevelReducer,
    ServiceItemStatReducer,
    CreateClientInformationReducer
});
