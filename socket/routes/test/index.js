const express = require('express');
const router = express.Router(null);
const monConnentor = require('../../connector/mongdb.connector');
const connection = require('../../connector/oracle.connector');
const WebSocket = require('ws');
const webSocketObject = {};
let webSocket = null;
// 引用Server类:
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
    port: 443
});


wss.on('connection', function (ws) {
    webSocket = ws;
    console.log(`[SERVER] connection()`);
    ws.on('message', function(msg) {
        webSocketObject[msg] = ws;
    });
    ws.on('close', function(msg) {
      console.log(`[SERVER] close()`);
  });
});

router.post('/sendMsg', (req, res) => {
  let str = {
    uuid: "OEV7Q1GFPUXG0YX1R6UBLLRBSQZA",
    unionid: "oEv7q1GFpUXg0YX1R6UBllRbsqzA",
    state: "1",
    status: "D",
    name: "吕辰西",
    phone: "15671551894",
    IDCard: "220322199611126312",
    organName: "吕晨曦大药房",
    authority: "001|002|003|004|005|006|007|008|009|010|011|012|013",
    scope: "in",
    isChain: "0",
    chainCode: null
  };
  // let str = {
  //   uuid:"OEV7Q1OE-T2JWOABSRJC53VI7GHA",
  //   unionid:"oEv7q1OE-T2jwoabSrJC53vI7gHA",
  //   state: "1",
  //   status: "D",
  //   name:'吕玉来',
  //   phone:"18943928887",
  //   IDCard:"220181199507226515",
  //   msg: 'SUCCESS',
  //   organName: "吕晨曦大药房",
  //   authority: "001|002|003|004|005|006|007|008|009|010|011|012|013",
  //   scope: "in",
  //   isChain: "0",
  //   chainCode: null
  // };
  webSocket.send(JSON.stringify(str));
  res.json(str);
});

// 登录扫码
router.post('/sendLoginInfo', (req, res) => {
    const userInfo = JSON.parse(req.body.data);
      const procedureName = 'REGISTER_USER';
      const inputParams = {};
      inputParams["unionid"] = connection.inputParamsVal(userInfo['unionid']);
      inputParams["name"] = connection.inputParamsVal(userInfo['xingMing']);
      inputParams["phone"] = connection.inputParamsVal(userInfo['tel']);
      connection.executeProcedure(procedureName, inputParams, connection.outputParamsCursor(2)).then(async (resultSet) => {
        if (resultSet[1][0][0] == '1') {
          const regExp = new RegExp(`^.*"unionid":"${userInfo['unionid']}","loginStatus":"ldjg".*$`);
          await monConnentor.remove('ldjgsession', {session: regExp});
          const obj = {};
          obj['uuid'] = resultSet[0][0][0];
          obj['unionid'] = userInfo['unionid'];
          obj['state'] = userInfo['status'];
          obj['status'] = resultSet[0][0][9];
          obj["name"] = userInfo['xingMing'];
          obj["phone"] = userInfo['tel'];
          obj['IDCard'] = userInfo['ShenFenZH'];
          obj['organName'] = resultSet[0][0][1];
          obj['authority'] = resultSet[0][0][4];
          obj['scope'] = resultSet[0][0][5];
          obj['isChain'] = resultSet[0][0][6];
          obj['chainCode'] = resultSet[0][0][7];
          webSocketObject[userInfo['code']].send(JSON.stringify(obj));
          res.json('SUCCESS');
        }
      })
    // 实例化:
});

// 其他业务扫码
router.post('/sendQRCodeInfo', async (req, res) => {
  const codeData = JSON.parse(req.body.data);
  const pharmacistInfo = await monConnentor.select('pharmacistInfo',
      {pharmacistName: codeData['xingMing'], pharmacistIDCard: codeData['ShenFenZH'], status: '1'});
  const obj = {};
  obj["name"] = codeData['xingMing'];
  obj["unionid"] = codeData['unionid'];
  obj["phone"] = codeData['tel'];
  obj['IDCard'] = codeData['ShenFenZH'];
  obj['status'] = pharmacistInfo.length === 0 ? '1' : '0';
  obj['msg'] = pharmacistInfo.length === 0 ? '绑定成功！' : '该人员已被其他人员绑定';
  // obj['status'] = '1';
  // obj['msg'] = '绑定成功!';
  webSocketObject[codeData['code']].send(JSON.stringify(obj));
  res.json('SUCCESS');
});

router.post('/sendQRCodeInfo1', (req, res) => {
  let str = {
    uuid:"OEV7Q1ALFXNRZU1ADUCDBS_JOLEW",
    unionid:"oEv7q1AlfXnrZu1adUCdbS_JolEw",
    status: '1',
    name:'李文琢',
    phone:"13134310281",
    IDCard:"220183199004177814",
    msg: 'SUCCESS'
  };
  webSocket.send(JSON.stringify(str));
  res.json('111');
});

router.post('/sendQRCodeInfo2', (req, res) => {
  let str = {
    uuid: req.body.unionid.toUpperCase(),
    unionid: req.body.unionid,
    status: '1',
    name: req.body.name,
    phone: req.body.phone,
    IDCard: req.body.IDCard,
    msg: 'SUCCESS'
  };
  webSocket.send(JSON.stringify(str));
  res.json('111');
});

router.get('/testUrl', async (req, res) => {
    res.json('SUCCESS');
});

router.get('/i', (req, res) => {
  const a = {
    creditCode: '1',
    name: '1',
    address: '1',
    member: '1',
    setDate: '1',
    scope: '1'
  }
  monConnentor.save('organInfo', a).then( d => {
    console.log(d);
  });
});

// delete req.session.uid;
module.exports = router;
