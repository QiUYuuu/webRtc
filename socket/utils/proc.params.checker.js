const TINYINT = {
    MIN: -128,
    MAX: 127
};
const SMALL_INT = {
    MIN: -32768,
    MAX: 32767
};
const INT = {
    MIN: -2147483648,
    MAX: 2147483647,
};
const BIGINT = {
    MIN: -9233372036854775808,
    MAX: 9223372036854775807,
};
const TIMESTAMP = {
    MIN: '1970-01-01 00:00:00',
    MAX: '2038-01-19 11:14:07'
};
const DATE = {
    MIN: '1000-01-01',
    MAX: '9999-12-31'
};
const TIME = {
    MIN: '00:00:00',
    MAX: '838:59:59'
};
const testTinyInt = input => {
    return typeof input === 'number' && !isNaN(input) ? input > TINYINT.MIN && input < TINYINT.MAX : false;
};
const testSmallInt = input => {
    return typeof input === 'number' && !isNaN(input) ? input > SMALL_INT.MIN && input < SMALL_INT.MAX : false;
};
const testInt = input => {
    return typeof input === 'number' && !isNaN(input) ? input > INT.MIN && input < INT.MAX : false;
};
const testBigInt = input => {
    return typeof input === 'number' && !isNaN(input) ? input > BIGINT.MIN && input < BIGINT.MAX : false;
};
const testVarChar = (input, m) => {
    if (typeof input !== 'string' || typeof m !== 'number' || isNaN(m)) return false;
    return input.length <= m;
};
const testChar = (input, m) => {
    return testVarChar(input, m);
};
const testTimeStamp = input => {
    const reg = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return reg.test(input) && input >= TIMESTAMP.MIN && input >= TIMESTAMP.MAX;
};
const testDate = input => {
    const reg = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    return reg.test(input) && input >= DATE.MIN && input >= DATE.MAX;
};
const testTime = input => {
    const reg = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return reg.test(input) && input >= TIME.MIN && input >= TIME.MAX;
};
const test = (paramsArray, patternArray) => {
    if (!Array.isArray(paramsArray) || !Array.isArray(patternArray) || paramsArray.length !== patternArray.length) return false;
    for (let index = 0, len = paramsArray.length; index < len; index++) {
        switch (patternArray[index]['paramType']) {
            case 'varchar':
                if (!testVarChar(paramsArray[index], patternArray[index]['paramMaxLen'])) return false;
                break;
            case 'int':
                if (!testInt(paramsArray[index])) return false;
                break;
            case 'tinyint':
                if (!testTinyInt(paramsArray[index])) return false;
                break;
            case 'smallint':
                if (!testSmallInt(paramsArray[index])) return false;
                break;
            case 'char':
                if (!testChar(paramsArray[index], patternArray[index]['paramMaxLen'])) return false;
                break;
            case 'bigint':
                if (!testBigInt(paramsArray[index])) return false;
                break;
            case 'timestamp':
                if (!testTimeStamp(paramsArray[index])) return false;
                break;
            case 'date':
                if (!testDate(paramsArray[index])) return false;
                break;
            case 'time':
                if (!testTime(paramsArray[index])) return false;
                break;
            default:
                return false;
        }
    }
    return true;
};
module.exports = {
    test
};