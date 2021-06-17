import store from 'store2';

const getSessionItem = (key) => {
    return store.session.get(key)
};

const setSessionItem = (key, value) => {
    store.session.set(key, value, true)
};

const removeSessionStore = (key) => {
    store.session.remove(key)
};

const getLocalItem = (key) => {
    return store.local.get(key)
};

const setLocalItem = (key, value) => {
    // store.local.set(key, value, true)
    let itemObj = {};
    itemObj[key] = value;
    store.local(itemObj)
};

const removeLocalItem = (key) => {
    store.local.remove(key)
};
export {
    getSessionItem , setSessionItem , removeSessionStore,
    getLocalItem , setLocalItem , removeLocalItem    
}
