import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { Keyword } from 'src/keyword/entities/keyword.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  async findByUrl(url: string): Promise<Article> {
    return await this.articleRepository.findOne({ where: { url } });
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const keywords = await Promise.all(
      createArticleDto.keywords.map((name) => this.preloadKeywordByName(name)),
    );

    const article = this.articleRepository.create({
      ...createArticleDto,
      keywords,
    });
    return await this.articleRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find({ relations: ['keywords'] });
  }

  async findOne(id: number): Promise<Article> {
    return await this.articleRepository.findOne({
      where: { id },
      relations: ['keywords'],
    });
  }

  async findByKeyword(keyword: string): Promise<Article[]> {
    return await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.keywords', 'keyword')
      .where('keyword.name = :keyword', { keyword })
      .getMany();
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const keywords = await Promise.all(
      updateArticleDto.keywords.map((name) => this.preloadKeywordByName(name)),
    );

    const article = await this.articleRepository.preload({
      id,
      ...updateArticleDto,
      keywords,
    });

    if (!article) {
      throw new Error(`Article with ID ${id} not found`);
    }

    return this.articleRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }

  private async preloadKeywordByName(name: string): Promise<Keyword> {
    const existingKeyword = await this.keywordRepository.findOne({
      where: { name },
    });
    if (existingKeyword) {
      return existingKeyword;
    }
    return this.keywordRepository.save(this.keywordRepository.create({ name }));
  }
}
