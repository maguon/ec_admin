import React ,{Fragment,useEffect,useState}from 'react';
import {connect} from 'react-redux';
import {AppBar,Box,TextField,Button,Container,Divider,Grid,Table,TableBody,TableCell,TableContainer,TableHead,TablePagination,TableRow,TableSortLabel,Paper,Toolbar,Typography} from '@material-ui/core';
import Swal from 'sweetalert2';
import { makeStyles } from '@material-ui/core/styles';
import {SimpleModal} from '../'
import {AppActionType, MainPanelActionType} from '../../types'

const mainPanelAction = require('../../actions/main/MainPanelAction');



const useStyles = makeStyles((theme) => ({
modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
},
paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
},
}));
// 综合页面
function MainPanel (props) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const {mainPanelReducer,getUserMsg, setSelectedDate} = props;
    const classes = useStyles();

    useEffect(()=>{
        getUserMsg();
    },[])
    const handleModelConfirm =() =>{
        setModalOpen(false);
        props.setShowLoadProgressFlag(true);
        setTimeout(()=>{
            props.setShowLoadProgressFlag(false);
            Swal.fire("操作成功","关闭对话框成功","success")
        },1000);
        
    }

    const handleDateChange = (event) => {
        console.log('',event);
        setSelectedDate(event);
        // setSelectedDate(event.target.value);
    };

    const handleChangeTextDate = (event) => {
        console.log('',event);
        setSelectedDate(event.target.value);
    };

    return (
        <Container maxWidth={'xl'}  style={{paddingBottom:50}} >
            <Box my={2}>
            
                <Typography variant="body1" style={{paddingTop:10,paddingBottom:10}}>
                                综合页面
                </Typography>
                
                <Divider />
                <Grid container spacing={3} style={{paddingTop:20}}>
                    <Grid item lg={4} sm={12} xs={12}>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography variant="body2">用户数</Typography>
                            <Typography variant="body2">
                                <Button variant="contained" onClick={()=>{setModalOpen(true)}} color="primary">
                                    打开对话框
                                </Button>
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item lg={4} sm={12} xs={12}>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography variant="body2">用户数</Typography>
                            <Typography variant="body2">
                                <Button variant="contained" onClick={()=>{setModalOpen(true)}} color="primary">
                                    打开对话框
                                </Button>
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item lg={4} sm={12} xs={12}>
                        <Paper className={classes.paper} elevation={3}>
                            <TextField label="年份(始)" fullWidth={true} margin={'normal'} type="date"
                                       value={mainPanelReducer.startDate} onChange={handleChangeTextDate}/>
                        </Paper>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} style={{marginTop:40}}>
                    <Table  size={'medium'} aria-label="a dense table">
                        <TableHead >
                        <TableRow style={{height:60}}>
                            <TableCell align="center">文章编号</TableCell>
                            <TableCell align="center">作者昵称</TableCell>
                            <TableCell align="center">发布位置</TableCell>
                            <TableCell align="center">文章类型</TableCell>
                            <TableCell align="center">载体类型</TableCell>
                            <TableCell align="center">评论数</TableCell>
                            <TableCell align="center">点赞数</TableCell>
                            <TableCell align="center">状态</TableCell>
                            <TableCell align="center">
                                    发布时间
                                    </TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {mainPanelReducer.msgList.map((row) => (
                            <TableRow key={row._id}>
                            <TableCell component="th" scope="row" align="center">
                                {row._id}
                            </TableCell>
                            <TableCell align="center">{row.user_detail_info[0].nick_name}</TableCell>
                            <TableCell align="center">{row.address_name}</TableCell>
                            <TableCell align="center">{row.type}</TableCell>
                            <TableCell align="center">{row.carrier}</TableCell>
                            <TableCell align="center">{row.comment_num}</TableCell>
                            <TableCell align="center">{row.agree_num}</TableCell>
                            <TableCell align="center">{row.status}</TableCell>
                            <TableCell align="center">{row.created_at}</TableCell>
                            <TableCell align="center">
                                <i className="mdi mdi-close purple-font pointer margin-right10"></i>
                                <i className="mdi mdi-eye-off purple-font pointer"></i>
                                <i className="mdi mdi-table-search purple-font margin-left10"></i>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <SimpleModal
                    title="title"
                    open={modalOpen}
                    showFooter={true}
                    footer={
                        <>
                            <Button variant="contained" onClick={handleModelConfirm} color="primary">
                                确定
                            </Button>
                            <Button onClick={()=>{setModalOpen(false)}} color="primary" autoFocus>
                                取消
                            </Button>
                        </>
                    }
                    onClose={()=>{setModalOpen(false)}}
                    
                >       <h2 id="transition-modal-title">Transition modal</h2>
                        <p id="transition-modal-description">react-transition-group animates me.</p>
                </SimpleModal>
            </Box>
            
        </Container>
    )
    
}

const mapStateToProps = (state) => {
    return {
        mainPanelReducer: state.MainPanelReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    setShowLoadProgressFlag :(f) => {
        dispatch(AppActionType.showLoadProgress(f))
    },
    getUserMsg :(params)=>{
        dispatch(mainPanelAction.getUserMsg(params));
    },
    setSelectedDate :(params)=>{
        console.log('setSelectedDate is : ', params);
        dispatch(MainPanelActionType.setStartDate(params));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPanel)