const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let HopitalizedRegDoctorQRCodeData = new Schema({
    _id: {type: String},//随机串
    deptCode: {type: String},
    deptalterCode: {type: String},
    doctorCode: {type: String},
    deptName: {type: String},
    doctorName: {type: String},
    hreCode: {type: String},
    qrText: {type: String},
});

let HopitalizedRegDeptQRCodeData = new Schema({
    _id: {type: String},//随机串
    deptCode: {type: String},
    deptalterCode: {type: String},
    deptName: {type: String},
    hreCode: {type: String},
    qrText: {type: String},
});

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

const LogPaymentDetialSchema = new Schema({
    _id: {type: String},
    description: {type: String},
    time: {type: Date},
    params: {type: Object},
    result: {type: Object},
    extra: {type: Object},
});

// 门诊挂号
const LogPaymentRegSchema = new Schema({
    _id: {type: String},
    appId: {type: String},//应用ID
    mch_id: {type: String},//商户ID
    trade_no: {type: String},//微信/支付宝交易流水号
    out_trade_no: {type: String},//平台交易流水号
    cost: {type: Number},//金额
    idNum: {type: String},//用户身份证号
    name: {type: String},//用户姓名
    payType: {type: String},//微信公众号直连模式 微信公众号商户模式 微信小程序 支付宝小程序
    hospitalCode: {type: String},//医院编码
    hosAreaCode: {type: String},//院区编码
    doctorCode: {type: String},//医生编码
    date: {type: String},//挂号日期
    choosenTime: {type: String},//挂号时段
    openId: {type: String},//微信OpenId,支付宝userId
    registNum: {type: String},//挂号单元
    hisOrderID: {type: String},//his单号
    uid: {type: String},
    vid: {type: String},
    refund: {type: Boolean},//是否退费
    createTime: {type: Date},//创建时间
    syncTime: {type: Date},//同步消息时间
    asyncTime: {type: Date},//异步消息时间
    queryTime: {type: Date},//主动查询时间
    refundTime: {type: Date},//退费时间
    refundAsyncTime: {type: Date},//退费异步时间
    detail: [LogPaymentDetialSchema],
});

// 住院
const LogPaymentHospitalRecallSchema = new Schema({
    _id: {type: String},
    registNum: {type: String},
    hisOrderID: {type: String},//his单号
    appId: {type: String},//应用ID
    mch_id: {type: String},//商户ID
    trade_no: {type: String},//微信/支付宝交易流水号
    out_trade_no: {type: String},//平台交易流水号
    cost: {type: Number},//金额
    payType: {type: String},//微信公众号直连模式 微信公众号商户模式 微信小程序 支付宝小程序
    hospitalCode: {type: String},//医院编码
    hosAreaCode: {type: String},//院区编码
    openId: {type: String},//微信OpenId,支付宝userId
    uid: {type: String},
    vid: {type: String},
    refund: {type: Boolean},//是否退费
    createTime: {type: Date},//创建时间
    syncTime: {type: Date},//同步消息时间
    asyncTime: {type: Date},//异步消息时间
    queryTime: {type: Date},//主动查询时间
    refundTime: {type: Date},//退费时间
    refundAsyncTime: {type: Date},//退费异步时间
    detail: [LogPaymentDetialSchema],
});

// 门诊缴费
const LogPaymentPaymentSchema = new Schema({
    _id: {type: String},
    registNum: {type: String},
    orderNumber1: {type: String},
    orderNumber2: {type: String},
    orderNumber3: {type: String},
    appId: {type: String},//应用ID
    mch_id: {type: String},//商户ID
    hisOrderID: {type: String},//his单号
    trade_no: {type: String},//微信/支付宝交易流水号
    out_trade_no: {type: String},//平台交易流水号
    cost: {type: Number},//金额
    payType: {type: String},//微信公众号直连模式 微信公众号商户模式 微信小程序 支付宝小程序
    hospitalCode: {type: String},//医院编码
    hosAreaCode: {type: String},//院区编码
    openId: {type: String},//微信OpenId,支付宝userId
    uid: {type: String},
    vid: {type: String},
    refund: {type: Boolean},//是否退费
    createTime: {type: Date},//创建时间
    syncTime: {type: Date},//同步消息时间
    asyncTime: {type: Date},//异步消息时间
    queryTime: {type: Date},//主动查询时间
    refundTime: {type: Date},//退费时间
    refundAsyncTime: {type: Date},//退费异步时间
    detail: [LogPaymentDetialSchema],
});

// 退费表
const LogPaymentRefundSchema = new Schema({
    _id: {type: String},
    appId: {type: String},//应用ID
    mch_id: {type: String},//商户ID
    trade_no: {type: String},//微信/支付宝交易流水号
    refund_id: {type: String},//微信退费id
    out_trade_no: {type: String},//平台交易流水号
    cashRefundFee: {type: Number},  // 现金退费
    cashFee: {type: Number},
    totalFee: {type: Number},
    refundFee: {type: Number},
    sendBackFee: {type: Number},
    insuranceRefundFee: {type: Number},//医保退费金额
    couponRefundCount: {type: Number},  // 代金券数量
    couponRefundFee: {type: Number},    // 代金券金额
    payType: {type: String},//微信公众号直连模式 微信公众号商户模式 微信小程序 支付宝小程序
    refundTime: {type: Date},//退费时间
    detail: [LogPaymentDetialSchema],
});

const dzDetailSchema = new Schema({
    appId: {type: String},              //应用ID
    mch_id: {type: String},//商户ID
    trade_no: {type: String},//微信/支付宝交易流水号
    out_trade_no: {type: String},//平台交易流水号
    ybCost: Number,                             // 医保支付
    selfPayCost: Number,                        // 现金支付
    totalCost: {type: Number, default: 0},      // 支付总金额
    ybRefundCost: {type: Number, default: 0},   // 医保退费金额
    selfPayRefundCost: {type: Number, default: 0},  // 现金退费金额
    totalRefundCost: {type: Number, default: 0},    // 退费总金额
    payType: {type: String},//微信公众号直连模式 微信公众号商户模式 微信小程序 支付宝小程序
    openId: {type: String},//微信OpenId,支付宝userId
    registNum: {type: String},//挂号单元
    hisOrderID: {type: String},//his单号
    paymentType: {type: String},//是否退费   REFUND   SUCCESS
    createTime: {type: Date},//创建时间
    syncTime: {type: Date},//同步消息时间
    asyncTime: {type: Date},//异步消息时间
    queryTime: {type: Date},//主动查询时间
    refundTime: {type: Date},//退费时间
    refundAsyncTime: {type: Date},//退费异步时间
    billStatus: {type: Number, default: 0},    // 对账单对账状态  0-未对账    -1-有问题    1-对账成功
    hisStatus: {type: Number, default: 0},    // his对账状态  0-未对账    -1-有问题    1-对账成功
    businssType: {type: String},            // 业务类型   paymentReg-门诊挂号
    searchDay: String
});

const bills = new Schema({
    out_trade_no: String,                           // 订单号
    ybCost: Number,                                 // 医保金额
    selfPayCost: Number,                            // 自费金额
    cost: Number,                                   // 金额
    ybRefundCost: Number,                           // 医保退费金额
    selfRefundCost: Number,                         // 现金退费金额
    totalRefundCost: Number,                        // 总退费金额
    tranState: String,                              // 状态     SUCCESS-支付成功  REFUND-退款
    shoufeiId: String,                              // 收费id     仅his对账单有此字段
    orderTime: Date,                                // 订单时间
    syncTime: Date,                                 // 数据同步时间
    refundState: String,                            // 退费状态     SUCCESS-成功
    payType: String,                                // 支付类型     wechat   alipay   his
    dzStatus: {type: Number, default: 0},           // 对账状态  0-未对账    -1-有问题    1-对账成功
    productName: String,                            // 类型  挂号reg or 缴费payment
    searchDay: String,
});

const dzStatus = new Schema({
    dzDate: String,
    systemTotal: Number,
    weChatTotal: Number,
    alipayTotal: Number,
    hisTotal: Number
});

module.exports = {
    HopitalizedRegDoctorQRCodeData: HopitalizedRegDoctorQRCodeData,
    HopitalizedRegDeptQRCodeData: HopitalizedRegDeptQRCodeData,
    TrackRegisterInfoSchema: TrackRegisterInfoSchema,
    LogPayment_Reg_Schema: LogPaymentRegSchema,
    LogPayment_HospitalRecall_Schema: LogPaymentHospitalRecallSchema,
    LogPayment_Payment_Schema: LogPaymentPaymentSchema,
    dzDetailSchema: dzDetailSchema,
    dzStatus: dzStatus,
    bills: bills,
    LogPayment_Refund_Schema: LogPaymentRefundSchema
}
