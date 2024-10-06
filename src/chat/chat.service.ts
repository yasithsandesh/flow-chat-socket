import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/dto/message.dto';
import { SendChat } from 'src/dto/sendChat.dto';
import { Chat } from 'src/entity/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {

    constructor(
        @InjectRepository(Chat)
        readonly chatRepo: Repository<Chat>,
    ) { }

    async sendChat(sendChatData: SendChat):Promise<Message> {
        const chat = new Chat();
        chat.message = sendChatData.message
        chat.status_id = 2;
        chat.user_from_id = sendChatData.logUserId
        chat.user_to_id = sendChatData.otherUserId;
        // this.chatRepo.create(chat)
        const newchat = await this.chatRepo.save(chat)

        const message = new Message();
        message.chatId = newchat.id
        message.message = newchat.message
        message.side = "right"
        message.status = 2;

        return message

    }

    async getAllChats(requestData: { logUserId: number, otherUserId: number }): Promise<Message[]> {

        const logUser = requestData.logUserId
        const otherUser = requestData.otherUserId



        const chatList: Chat[] = await this.chatRepo
            .createQueryBuilder('chat')
            .where(
                '(chat.user_from_id = :logUser AND chat.user_to_id = :otherUser) OR (chat.user_from_id = :otherUser AND chat.user_to_id = :logUser)',
                { logUser, otherUser },
            ).addOrderBy("date_time","ASC")
            .getMany();

        let messages: Message[] = [
            {
                chatId: 0,
                message: '',
                status: 0,
                side: ''
            }
        ]

        for (let chat of chatList) {
            const message = new Message();
            message.chatId = chat.id
            message.message = chat.message
            message.status = chat.status_id

            if (chat.user_from_id == logUser) {
                message.side = "right"
            } else {
                message.side = "left"
            }

            messages.push(message)
        }

        // Remove the first element
        messages.shift()

        console.log(messages)
        return messages

    }

}
