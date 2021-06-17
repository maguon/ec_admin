const httpHeaders = require('./HttpHeaders');

export const httpAsyncFormPost = (url, formData, success, fail) => {
    //$("#preload").show();
    fetch('http://' + url, {
        method :"POST",
        body: formData
    }).then((response) => {
        //$("#preload").hide();
        if(response.ok){
            return response.json();
        }else{
            throw new Error();
        }
    }).then((result) => {
        //$("#preload").hide();
        success(result);
    }).catch((error) => {
        //$("#preload").hide();
        fail(error);
    })
};

const simpleFetch = (method, url, params) => {
    //$("#preload").show();
    let options = {
        method: method,
        headers: httpHeaders.getHeaders()
    };
    if ('GET' != method) {
        options.body = JSON.stringify(params)
    }

    return fetch('http://' + url, options).then((response) => {
        //$("#preload").hide();

        // http 正常处理，则返回response，否则进入catch 处理
        if (response.ok) {
            return response.json();
        } else {
            throw new Error();
        }
    }).catch(function (error) {
        //$("#preload").hide();
        //swal('服务器内部错误!', '', 'error');
        return error;
    });
};

export const httpGet = (url) => {
    return simpleFetch('GET', url, {});
};
export const httpPost = (url, params) => {
    return simpleFetch('POST', url, params)
};
export const httpPut = (url, params) => {
    return simpleFetch('PUT', url, params)
};
export const httpDelete = (url, params) => {
    return simpleFetch('DELETE', url, params)
};

export const httpAsyncGet = (url, callback) => {
    fetch('http://' + url, {
        method: 'GET',
        headers: httpHeaders.headers
    }).then((response) => {
        return response.json();
    }).then((result) => {
        callback(null, result);
    }).catch((error) => {
        callback(error, null);
    })
};

export const httpAsyncPost = (url, params,callback) => {
    fetch('http://'+url, {
        method: 'POST',
        headers: httpHeaders.headers,
        body: JSON.stringify(params)
    }).then((response) => {
        return response.json();
    }).then((result)=>{
        callback(null,result);
    }).catch((error)=>{
        callback(error,null);
    })
};

/**
 * 将 Obj 转化为 Url 格式的String
 */
export const objToUrl = (obj) => {
    let str = "";
    for (let i in obj) {
        if (obj[i] !== undefined && obj[i] != null && obj[i] !== "") {
            str = str + i + "=" + obj[i] + "&";
        }
    }
    return str.substr(0, str.length - 1);
};