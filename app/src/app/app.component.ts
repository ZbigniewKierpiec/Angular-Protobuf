import { ProtobufService } from './core/protobuf.service';
import { Component, OnInit } from '@angular/core';
import { BinaryEncoder } from 'google-protobuf';
import { WebsocketService } from './websocket/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';
  input: any;
  message: any;
  size:any;
  server: any;
  dataServer: any;
  constructor(
    private protobufService: ProtobufService,
    private websocketService: WebsocketService
  ) {}

  send() {
    console.log(this.input);
    this.message = this.input;
    this.input = '';

    /////////////////////Coding//////////////////
    let binaryMessage = this.protobufService.serializeBinaryMessage({
      title: 'Hello World',
      message: this.message,
      type: this.protobufService.proto.Message.MessageType.HELLO_WORLD,
    });

    this.message = binaryMessage;
    this.size = binaryMessage.byteLength;
    //////////////////////////Decoding///////////////////////

    let protoMessage = this.protobufService.deserializeMessageBinary(
      this.message
    );

    this.server = protoMessage;

    ////////////////////Sending to Server using Socket.io/////////////////////////////

    this.websocketService.emit('add', this.message);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    ///////////////////Encoded//////////////////////////////
    let binaryMessage = this.protobufService.serializeBinaryMessage({
      title: 'Hello World',
      message:
        'If you seeing this message in your browser, means protobuf works!',
      type: this.protobufService.proto.Message.MessageType.HELLO_WORLD,
    });
    //////////////////////////////Decoded//////////////////////////////
    let protoMessage =
      this.protobufService.deserializeMessageBinary(binaryMessage);
    console.log(protoMessage.getType());

    this.title = `${protoMessage.getTitle()}: ${protoMessage.getMessage()} (Message Type:${this.protobufService.getMessageTypeName(
      protoMessage.getType()
    )})`;

    this.title = `Zee ,  ${protoMessage}`;
    /////////////////reciving Data from the Server via Socket.io////////////////////////

    this.websocketService.listen('test event').subscribe((data: any) => {
      this.dataServer = data;
    });
  }
}
