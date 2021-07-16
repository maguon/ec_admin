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
    drawer: {width: drawerWidth,flexShrink: 0},
    drawerPaper: {width: drawerWidth},
    // 用户头像
    avatar: {width: 48,height: 48},
    // 菜单部分 有滚动条
    menuList: {
        width: drawerWidth - 1,
        maxHeight: `calc(100% - 240px)`,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
    },
}));

function Navigation(props) {
    const classes = useStyles();
    const {appReducer, handleDrawerClose, drawerOpen} = props;

    // 取得头像，若不存在，则使用默认头像 TODO 后期修改
    let avatarUrl;
    if (appReducer.currentUser && appReducer.currentUser.avatar_image) {
        avatarUrl = "http://" + apiHost + "/api/image/" + appReducer.currentUser.avatar_image;
    } else {
        avatarUrl = "/assets/images/avatar.png"
    }

    return (
        <Drawer
            className={classes.drawer}
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerClose}
            classes={{paper: classes.drawerPaper}}
        >
            {/* 抽屉上部分：用户信息 */}
            <Grid container spacing={1}>
                <Grid item xs={12} style={{marginLeft: 96,marginTop: 20}}>
                    <Avatar src={avatarUrl} className={classes.avatar}/>
                </Grid>

                <Grid item xs={12} style={{textAlign: 'center',fontSize: 12}}>{appReducer.currentUser.type_name}</Grid>
                <Grid item xs={12} style={{textAlign: 'center',fontSize: 12}}>{appReducer.currentUser.real_name}</Grid>
                <Grid item xs={12} style={{textAlign: 'center',fontSize: 12}}>{appReducer.currentUser.phone}</Grid>
            </Grid>
            {/* 分割线 */}
            <Divider style={{marginTop: 20}}/>

            {/* 抽屉下部分：导航列表 */}
            <List className={classes.menuList}>
                {appReducer.currentUserMenu.map(function (item, index) {
                    return (
                        <div key={index}>
                            {/* 不含子菜单：直接使用ListItem */}
                            {item.children.length === 0 &&
                            <NavLink exact to={item.link} style={{textDecoration: 'none'}}>
                                <ListItem button key={item.link + index} onClick={handleDrawerClose}>
                                    <ListItemIcon><i className={`mdi ${item.icon} mdi-24px`}/></ListItemIcon>
                                    <ListItemText primary={item.label} disableTypography={true}
                                                  style={{color: 'black'}}/>
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
        appReducer: state.AppReducer
    }
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
