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




let lockReconnect = false;
// let http = `wss://zybm.0405.tech/socket-websocket`;
let http = `ws://localhost:443/socket-websocket`;
let websocket: WebSocket;

// let websocket = new WebSocket(http);
//   // 连接发生错误，连接错误时会继续尝试发起连接（尝试5次）
//   websocket.onerror = function () {
//     console.log("onerror连接发生错误")
//   }
//   // 接受到消息的回调方法
//   // 接受到服务端关闭连接时的回调方法
//   websocket.onclose = function (e) {
//     try {
//       websocket.close();
//     } catch (e) {
//     }
//     console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
//   }
// // 连接成功建立的回调方法
// websocket.onopen = function (e) {
//     console.log("webSocket链接成功！");
//     // 成功建立连接后，重置心跳检测
// }


// createWebSocket(http);   //连接ws
 
function createWebSocket(url: string) {
    try{
        if('WebSocket' in window){
            websocket = new WebSocket(url);
        }
        initEventHandle();
    }catch(e){
        reconnect(url);
        console.log(e);
    }     
}


function initEventHandle() {
    websocket.onclose = function () {
        reconnect(http);
        console.log("llws连接关闭!"+new Date().toLocaleString());
    };
    websocket.onerror = function () {
        reconnect(http);
        console.log("llws连接错误!");
    };
    websocket.onopen = function () {
        heartCheck.reset().start();      //心跳检测重置
        console.log("llws连接成功!"+new Date().toLocaleString());
    };
    websocket.onmessage = function (event) {    //如果获取到消息，心跳检测重置
        heartCheck.reset().start();      //拿到任何消息都说明当前连接是正常的
        console.log("llws收到消息啦:" +event.data);
        if(event.data!='pong'){
            let data = JSON.parse(event.data);
        }
    };
}


function reconnect(url: string) {
    if(lockReconnect) return;
    lockReconnect = true;
    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        createWebSocket(url);
        lockReconnect = false;
    }, 2000);
}

var heartCheck = {
    timeout: 1000,        //1分钟发一次心跳
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            websocket.send(JSON.stringify({value: "ping"}));
            console.log("ping!")
            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                websocket.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}

export default websocket;