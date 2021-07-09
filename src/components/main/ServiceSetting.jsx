import React, {useEffect,useState}from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
import {
    Button, Divider, Grid, Typography, Paper, TextField, TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, IconButton, FormControl, InputLabel, Select, MenuItem, Box
} from "@material-ui/core";
import Fab from '@material-ui/core/Fab';
import {withStyles,makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {SimpleModal} from '../index';
import {PurchaseActionType, ServiceSettingActionType} from '../../types';
const ServiceSettingAction = require('../../actions/main/ServiceSettingAction');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    },
    select: {
        width: '100%',
    },
    selectCondition: {
        width: '100%',
    },
    button:{
        margin:'15px',
        float:'right'
    },
    divider:{
        margin:'20px 0'
    },
    addCategory:{
        marginTop:'8px'
    },
    pdfPage:customTheme.pdfPage,
    pdfTitle:customTheme.pdfTitle,
    tblHeader:customTheme.tblHeader,
    tblLastHeader:customTheme.tblLastHeader,
    tblBody:customTheme.tblBody,
    tblLastBody:customTheme.tblLastBody
}));
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}))(TableCell);


function ServiceSetting (props){
    const classes = useStyles();
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>服务项目设置</Typography>
            <Divider light className={classes.pageDivider}/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        fromDetail = true;
    }
    return {
        serviceSettingReducer: state.ServiceSettingReducer,
        fromDetail: fromDetail
    }
};
const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(ServiceSetting)

