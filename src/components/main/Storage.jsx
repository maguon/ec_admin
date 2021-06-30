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

const brandManagerAction = require('../../actions/main/BrandManagerAction');

const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        minWidth: 800,
        paddingBottom: 50
    },
    // 标题样式
    pageTitle: {
        color: '#3C3CC4',
        fontSize: 20,
        fontWeight: 'bold'
    },
    pageDivider: {
        height: 1,
        marginBottom: 15,
        background: '#7179e6'
    }
}));

// 权限设置
function BrandManager (props) {
    const {brandManagerReducer, getBrandList, getBrandModelList, saveModalData} = props;
    const classes = useStyles();

    // 执行1次，取得数结构
    useEffect(()=>{
        getBrandList();
    },[]);

    // 模态状态
    const [modalOpen, setModalOpen] = React.useState(false);
    const closeModal = (event) => {
        setModalOpen(false);
    };

    // 模态页面属性
    const [pageType, setPageType] = React.useState('');
    const [pageTitle, setPageTitle] = React.useState('');
    const [uid, setUid] = React.useState(-1);
    const [parent, setParent] = React.useState('');
    const [brandId, setBrandId] = React.useState('');
    const [brandName, setBrandName] = React.useState('');
    const [remark, setRemark] = useState('');
    const [validation,setValidation] = useState({});
    const validate = ()=>{
        const validateObj ={};
        if (!brandName) {
            validateObj.brandName ='请输入名称';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };
    const submitModal = () => {
        const errorCount = validate();
        if(errorCount==0){
            saveModalData(pageType, uid, brandId, brandName, remark);
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
                setPageTitle('新增品牌');
                setBrandName('');
                setRemark('');
                break;
            case "edit":
                setPageTitle('修改品牌');
                setUid(data.id);
                setBrandName(data.brand_name);
                setRemark(data.remark);
                break;
            case "sub_new":
                setPageTitle('新增品牌型号');
                setParent(data.brand_name + '-' + data.id);
                setBrandId(data.id);
                setBrandName('');
                setRemark('');
                break;
            case "sub_edit":
                setPageTitle('修改品牌型号');
                setUid(data.id);
                setParent(data.brand_name + '-' + data.brand_id);
                setBrandId(data.brand_id);
                setBrandName(data.brand_model_name);
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
        getBrandModelList(nodeIds);
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>品牌</Typography>
            <Divider light className={classes.pageDivider}/>

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
                {brandManagerReducer.brandList.map(function (item) {
                    return (
                        <TreeItem
                            key={'brand' + item.id}
                            nodeId={'' + item.id}
                            style={{marginLeft:80, width: '80%'}}
                            label={<div>{item.brand_name}
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
                                        key={'brand-model' + child.id}
                                        nodeId={'_' + child.id}
                                        label={<div>{child.brand_model_name}
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

            {/* 模态：新增/修改 初中信息 */}
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
                    {(pageType!='new' && pageType!='edit') && <Grid item xs={12}>品牌：{parent}</Grid>}
                    <Grid item xs={12}>
                        <TextField fullWidth={true} margin="dense" variant="outlined" label={(pageType!='new' && pageType!='edit') ? "品牌型号名称" : "品牌名称"} value={brandName}
                                   onChange={(e) => {
                                       setBrandName(e.target.value)
                                   }}
                                   error={validation.brandName&&validation.brandName!=''}
                                   helperText={validation.brandName}
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

const mapStateToProps = (state, ownProps) => {
    return {
        brandManagerReducer: state.BrandManagerReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getBrandList: () => {
        dispatch(brandManagerAction.getBrandList())
    },
    getBrandModelList: (brandId) => {
        dispatch(brandManagerAction.getBrandModelList(brandId))
    },
    saveModalData: (pageType, uid, brandId, brandName, remark) => {
        dispatch(brandManagerAction.saveModalData({pageType, uid, brandId, brandName, remark}))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BrandManager)
