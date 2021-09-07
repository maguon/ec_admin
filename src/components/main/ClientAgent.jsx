import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
import Swal from "sweetalert2";
import {Button, Divider, Grid, Typography, Paper, TextField, TableContainer, Table, TableHead, TableRow,TableCell, TableBody,Box, Switch,Fab, IconButton,} from "@material-ui/core";
import {withStyles,makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {CreateClientAgentModel} from "../index";
import {ClientAgentActionType} from '../../types';
const ClientAgentAction = require('../../actions/main/ClientAgentAction');
const CreateClientModelAction =require('../../actions/main/model/CreateClientAgentModelAction');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
    button:{
        margin:'15px',
        float:'right'
    },
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
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
function ClientAgent (props) {
    const {clientAgentReducer,getClientList,changeStatus,openCreateClientModel,fromDetail} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffect(()=>{
        if (!fromDetail) {
            let queryClientObj={
                clientType :null,
                idSerial :'',
                dateIdStart :'',
                dateIdEnd :'',
                sourceType :null,
                status:null
            }
            dispatch(ClientAgentActionType.setClientAgentQueryObj(queryClientObj));
        }
        getClientList(clientAgentReducer.start);
    },[])
    const clientArray =() =>{
        getClientList(0);
    }
    const modalOpen=()=>{
        openCreateClientModel();
    }
    //下一页
    const getNextClientList = () => {
        getClientList(clientAgentReducer.start+(clientAgentReducer.size-1));
    };
    //上一页
    const getPreClientList = () => {
        getClientList(clientAgentReducer.start-(clientAgentReducer.size-1));
    };
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>客户集群</Typography>
            <Divider light className={classes.pageDivider}/>
            {/*查询条件*/}
            <Grid container  spacing={1}>
                <Grid container item xs={10} spacing={1}>
                    {/*客户类型  普通  大客户clientType*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.CLIENT_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={clientAgentReducer.queryClientObj.clientType}
                                      onChange={(e,value) => {
                                          dispatch(ClientAgentActionType.setClientAgentQueryObjs({name: "clientType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="客户类型" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*客户来源*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.SOURCE_TYPE}
                                      getOptionLabel={(option) => option.label}
                                      value={clientAgentReducer.queryClientObj.sourceType}
                                      onChange={(e,value) => {
                                          dispatch(ClientAgentActionType.setClientAgentQueryObjs({name: "sourceType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="客户来源" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*身份证号*/}
                    <Grid item xs>
                        <TextField fullWidth={true} margin="dense" variant="outlined" label="身份证号"
                            value={clientAgentReducer.queryClientObj.idSerial}
                            onChange={(e,value) => {
                                dispatch(ClientAgentActionType.setClientAgentQueryObjs({name: "idSerial", value: e.target.value}));
                            }}
                        />
                    </Grid>

                    {/*状态status*/}
                    <Grid item  xs>
                        <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth={true}
                                      options={sysConst.USE_FLAG}
                                      getOptionLabel={(option) => option.label}
                                      value={clientAgentReducer.queryClientObj.status}
                                      onChange={(e,value) => {
                                          dispatch(ClientAgentActionType.setClientAgentQueryObjs({name: "status", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="状态" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    {/*创建时间*/}
                    <Grid item  xs>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建时间（始）"
                                    value={clientAgentReducer.queryClientObj.dateIdStart=="" ? null :clientAgentReducer.queryClientObj.dateIdStart}
                                    onChange={(date) => {
                                        dispatch(ClientAgentActionType.setClientAgentQueryObjs({name: "dateIdStart", value:date}));
                                    }}
                        />
                    </Grid>
                    <Grid item  xs>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="创建时间（终）"
                                    value={clientAgentReducer.queryClientObj.dateIdEnd=="" ? null :clientAgentReducer.queryClientObj.dateIdEnd}
                                    onChange={(date) => {
                                        dispatch(ClientAgentActionType.setClientAgentQueryObjs({name: "dateIdEnd", value:date}));
                                    }}
                        />
                    </Grid>
                </Grid>
                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign: 'right',marginTop:10}}>
                    <Fab color="primary" size="small" onClick={clientArray}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>
                {/*追加按钮*/}
                <Grid item xs={1} style={{textAlign: 'right',marginTop:10}}>
                    <Fab color="primary" size="small"  onClick={() => {modalOpen()}}>
                            <i className="mdi mdi-plus mdi-24px"/>
                    </Fab>
                </Grid>
                <CreateClientAgentModel/>
            </Grid>
            {/*主体*/}
            <Grid container spacing={1}>
                <TableContainer component={Paper} style={{marginTop:20}}>
                    <Table  size='small' aria-label="a dense table">
                        <TableHead >
                            <TableRow style={{height:50}}>
                                <StyledTableCell align="center">ID</StyledTableCell>
                                <StyledTableCell align="center">客户名称</StyledTableCell>
                                <StyledTableCell align="center">客户类型</StyledTableCell>
                                <StyledTableCell align="center">客户来源</StyledTableCell>
                                <StyledTableCell align="center">身份证号</StyledTableCell>
                                <StyledTableCell align="center">联系人</StyledTableCell>
                                <StyledTableCell align="center">电话</StyledTableCell>
                                <StyledTableCell align="center">创建时间</StyledTableCell>
                                <StyledTableCell align="center">操作</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientAgentReducer.clientArray.length > 0 &&clientAgentReducer.clientArray.map((row,index) => (
                                <TableRow key={index}>
                                    <TableCell align="center" >{row.id}</TableCell>
                                    <TableCell align="center" >{row.name}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.CLIENT_TYPE,row.client_type)}</TableCell>
                                    <TableCell align="center" >{commonUtil.getJsonValue(sysConst.SOURCE_TYPE,row.source_type)}</TableCell>
                                    <TableCell align="center" >{row.id_serial}</TableCell>
                                    <TableCell align="center" >{row.sales_real_name}</TableCell>
                                    <TableCell align="center" >{row.tel}</TableCell>
                                    <TableCell align="center" >{row.date_id}</TableCell>
                                    <TableCell align="center">
                                        {/* 停用/可用 状态 */}
                                        <Switch color='primary' size="small" name="状态"
                                                checked={row.status==sysConst.USE_FLAG[1].value}
                                                onChange={(e)=>{changeStatus(row.id, row.status)}}
                                        />
                                        <IconButton color="primary" edge="start" size="small">
                                            <Link to={{pathname: '/client_agent/' + row.id}}>
                                                <i className="mdi mdi-table-search"/>
                                            </Link>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>))}
                            {clientAgentReducer.clientArray.length === 0 &&
                            <TableRow style={{height:60}}><TableCell align="center" colSpan="9">暂无数据</TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {clientAgentReducer.dataSize >=clientAgentReducer.size &&
                <Button className={classes.button} variant="contained" color="primary"  size="small" onClick={getNextClientList}>
                    下一页
                </Button>}
                {clientAgentReducer.start > 0 &&clientAgentReducer.dataSize > 0 &&
                <Button className={classes.button} variant="contained" color="primary"  size="small" onClick={getPreClientList}>
                    上一页
                </Button>}
            </Box>
        </div>
    )
}
const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        fromDetail = true;
    }
    return {
        clientAgentReducer: state.ClientAgentReducer,
        fromDetail: fromDetail
    }
};
const mapDispatchToProps = (dispatch) => ({
    getClientList: (start) => {
        dispatch(ClientAgentAction.getClientList(start));
    },
    changeStatus: (id, status) => {
        Swal.fire({
            title: status === 1 ? "确定停用该数据？" : "确定重新启用该数据？",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(ClientAgentAction.changeStatus(id, status));
            }
        });
    },
    openCreateClientModel: () => {
        dispatch(CreateClientModelAction.openCreateClientModel());
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(ClientAgent)
