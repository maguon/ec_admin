import React, {useEffect} from 'react';
import Select from 'react-select';
import {connect} from 'react-redux';
import {AuthoritySettingActionType} from '../../types';
import {
    Button,
    Divider,
    Grid,
    Icon,
    IconButton,
    FormControlLabel,
    Checkbox,
    Typography,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const authoritySettingAction = require('../../actions/main/AuthoritySettingAction');
const sysConst = require('../../utils/SysConst');

const useStyles = makeStyles((theme) => ({
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
    const {authoritySettingReducer, changeConditionUserType, changeMenu, saveMenu} = props;
    const classes = useStyles();

    useEffect(()=>{
        props.changeConditionUserType(sysConst.USER_TYPES[0]);
        props.changeCurrentUserType(sysConst.USER_TYPES[0]);
        props.getMenuList();
    },[]);

    /**
     * 查询菜单设定情况
     */
    const queryMenuList = () => {
        props.getMenuList();
    };


    return (
        <div>
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
                            onChange={changeConditionUserType}
                            value={authoritySettingReducer.conditionUserType}
                            isSearchable={false}
                            placeholder={"请选择"}
                            styles={sysConst.REACT_SELECT_SEARCH_STYLE}
                            isClearable={false}
                        />
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1}>
                    <IconButton className={classes.addButton} onClick={queryMenuList}><Icon>search</Icon></IconButton>
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
                        <Grid item container xs={12}>
                            {/* 不含子菜单的样式 */}
                            {item.children.length === 0 &&
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox color="primary" checked={item.available}
                                            onChange={() => {changeMenu(index, -1)}}
                                        />
                                    }
                                    label={item.label}
                                />
                            </Grid>}

                            {/* 含子菜单的样式 */}
                            {item.children.length > 0 &&
                            <Grid item container xs={12}>
                                <Grid item xs={12}><b>{item.label}</b></Grid>
                                {item.children.map(function (menu, key) {
                                    return (
                                        <Grid item xs={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox color="primary" checked={menu.available}
                                                        onChange={() => {changeMenu(index, key)}}
                                                    />
                                                }
                                                label={menu.label}
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
    getMenuList: () => {
        dispatch(authoritySettingAction.getMenuList())
    },
    changeConditionUserType: (value) => {
        dispatch(AuthoritySettingActionType.setConditionUserType(value))
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
