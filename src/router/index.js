import {
    Login, Register, ResetPassword,
    MainPanel, CategoryManager, BrandManager, Storage, StorageProduct, ProductManager, ProductManagerDetail, Supplier, SupplierDetail, Purchase,
    AdminUserSetting, AppSetting, AuthoritySetting, DataDictionary
} from "../components";

export const routes = [
    // 登录画面
    {path: "/login", exact: true, component: Login},
    {path: "/register", exact: true, component: Register},
    {path: "/reset", exact: true, component: ResetPassword}
];

export const routesWithHeader = [
    /** 综合页面 */
    {path: "/", exact: true, component: MainPanel},

    /** 采购管理 */
    //采购
    {path: "/purchase", exact: true, component: Purchase},
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
    // 仓库设置
    {path: "/storage", exact: true, component: Storage},
    // 库存商品
    {path: "/storage_product", exact: true, component: StorageProduct},

    /** 数据字典 */
    {path: "/data_dictionary", exact: true, component: DataDictionary},

    /** 系统设置 */
    //员工管理
    {path: "/admin_user_setting", exact: true, component: AdminUserSetting},
    // App系统
    {path: "/app_setting", exact: true, component: AppSetting},
    // 权限管理
    {path: "/authority_setting", exact: true, component: AuthoritySetting}
];