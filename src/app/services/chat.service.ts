import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from '../models/chatMessage.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: WebSocket;
  private messageSubject = new Subject<ChatMessage>();

  constructor() {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onmessage = (event) => {
      // Convertir el mensaje recibido en JSON y emitirlo a través del Subject
      const data: ChatMessage = JSON.parse(event.data);
      this.messageSubject.next(data);
    };

    this.socket.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket cerrado:', event);
    };
  }

  sendMessage(message: ChatMessage): void {
    // Verificar si el WebSocket está abierto antes de enviar el mensaje
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket no está abierto, intentando reconectar...');
      // Lógica de reconexión o manejo de error.
    }
  }

  getMessage(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }
}
