import React ,{Fragment,useEffect,useState}from 'react';
import {AppBar,Dialog,Badge,Button,Fade,IconButton,Modal,Toolbar,Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import { makeStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        backgroundColor:"#3f51b5",
        color:"#FFF",
        minWidth:400
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes,  ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
      </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => {console.log(theme);return{
    root: {
        padding: theme.spacing(2),
    }
}})(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    }
}))(MuiDialogActions);

export default function SimpleModal (props){
    const [open, setOpen] = React.useState(false);
    const { title, children, footer, ...other } = props;
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog onClose={props.onClose} aria-labelledby="customized-dialog-title" open={props.open}>
            <DialogTitle id="customized-dialog-title">
                {props.title}
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            {props.showFooter&&(
                <DialogActions>
                {props.footer}
                </DialogActions>
            )}
            
        </Dialog>
    )
}

