import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useLocation} from 'react-router-dom'
import {makeStyles, Typography} from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    pic: {
        textAlign: 'center',
        marginTop: 150
    }
}));

// 欢迎页面
function NotFound(props) {
    // const {appReducer} = props;
    const classes = useStyles();
    // let location = useLocation();
    // const [invalid, setInvalid] = React.useState(false);

    // useEffect(() => {
    //     // 默认路径 所有情况，均为 有效路径
    //     if (location.pathname === '/') {
    //         setInvalid(false);
    //     } else {
    //         // 如果此用户没有权限，则所有路径均为无效路径
    //         if (appReducer.currentUserMenu.menuList.length === 0) {
    //             setInvalid(true);
    //         } else {
    //             // 判断有没有二层路径
    //             let index = location.pathname.indexOf('/', 1);
    //             if (index > 0) {
    //                 let firstPath = location.pathname.substr(0, index);
    //                 // 有二层，先判断一层权限有没有
    //                 if (appReducer.currentUserMenu.linkMenu.get(firstPath)) {
    //                     // 有 第一层权限，继续判断第二层 有没有
    //                     setInvalid(!appReducer.allPath.has(firstPath + '/:id'));
    //                 } else {
    //                     // 没有 第一层权限
    //                     setInvalid(true);
    //                 }
    //             } else {
    //                 // 无二层
    //                 setInvalid(!appReducer.currentUserMenu.linkMenu.get(location.pathname));
    //             }
    //         }
    //     }
    // }, [location,appReducer.currentUserMenu.menuList.length]);

    return (
        <div className={classes.root}>
            <Typography gutterBottom className={classes.pic}>
                <img style={{paddingTop: 6}} src="/404.png" alt=""/>
            </Typography>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        appReducer: state.AppReducer
    }
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NotFound)