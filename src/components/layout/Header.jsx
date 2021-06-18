import React,{useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {AppBar,Badge,IconButton,Toolbar,Typography,useScrollTrigger} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {AppActionType} from '../../types';
import * as localUtil from'../../utils/LocalUtils';
import { getCurrentUser,getCurrentUserMenu,logout } from '../../actions/layout/AppAction';
import { setAccountModalOpen } from '../../types/layout/AppActionType';
import {webName} from "../../config";
const httpHeaders = require('../../utils/HttpHeaders');
const sysConst = require('../../utils/SysConst');

const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
      paddingLeft:16
    }
  }));
  
function Header (props) {
    const {appReducer ,setShowDrawerFlag,logout,setShowLoadProgressFlag,setAccountModalOpenFlag} = props; 
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    useEffect(()=>{
        const userId = localUtil.getSessionItem(sysConst.LOGIN_USER_ID);
        const userType = localUtil.getSessionItem(sysConst.LOGIN_USER_TYPE);
        const token = localUtil.getSessionItem(sysConst.AUTH_TOKEN);

        httpHeaders.set(sysConst.LOGIN_USER_ID, userId);
        httpHeaders.set(sysConst.LOGIN_USER_TYPE, userType);
        httpHeaders.set(sysConst.AUTH_TOKEN, token);
        if (userId == null || userType == null || token == null) {
            window.location.href = '#!/login';
        } else {
            props.getCurrentUser(userId);
            props.getCurrentUserMenu();
        }
    },[])

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
      };
    const toggleDrawer = (f) => (event) => {
        setShowDrawerFlag(f);
    };
    const openAccountModal =(f)=>(event)=>{
        console.log(f)
        setAccountModalOpenFlag(f)
    }

    return (
        <div className={classes.grow}>
            
            <AppBar >
                <Toolbar>
                <IconButton color="inherit"   component="span" onClick={toggleDrawer(true)}>
                    <i className="mdi mdi-menu mdi-36px" />
                </IconButton>
                <div >                        
                    <Typography  variant="h6" noWrap>
                        <img   style={{width:36,paddingTop:6}} src="/logo_reverse120.png" alt=""/>
                    </Typography>
                </div>

                <div>
                    <Typography className={classes.title} variant="h6" noWrap>
                        {webName}
                    </Typography>
                </div>
                <div className={classes.grow} />
                <div>
                    <IconButton color="inherit"  component="span">
                        <Badge badgeContent={4} color="secondary">
                            <i className="mdi mdi-clipboard-list mdi-36px" />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit"  component="span" onClick={()=>{setAccountModalOpenFlag(true)}}>
                        <i className="mdi mdi-account-circle mdi-36px" />
                    </IconButton>
                    <IconButton color="inherit"  component="span" onClick={logout}>
                        <i className="mdi mdi-exit-to-app mdi-36px" />
                    </IconButton>
                </div>                
                </Toolbar>
            </AppBar>
            
        </div>
            
    )
    
}

const mapStateToProps = (state) => {
    return {
        appReducer : state.AppReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    setShowDrawerFlag :(f) => {
        dispatch(AppActionType.showDrawer(f))
    },
    setShowLoadProgressFlag :(f) => {
        dispatch(AppActionType.showLoadProgress(f))
    },
    setAccountModalOpenFlag :(f) => {
        dispatch(AppActionType.setAccountModalOpen(f))
    },
    logout:()=>{
        dispatch(logout());
    },
    getCurrentUser:(userId)=>{
        dispatch(getCurrentUser({userId}))
    },
    getCurrentUserMenu:()=>{
        dispatch(getCurrentUserMenu())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header)