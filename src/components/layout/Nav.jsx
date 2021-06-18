import React ,{Fragment,useEffect,useState}from 'react';
import {connect} from 'react-redux';
import {Avatar,Box,Collapse,Divider,Drawer,List,ListItem,ListItemIcon,ListItemText,Typography,withStyles }from '@material-ui/core';
import {Link} from 'react-router-dom'
import {NavAvatarSkeleton} from '../skeleton';
import {AppActionType} from '../../types';

const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  });
const user = {
    avatar: 'https://material-kit-react.devias.io/static/images/avatars/avatar_6.png',
    jobTitle: 'Senior Developer',
    name: 'Katarina Smith'
};
function Nav (props) {

    const [menuArray,setMenuArray] = useState([]);
    const {appReducer ,classes,setShowDrawerFlag,logout} = props; 
    useEffect(()=>{
        setMenuArray(props.appReducer.currentUserMenu);

    },[appReducer.currentUserMenu])

    const menuFold =(index)=>(event)=>{
        var arrayTemp = menuArray.concat();
        arrayTemp[index].foldFlag = !arrayTemp[index].foldFlag;
        setMenuArray(arrayTemp)
    }
    const menuItemClick=(url)=>{
        toggleDrawer(false);
    }
    const toggleDrawer = (f) => (event) => {
        setShowDrawerFlag(f);
    };
    return (
        <>
            <Drawer anchor="left" open={appReducer.showDrawerFlag} onClose={toggleDrawer(false)}>
                <div style={{width: 250}} role="presentation"   >
                <Box style={{padding:16,
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor:"#3f51b5"
                        }} >
                    {appReducer.currentUser.realname?(<><Avatar sx={{
                        cursor: 'pointer',
                        width: 64,
                        height: 64
                    }}>{appReducer.currentUser.realname&&appReducer.currentUser.realname.slice(0,1)}</Avatar>
                    <Typography style={{color:"#fff"}} variant="h6" >
                        {appReducer.currentUser.realname}
                    </Typography>
                    <Typography style={{color:"#fff"}} variant="body2" >
                    {appReducer.currentUser.phone}
                    </Typography></>)
                    :(
                        NavAvatarSkeleton()
                      )}
                    
                </Box>
                <Divider />
                <List component="nav" className={classes.root}>
                    {menuArray.map((item,index)=>{
                        return(
                            <Fragment key={index}>
                                {item.children.length === 0 && 
                                        <Link style={{color:"inherit",textDecorationLine:"unset"}} to={item.link}>
                                            <ListItem button onClick={toggleDrawer(false)}>                            
                                                <ListItemIcon>                                        
                                                <i className={`mdi ${item.icon} mdi-24px`} />
                                                </ListItemIcon>
                                                <ListItemText primary={item.label}/>
                                            </ListItem>
                                        </Link>
                                        
                                    }
                                {item.children.length > 0 &&
                                    <Fragment>
                                    <ListItem button   onClick={menuFold(index)}>
                                        <ListItemIcon>
                                        <i className={`mdi ${item.icon} mdi-24px`} />
                                        </ListItemIcon>
                                        <ListItemText primary={item.label} />
                                        {menuArray[index].foldFlag ? <i className="mdi mdi-chevron-down mdi-24px" />: <i className="mdi mdi-chevron-right mdi-24px" />}
                                    </ListItem>
                                    <Collapse in={menuArray[index].foldFlag} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                        {item.children.map(function (subItem,subIndex) {
                                            return (
                                                <Link key={index+"-"+subIndex} style={{color:"inherit",textDecorationLine:"unset"}} to={subItem.link}>
                                                    <ListItem  button  className={classes.nested} onClick={toggleDrawer(false)}>
                                                        <ListItemIcon>
                                                        <i className={`mdi ${subItem.icon} mdi-24px`} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={subItem.name} />
                                                    </ListItem>
                                                </Link>
                                            )
                                        })}
                                        </List>
                                    </Collapse>
                                    </Fragment>
                                }
                            </Fragment>
                        )
                    })}
                    
                    </List>
                    <Divider />
                </div>
            </Drawer>
        </>
        
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
    logout:()=>{
        dispatch(AppActionType.logout());
    }
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Nav))