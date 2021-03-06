import {
    Login,
    Register,
    ResetPassword,
    StoragePanel,
    FinancePanel,
    CategoryManager,
    BrandManager,
    Storage,
    Order,
    OrderDetail,
    OrderRefund,
    OrderRefundDetail,
    StorageProduct,
    StorageInOut,
    StorageCheck,
    StorageCheckDetail,
    ProductManager,
    ProductManagerDetail,
    Supplier,
    SupplierDetail,
    Purchase,
    PurchaseDetail,
    PurchasePay,
    PurchaseRefundPay,
    AdminUserSetting,
    AppSetting,
    AuthoritySetting,
    DataDictionary,
    PurchaseRefund,
    ServiceSetting,
    UpLoadFile,
    PurchasePanel,
    ClientAgent,
    ClientAgentDetail,
    ClientInformation,
    ClientInformationDetail,
    PurchaseStat,
    OrderStat,
    ClientStat,
    OrderPanel,
    Achievement,
    OrderPay,
    CollectionRefund,
    CollectionRefundDetail,
    OrderRefundPay,
    UserAchievement,
    UserAchievementDetail,
    CarModel,
    UserPerfLevel,
    ServiceItemStat
} from "../components";

export const routes = [
    // 登录画面
    {path: "/login", exact: true, component: Login},
    {path: "/register", exact: true, component: Register},
    {path: "/reset", exact: true, component: ResetPassword}
];

export const routesWithHeader = [
    /** 综合页面 */
    {path: "/storage_panel", exact: true, component: StoragePanel},
    {path: "/purchase_panel", exact: true, component:PurchasePanel},
    {path: "/finance_panel", exact: true, component: FinancePanel},
    {path: "/order_panel", exact: true, component: OrderPanel},

    /** 订单管理 */
    // 订单信息
    {path: "/order", exact: true, component: Order},
    {path: "/order/:id", exact: true, component: OrderDetail},
    // 退单信息
    {path: "/order_refund", exact: true, component: OrderRefund},
    {path: "/order_refund/:id", exact: true, component: OrderRefundDetail},
    {path: "/achievement", exact: true, component: Achievement},
    {path: "/user_achievement", exact: true, component: UserAchievement},
    {path: "/user_achievement/:id?finDateStart=:finDateStart&finDateEnd=:finDateEnd", exact: true, component: UserAchievementDetail},
    /** 采购管理 */
    //采购
    {path: "/purchase", exact: true, component: Purchase},
    {path: "/purchase/:id", exact: true, component: PurchaseDetail},
    //退货
    {path: "/purchase_refund", exact: true, component: PurchaseRefund},
    // 商品分类
    {path: "/category_manager", exact: true, component: CategoryManager},
    // 品牌
    {path: "/brand_manager", exact: true, component: BrandManager},
    // 商品
    {path: "/product_manager", exact: true, component: ProductManager},
    {path: "/product_manager/:id", exact: true, component: ProductManagerDetail},
    //供应商
    {path: "/supplier", exact: true, component: Supplier},
    {path: "/supplier/:id",exact: true,component: SupplierDetail},

    /** 仓库管理 */
    // 库存商品
    {path: "/storage_product", exact: true, component: StorageProduct},
    // 出入库
    {path: "/storage_in_out", exact: true, component: StorageInOut},
    // 仓库盘点
    {path: "/storage_check", exact: true, component: StorageCheck},
    {path: "/storage_check/:id", exact: true, component: StorageCheckDetail},
    // 仓库设置
    {path: "/storage", exact: true, component: Storage},

    /** 财务管理 */
    // 采购付款
    {path: "/purchase_pay", exact: true, component: PurchasePay},
    // 采购退款
    {path: "/purchase_refund_pay", exact: true, component: PurchaseRefundPay},
    //订单付款
    {path: "/order_pay", exact: true, component: OrderPay},
    //订单退款
    {path: "/order_refund_pay", exact: true, component: OrderRefundPay},

    //收款付款
    {path: "/collection_refund", exact: true, component: CollectionRefund},
    //收款付款详情
    {path: "/collection_refund/:id", exact: true, component: CollectionRefundDetail},

    /** 客户服务 */
    {path: "/client_information", exact: true, component: ClientInformation},
    {path: "/client_information/:id", exact: true, component: ClientInformationDetail},
    {path: "/client_agent", exact: true, component: ClientAgent},
    {path: "/client_agent/:id", exact: true, component: ClientAgentDetail},

    /** 统计 */
    {path: "/purchase_stat", exact: true, component: PurchaseStat},
    {path: "/order_stat", exact: true, component: OrderStat},
    {path: "/client_stat", exact: true, component: ClientStat},
    {path: "/service_item_stat", exact: true, component: ServiceItemStat},
    /** 数据字典 */
    {path: "/data_dictionary", exact: true, component: DataDictionary},

    /** 系统设置 */
    //员工管理
    {path: "/admin_user_setting", exact: true, component: AdminUserSetting},
    // App系统
    {path: "/app_setting", exact: true, component: AppSetting},
    // 绩效设置
    {path: "/user_perf_level", exact: true, component: UserPerfLevel},
    // 权限设置
    {path: "/authority_setting", exact: true, component: AuthoritySetting},
    //服务项目设置
    {path: "/service_setting", exact: true, component: ServiceSetting},
    {path: "/upload", exact: true, component: UpLoadFile},
    //车型
    {path: "/car_model", exact: true, component: CarModel},
];