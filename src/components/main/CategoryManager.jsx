import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import { makeStyles, Grid, Icon, IconButton } from "@material-ui/core";

import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";

import {AuthoritySettingActionType} from "../../types";

const categoryManagerAction = require('../../actions/main/CategoryManagerAction');

const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        width: `calc(100% - 50px)`,
        minWidth: 800,
        paddingLeft: 30,
        paddingBottom: 50,
        flexGrow: 1,
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
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    }
}));

// 权限设置
function CategoryManager (props) {
    const {categoryManagerReducer, getCategoryList, getCategorySubList} = props;

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState([]);

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
        console.log("handleToggle", nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
        console.log("handleSelect", nodeIds);
    };

    const clickIcon = (event, item) => {
        console.log("event", item);
        event.preventDefault();
    };

    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<i className="mdi mdi-chevron-down mdi-24px" />}
            defaultExpandIcon={<i className="mdi mdi-chevron-right mdi-24px" />}
            expanded={expanded}
            selected={selected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
        >
            <TreeItem
                nodeId="1"
                label={'temp'}
                onLabelClick={clickIcon}
            >
                <TreeItem nodeId="2" label="Calendar" />
                <TreeItem nodeId="3" label="Chrome" />
                <TreeItem nodeId="4" label="Webstorm" />
            </TreeItem>
            <TreeItem nodeId="5" label="Documents"
                      onLabelClick={clickIcon}>
                <TreeItem nodeId="6" label="Material-UI" />
            </TreeItem>
        </TreeView>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        categoryManagerReducer: state.CategoryManagerReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getCategoryList: () => {
        dispatch(categoryManagerAction.getCategoryList())
    },
    getCategorySubList: (categoryId) => {
        dispatch(categoryManagerAction.getCategorySubList(categoryId))
    },
    // setCurrentRemark: (value) => {
    //     dispatch(AuthoritySettingActionType.setCurrentRemark(value))
    // },
    // addUserGroup: (typeName, remarks) => {
    //     dispatch(categoryManagerAction.createUserGroup({typeName, remarks}))
    // },
    // changeMenu: (index, key) => {
    //     dispatch(categoryManagerAction.changeMenuList(index, key))
    // },
    // saveMenu: (conditionUserType) => {
    //     dispatch(categoryManagerAction.saveMenu(conditionUserType))
    // }
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryManager)
