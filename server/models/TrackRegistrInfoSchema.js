let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TrackRegisterInfoSchema = new Schema({
    _id: {type: String},
    towername: {type: String},//建筑名称
    deptname: {type: String},//科室名称
    placename: {type: String},//位置名称
    tracktime: {type: Date},//登记时间
    visitorname: {type: String},//患者姓名
    visitoridnum: {type: String},//患者身份证号
    phonnum: {type: String},//患者手机号
    address: {type: String},//患者家庭住址
    abroad: {type: String},//是否从国外返回,如果是则字段内容为返回时间
    actiontrackid: {type: Number},//轨迹登记id
    questionid: {type: Number},//关联问卷id
});

let model = mongoose.model('TrackRegisterInfoSchema', TrackRegisterInfoSchema, 'TrackRegisterInfoSchema');


//查询时每页条数
const countForOnePage = 10;

async function find(KSId, date, pageIndex) {
    try {
        if (!date || '' == date) {
            throw '日期为空';
        }
        if (!pageIndex || pageIndex < 1) {
            throw '页码为空';
        }

        let list = [];
        let maxrows = 0;
        const startTime = new Date(date + ' 00:00:00').getTime();
        const endTime = startTime + 24 * 60 * 60 * 1000;
        const timeRange = {$gte: startTime, $lt: endTime};
        const sortOpts = {towername: 1, deptname: 1, placename: 1, tracktime: -1};
        const skip = (pageIndex - 1) * countForOnePage;

        if (!KSId || '' === KSId) {
            list = await model.find({tracktime: timeRange}).sort(sortOpts).skip(skip).limit(countForOnePage).exec();
            maxrows = await model.find({tracktime: timeRange}).count();
        } else {
            list = await model.find({tracktime: timeRange, deptname: KSId}).sort(sortOpts).skip(skip).limit(countForOnePage).exec();
            maxrows = await model.find({tracktime: timeRange, deptname: KSId}).count();
        }
        return [list, {maxrows: maxrows}];

    } catch (e) {
        return [
            [],
            [{maxrows: 0}]
        ];
    }

}

async function findById(id) {
    try {
        if (!id || '' == id) {
            throw '参数错误';
        }

        const sortOpts = {tracktime: -1};
        const list = await model.find({visitoridnum: id}).sort(sortOpts).exec();
        return [list];
    } catch (e) {
        return [[]];
    }

}

module.exports = {
    model: model,
    schema: TrackRegisterInfoSchema,
    find,
    findById,
};
