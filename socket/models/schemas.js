const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sysParams = new Schema({
    key: String,
    value: String,
    expires: Date
});

const qrCodeCcsyb = new Schema({
    code: String,
    unionid: String,
    status: String,
    tel: String,
    createdAt: { type: Date, expires: 30 }
});

const chainCodeInfo = new Schema({
    creditCode: String,
    chainName: String,
});

const bindOrgan = new Schema({
    bindId: String,
    bindName: String,
    
});

const voucher = new Schema({
    organId: String,
    organName: String,
    year: String,
    January: String,
    February: String,
    March: String,
    April: String,
    May: String,
    June: String,
    July: String,
    August: String,
    September: String,
    October: String,
    November: String,
    December: String,
});

const ldjgsession = new Schema({
    _id: String,
    session: Object,
    expires: Date
});

const userInfo = new Schema({
    geRenBh: String,
    jiaTingBh: String,
    xingMing: String,
    shenFenZh: String,
    tel: String,
    email: String,
    canBaoLx: String,
    canBaoZt: String,
    canBaoDw: String,
    shiYongBz: String,
    renYuanLbBm: String,
    renYuanLbMc: String,
    color1: String,
    color2: String,
    zuoFeiBz: String,
    unionid: String,
    bindId: String,
    threadId: String,
    openid: String,
    ybUserId:String,
    selfSign:String,
    workDate:String,
    expires: Date
});

const pharmacistInfo = new Schema({
    creditCode: String,
    organName: String,
    pharmacistName: String,
    pharmacistIDCard: String,
    status: String
});

const organInfo = new Schema({
    creditCode: String,
    name: String,
    address: String,
    member: String,
    setDate: String,
    scope: String
});

const pub_user_info = new Schema({
    geRenBh: String,
    jiaTingBh: String,
    xingMing: String,
    shenFenZh: String,
    tel: String,
    mobile: String,
    yiBaoBh: String,
    email: String,
    canBaoLx: String,
    canBaoZt: String,
    canBaoDw: String,
    danWeiBh: String,
    empEnttCodg:String,
    shiYongBz: String,
    renYuanLbBm: String,
    renYuanLbMc: String,
    color1: String,
    color2: String,
    zuoFeiBz: String,
    unionid: String,
    openid: String,
    bindId: String,
    threadId: String,
    ybUserId: String,
    workDate: String,
    insuAdmdvs: String,// 参保所属医保区划
    poolareaNo: String,//  统筹区编号
    crtInsuDate: String,// 本次参加工作时间
    psnInsuRltsId: String,//人员参保关系ID
    selfSign: String,
    auth_code: String, // 电子凭证授权码
    channel: String, // 用户渠道
    create_time: String,
    update_time: String,
    is_delete: String,
});

module.exports = {
    pharmacistInfo: pharmacistInfo,
    qrCodeCcsyb: qrCodeCcsyb,
    userInfo: userInfo,
    organInfo: organInfo,
    chainCodeInfo: chainCodeInfo,
    bindOrgan: bindOrgan,
    voucher: voucher,
    ldjgsession: ldjgsession,
    sysParams: sysParams,
    pub_user_info: pub_user_info
}
