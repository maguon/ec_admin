import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
    Button,
    Checkbox,
    Divider,
    Fab,
    FormControlLabel,
    Grid,
    makeStyles,
    TextField,
    Typography
} from "@material-ui/core";
import {SimpleModal} from '../'
import {AuthoritySettingActionType} from "../../types";

const authoritySettingAction = require('../../actions/main/AuthoritySettingAction');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider
}));

// 权限设置
function AuthoritySetting (props) {
    const {authoritySettingReducer, getUserGroupList, getMenuList, setCurrentRemark, changeMenuChk, addUserGroup, saveMenu} = props;
    const classes = useStyles();

    // 执行1次，取得 用户群组列表 （填充select）
    useEffect(()=>{
        getUserGroupList();
        setCurrentRemark('');
    },[]);

    // 头部条件：用户群组
    const [currentUserType, setCurrentUserType] = useState(null);

    // 变更select内容时触发，取得当前群组的 权限结构
    useEffect(()=>{
        getMenuList(currentUserType);
    },[currentUserType]);

    // 模态状态
    const [modalOpen, setModalOpen] = React.useState(false);
    const openModal = (event) => {
        // 清check内容
        setValidation({});
        setTypeName('');
        setRemarks('');
        setModalOpen(true);
    };
    const closeModal = (event) => {
        setModalOpen(false);
    };

    // 模态页面属性
    const [typeName, setTypeName] = React.useState('');
    const [remarks, setRemarks] = useState('');
    const [validation,setValidation] = useState({});
    const validate = ()=>{
        const validateObj ={};
        if (!typeName) {
            validateObj.typeName ='请输入用户群组名称';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };
    const submitModal = (event) => {
        const errorCount = validate();
        if(errorCount===0){
            addUserGroup(typeName, remarks);
            closeModal();
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>权限设置</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={11} spacing={1}>
                    <Grid item xs={3}>
                        <Autocomplete fullWidth disableClearable
                                      options={authoritySettingReducer.userGroupList}
                                      getOptionLabel={(option) => option.label}
                                      value={currentUserType}
                                      onChange={(event, value) => {
                                          setCurrentUserType(value);
                                      }}
                                      renderInput={(params) => <TextField {...params} label="用户群组" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth margin="dense" variant="outlined" label="备注" InputLabelProps={{ shrink: true }}
                                   value={authoritySettingReducer.currentRemark}
                                   onChange={(e) => {
                                       setCurrentRemark(e.target.value)
                                   }}
                        />
                    </Grid>
                </Grid>

                {/* 新增用户群组 */}
                <Grid item xs={1}>
                    <Fab color="primary" size="small" onClick={()=>{openModal()}}>
                        <i className="mdi mdi-plus mdi-24px" />
                    </Fab>
                </Grid>
            </Grid>

            {/* 主体 */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <b>当前权限：</b>
                </Grid>
                {currentUserType != null && sysConst.ALL_PAGE_LIST.map(function (item, index) {
                    return (
                        <Grid item container xs={12}  key={'no_child_container' + index}>
                            {/* 不含子菜单的样式 */}
                            {item.children.length === 0 &&
                            <Grid item xs={3}  key={'no_child_item' + index}>
                                <FormControlLabel key={'no_child_FormControlLabel' + index}
                                    control={
                                        <Checkbox color="primary" key={'no_child_checkbox' + index}
                                                  checked={authoritySettingReducer.currentMenu.size>0 && authoritySettingReducer.currentMenu.has(item.link)}
                                            onChange={(e) => {changeMenuChk(e, item.link)}}
                                        />
                                    }
                                    label={item.label}
                                />
                            </Grid>}

                            {/* 含子菜单的样式 */}
                            {item.children.length > 0 &&
                            <Grid item container xs={12} key={'has_child_container' + index}>
                                <Grid item xs={12} key={'has_child_item' + index}><b>{item.label}</b></Grid>
                                {item.children.map(function (menu, key) {
                                    return (
                                        <Grid item xs={3} key={'has_child_item' + index + key}>
                                            <FormControlLabel key={'has_child_FormControlLabel' + index + key}
                                                control={
                                                    <Checkbox color="primary" key={'has_child_checkbox' + index + key}
                                                              checked={authoritySettingReducer.currentMenu.size>0 && authoritySettingReducer.currentMenu.has(menu.link)}
                                                        onChange={(e) => {changeMenuChk(e, menu.link)}}
                                                    />
                                                }
                                                label={menu.name}
                                            />
                                        </Grid>
                                    )
                                })}
                            </Grid>}
                        </Grid>
                    )
                })}
                {currentUserType != null &&
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={()=>{saveMenu(currentUserType)}}>修改</Button>
                </Grid>}
            </Grid>

            {/* 模态：新增/修改 */}
            <SimpleModal
                title="新增用户群组"
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
                    <Grid item xs={12}>
                        <TextField fullWidth margin="dense" variant="outlined" label="用户群组名称" value={typeName}
                                   onChange={(e) => {
                                       setTypeName(e.target.value)
                                   }}
                                   error={validation.typeName&&validation.typeName!=''}
                                   helperText={validation.typeName}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth margin="dense" variant="outlined" label="备注" multiline rows={4} value={remarks}
                                   onChange={(e) => {
                                       setRemarks(e.target.value)
                                   }}/>
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        authoritySettingReducer: state.AuthoritySettingReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getMenuList: (currentUserType) => {
        if (currentUserType != null) {
            dispatch(authoritySettingAction.getMenuList(currentUserType))
        }
    },
    getUserGroupList: () => {
        dispatch(authoritySettingAction.getUserGroupList());
        dispatch(AuthoritySettingActionType.setMenuList([]))
    },
    setCurrentRemark: (value) => {
        dispatch(AuthoritySettingActionType.setCurrentRemark(value))
    },
    addUserGroup: (typeName, remarks) => {
        dispatch(authoritySettingAction.createUserGroup({typeName, remarks}))
    },
    changeMenuChk: (event, key) => {
        dispatch(authoritySettingAction.changeMenuList(key, event.target.checked))
    },
    saveMenu: (currentUserType) => {
        dispatch(authoritySettingAction.saveMenu(currentUserType))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthoritySetting)
