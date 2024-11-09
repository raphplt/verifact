import { Controller, Post, Body } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapePageDto } from './dto/scrape-page.dto';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('scrape')
  async scrapePage(@Body() scrapePageDto: ScrapePageDto) {
    return await this.scrapingService.scrapePage(scrapePageDto.url);
  }
}
