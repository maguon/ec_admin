import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {connect, useDispatch} from 'react-redux';
import Swal from "sweetalert2";
// 引入material-ui基础组件
import {
    Grid,
    IconButton,
    TextField,
    Typography,
    Divider,
    Button, makeStyles
} from "@material-ui/core";
import {StorageCheckDetailActionType} from "../../types";

const storageCheckDetailAction = require('../../actions/main/StorageCheckDetailAction');
const storageCheckAction = require('../../actions/main/StorageCheckAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;

const useStyles = makeStyles((theme) => ({
    root:{
        marginBottom: 20,
    },
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableRow: {
        padding: 5,
    },
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'
    },
    red: {
        backgroundColor: 'red',
        color: 'red',
    },
    pdfPage:customTheme.pdfPage,
    pdfTitle:customTheme.pdfTitle,
    tblHeader:customTheme.tblHeader,
    tblLastHeader:customTheme.tblLastHeader,
    tblBody:customTheme.tblBody,
    tblLastBody:customTheme.tblLastBody
}));

function StorageCheck(props) {
    const {storageCheckDetailReducer, saveStorageCheck, saveStorageCheckRel, confirmCheck, downLoadCsv, downLoadPDF} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        props.getStorageCheckInfo(id);
    }, []);

    return (
        <div className={classes.root} id="temp">
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>
                <Link to={{pathname: '/storage_check', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"/>
                    </IconButton>
                </Link>
                仓库盘点 - {storageCheckDetailReducer.storageCheckInfo.id}
            </Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分 */}
            <Grid container spacing={1}>
                <Grid item sm={3}>
                    <TextField label="计划盘点数" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={storageCheckDetailReducer.storageCheckInfo.plan_check_count}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="盘点完成数" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={storageCheckDetailReducer.storageCheckInfo.checked_count}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="盘点状态" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={commonUtil.getJsonValue(sysConst.STORAGE_CHECK_STATUS, storageCheckDetailReducer.storageCheckInfo.check_status)}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="完成状态" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={commonUtil.getJsonValue(sysConst.STORAGE_RET_STATUS, storageCheckDetailReducer.storageCheckInfo.status)}/>
                </Grid>
                <Grid item sm={12}>
                    <TextField label="盘点描述" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled multiline rows="2"
                               value={storageCheckDetailReducer.storageCheckInfo.check_desc}/>
                </Grid>
                <Grid item sm={12}>
                    <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows="2" InputLabelProps={{ shrink: true }}
                               disabled={storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[1].value}
                               value={storageCheckDetailReducer.storageCheckInfo.remark}
                               onChange={(e) => {
                                   dispatch(StorageCheckDetailActionType.setStorageCheckInfo({name: "remark", value: e.target.value}))
                               }}
                    />
                </Grid>
                {storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[0].value &&
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" style={{float:'right', marginLeft: 20}} onClick={()=>{confirmCheck(storageCheckDetailReducer.storageCheckInfo)}}>完成</Button>
                    <Button variant="contained" color="primary" style={{float:'right',marginLeft: 20}} onClick={saveStorageCheck}>保存</Button>
                </Grid>}
                {storageCheckDetailReducer.detailList.length > 0 &&
                <Grid item xs={12}>
                    <Typography color={"primary"}>盘点详情
                        <IconButton color="primary" edge="start" style={{marginLeft:1}} onClick={()=>{downLoadCsv(storageCheckDetailReducer.storageCheckInfo.id)}}>
                            <i className="mdi mdi-file-excel mdi-24px"/>
                        </IconButton>
                        <IconButton color="primary" edge="start" onClick={()=>{downLoadPDF(storageCheckDetailReducer.storageCheckInfo.id)}}>
                            <i className="mdi mdi-file-pdf mdi-24px"/>
                        </IconButton>
                    </Typography>

                </Grid>}
            </Grid>

            {/* 下部分 */}
            {storageCheckDetailReducer.detailList.map((row, index) => (
                <Grid container spacing={1}>
                    <Grid item sm={2}>
                        <TextField label="仓库" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                                   value={row.storage_name}/>
                    </Grid>
                    <Grid item sm={2}>
                        <TextField label="仓库分区" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                                   value={row.storage_area_name}/>
                    </Grid>
                    <Grid item sm={2}>
                        <TextField label="商品" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                                   value={row.product_name}/>
                    </Grid>

                    <Grid item sm={1}>
                        <TextField label="库存数" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                                   value={row.storage_count}/>
                    </Grid>
                    <Grid item sm={1}>
                        <TextField label="盘点数" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} type="number"
                                   disabled={storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[1].value}
                                   value={row.check_count}
                                   onChange={(e) => {
                                       dispatch(StorageCheckDetailActionType.setDetailList({name: "check_count", value: e.target.value, index: index}))
                                   }}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined"
                                   disabled={storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[1].value}
                                   value={row.remark}
                                   onChange={(e) => {
                                       dispatch(StorageCheckDetailActionType.setDetailList({name: "remark", value: e.target.value, index: index}))
                                   }}
                        />
                    </Grid>
                    {storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[0].value &&
                    <Grid item xs={1} align="center">
                        <IconButton>
                            {/* check_status = 0 ,未check， = 1，则是正常 */}
                            <i className={`mdi ${row.check_status === sysConst.STORAGE_CHECK_STATUS[0].value ? 'mdi-check-circle-outline blue' : (row.check_status === sysConst.STORAGE_CHECK_STATUS[1].value ? 'mdi-check-circle green' : 'mdi-alert-circle-outline red')} mdi-24px`}
                               onClick={()=>{saveStorageCheckRel(row.id, row.check_count, row.remark)}}/>
                        </IconButton>
                    </Grid>}
                </Grid>
            ))}

            {/* PDF 输出用 DIV */}
            <div id="pdf" className={classes.pdfPage} style={{marginTop: -99999}}>
                <Grid container spacing={0}>
                    <Grid item sm={12} className={classes.pdfTitle}>仓库盘点</Grid>
                    <Grid item sm={2}><img style={{width: 120,paddingLeft:30}} src="/logo120.png"  alt=""/></Grid>
                    <Grid item container sm={10} spacing={0}>
                        <Grid item sm={6}><b>盘点ID：</b>{storageCheckDetailReducer.storageCheckInfo.id}</Grid>
                        <Grid item sm={6}><b>计划盘点数：</b>{storageCheckDetailReducer.storageCheckInfo.plan_check_count}</Grid>
                        <Grid item sm={6}><b>操作人员：</b>{storageCheckDetailReducer.storageCheckInfo.real_name}</Grid>
                        <Grid item sm={6}><b>盘点创建时间：</b>{commonUtil.getDateTime(storageCheckDetailReducer.storageCheckInfo.created_on)}</Grid>
                        <Grid item sm={12}><b>盘点描述：</b>{storageCheckDetailReducer.storageCheckInfo.check_desc}</Grid>
                    </Grid>
                </Grid>

                <Grid container spacing={0} style={{paddingTop: 15}}>
                    <Grid item sm={2} className={classes.tblHeader}>仓库</Grid>
                    <Grid item sm={2} className={classes.tblHeader}>仓库分区</Grid>
                    <Grid item sm={2} className={classes.tblHeader}>商品</Grid>

                    <Grid item sm={1} className={classes.tblHeader}>库存数</Grid>
                    <Grid item sm={1} className={classes.tblHeader}>盘点数</Grid>
                    <Grid item sm={4} className={classes.tblLastHeader}>备注</Grid>
                </Grid>

                {storageCheckDetailReducer.detailList.map((row, index) => (
                    <Grid container spacing={0}>
                        <Grid item sm={2} className={classes.tblBody}>{row.storage_name}</Grid>
                        <Grid item sm={2} className={classes.tblBody}>{row.storage_area_name}</Grid>
                        <Grid item sm={2} className={classes.tblBody}>{row.product_name}</Grid>

                        <Grid item sm={1} className={classes.tblBody}>{row.storage_count}</Grid>
                        <Grid item sm={1} className={classes.tblBody}>{row.check_count}</Grid>
                        <Grid item sm={4} className={classes.tblLastBody}>{row.remark}</Grid>
                    </Grid>
                ))}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        storageCheckDetailReducer: state.StorageCheckDetailReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    getStorageCheckInfo: (id) => {
        dispatch(storageCheckDetailAction.getStorageCheckInfo(id));
        dispatch(storageCheckDetailAction.getStorageCheckRelList(id));
    },
    saveStorageCheck: () => {
        dispatch(storageCheckDetailAction.saveStorageCheck());
    },
    saveStorageCheckRel: (id, checkCount, remark) => {
        if (checkCount === '') {
            Swal.fire("盘点数不能为空，请输入", '', "warning");
        } else {
            dispatch(storageCheckDetailAction.saveStorageCheckRel({id, checkCount, remark}));
        }
    },
    confirmCheck: (storageCheckInfo) => {
        // 计划盘点数 <> 盘点完成数 则不能执行完成操作
        if (storageCheckInfo.plan_check_count != storageCheckInfo.checked_count) {
            Swal.fire("盘点完成数和计划盘点数不相等，不能执行完成", '', "warning");
        } else {
            dispatch(storageCheckDetailAction.changeStorageCheckStatus(storageCheckInfo.id, sysConst.STORAGE_RET_STATUS[1].value));
        }
    },
    downLoadCsv: (storageCheckId) => {
        dispatch(storageCheckAction.downLoadCsv(storageCheckId))
    },
    downLoadPDF: (storageCheckId) => {
        dispatch(storageCheckDetailAction.downLoadPDF(storageCheckId))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageCheck)
