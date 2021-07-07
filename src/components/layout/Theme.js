import {createMuiTheme} from "@material-ui/core/styles";

export const customTheme = createMuiTheme({
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
    },
    // PDF 布局 样式
    pdfPage: {
        width: 1280,
        fontColor: 'black',
        padding: 50,
    },
    pdfTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 12,
        paddingBottom: 30,
    },
    tblHeader: {
        borderLeft: '1px solid #D4D4D4',
        borderTop: '1px solid #D4D4D4',
        borderBottom: '1px solid #D4D4D4',
        background:'#ECEFF1',
        textAlign: 'center',
        padding: 5
    },
    tblLastHeader: {
        border: '1px solid #D4D4D4',
        background:'#ECEFF1',
        textAlign: 'center',
        padding: 5
    },
    tblBody: {
        borderLeft: '1px solid #D4D4D4',
        borderBottom: '1px solid #D4D4D4',
        textAlign: 'center',
        padding: 5
    },
    tblLastBody: {
        borderLeft: '1px solid #D4D4D4',
        borderRight: '1px solid #D4D4D4',
        borderBottom: '1px solid #D4D4D4',
        textAlign: 'center',
        padding: 5
    },
});
