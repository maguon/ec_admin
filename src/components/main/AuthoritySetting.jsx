import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {connect} from 'react-redux';
import {
    Button,
    Divider,
    Grid,
    IconButton,
    FormControlLabel,
    Checkbox,
    TextField,
    Typography,
    makeStyles
} from "@material-ui/core";
import {SimpleModal} from '../'

const authoritySettingAction = require('../../actions/main/AuthoritySettingAction');
const sysConst = require('../../utils/SysConst');

const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        width: `calc(100% - 50px)`,
        minWidth: 800,
        paddingLeft: 30,
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
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: '#7179e6'
    },
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    }
}));

// 权限设置
function AuthoritySetting (props) {
    const {authoritySettingReducer, changeMenu, getMenuList, getUserGroupList, addUserGroup, saveMenu} = props;
    const classes = useStyles();
    const [conditionUserType, setConditionUserType] = useState(null);
    // 模态状态
    const [modalOpen, setModalOpen] = React.useState(false);
    const openModal = (event) => {
        setModalOpen(true);
    };
    const closeModal = (event) => {
        setModalOpen(false);
    };

    // 模态页面属性
    const [typeName, setTypeName] = React.useState('');
    const [submitFlag, setSubmitFlag] = useState(false);
    const [remarks, setRemarks] = useState('');

    useEffect(()=>{
        getUserGroupList();
    },[]);

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>权限设置</Typography>
            <Divider light className={classes.pageDivider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={11} spacing={3}>
                    <Grid item xs={6} sm={3}>
                        <label htmlFor="conditionUserType" className={classes.selectLabel}>用户群组</label>
                        <Select
                            inputId="conditionUserType"
                            options={authoritySettingReducer.userGroupList}
                            onChange={(value) => {
                                setConditionUserType(value);
                                getMenuList(value);
                            }}
                            value={conditionUserType}
                            isSearchable={false}
                            placeholder={"请选择"}
                            styles={sysConst.REACT_SELECT_SEARCH_STYLE}
                            isClearable={false}
                        />
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1}>
                    <IconButton className={classes.addButton} onClick={()=>{openModal();setTypeName('');setRemarks('');setSubmitFlag(false)}}>
                        <i className="mdi mdi-plus mdi-24px" />
                    </IconButton>
                </Grid>
            </Grid>

            {/* 主体 */}
            <Grid container spacing={2}>
                {authoritySettingReducer.currentUserType != null &&
                <Grid item xs={12}>
                    <b>当前权限：{authoritySettingReducer.currentUserType.label}</b>
                </Grid>}

                {authoritySettingReducer.currentMenu.length > 0 && authoritySettingReducer.currentMenu.map(function (item, index) {
                    return (
                        <Grid item container xs={12}  key={'no_child_container' + index}>
                            {/* 不含子菜单的样式 */}
                            {item.children.length === 0 &&
                            <Grid item xs={3}  key={'no_child_item' + index}>
                                <FormControlLabel key={'no_child_FormControlLabel' + index}
                                    control={
                                        <Checkbox color="primary" checked={item.usable} key={'no_child_checkbox' + index}
                                            onChange={() => {changeMenu(index, -1)}}
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
                                                    <Checkbox color="primary" checked={menu.usable} key={'has_child_checkbox' + index + key}
                                                        onChange={() => {changeMenu(index, key)}}
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
                {authoritySettingReducer.currentMenu.length > 0 &&
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" className={classes.modalButton}
                            onClick={saveMenu}>修改</Button>
                </Grid>}
            </Grid>

            {/* 模态：新增/修改 初中信息 */}
            <SimpleModal
                title="新增用户群组"
                open={modalOpen}
                onClose={closeModal}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" color="primary" className={classes.modalButton} onClick={()=>{
                            setSubmitFlag(true);
                            if (typeName.length > 0) {
                                addUserGroup(typeName, remarks);
                                closeModal();
                            }
                        }}>确定</Button>
                        <Button variant="contained" className={classes.modalButton} onClick={closeModal}>关闭</Button>
                    </>
                }
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth={true}
                                   margin="normal"
                                   label="用户群组名称"
                                   onChange={(e) => {
                                       setSubmitFlag(false);
                                       setTypeName(e.target.value)
                                   }}
                                   error={typeName == "" && submitFlag}
                                   helperText={typeName == "" && submitFlag  ? "用户群组名称不能为空" : ""}
                                   value={typeName}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth={true} margin="normal" multiline rows={4} variant="outlined"
                                   onChange={(e) => {
                                       setSubmitFlag(false);
                                       setRemarks(e.target.value)
                                   }}
                                   value={remarks}/>
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
    getMenuList: (conditionUserType) => {
        dispatch(authoritySettingAction.getMenuList(conditionUserType))
    },
    getUserGroupList: (conditionUserType) => {
        dispatch(authoritySettingAction.getUserGroupList())
    },
    addUserGroup: (typeName, remarks) => {
        dispatch(authoritySettingAction.createUserGroup({typeName, remarks}))
    },
    changeMenu: (index, key) => {
        dispatch(authoritySettingAction.changeMenuList(index, key))
    },
    saveMenu: () => {
        dispatch(authoritySettingAction.saveMenu())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthoritySetting)
