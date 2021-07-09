import {createMuiTheme} from "@material-ui/core/styles";

export const customTheme = createMuiTheme({
    // 标题样式
    root:{
        // 默认页面最小宽度800，避免画面挤压变形
        minWidth: 800,
        // 距离底部流出距离，避免被footer遮罩
        paddingBottom: 20,
    },
    // 标题样式
    pageTitle: {
        color: '#3C3CC4',
        fontSize: 20,
        fontWeight: 'bold'
    },
    // 标题 下划线 样式
    pageDivider: {
        height: 1,
        marginBottom: 15,
        background: '#7179e6'
    },
    // 全部页面table列表 header 样式
    tableHead: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'
    },
    // PDF 布局 样式 start
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
    // PDF 布局 样式 end
});