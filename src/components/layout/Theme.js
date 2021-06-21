'use strict'

import {createMuiTheme} from "@material-ui/core/styles";
import {orange} from "@material-ui/core/colors";


export const customTheme = createMuiTheme({
    palette: {
        secondary: {
            main: orange[100],
        },
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

    // 圆形
    shapeCircle: {
        width: 56,
        height: 56,
        borderRadius: '50%',
    },
    addButton: {
        color: '#7179e6'
    },
    queryButton: {
        color: '#e6a8ca'
    },
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    },
    tableNoData: {
        textAlign: 'center',
    },
    tableButton: {
        textAlign: 'right',
    },
    // 模态画面样式
    modalPaper: {
        position: 'absolute',
        width: 800,
        height: 500,
        background: '#fafafa',
        border: '2px solid #000',
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
    },
    modalHeader: {
        position: 'fixed',
        width: '100%',
        textAlign: 'center',
        height: 50,
        background: '#626de6',
        borderBottom: '2px solid #515DE6',
    },
    modalTitle: {
        paddingTop: 10,
        fontSize: 20,
        color: 'white',
        letterSpacing: 5,
    },
    modalBody: {
        height: `calc(100% - 125px)`,
        marginTop: 52,
        padding: 18,
    },
    modalFooter: {
        position: 'fixed',
        width: '100%',
        height: 50,
        background: '#f4f4f4',
        textAlign: 'right',
        bottom: 0,
        borderTop: '1px solid grey',
    },
    modalButton: {
        marginTop: 8,
        marginRight: 10,
        width: 80,
    },
    mustInput: {
        color: 'red'
    },
});
