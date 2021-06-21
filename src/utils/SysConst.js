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

// 用户类型
export const USER_TYPES = [
    {value: 99, label: "管理员"},
    {value: 1, label: "普通用户"}
];