import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ScrapingService } from 'src/scraping/scraping.service';
import { ArticleService } from 'src/article/article.service';
import { CreateArticleDto } from 'src/article/dto/create-article.dto';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private scrapingService: ScrapingService,
    private articleService: ArticleService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey, maxRetries: 2 });
  }

  async getOpenAICompletion(url: string, metadata: any) {
    const resumePrompt = this.configService.get<string>('OPENAI_PROMPT');
    try {
      // Vérifier si l'article existe déjà
      const existingArticle = await this.articleService.findByUrl(url);
      if (existingArticle) {
        console.log('Article déjà existant:', existingArticle);
        return existingArticle;
      }

      const scrapedData = await this.scrapingService.scrapePage(url);
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
        const articleData = JSON.parse(jsonMatch[0]);
        console.log('articleData', articleData);

        // Créer un nouvel article
        const createArticleDto: CreateArticleDto = {
          title: scrapedData.title,
          url: url,
          resume: articleData.resume,
          siteName: scrapedData.siteName,
          credibilityScore: articleData.credibility,
          imageUrl: metadata.image,
          keywords: articleData.keywords,
        };

        await this.articleService.create(createArticleDto);

        return articleData;
      } else {
        throw new Error("Le contenu JSON n'a pas été trouvé dans la réponse.");
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}