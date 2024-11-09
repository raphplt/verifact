import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ScrapingService } from 'src/scraping/scraping.service';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private scrapingService: ScrapingService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey, maxRetries: 5 });
  }

  async testOpenAI(input: string) {
    const resumePrompt = this.configService.get<string>('OPENAI_PROMPT');
    try {
      const scrapedData = await this.scrapingService.scrapePage(input);
      const prompt = resumePrompt + scrapedData.title + scrapedData.content;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseContent = completion.choices[0].message.content;

      // Utiliser une expression régulière pour extraire le contenu JSON
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Le contenu JSON n'a pas été trouvé dans la réponse.");
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}