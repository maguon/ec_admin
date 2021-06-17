let headers = {
    "Content-Type": "application/json;charset=UTF-8"
};
let formHeaders = {
    "Content-Type": "multipart/form-data"
};
export const getHeaders = () => {
    return headers;
};

export const getFormHeaders = () => {
    return formHeaders;
};

export const set = (key, value) => {
    headers[key] = value;
    formHeaders[key] = value;
};