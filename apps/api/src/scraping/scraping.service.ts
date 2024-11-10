import { Injectable } from '@nestjs/common';
import * as playwright from 'playwright';
import * as cheerio from 'cheerio';

@Injectable()
export class ScrapingService {
  async scrapePage(url: string): Promise<{
    title: string;
    content: string;
    siteName: string;
    contentLength: number;
  }> {
    try {
      const browser = await playwright.chromium.launch();
      const page = await browser.newPage();
      await page.goto(url);

      const html = await page.content();
      const $ = cheerio.load(html);

      const title = $('title').text();
      let content = $('article').text();

      // Supprimer les éléments indésirables
      $(
        'article .share-buttons, article .advertisement, article .newsletter-signup, article .inline-newsletter, article .newsletter, article .inline-newsletter, article .newsletter-subscribe, article .newsletter-signup, article .newsletter-inline, article .newsletter-subscribe',
      ).remove();

      // Supprimer les scripts et les éléments non textuels
      $('script, style, iframe, noscript').remove();

      // Nettoyer le contenu
      content = $('article').text();
      content = content.replace(/\n/g, ' ');
      content = content.replace(/\s\s+/g, ' ');

      const siteName = new URL(url).hostname;
      const contentLength = content.length;

      await browser.close();

      return { title, content, siteName, contentLength };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
