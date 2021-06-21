import React from 'react';
import {connect} from 'react-redux';
import {HashRouter as Router, Route, NavLink} from "react-router-dom";
import clsx from 'clsx';
// 文件服务器地址
import {apiHost} from '../../config';
import {CommonActionType} from '../../types';
// 引入嵌套列表组件
import {NestedList} from '../index';
// 引入material-ui基础组件
import {
    CssBaseline,
    withStyles,
    Drawer,
    Grid,
    Avatar,
    Typography,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Icon,
    ListItemText, makeStyles
} from "@material-ui/core";

// 路由使用，迁移 组件
import {
    // 综合页面
    MainPanel,
    // 学校信息
    // MidSchool,
    HighSchool,



    // // 统计
    // UserStatistic,
    // // Faker文章管理
    // HighSchoolQuota,
    // HighSchoolQuotaDetail,
    // // 用户管理
    // UserManager,
    // // 权限设置
    // AuthoritySetting
} from '../index';

const sysConst = require('../../utils/SysConst');
// 自定义主题（全局用样式）
const customTheme = require('./Theme').customTheme;
// 抽屉宽度
const drawerWidth = 240;
// 组件样式
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        background: theme.background,
    },
    // 抽屉
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1)
    },
    // 用户头像
    avatar: {
        width: 128,
        height: 128,
    },
    // 菜单部分 有滚动条
    menuList: {
        width: drawerWidth - 1,
        maxHeight: `calc(100% - 240px)`,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
    },
    // 菜单默认字体
    menuText: {
        color: "black",
    },
    // 主体内容部分
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    contentHeader: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ff0000',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    // 特殊设定
    marginTop20: {
        marginTop: 20,
    },
}));

function Navigation (props) {
    const classes = useStyles();
    const {commonReducer, handleDrawerClose, drawerOpen} = props;

    console.log('commonReducer', commonReducer);
    // 取得头像，若不存在，则使用默认头像 TODO 后期修改
    let avatarUrl;
    if (commonReducer.loginUserInfo && commonReducer.loginUserInfo.avatar_image) {
        avatarUrl = "http://" + apiHost + "/api/image/" + commonReducer.loginUserInfo.avatar_image;
    } else {
        avatarUrl = "/assets/images/avatar.png"
    }

    return (
    <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{paper: classes.drawerPaper}}
    >
        {/* 抽屉上部分：用户信息 */}
        <div className={classes.drawerHeader}>
            <Grid container spacing={3}>
                <Grid item xs={12}><Avatar src={avatarUrl} className={classes.avatar}/></Grid>
                <Grid item xs={12}>Name: {commonReducer.loginUserInfo.realname}</Grid>
                <Grid item xs={12}>Phone: {commonReducer.loginUserInfo.phone}</Grid>
            </Grid>

            <IconButton onClick={handleDrawerClose}>
                <i className={`mdi mdi-chevron-left mdi-24px`} />
            </IconButton>
        </div>
        {/* 分割线 */}
        <Divider className={classes.marginTop20}/>

        {/* 抽屉下部分：导航列表 */}
        <List className={classes.menuList}>
            {commonReducer.loginUserMenuList.map(function (item) {
                return (
                    <div >
                        {/* 不含子菜单：直接使用ListItem */}
                        {item.children.length === 0 &&
                        <NavLink exact to={item.link} style={{textDecoration: 'none'}}>
                            <ListItem button key={item.link} onClick={handleDrawerClose}>
                                <ListItemIcon><i className={`mdi ${item.icon} mdi-24px`} /></ListItemIcon>
                                <ListItemText primary={item.label} disableTypography={true} className={classes.menuText}/>
                            </ListItem>
                        </NavLink>}

                        {/* 含子菜单：使用嵌套列表组件 */}
                        {item.children.length > 0 && <NestedList handleDrawerClose={handleDrawerClose} item={item}/>}
                        <Divider/>
                    </div>
                )
            })}
        </List>
    </Drawer>
    )
}

const mapStateToProps = (state) => {
    return {
        commonReducer: state.CommonReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    setDrawerOpen: (value) => {
        // 设置抽屉打开状态
        dispatch(CommonActionType.setDrawerOpen(value))
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
