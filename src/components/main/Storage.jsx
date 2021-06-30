import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
    Button,
    Divider,
    Grid,
    TextField,
    Typography,
    Fab,
    makeStyles, IconButton
} from "@material-ui/core";
import {SimpleModal} from '../'
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";

const storageAction = require('../../actions/main/StorageAction');

const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root:{
        marginBottom: 20,
    },
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
}));

function Storage (props) {
    const {storageReducer, getStorageList, getStorageAreaList, saveStorageData} = props;
    const classes = useStyles();

    // 执行1次，取得数结构
    useEffect(()=>{
        getStorageList();
    },[]);

    // 模态状态
    const [modalOpen, setModalOpen] = React.useState(false);
    const closeModal = () => {
        setModalOpen(false);
    };

    // 模态页面属性
    const [pageType, setPageType] = React.useState('');
    const [pageTitle, setPageTitle] = React.useState('');
    const [uid, setUid] = React.useState(-1);
    const [parent, setParent] = React.useState('');
    const [storageId, setStorageId] = React.useState('');
    const [storageName, setStorageName] = React.useState('');
    const [remark, setRemark] = useState('');
    const [validation,setValidation] = useState({});
    const validate = ()=>{
        const validateObj ={};
        if (!storageName) {
            validateObj.storageName ='请输入名称';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };
    const submitModal = () => {
        const errorCount = validate();
        if(errorCount==0){
            saveStorageData(pageType, uid, storageId, storageName, remark);
            closeModal();
        }
    };

    //初始添加模态框值
    const initModal =(pageType, data) =>{
        // 设定模态打开
        setModalOpen(true);
        // 清楚check内容
        setValidation({});
        setPageType(pageType);
        // 新建 / 修改
        switch (pageType) {
            case "new":
                setPageTitle('新增仓库');
                setStorageName('');
                setRemark('');
                break;
            case "edit":
                setPageTitle('修改仓库');
                setUid(data.id);
                setStorageName(data.storage_name);
                setRemark(data.remark);
                break;
            case "sub_new":
                setPageTitle('新增仓库分区');
                setParent(data.storage_name + '-' + data.id);
                setStorageId(data.id);
                setStorageName('');
                setRemark('');
                break;
            case "sub_edit":
                setPageTitle('修改仓库分区');
                setUid(data.id);
                setParent(data.storage_name + '-' + data.storage_id);
                setStorageId(data.storage_id);
                setStorageName(data.storage_area_name);
                setRemark(data.remark);
                break;
            default:
                break;
        }
    };

    const [expanded, setExpanded] = React.useState([]);
    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const clickLabel = (event, nodeIds) => {
        event.preventDefault();
        getStorageAreaList(nodeIds);
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>仓库设置</Typography>
            <Divider light className={classes.divider}/>

            <Grid container spacing={3}>
                <Grid item xs={11}> </Grid>
                <Grid item xs={1}>
                    <Fab color="primary" aria-label="add" size="small" onClick={()=>{initModal('new', null)}}>
                        <i className="mdi mdi-plus mdi-24px" />
                    </Fab>
                </Grid>
            </Grid>

            {/* 主体 */}
            <TreeView
                className={classes.root}
                defaultCollapseIcon={<i className="mdi mdi-chevron-down mdi-24px" />}
                defaultExpandIcon={<i className="mdi mdi-chevron-right mdi-24px" />}
                expanded={expanded}
                onNodeToggle={handleToggle}
            >
                {storageReducer.storageList.map(function (item) {
                    return (
                        <TreeItem
                            key={'storage' + item.id}
                            nodeId={'' + item.id}
                            style={{marginLeft:80, width: '80%'}}
                            label={<div>{item.storage_name}
                                <IconButton onClick={()=>{initModal('sub_new',item)}} size="small">
                                    <i className="mdi mdi-plus mdi-12px" style={{marginLeft: 8,color:'black'}} />
                                </IconButton>
                                <IconButton onClick={()=>{initModal('edit', item)}} size="small">
                                    <i className="mdi mdi-pencil mdi-12px" style={{marginLeft: 8, color:'black'}} />
                                </IconButton>
                            </div>}
                            onLabelClick={(e) => {clickLabel(e, item.id)}}
                        >
                            {item.sub && item.sub.map(function (child) {
                                return (
                                    <TreeItem
                                        key={'storage-area' + child.id}
                                        nodeId={'_' + child.id}
                                        label={<div>{child.storage_area_name}
                                            <IconButton color="primary" onClick={()=>{initModal('sub_edit',child)}} size="small">
                                                <i className="mdi mdi-pencil mdi-12px" style={{marginLeft: 8, color:'black'}} />
                                            </IconButton>
                                        </div>}
                                    />
                                )
                            })}
                        </TreeItem>
                    )
                })}
            </TreeView>

            {/* 模态：新增/修改 */}
            <SimpleModal
                title={pageTitle}
                open={modalOpen}
                onClose={closeModal}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" color="primary" onClick={submitModal}>确定</Button>
                        <Button variant="contained" onClick={closeModal}>关闭</Button>
                    </>
                }
            >
                <Grid container spacing={2}>
                    {(pageType!='new' && pageType!='edit') && <Grid item xs={12}>仓库：{parent}</Grid>}
                    <Grid item xs={12}>
                        <TextField fullWidth={true} margin="dense" variant="outlined" label={(pageType!='new' && pageType!='edit') ? "仓库分区名称" : "仓库名称"} value={storageName}
                                   onChange={(e) => {
                                       setStorageName(e.target.value)
                                   }}
                                   error={validation.storageName&&validation.storageName!=''}
                                   helperText={validation.storageName}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth={true} margin="dense" variant="outlined" label="备注" multiline rows={4} value={remark}
                                   onChange={(e) => {
                                       setRemark(e.target.value)
                                   }}/>
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        storageReducer: state.StorageReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getStorageList: () => {
        dispatch(storageAction.getStorageList())
    },
    getStorageAreaList: (storageId) => {
        dispatch(storageAction.getStorageAreaList(storageId))
    },
    saveStorageData: (pageType, uid, storageId, storageName, remark) => {
        dispatch(storageAction.saveStorageData({pageType, uid, storageId, storageName, remark}))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Storage)
