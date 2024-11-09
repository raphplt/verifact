import { Injectable } from '@nestjs/common';
import * as playwright from 'playwright';

@Injectable()
export class ScrapingService {
  async scrapePage(
    url: string,
  ): Promise<{ title: string; content: string; siteName: string }> {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const title = await page.title();
    let content = await page.$eval('article', (article) => article.innerText);
    content = content.replace(/\n/g, ' '); //TODO : fonction spécifique pour le traitement du contenu ?
    const siteName = new URL(url).hostname;

    await browser.close();

    return { title, content, siteName };
  }
}
