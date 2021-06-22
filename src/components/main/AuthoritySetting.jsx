import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {connect} from 'react-redux';
import {AuthoritySettingActionType} from '../../types';
import {
    Button,
    Divider,
    Grid,
    IconButton,
    FormControlLabel,
    Checkbox,
    Typography,
    makeStyles
} from "@material-ui/core";

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
    const {authoritySettingReducer, changeMenu, getMenuList, saveMenu} = props;
    const classes = useStyles();
    const [conditionUserType, setConditionUserType] = useState(sysConst.USER_TYPES[0]);

    useEffect(()=>{
        getMenuList(conditionUserType);
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
                        <label htmlFor="conditionUserType" className={classes.selectLabel}>用户类型</label>
                        <Select
                            inputId="conditionUserType"
                            options={sysConst.USER_TYPES}
                            onChange={(value) => {
                                setConditionUserType(value);
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
                    <IconButton className={classes.addButton} onClick={() => {getMenuList(conditionUserType)}}>
                        <i className="mdi mdi-magnify mdi-24px" />
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
    changeCurrentUserType: (value) => {
        dispatch(AuthoritySettingActionType.setCurrentUserType(value))
    },
    changeMenu: (index, key) => {
        dispatch(authoritySettingAction.changeMenuList(index, key))
    },
    saveMenu: () => {
        dispatch(authoritySettingAction.saveMenu())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthoritySetting)
