import React, {Fragment, useEffect} from 'react';
import {connect} from 'react-redux';
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import cnLocale from "date-fns/locale/zh-CN";
// 引入布局组件
import {Footer, Header, LoadProgree, MainPanel, Navigation, NotFound} from './components';
import './App.css';
import {AppActionType} from "../src/types";

// 路由
const routes = require('../src/router/index');
// 抽屉宽度
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
    contentHeader: {
        display: 'flex',
        marginTop: 40,
        marginBottom: 20,
    }
}));

function App(props) {
    const {appReducer, setAllPath} = props;
    const classes = useStyles();
    const [drawerOpen, setOpen] = React.useState(false);

    useEffect(() => {
        // 将所有路由的link（即：有效路径）保存到map中
        let allPath = new Map();
        routes.routesWithHeader.forEach((item) => {
            allPath.set(item.path,'');
        });
        setAllPath(allPath);
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Router hashType={"hashbang"}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={cnLocale}>
            <Switch>
                {/* login相关 */}
                {routes.routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.component}
                    />
                ))}
                {/* 主画面 */}
                <Fragment>
                    {/* 主页：头部 内容 */}
                    <Header drawerOpen={drawerOpen} handleDrawerOpen={handleDrawerOpen} />
                    {/* 主页：导航 内容 */}
                    <Navigation drawerOpen={drawerOpen} handleDrawerClose={handleDrawerClose}/>
                    {/* 主页：主体 内容 */}
                    <main className={clsx(classes.content, {[classes.contentShift]: drawerOpen})}>
                        {/* css：避开 toolsBar 部分 */}
                        <div className={classes.contentHeader}/>
                        {/* 路由主体：迁移到各 组件 */}
                        {routes.routesWithHeader.map((route, index) => (
                            <>
                                {appReducer.currentUserMenu.menuList.length > 0 &&
                                appReducer.currentUserMenu.linkMenu.get(route.path.substr(0,route.path.lastIndexOf('/') > 0 ? route.path.lastIndexOf('/') : route.path.length)) &&
                                <Route
                                    key={index + 10}
                                    path={route.path}
                                    exact
                                    component={route.component}
                                />}
                            </>
                        ))}
                        <Route path="/" exact component={MainPanel}/>
                        <Route component={NotFound}/>
                    </main>
                    {/* 主页：底部 内容 */}
                    <Footer/>
                </Fragment>
            </Switch>
            </MuiPickersUtilsProvider>
            {/* 加载中... */}
            <LoadProgree/>
        </Router>
    )
}

const mapStateToProps = (state) => {
    return {
        appReducer: state.AppReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    setAllPath: (allPath) => {
        dispatch(AppActionType.setAllPath(allPath));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
