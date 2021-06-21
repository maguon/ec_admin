import React from 'react';
import {Box, Typography, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    footer: {
        position: 'fixed',
        width: '100%',
        height: 32,
        bottom: 0,
        zIndex: 10,
        background: '#6F6B83',
        paddingTop: 6,
        textAlign: 'right',
    },
    footerProject: {
        color: 'white',
        fontSize: 14,
        paddingRight: 10
    },
    footerVersion: {
        marginLeft: 20,
    }
}));

function Footer (props) {
    const classes = useStyles();
    return (
        <Box className={classes.footer}>
            <Typography gutterBottom><span className={classes.footerProject}>鸿溧科技<span className={classes.footerVersion}>进销存管理系统1.0版</span></span></Typography>
        </Box>
    )
}

export default Footer;