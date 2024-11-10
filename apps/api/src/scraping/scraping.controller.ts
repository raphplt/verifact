import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapePageDto } from './entities/dto/scrape-page.dto';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('scrape')
  async scrapePage(@Body() scrapePageDto: ScrapePageDto) {
    try {
      if (!scrapePageDto.url) {
        throw new BadRequestException('URL is required');
      }
      return await this.scrapingService.scrapePage(scrapePageDto.url);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
