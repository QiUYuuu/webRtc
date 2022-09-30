/**
 *  author: 李腾飞
 *  date：2017年11月16日14:38:12
 *  version：1.0
 *  AES加解密
 */
const crypto = require('crypto');
const key = 'qwerasdfqwerasdf';
const iv = '1111111111111111';
/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
// const encrypt = (key, iv, data) => {
const encrypt = data => {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString('base64');
    return crypted;
};
/**
 * 解密方法
 * @param key      解密的key
 * @param iv       向量
 * @param crypted  密文
 * @returns string
 */
// const decrypt = (key, iv, crypted) => {
const decrypt = crypted => {
    crypted = new Buffer(crypted, 'base64').toString('binary');
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};
/**
 * Demo:
 * var key = '751f621ea5c8f930';
 * var key = 'qwerasdfqwerasdf';
 * console.log('加密的key:', key.toString('hex'));
 * var iv = '2624750004598718';
 * var iv = '1111111111111111';
 * console.log('加密的iv:', iv);
 * var data = "Hello, nodejs. 演示aes-128-cbc加密和解密";
 * console.log("需要加密的数据:", data);
 * var crypted = encrypt(key, iv, data);
 * console.log("数据加密后:", crypted);
 * var dec = decrypt(key, iv, crypted);
 * console.log("数据解密后:", dec);
 */
// const data1 = JSON.stringify({"qrty":"2","qrid":256,"hsid":"1137","plid":"11291374"});
// const data2 = JSON.stringify({"qrty":"2","qrid":257,"hsid":"1137","plid":"11291374"});
// const crypted1 = encrypt(data2);
// console.log(crypted1);
// const dec1 = decrypt(crypted1);
// console.log(dec1);
module.exports = {encrypt, decrypt};
