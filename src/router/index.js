import {
    Login, Register, ResetPassword,
    MainPanel, CategoryManager,SupplierManager,
    AdminUserSetting, AppSetting, AuthoritySetting
} from "../components";

export const routes = [
    // 登录画面
    {path: "/login", exact: true, component: Login},
    {path: "/register", exact: true, component: Register},
    {path: "/reset", exact: true, component: ResetPassword}
];

export const routesWithHeader = [
    // 默认打开画面 - 暂定综合页面
    {path: "/", exact: true, component: MainPanel},
    // 统计
    // {path: "/user_statistic", exact: true, component: DemoStatistic},

    // 商品分类
    {path: "/category_manager", exact: true, component: CategoryManager},

    //供应商
    {path: "/supplier_manager", exact: true, component: SupplierManager},


    //员工管理
    {path: "/admin_user_setting", exact: true, component: AdminUserSetting},
    // App系统
    {path: "/app_setting", exact: true, component: AppSetting},


    // 权限管理
    {path: "/authority_setting", exact: true, component: AuthoritySetting}
];