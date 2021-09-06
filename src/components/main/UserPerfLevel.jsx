import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {
    Box,
    Button,
    Divider,
    Fab,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
// 引入Dialog
import {SimpleModal} from "../index";

const userPerfLevelAction = require('../../actions/main/UserPerfLevelAction');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead: customTheme.tableHead
}));

function UserPerfLevel(props) {
    const {userPerfLevelReducer} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userPerfLevelAction.getUserPerfLevel(userPerfLevelReducer.userPerfLevelData.start));
    }, []);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 模态数据
    const [modalData, setModalData] = React.useState({});
    const [validation,setValidation] = useState({});

    //初始添加模态框值
    const initModal =(data) =>{
        // 设定模态打开
        setModalOpen(true);
        // 清楚check内容
        setValidation({});
        // 新建 / 修改
        if (data == null) {
            setModalData({pageType:'new', perfName: '', remark: '', saleRatio: 1, deployRatio: 1, checkRatio: 1});
        } else {
            setModalData({pageType:'edit', uid:data.id, perfName: data.perf_name, remark: data.remark, saleRatio: data.sale_ratio, deployRatio: data.deploy_ratio, checkRatio: data.check_ratio});
        }
    };

    const validate = ()=>{
        const validateObj ={};
        if (!modalData.perfName) {
            validateObj.perfName ='请输入绩效名';
        }
        if (!modalData.saleRatio) {
            validateObj.saleRatio ='请输入销售提成率';
        } else if (!(/^\d+(\.\d{1,2})?$/.test(modalData.saleRatio))) {
            validateObj.saleRatio ='请输入大于等于0的浮点数（最多2位小数）';
        }
        if (!modalData.deployRatio) {
            validateObj.deployRatio ='请输入实施提成率';
        } else if (!(/^\d+(\.\d{1,2})?$/.test(modalData.deployRatio))) {
            validateObj.deployRatio ='请输入大于等于0的浮点数（最多2位小数）';
        }
        if (!modalData.checkRatio) {
            validateObj.checkRatio ='请输入验收提成率';
        } else if (!(/^\d+(\.\d{1,2})?$/.test(modalData.checkRatio))) {
            validateObj.checkRatio ='请输入大于等于0的浮点数（最多2位小数）';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const submitModal= ()=>{
        const errorCount = validate();
        if(errorCount===0){
            dispatch(userPerfLevelAction.saveModalData(modalData));
            setModalOpen(false);
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>绩效设置</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={11} spacing={1}> </Grid>
                {/*追加按钮*/}
                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" size="small" onClick={() => {initModal(null)}}>
                        <i className="mdi mdi-plus mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">ID</TableCell>
                            <TableCell className={classes.tableHead} align="left">绩效名</TableCell>
                            <TableCell className={classes.tableHead} align="center">销售提成率</TableCell>
                            <TableCell className={classes.tableHead} align="center">实施提成率</TableCell>
                            <TableCell className={classes.tableHead} align="center">验收提成率</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userPerfLevelReducer.userPerfLevelData.dataList.map((row) => (
                            <TableRow key={'table-row-' + row.id}>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="left">{row.perf_name}</TableCell>
                                <TableCell align="center">{row.sale_ratio}</TableCell>
                                <TableCell align="center">{row.deploy_ratio}</TableCell>
                                <TableCell align="center">{row.check_ratio}</TableCell>
                                <TableCell align="center">
                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" size="small" onClick={() => {initModal(row)}}>
                                        <i className="mdi mdi-pencil"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {userPerfLevelReducer.userPerfLevelData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={6} align="center">暂无数据</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {userPerfLevelReducer.userPerfLevelData.start > 0 && userPerfLevelReducer.userPerfLevelData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={()=>{dispatch(userPerfLevelAction.getUserPerfLevel(userPerfLevelReducer.userPerfLevelData.start-(userPerfLevelReducer.userPerfLevelData.size-1)))}}>上一页</Button>}
                {userPerfLevelReducer.userPerfLevelData.dataSize >= userPerfLevelReducer.userPerfLevelData.size &&
                <Button variant="contained" color="primary"
                        onClick={()=>{dispatch(userPerfLevelAction.getUserPerfLevel(userPerfLevelReducer.userPerfLevelData.start+(userPerfLevelReducer.userPerfLevelData.size-1)))}}>下一页</Button>}
            </Box>

            {/* 模态：新增/修改 */}
            <SimpleModal
                maxWidth={'sm'}
                title={modalData.pageType === 'edit' ? '修改绩效设置' : '新增绩效设置'}
                open={modalOpen}
                onClose={()=>{setModalOpen(false)}}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" color="primary" onClick={submitModal}>确定</Button>
                        <Button variant="contained" onClick={()=>{setModalOpen(false)}}>关闭</Button>
                    </>
                }
            >
                <Grid container spacing={1}>
                    {modalData.pageType === 'edit' && <Grid item sm={12}><Typography color="primary">ID：{modalData.uid}</Typography></Grid>}

                    <Grid item xs={12}>
                        <TextField label="绩效名" fullWidth margin="dense" variant="outlined" value={modalData.perfName}
                                   onChange={(e) => {
                                       setModalData({...modalData, perfName: e.target.value})
                                   }}
                                   error={validation.perfName&&validation.perfName!=''}
                                   helperText={validation.perfName}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="销售提成率" fullWidth margin="dense" variant="outlined" value={modalData.saleRatio} type="number"
                                   onChange={(e) => {
                                       setModalData({...modalData, saleRatio: e.target.value})
                                   }}
                                   error={validation.saleRatio&&validation.saleRatio!=''}
                                   helperText={validation.saleRatio}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="实施提成率" fullWidth margin="dense" variant="outlined" value={modalData.deployRatio} type="number"
                                   onChange={(e) => {
                                       setModalData({...modalData, deployRatio: e.target.value})
                                   }}
                                   error={validation.deployRatio&&validation.deployRatio!=''}
                                   helperText={validation.deployRatio}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField label="验收提成率" fullWidth margin="dense" variant="outlined" value={modalData.checkRatio} type="number"
                                   onChange={(e) => {
                                       setModalData({...modalData, checkRatio: e.target.value})
                                   }}
                                   error={validation.checkRatio&&validation.checkRatio!=''}
                                   helperText={validation.checkRatio}
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={4} value={modalData.remark}
                                   onChange={(e) => {
                                       setModalData({...modalData, remark: e.target.value})
                                   }}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userPerfLevelReducer: state.UserPerfLevelReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPerfLevel)
