import React,{ Fragment } from 'react';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import {HashRouter as Router, Route, Switch,Redirect} from "react-router-dom";
import {AppBar,Typography,Container,Box,CssBaseline,Toolbar,useScrollTrigger} from '@material-ui/core';
import PropTypes from 'prop-types';
import {applyMiddleware, createStore, compose} from 'redux';
import './App.css';
import {
    Login,
    Register,
    ResetPassword,
    Header,
    Footer,
    Nav,
    MainPanel,
    AuthoritySetting,
    ErrorPanel,
    LoadProgree,
    AccountModal,
    AdminUserSetting,
} from './components';
import reducers from './reducers'

const store = compose(
    applyMiddleware(ReduxThunk)
)(createStore)(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const routes = [
  // 登录画面
  {
      path: "/login",
      exact: true,
      component: Login
  },
  {
    path: "/register",
    exact: true,
    component: Register
  },
  {
      path: "/reset",
      exact: true,
      component: ResetPassword
  }
];
const routesWithHeader = [
    {path: "/", exact: true,component: MainPanel},
    // 权限管理
    {path: "/authority_setting", exact: true, component: AuthoritySetting},
    //员工管理
    {path: "/admin_user_setting", exact: true, component: AdminUserSetting},
];

function App(props) {
  return (
    <Provider store={store}>
        <Router hashType={"hashbang"}>
              <Switch>
              {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.component}
                    />
                ))}
                <Fragment>
                    <Header/>
                    <Toolbar/>
                    <div className="main-body">
                    <Fragment>
                      <Nav/>
                      <AccountModal/>
                      {routesWithHeader.map((route, index) => (
                          <Route
                              key={index+10}
                              path={route.path}
                              exact={route.exact}
                              component={route.component}
                          />
                      ))}
                    </Fragment>
                    </div>
                    <Footer/>
                </Fragment>
              </Switch>
              <LoadProgree/>
        </Router>
    </Provider>
  )
};
export default App;
