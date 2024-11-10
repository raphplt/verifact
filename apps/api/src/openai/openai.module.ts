import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { ScrapingModule } from '../scraping/scraping.module';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [ScrapingModule, ArticleModule],
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class OpenaiModule {}
