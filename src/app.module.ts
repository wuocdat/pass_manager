import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const toBool = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback;
  }
  return value.toLowerCase() === 'true';
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'pass_manager',
      password: process.env.DB_PASSWORD ?? 'pass_manager',
      database: process.env.DB_NAME ?? 'pass_manager',
      autoLoadEntities: true,
      synchronize: toBool(process.env.DB_SYNCHRONIZE, true),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
