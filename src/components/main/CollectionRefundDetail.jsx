import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Checkbox,
    IconButton, AppBar, Tabs, Tab, Accordion, AccordionSummary
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {ClientInformationDetailActionType, OrderPayActionType} from "../../types";
import {Link, useParams} from "react-router-dom";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
const orderPayAction = require('../../actions/main/OrderPayAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
}));

function CollectionRefundDetail(props) {
    const {collectionRefundDetailReducer, commonReducer} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();
    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>
                <Link to={{pathname: '/collection_refund', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start"><i className="mdi mdi-arrow-left-bold"/></IconButton>
                </Link>
                收款退款 - {id}
            </Typography>
            <Divider light className={classes.divider}/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        collectionRefundDetailReducer: state.CollectionRefundDetailReducer,
    }
};
const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionRefundDetail)
