import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../models/chatMessage.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages: ChatMessage[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.listMessage();
  }

  sendMessage(): void {
    if (this.message.trim()) {
      // Crear un objeto ChatMessage usando el modelo
      const chatMessage: ChatMessage = {
        text: this.message,
        type: 'sent',
        date: new Date(),
        author: 'User1'  // Puedes cambiar esto según el usuario autenticado
      };

      // Pasar el objeto chatMessage al servicio
      this.chatService.sendMessage(chatMessage);

      // Agregar el mensaje enviado a la lista de mensajes
      this.messages.push(chatMessage);

      // Limpiar el campo de mensaje y hacer scroll hacia abajo
      this.message = '';
      this.scrollToBottom();
    }
  }

  listMessage(): void {
    this.chatService.getMessage().subscribe((data: ChatMessage) => {
      console.log('Mensaje recibido:', data);

      // Añadir el mensaje recibido al array de mensajes
      this.messages.push({ ...data, type: 'received' });
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    const messageContainer = document.querySelector('.chat-messages');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }
}
