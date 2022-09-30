export default function newWebSocket() {
    let ishttps = 'https:' == document.location.protocol;
    let ws = "";
    if (ishttps) {
      ws = "wss://";
    } else {
      ws = "ws://";
    }
    // let http = `wss://zybm.0405.tech/socket-websocket`;
    let http = `${ws}localhost:443/socket-websocket`;

    let websocket = new WebSocket(http);
    // 连接成功建立的回调方法
    websocket.onopen = function (e) {
      console.log("webSocket链接成功！");
      // 成功建立连接后，重置心跳检测
    }
    // 连接发生错误，连接错误时会继续尝试发起连接（尝试5次）
    websocket.onerror = function () {
      console.log("onerror连接发生错误")
    }
    // 接受到消息的回调方法
    // 接受到服务端关闭连接时的回调方法
    websocket.onclose = function (e) {
      try {
        websocket.close();
      } catch (e) {
      }
      console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
    }
    // 监听窗口事件，当窗口关闭时，主动断开websocket连接，防止连接没断开就关闭窗口，server端报错
    window.onbeforeunload = function () {
      websocket.close();
    }
    setTimeout(() => {
      websocket.close();
    }, 1000 * 60);

    return websocket;

    // let obj  = setInterval(() => {
    //   console.log(websocket.readyState)
    //   if (websocket.readyState == 1) {
    //     console.log("连接状态，发送消息保持连接");
    //     websocket.send("ping");
    //   } else {
    //     console.log("断开状态，尝试重连");
    //     clearInterval(obj);
    //     that.newWebSocket();
    //
    //   }
    // }, 1000 * 60)

  }