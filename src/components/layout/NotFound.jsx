import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useLocation} from 'react-router-dom'
import {makeStyles, Typography} from '@material-ui/core';

const appAction = require('../../actions/layout/AppAction');
const useStyles = makeStyles((theme) => ({
    welcome: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 22,
        color: '#80c2ff',
    }
}));

// 欢迎页面
function NotFound(props) {
    const {appReducer} = props;
    const classes = useStyles();
    let location = useLocation();

    const [path, setPath] = React.useState('');

    useEffect(() => {
        console.log('location.pathname',location.pathname);
        let index = location.pathname.indexOf('/',1);
        if (index > 0) {
            setPath(location.pathname.substr(0,index));
        } else {
            setPath(location.pathname);
        }

console.log('',path);
    }, [location]);

    return (
        <div className={classes.root}>
            {(appReducer.currentUserMenu.menuList.length > 0 && !appReducer.currentUserMenu.linkMenu.get(path) && path != '/') &&
            <Typography gutterBottom className={classes.welcome}>
                <img style={{paddingTop: 6}} src="/404.png" alt=""/>
            </Typography>}
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

export default connect(mapStateToProps, mapDispatchToProps)(NotFound)