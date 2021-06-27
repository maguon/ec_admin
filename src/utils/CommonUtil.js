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
