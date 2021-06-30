import React from "react";
import {NavLink} from "react-router-dom";
import {makeStyles, List, ListItem, ListItemIcon, ListItemText, Collapse} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    menuText: {
        color: "black"
    },
}));

export default function NestedList(props) {
    let {item, handleDrawerClose} = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <div>
            <ListItem button onClick={handleClick}>
                <ListItemIcon><i className={`mdi ${item.icon} mdi-24px`}/></ListItemIcon>
                <ListItemText primary={item.label} disableTypography={true} className={classes.menuText}/>
                {open ? <i className={`mdi mdi-chevron-down mdi-24px`}/> :
                    <i className={`mdi mdi-chevron-right mdi-24px`}/>}
            </ListItem>

            <Collapse timeout="auto" in={open} unmountOnExit>
                <List component="div" disablePadding>
                    {item.children.map(function (menu) {
                        return (
                            <NavLink exact to={menu.link} style={{textDecoration: 'none'}} key={'link-' + menu.link}>
                                <ListItem button className={classes.nested} onClick={handleDrawerClose} key={'second-' + menu.link}>
                                    <ListItemIcon><i className={`mdi ${menu.icon} mdi-24px`}/></ListItemIcon>
                                    <ListItemText primary={menu.name} disableTypography={true} className={classes.menuText}/>
                                </ListItem>
                            </NavLink>
                        )
                    })}
                </List>
            </Collapse>
        </div>
    );
}
