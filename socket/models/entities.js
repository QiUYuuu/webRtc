const _wsMaps = new Map();
const set = (key, value) => {
    _wsMaps.set(key, value);
};
const get = key => {
    return _wsMaps.get(key)
};
const has = key => {
    return _wsMaps.has(key)
};
const remove = key => {
    return _wsMaps.delete(key);
};
const clear = () => {
    return _wsMaps.clear();
};
const show = () => {
    return [..._wsMaps.keys()];
};
module.exports = {set, get, has, remove, clear, show};
