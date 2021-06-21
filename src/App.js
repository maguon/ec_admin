import React, {Fragment} from 'react';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import clsx from 'clsx';
import {makeStyles,useTheme} from '@material-ui/core';
import {applyMiddleware, createStore, compose} from 'redux';
import reducers from './reducers'
// 引入布局组件
import {Header,Navigation,Footer,LoadProgree} from './components';

const store = compose(
    applyMiddleware(ReduxThunk)
)(createStore)(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
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
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        marginBottom: 20,
        justifyContent: 'flex-end',
    }
}));

function App(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [drawerOpen, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Provider store={store}>
            <Router hashType={"hashbang"}>
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
                                <Route
                                    key={index + 10}
                                    path={route.path}
                                    exact={route.exact}
                                    component={route.component}
                                />
                            ))}
                        </main>
                        {/* 主页：底部 内容 */}
                        <Footer/>
                    </Fragment>
                </Switch>
                {/* 加载中... */}
                <LoadProgree/>
            </Router>
        </Provider>
    )
}

export default App;
