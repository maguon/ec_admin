export const LOGIN_USER_ID ='user-id';
export const LOGIN_USER_TYPE ='user-type';
export const LOGIN_USER_STATUS='user-status';
export const AUTH_TOKEN ='auth-token';

/**
 * 日期控件 国际化用
 */
export const DATE_PICKER_OPTION = {
    autoClose: true,
    // showClearBtn: true,
    format: 'yyyy-mm-dd',
    i18n: {
        cancel: '取消',
        clear: '清除',
        done: '确认',
        previousMonth: '‹',
        nextMonth: '›',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        weekdaysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        weekdaysAbbrev: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    },
};

/**
 * 单选下拉菜单样式
 */
export const REACT_SELECT_SEARCH_STYLE = {
    // 整体容器
    // container: styles => ({ ...styles,  border:'1px solid #ff0000'}),
    // 控制器
    control: (styles, {isFocused}) => ({
        ...styles,
        height: 'calc(40px)',
        borderRadius: '0',
        boxShadow: '0',
        borderTop: '0',
        borderLeft: '0',
        borderRight: '0',
        background: '#ffffff',
        margin: "0 0 20px 0",
        borderColor: isFocused ? '#3C3CC4' : '#ACACAC',
        ':hover': {
            borderColor: "#3C3CC4"
        }
    }),
    // 下拉菜单和输入框距离
    menu: styles => ({ ...styles, marginTop:'1px',zIndex: 10}),
    // 指示器（删除/下拉）分隔符(竖线)
    indicatorSeparator: styles => ({...styles, display: 'none'}),
    // 检索输入框
    input: styles => ({...styles, margin: '0', paddingTop: '0',paddingBottom: '0',height: 'calc(3rem)'}),
    // 选中内容显示区域
    valueContainer: styles => ({
        ...styles,
        paddingLeft: '0',
        height: 'calc(3rem + 1px)'
    })
};

// 性别
export const GENDER = [
    {value: 0, label: "女"},
    {value: 1, label: "男"}
];

// 可用/停用 标记
export const USE_FLAG = [
    {value: 0, label: "停用"},
    {value: 1, label: "可用"}
];

// 系统类型(1-进销存管理系统 )
export const APP_TYPE = [
    {value: 1, label: "进销存管理系统"},
];

// 系统类型(1-安卓 2-苹果)
export const DEVICE_TYPE = [
    {value: 1, label: "安卓"},
    {value: 2, label: "苹果"}
];

// 强制更新(0-非强制更新 1-强制更新)
export const FORCE_UPDATE = [
    {value: 0, label: "否"},
    {value: 1, label: "是"}
];

// 用于权限设定（包含所有机能设定）
export const ALL_PAGE_LIST = [
    {
        "link": "/",
        "label": "综合页面",
        "icon": "mdi-cards-variant",
        "children": [],
        "usable": false
    },
    {
        "label": "公共数据",
        "icon": "mdi-chart-line",
        "children": [
            {
                "link": "/user_statistic",
                "name": "新增用户",
                "icon": "mdi-chevron-right",
                "usable": false
            }
        ]
    },
    {
        "label": "采购管理",
        "icon": "mdi-chart-line",
        "children": [
            {
                "link": "/category_manager",
                "name": "商品分类",
                "icon": "mdi-chevron-right",
                "usable": false
            },
            {
                "link": "/brand_manager",
                "name": "品牌",
                "icon": "mdi-chevron-right",
                "usable": false
            },
            {
                "link": "/supplier_manager",
                "name": "供应商",
                "icon": "mdi-chevron-right",
                "usable": false
            }
        ]
    },
    {
        "label": "系统设置",
        "icon": "mdi-server",
        "children": [
            {
                "link": "/admin_user_setting",
                "name": "用户管理",
                "icon": "mdi-chevron-right",
                "usable": false
            },
            {
                "link": "/app_setting",
                "name": "App系统",
                "icon": "mdi-chevron-right",
                "usable": false
            },
            {
                "link": "/authority_setting",
                "name": "权限设置",
                "icon": "mdi-chevron-right",
                "usable": false
            }
        ]
    }
];
