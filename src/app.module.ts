import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entity/chat.entity';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Sg%16Zaak',
      database: 'flowChat',
      entities: [Chat],
      synchronize: false,
    }),
    ChatModule
  ],
})
export class AppModule {}
