import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Chat } from 'src/entity/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
