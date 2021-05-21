import { Elm } from './Main.elm';
// Start the Elm application.
var app = Elm.Main.init({
	node: document.getElementById('myapp')
});

// Chrome gRPC dev-tool
// ref: https://github.com/SafetyCulture/grpc-web-devtools
const enableDevTools = window.__GRPCWEB_DEVTOOLS__ || (() => {});

// Create your WebSocket.
// var socket = new WebSocket('wss://echo.websocket.org');

const proto = require('@pyar6329/chat-proto');
const chatPb = proto.chatPb;
const chatGrpcWebPb = proto.chatGrpcWebPb;
const wellKnownTypeTimestamp = proto.googleProtobufTimestampPb;
const wellKnownTypeEmpty = proto.googleProtobufEmptyPb;

const grpcUrl = 'https://chat-api.pyar.bz';
const chatClient = new chatGrpcWebPb.ChatClient(grpcUrl, null, null);
// const chatClientPromise = new chatGrpcWebPb.ChatPromiseClient(grpcUrl);
// Chrome gRPC devtool
enableDevTools([chatClient]);

// Elm -> JS
app.ports.sendMessage.subscribe(function(message) {
  // JS -> WebSocket
  // socket.send(message);

  // JS -> gRPC Web
  const metadata = {'custom-header': 'custom-header-value'};
  var sendChatMessageRequest = new chatPb.SendChatMessageRequest();
  sendChatMessageRequest.setId(1);
  sendChatMessageRequest.setMessage(message);
  sendChatMessageRequest.setName('elm name');
  chatClient.sendMessage(sendChatMessageRequest, metadata, (err, response) => {
    if (err) {
      console.log(err.code);
      console.log(err.message);
    } else {
      // console.log(response.get)
      // 返り値が無いので何もしない
      console.log('okkkkkk!!!!');
    }
  });
});

// WebSocket -> JS
// socket.addEventListener("message", function(event) {
//   // JS -> Elm
// 	app.ports.messageReceiver.send(event.data);
// });


const joinChatRoomResponseStreamRequest = new wellKnownTypeEmpty.Empty();
const joinChatRoomResponseStreamMetadata = {'custom-header': 'custom-header-value'};
// gRPC -> JS
var joinChatRoomResponseStream = chatClient.joinRoom(joinChatRoomResponseStreamRequest, joinChatRoomResponseStreamMetadata);
// joinChatRoomResponseStream.on('error', (err) => {
//   console.log('Error code: ' + err.code + ' "' + err.message + '"');
// });
joinChatRoomResponseStream.on('data', (response) => {
  // console.log('data');
  // console.dir(response);
  console.log('id: ' + response.getId());
  console.log('name: ' + response.getName());
  console.log('message: ' + response.getMessage());

  const message = response.getMessage();
  // JS -> Elm
	app.ports.messageReceiver.send(message);
});
joinChatRoomResponseStream.on('status', (status) => {
  console.log(status.code);
  console.log(status.details);
  console.log(status.metadata);
  // if (status.metadata) {
  //   console.log('Received metadata');
  //   console.log(status.metadata);
  // }
});
// joinChatRoomResponseStream.on('metadata', (status) => {
//   console.log('metadata');
// });
joinChatRoomResponseStream.on('end', (end) => {
  console.log('stream end signal received. connection was finished.');
});

// // var joinChatRoomResponse = new chatPb.JoinChatRoomResponse();
// const currentDate = Date.now();
// var timestamp = new wellKnownTypeTimestamp.Timestamp();
// timestamp.setSeconds(currentDate / 1000);
// timestamp.setNanos((currentDate % 1000) * 1e6);
// joinChatRoomResponse.setId(1);
// joinChatRoomResponse.setMessage('message');
// joinChatRoomResponse.setName('name');
// joinChatRoomResponse.setDate(timestamp);


// const service = new chatProto.chatGrpcWebPb.
