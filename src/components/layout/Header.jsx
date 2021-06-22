import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import clsx from "clsx";
// 引入material-ui基础组件
import {
    makeStyles,
    AppBar,
    Menu,
    MenuItem,
    Badge,
    Toolbar,
    IconButton,
    Typography,
} from "@material-ui/core";
import {AppActionType} from "../../types";
import {AccountModal} from "../index";
import {webName} from "../../config";

const appAction = require('../../actions/layout/AppAction');
const httpHeaders = require('../../utils/HttpHeaders');
const localUtil = require('../../utils/LocalUtils');
const sysConst = require('../../utils/SysConst');

// 抽屉宽度
const drawerWidth = 240;
// 组件样式
const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    appBar: {
        background: theme.background,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    grow: {
        flexGrow: 1,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));


/**
 * UI组件：主画面头部。
 */
function Header(props) {
    // 组件属性
    const {logout, setAccountModalOpenFlag, drawerOpen, handleDrawerOpen} = props;

    useEffect(() => {
        const userId = localUtil.getSessionItem(sysConst.LOGIN_USER_ID);
        const userType = localUtil.getSessionItem(sysConst.LOGIN_USER_TYPE);
        const token = localUtil.getSessionItem(sysConst.AUTH_TOKEN);

        httpHeaders.set(sysConst.LOGIN_USER_ID, userId);
        httpHeaders.set(sysConst.LOGIN_USER_TYPE, userType);
        httpHeaders.set(sysConst.AUTH_TOKEN, token);

        if (userId == null || userType == null || token == null) {
            window.location.href = '#!/login';
        } else {
            props.getLoginInfo(userId);
        }
    }, []);

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = (event) => {
        setMobileMoreAnchorEl(null);
    };

    // 锚点
    const mobileMenuId = 'primary-menu-mobile';
    // 手机模式时，显示的菜单
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={Boolean(mobileMoreAnchorEl)}
            onClose={handleMobileMenuClose}
        >
            {/* 用户信息 */}
            <MenuItem onClick={logout}>
                <IconButton color="inherit">
                    <i className="mdi mdi-account-circle mdi-36px"/>
                </IconButton>
                <p>Profile</p>
            </MenuItem>

            {/* 退出 */}
            <MenuItem onClick={logout}>
                <IconButton color="inherit">
                    <i className="mdi mdi-exit-to-app mdi-36px"/>
                </IconButton>
                <p>Logout</p>
            </MenuItem>
        </Menu>
    );

    const classes = useStyles();

    return (
        <div className={classes.grow}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: drawerOpen,
                })}
            >
                <Toolbar>
                    {/* 菜单按钮 */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, drawerOpen && classes.hide)}
                    >
                        <i className="mdi mdi-menu mdi-36px"/>
                    </IconButton>

                    {/* 项目标记 */}
                    <Typography variant="h6" noWrap><img style={{width: 36, paddingTop: 6}} src="/logo_reverse120.png"
                                                         alt=""/></Typography>
                    <Typography className={classes.title} variant="h6" noWrap>{webName}</Typography>

                    {/* 空白 */}
                    <div className={classes.grow}/>

                    {/* 桌面模式，菜单 */}
                    <div className={classes.sectionDesktop}>
                        <IconButton color="inherit" component="span">
                            <Badge badgeContent={4} color="secondary">
                                <i className="mdi mdi-clipboard-list mdi-36px"/>
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit" component="span" onClick={() => {
                            setAccountModalOpenFlag(true)
                        }}>
                            <i className="mdi mdi-account-circle mdi-36px"/>
                        </IconButton>
                        <IconButton color="inherit" component="span" onClick={logout}>
                            <i className="mdi mdi-exit-to-app mdi-36px"/>
                        </IconButton>
                    </div>

                    {/* 手机模式，菜单 */}
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <i className="mdi mdi-dots-vertical mdi-36px"/>
                        </IconButton>
                    </div>

                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            <AccountModal/>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => ({
    // 取得登录用户基本信息
    getLoginInfo: (userId) => {
        console.log('userId', userId);
        dispatch(appAction.getCurrentUser({userId: userId}));
        dispatch(appAction.getCurrentUserMenu());
    },
    setAccountModalOpenFlag: (f) => {
        dispatch(AppActionType.setAccountModalOpen(f))
    },
    // 退出
    logout: () => {
        dispatch(appAction.logout());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
