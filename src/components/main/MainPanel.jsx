import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import {makeStyles, Typography} from '@material-ui/core';

const appAction = require('../../actions/layout/AppAction');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');
const useStyles = makeStyles((theme) => ({
    welcome: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 22,
        color: '#80c2ff',
    }
}));

// 欢迎页面
function MainPanel(props) {
    const {appReducer} = props;
    const classes = useStyles();
    const [link, setLink] = React.useState('');

    // 根据登录用户 取得菜单列表
    useEffect(() => {
        const userId = localUtil.getSessionItem(sysConst.LOGIN_USER_ID);
        const userType = localUtil.getSessionItem(sysConst.LOGIN_USER_TYPE);
        const token = localUtil.getSessionItem(sysConst.AUTH_TOKEN);
        if (userId == null || userType == null || token == null) {
            window.location.href = '#!/login';
        } else {
            props.getCurrentUserMenu(userId);
        }
    }, []);

    // 存在菜单时，隔2秒，自动跳转到  菜单第一个link
    useEffect(() => {
        if (appReducer.currentUserMenu.length > 0) {
            setTimeout(() => {
                setLink(appReducer.currentUserMenu[0].link);
            }, 2000);
        }
    }, [appReducer.currentUserMenu.length]);

    return (
        <div className={classes.root}>
            <Typography gutterBottom className={classes.welcome}>欢迎登录</Typography>
            <Redirect to={link}/>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        appReducer: state.AppReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得登录用户 菜单
    getCurrentUserMenu: () => {
        dispatch(appAction.getCurrentUserMenu());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPanel)