module.exports = {
    isPositiveInt: function (rawStr) {
        const regex = /^\d+$/;
        return regex.test(rawStr);
    },
    isDate: function (rawStr) {
        const regex = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
        return regex.test(rawStr);
    },
    isSearchInfo: function (rawStr) {
        const regex = /^.{0,20}$/;
        return regex.test(rawStr);
    },
    isIntSepByComma: function (rawStr) {
        const regex = /^(\d+,)*\d+$/;
        return regex.test(rawStr);
    },
    is24TimeFormat: function (rawStr) {
        const regex = /^([0-1][0-9]|[2][0-3])(:)([0-5][0-9])(:)([0-5][0-9])$/g;
        return regex.test(rawStr);
    },
    is24HHAndMMFormat: function (rawStr) {
        const regex = /^([0-1][0-9]|[2][0-3])(:)([0-5][0-9])$/g;
        return regex.test(rawStr);
    },
    is24HHAndMMFormatGreat: function (rawStr1, rawStr2) {
        return new Date('1971-01-01 ' + rawStr1 + ':00') - new Date('1971-01-01' + rawStr2 + ':00') > 0;
    }
};