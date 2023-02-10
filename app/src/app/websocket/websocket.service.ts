import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor() {
    this.socket = io(this.url);
  }

  socket: any;
  readonly url: string = 'http://localhost:3000';

  listen(event: string) {
    return new Observable((subscriber) => {
      this.socket.on(event, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
