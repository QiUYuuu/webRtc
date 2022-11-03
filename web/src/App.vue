<template>
  <button @click="sendMessage()">fasong xiaoxi </button>
  <button @click="start()">开启摄像头</button>
  <button @click="callOther()">拨打</button>
  <button @click="hangup()">停止</button>
  <button @click="initWebSocket()">初始化websocket</button>
  <button @click="closeWebSocket()">断开websocket</button>
  <div id="container">
    <div id="selects">
      <div>
        <span>音频输入源：</span>
        <select v-on:change="changeSource()" v-model="audioinputSource" name="audioinput" id="audioinput">
          <option v-for="item of audioinputArray" :key="item.deviceId" :value="item.deviceId">{{item.label}}</option>
        </select>
      </div>
      <div>
        <span>音频输出源：</span>
        <select v-model="audiooutputSource" name="audiooutput" id="audiooutput">
          <option v-for="item of audiooutputArray" :key="item.deviceId" :value="item.deviceId">{{item.label}}</option>
        </select>
      </div>
      <div>
        <span>视频源：</span>
        <select v-model="videoinputSource" name="videoinput" id="videoinput">
          <option v-for="item of videoinputArray" :key="item.deviceId" :value="item.deviceId">{{item.label}}</option>
        </select>
      </div>
    </div>
    <div id="video">
      <div class="room">
        <div style="width: 100%;height: 10%;border-bottom: 1px solid black;">当前用户：{{socketId}}</div>
        <div style="display: flex;width: 100%;flex-wrap:nowrap;height: 90%;">
          <div class="info">消息
            <p v-for="(item, index) in messageArray" :key="index">{{item}}</p>
          </div>
          <div class="users">当前房间用户
            <p v-for="user in users.list" :key="user">{{user}}</p>
          </div>
        </div>
      </div>
      <div class="video">
        <video id="video1" width="640" height="480" autoplay></video>
        <video id="video2" width="640" height="480" autoplay></video>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { ref, defineComponent, getCurrentInstance, onMounted, onUnmounted, reactive } from 'vue';
import newWebSocket from '@/utils/websocket';

const { proxy }: any = getCurrentInstance();

const audioinputArray = reactive<InputDeviceInfo[] | MediaDeviceInfo[]>([]);
const audiooutputArray = reactive<InputDeviceInfo[] | MediaDeviceInfo[]>([]);
const videoinputArray = reactive<InputDeviceInfo[] | MediaDeviceInfo[]>([]);
const audioinputSource = ref('');
const audiooutputSource = ref('');
const socketId = ref('');
const users = reactive<{
  list: string[]
}>({
  list: []
});

const messageArray = reactive<string[]>([]);

let __WEBSOCKET__: WebSocket;
const videoinputSource = ref('');
const callButtonDisabled = ref(false);
const offerOptions: RTCOfferOptions = { offerToReceiveAudio: true, offerToReceiveVideo: true };
let startTime = 0;
let pc1Local: RTCPeerConnection | null;
let pc1Remote: RTCPeerConnection | null;
let videoDom: HTMLVideoElement;
let videoDom1: HTMLVideoElement;
const constraints = { audio: true, video: true };
let localVideo: any = { srcObject: null };
let localStream: MediaStream;

const initWebSocket = () => {
  __WEBSOCKET__ = newWebSocket();
  __WEBSOCKET__.onopen = function (e) {
    console.log("webSocket链接成功！");
    // 成功建立连接后，重置心跳检测
  }
  __WEBSOCKET__.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.type === 'no') {
      socketId.value = data.data;
    }
    if (data.type === 'updateUser') {
      users.list = data.users;
    }
    if (data.type === 'joinRoom') {
      messageArray.push(data.msg);
    }
    if (data.type === 'sendSDP') {

    }
  }
}

const closeWebSocket = () => {
  __WEBSOCKET__.close();
}

const start = async () => {
  console.log('Requesting local stream');

  try {
    //捕获摄像头和麦克风的流，放到localVideo中
    const stream = await navigator.mediaDevices.getUserMedia(constraints).catch(handleError);
    await handleSuccess(stream);
    console.log('Received local stream');
    localVideo.srcObject = stream;
    localStream = stream as MediaStream;
    callButtonDisabled.value = false;
  } catch (e) {
    console.log(e);
  }
}

const callOther = async () => {
  console.log('Starting call');
  const socketState = __WEBSOCKET__.readyState;
  if (socketState != 1) initWebSocket();
  console.log("webSocket链接成功！");
  startTime = window.performance.now();
  const configuration = { iceServers: [
        {urls: "stun:152.136.138.216:3478"},
        {
            urls: "turn:152.136.138.216:3478",
            username: 'chr',
            credential: '123456',
        }]
};
  // Peer-A   Create PeerConnection
  pc1Local = new RTCPeerConnection(configuration);
  //当ice准备好后，加到目标源中
  // 主机端发送流
  pc1Local.onicecandidate = iceCallback1Local;
  pc1Local.oniceconnectionstatechange = handleICEConnectionChange;
  window.localStream.getTracks().forEach((track: MediaStreamTrack) => pc1Local?.addTrack(track, window.localStream as any));
  // Peer-A  CreateOffer
  const sdp = await pc1Local.createOffer(offerOptions).catch(onCreateSessionDescriptionError);
  // Peer-A  setLocalDescription
  pc1Local.setLocalDescription(sdp as RTCLocalSessionDescriptionInit);

  // Peer-A  Send Offer SDP
  // __WEBSOCKET__.send(JSON.stringify({
  //   type: "sdp",
  //   content: sdp,
  // }));
}

const receiveCall = (sdp: RTCLocalSessionDescriptionInit) => {
  const servers: RTCConfiguration = {};
  // Peer-B   Create PeerConnection
  pc1Remote = new RTCPeerConnection(servers);
  // Peer-B   addStream
  pc1Remote.ontrack = gotRemoteStream1;
  // Peer-B   setRemoteDescription
  pc1Remote.setRemoteDescription(sdp as RTCSessionDescriptionInit);
  // Peer-B   createAnswer
  pc1Remote.createAnswer().then((sdpB) => {
    // Peer-B   setLocalDescription
    pc1Remote?.setLocalDescription(sdpB);
    // Peer-B   Send Answer SDP
    __WEBSOCKET__.send(JSON.stringify({
      type: "sdp",
      content: sdpB,
    }));
  }).catch(error => {
    console.log(`Failed to create session description: ${error.toString()}`);
  });
}

const receiveAnswerSDP = (answerSDP: RTCSessionDescriptionInit) => {
  pc1Local?.setRemoteDescription(answerSDP);
}

onMounted(() => {

  const video = document.querySelector('video#video1');
  const video2 = document.querySelector('video#video2');
  videoDom1 = video2 as HTMLVideoElement;
  videoDom = video as HTMLVideoElement;

  // proxy.$axios({url:'http://localhost:3001/rtc-rtc/test', method:'post'}).then((res: any) => {
  //   console.log(res);

  // });
});

onUnmounted(() => {
  if (!!__WEBSOCKET__) {
    __WEBSOCKET__.close();
  }
});

let sendMessage = () => {
  console.log('发送消息');
  __WEBSOCKET__.send(JSON.stringify({
    socketId: socketId.value,
    type: "sdp",
    content: 'dsp',
  }));
}

const handleSuccess = (stream: void | MediaProvider | null) => {
  window.localStream = stream as any;
  videoDom.srcObject = stream as MediaProvider;
}

const handleError = (error: any) => {
  console.log('error', error);
}

const gotDevices = (deviceInfos: Array<InputDeviceInfo | MediaDeviceInfo>) => {
  // 枚举所有的输入输出口，并放到下拉框中
  deviceInfos.map((e: InputDeviceInfo | MediaDeviceInfo) => {
    if (e.kind === 'audioinput') {
      audioinputArray.push(e);
    } else if (e.kind === 'audiooutput') {
      audiooutputArray.push(e)
    } else if (e.kind === 'videoinput') {
      videoinputSource.value = e.deviceId;
      videoinputArray.push(e);
    } else {
      console.log('Some other kind of source/device: ', e);
    }
  });
}
// 获取摄像头/麦克风
// const stream = navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
// 获取桌面
// navigator.mediaDevices.getDisplayMedia(constraints).then(handleSuccess).catch(handleError);
// 获取音视频设备
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);


const changeSource = () => {
  if (window.localStream) {
    window.localStream.getTracks().forEach((track: any) => {
      track.stop();
    });
  }
  //获取deviceId，变化不同的输入口
  const audioSource = audioinputSource.value;
  const videoSource = videoinputSource.value;
  const constraints = {
    audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
    video: { deviceId: videoSource ? { exact: videoSource } : undefined }
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}

const gotStream = () => {
  window.localStream.getTracks().forEach((track: any) => {
    track.start();
  });
}


const onCreateSessionDescriptionError = (error: { toString: () => any; }) => {
  console.log(`Failed to create session description: ${error.toString()}`);
}

const gotDescription1Local = (desc: RTCLocalSessionDescriptionInit | undefined) => {
  pc1Local?.setLocalDescription(desc);
  // pc1Remote.setRemoteDescription(desc);
  // pc1Remote.createAnswer().then(gotDescription1Remote, onCreateSessionDescriptionError);
}

const gotDescription1Remote = (desc: RTCSessionDescriptionInit) => {
  pc1Remote?.setLocalDescription(desc);
  pc1Local?.setRemoteDescription(desc);
}

const hangup = () => {
  console.log('Ending calls');
  pc1Local?.close();
  // 停止接收
  pc1Remote?.close();
  pc1Local = pc1Remote = null;
}

const gotRemoteStream1 = (e: any) => {
  if (videoDom1.srcObject !== e.streams[0]) {
    videoDom1.srcObject = e.streams[0];
    console.log('pc1: received remote stream');
  }
}

const gotRemoteStream2 = (e: any) => {
  // if (video3.srcObject !== e.streams[0]) {
  //   video3.srcObject = e.streams[0];
  // }
}

const iceCallback1Local = (event: any) => {
  console.log(event);

  // __WEBSOCKET__.send(JSON.stringify({
  //   type: "candidate",
  //   content: event.candidate,
  // }));
  // handleCandidate(event.candidate, pc1Remote, 'pc1: ', 'local');
}

const iceCallback1Remote = (event: { candidate: any; }) => {
  handleCandidate(event.candidate, pc1Local as RTCPeerConnection, 'pc1: ', 'remote');
}

const handleCandidate = (candidate: any, dest: RTCPeerConnection, prefix: string, type: string) => {
  dest.addIceCandidate(candidate)
    .then(onAddIceCandidateSuccess, onAddIceCandidateError);
}

const onAddIceCandidateSuccess = () => {
  console.log('AddIceCandidate success.');
}

const onAddIceCandidateError = (error: { toString: () => any; }) => {
  console.log(`Failed to add ICE candidate: ${error.toString()}`);
}

const handleICEConnectionChange = (event: any) => {
      console.log("ICE连接状态改变: ", event);
    }

// start();
</script>



<style scoped lang="scss">
#container {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  width: 100%;
  height: 100vh;
  padding: 0.5rem;
}

#video {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  border: 1px solid black;

  .room {
    width: 30%;
    border-right: 1px solid black;

    .info {
      width: 70%;
      border-right: 1px solid black;
    }

    .users {
      width: 30%;
    }
  }

  .video {
    width: 70%;
  }
}

#selects {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
}
</style>
