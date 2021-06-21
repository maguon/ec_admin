import {AuthoritySetting, Login, MainPanel, Register, ResetPassword} from "../components";

export const routes = [
    // 登录画面
    {path: "/login", exact: true, component: Login},
    {path: "/register", exact: true, component: Register},
    {path: "/reset", exact: true, component: ResetPassword}
];

export const routesWithHeader = [
    // 默认打开画面 - 暂定综合页面
    {path: "/", exact: true, component: MainPanel},
    // // 统计
    // {path: "/user_statistic", exact: true, component: UserStatistic},
    //
    // 权限管理
    {path: "/authority_setting", exact: true, component: AuthoritySetting}
];