export const getJsonValue = (original, key) => {
   let ret = '未知';
   for (let i = 0; i < original.length; i++) {
      if (original[i].value === key) {
         ret = original[i].label;
         break;
      }
   }
   return ret;
};

export const formatDate = (date, format) => {
   // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   Date.prototype.Format = function (fmt) { //author: meizz
      let o = {
         "M+": this.getMonth() + 1,                     //月份
         "d+": this.getDate(),                          //日
         "h+": this.getHours(),                         //小时
         "m+": this.getMinutes(),                       //分
         "s+": this.getSeconds(),                       //秒
         "q+": Math.floor((this.getMonth() + 3) / 3),  //季度
         "S": this.getMilliseconds()                    //毫秒
      };
      if (/(y+)/.test(fmt))
         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (let k in o)
         if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
   };

   // string类型时，不能纯数字，并且Date.parse有正常值
   if (typeof date === 'string' && isNaN(date) && !isNaN(Date.parse(date))) {
      return new Date(date).Format(format);
   } else if (date instanceof Date) {
      return date.Format(format);
   } else {
      // 非法日期参数，则返回空
      return '';
   }
};

export const getDateTime = (date) => {
   return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
};

export const getDate = (date) => {
   return formatDate(date, 'yyyy-MM-dd');
};
export const getDateFormat = (date) => {
   return formatDate(date, 'yyyyMMdd');
};
/**
 * 在本地进行文件保存
 * @param  {String} data     要保存到本地的文件数据
 * @param  {String} filename 文件名
 */
 export const saveFile = (data, filename) => {
    let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    let event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};

export function mapToObj(strMap){
   let obj= Object.create(null);
   for (let[key,value] of strMap) {
      obj[key] = value;
   }
   return obj;
}

export function objToMap(obj){
   let strMap = new Map();
   for (let k of Object.keys(obj)) {
      strMap.set(k,obj[k]);
   }
   return strMap;
}
