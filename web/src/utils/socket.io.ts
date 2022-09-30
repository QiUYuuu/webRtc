// import io from 'socket.io-client';
// const timeStamp = new Date().getTime();
// // 'http://localhost:3000'
// // `wss://${window.location.host}:30001`
// const socket = io('wss://www.xinzhongshun.cn/zhbl/system/webSocket?userId=3&session_id=91291C321B431A8D5BD572CEF17026CD', {
//     query: {
//         timeStamp
//     },
//     transports: ['websocket', 'polling'],
//     timeout: 5000
// });


let http = `wss://zybm.0405.tech/socket-websocket`;
let websocket = new WebSocket(http);
// 连接成功建立的回调方法
websocket.onopen = function (e) {
    console.log("webSocket链接成功！");
    // 成功建立连接后，重置心跳检测
}

export default websocket;