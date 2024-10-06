import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { Chat } from "src/entity/chat.entity";
import { Server, Socket } from 'socket.io';
import { Message } from "src/dto/message.dto";
import { SendChat } from "src/dto/sendChat.dto";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    private users: { [userId: string]: string } = {}

    @WebSocketServer()
    server: Server;

    constructor(readonly chatService: ChatService) {

    }

    handleDisconnect(client: any) {

    }

    handleConnection(client: Socket) {
        console.log('Client connected');
        const userid = client.handshake.query.userId;// Assume userId is passed when connecting
        this.users[userid as string] = client.id;
    }

    @SubscribeMessage('sendChat')
    async sendChat(client: Socket, sendChatData: SendChat) {
        const message:Message = await this.chatService.sendChat(sendChatData)

        const toUsersocketId = this.users[sendChatData.otherUserId];

        const logUsersocketId = this.users[sendChatData.logUserId];

        if (toUsersocketId) {
            const sendToUserMessage = new Message()
            sendToUserMessage.chatId = message.chatId
            sendToUserMessage.message = message.message
            sendToUserMessage.side = "left"
            sendToUserMessage.status = message.status
            // Send message to the specific client (toUser)
            this.server.to(toUsersocketId).emit('receiveMessage', sendToUserMessage);

            this.server.to(logUsersocketId).emit('receiveMessage',message)
        }

      
    }

    @SubscribeMessage('getAllChats')
    async getAllChats(client: Socket, requestData: { logUserId: number, otherUserId: number }): Promise<Message[]> {
        const messages: Message[] = await this.chatService.getAllChats(requestData)
        client.emit('chatHistory', messages);
        console.log(this.users)
        return messages
    }
}