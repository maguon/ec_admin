import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from "react-router-dom";
// 文件服务器地址
import {apiHost} from '../../config';
// 引入嵌套列表组件
import {NestedList} from '../index';
// 引入material-ui基础组件
import {
    Drawer,
    Grid,
    Avatar,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles
} from "@material-ui/core";

// 抽屉宽度
const drawerWidth = 240;
// 组件样式
const useStyles = makeStyles((theme) => ({
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
}));

function Navigation(props) {
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
                    <i className={`mdi mdi-chevron-left mdi-24px`}/>
                </IconButton>
            </div>
            {/* 分割线 */}
            <Divider style={{marginTop: 20}}/>

            {/* 抽屉下部分：导航列表 */}
            <List className={classes.menuList}>
                {commonReducer.loginUserMenuList.map(function (item) {
                    return (
                        <div>
                            {/* 不含子菜单：直接使用ListItem */}
                            {item.children.length === 0 &&
                            <NavLink exact to={item.link} style={{textDecoration: 'none'}}>
                                <ListItem button key={item.link} onClick={handleDrawerClose}>
                                    <ListItemIcon><i className={`mdi ${item.icon} mdi-24px`}/></ListItemIcon>
                                    <ListItemText primary={item.label} disableTypography={true}
                                                  className={classes.menuText}/>
                                </ListItem>
                            </NavLink>}

                            {/* 含子菜单：使用嵌套列表组件 */}
                            {item.children.length > 0 &&
                            <NestedList handleDrawerClose={handleDrawerClose} item={item}/>}
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

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
