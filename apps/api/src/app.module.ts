import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { ScrapingModule } from './scraping/scraping.module';
import { ArticleModule } from './article/article.module';
import { MetadataModule } from './metadata/metadata.module';
import { KeywordModule } from './keyword/keyword.module';
import { CredibilityServiceModule } from './credibility-service/credibility-service.module';

@Module({
  imports: [
    OpenaiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScrapingModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ArticleModule,
    MetadataModule,
    KeywordModule,
    CredibilityServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
